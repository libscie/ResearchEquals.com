import { gSSP } from "app/blitz-server"
import Link from "next/link"
import { useRouter, Router } from "next/router"
import { useQuery, useMutation } from "@blitzjs/rpc"
import { useSession } from "@blitzjs/auth"
import { BlitzPage, Routes } from "@blitzjs/next"
import Layout from "app/core/layouts/Layout"
import { UserAdmin, LogoTwitter, UserFollow } from "@carbon/icons-react"
import { Suspense, useState } from "react"

import Navbar from "app/core/components/Navbar"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import getInvitedModules from "app/workspaces/queries/getInvitedModules"
import { useCurrentWorkspace } from "app/core/hooks/useCurrentWorkspace"
import LayoutLoader from "app/core/components/LayoutLoader"
import getDrafts from "app/core/queries/getDrafts"
import getCollection from "app/collections/queries/getCollection"
import SearchResultModule from "app/core/components/SearchResultModule"
import { getAlgoliaResults } from "@algolia/autocomplete-js"
import toast from "react-hot-toast"
import Autocomplete from "app/core/components/Autocomplete"
import algoliasearch from "algoliasearch"
import addSubmission from "app/collections/mutations/addSubmission"
import { useMediaPredicate } from "react-media-hook"
import ViewHeaderImage from "app/collections/components/ViewHeaderImage"
import ViewIcon from "app/collections/components/ViewIcon"
import ViewTitle from "app/collections/components/ViewTitle"
import ViewSubtitle from "app/collections/components/ViewSubtitle"
import DoiCollection from "app/collections/components/DoiCollection"
import ActivityBadge from "app/collections/components/ActivityBadge"
import EditorsBadge from "app/collections/components/EditorsBadge"
import ContributorsBadge from "app/collections/components/ContributorsBadge"
import ViewDescription from "app/collections/components/ViewDescription"
import ViewCollectedWorks from "app/collections/components/ViewCollectedWorks"
import ViewEditors from "app/collections/components/ViewEditors"
import followCollection from "app/collections/mutations/followCollection"
import db from "db"
import addWork from "app/collections/mutations/addWork"
import createReferenceModule from "app/modules/mutations/createReferenceModule"
import { Modal } from "app/core/modals/Modal"
import { NotFoundError } from "blitz"

const searchClient = algoliasearch(process.env.ALGOLIA_APP_ID!, process.env.ALGOLIA_API_SEARCH_KEY!)

export const getServerSideProps = gSSP(async function getServerSideProps(context) {
  const collection = await db.collection.findFirst({
    where: {
      suffix: context.params?.suffix?.toString().toLowerCase(),
    },
    include: {
      submissions: {
        orderBy: {
          updatedAt: "desc",
        },
        include: {
          submittedBy: true,
          module: true,
          editor: {
            include: {
              workspace: true,
            },
          },
        },
      },
      editors: {
        orderBy: {
          id: "asc",
        },
        include: {
          workspace: {
            include: {
              members: {
                include: {
                  user: {
                    select: {
                      id: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
      type: true,
    },
  })

  if (!collection) throw new NotFoundError()
  return {
    props: {
      collection,
    },
  }
})

const Collection: BlitzPage = () => {
  const currentUser = useCurrentUser()
  const session = useSession()
  const currentWorkspace = useCurrentWorkspace()
  const router = useRouter()
  const [drafts] = useQuery(getDrafts, { session })
  const [invitations] = useQuery(getInvitedModules, { session })
  const [{ collection, isAdmin, pendingSubmissions, contributors, isFollowing }, { refetch }] =
    useQuery(getCollection, router.query.suffix as string)
  const xlWindow = useMediaPredicate("(min-width: 1280px)")
  console.log(currentWorkspace === null)
  return (
    <>
        <Navbar />

      <main className="relative">
        {isAdmin && <AdminBanner suffix={router.query.suffix} />}
        <ViewHeaderImage collection={collection} />
        {!xlWindow && (
          <>
            <div className="w-full">
              <div className="flex">
                <div className="top-[50%] mx-4 mx-auto w-[25%] p-4 ">
                  {collection!.type.type !== "INDIVIDUAL" && <ViewIcon collection={collection} />}
                </div>
                <div className="flex-grow">
                  <ViewTitle collection={collection} />
                  {collection!.type.type !== "INDIVIDUAL" && (
                    <ViewSubtitle collection={collection} />
                  )}
                  <div className="my-4 w-full text-center align-middle">
                    <DoiCollection collection={collection} />
                    <ActivityBadge collection={collection} />
                    {collection!.type.type !== "INDIVIDUAL" && (
                      <EditorsBadge collection={collection} />
                    )}
                    {collection!.type.type !== "INDIVIDUAL" && (
                      <ContributorsBadge collection={{}} nrContributors={contributors.length} />
                    )}
                    {pendingSubmissions.length! > 0 && (
                      <PendingBadge submissions={pendingSubmissions} />
                    )}
                  </div>
                </div>
                <SocialActivity
                  collection={collection}
                  isFollowing={isFollowing}
                  refetchFn={refetch}
                />
              </div>
              <ViewDescription collection={collection} />
              <ViewEditors collection={collection} />
              <ViewCollectedWorks collection={collection} />
              {collection!.type.type === "COMMUNITY" && currentWorkspace != null && (
                <>
                  <AddSubmmision
                    collection={collection}
                    currentWorkspace={currentWorkspace}
                    refetchFn={refetch}
                  />
                  <ViewContributors contributors={contributors} />
                </>
              )}
            </div>
          </>
        )}
        {xlWindow && (
          <div className="inline-block w-full md:grid md:grid-cols-4 xl:grid-cols-8">
            <div className="col-span-1 mx-4 p-4 xl:col-span-2">
              {collection!.type.type !== "INDIVIDUAL" && <ViewIcon collection={collection} />}
              <ViewEditors collection={collection} />
              <SocialActivity
                collection={collection}
                isFollowing={isFollowing}
                refetchFn={refetch}
              />
            </div>
            <div className="col-span-4 mx-4 px-4">
              <ViewTitle collection={collection} />
              {collection!.type.type !== "INDIVIDUAL" && <ViewSubtitle collection={collection} />}
              <div className="my-4 w-full text-center align-middle">
                <DoiCollection collection={collection} />
                <ActivityBadge collection={collection} />
                {collection!.type.type !== "INDIVIDUAL" && <EditorsBadge collection={collection} />}
                {collection!.type.type !== "INDIVIDUAL" && (
                  <ContributorsBadge collection={{}} nrContributors={contributors.length} />
                )}
                {pendingSubmissions.length! > 0 && (
                  <PendingBadge submissions={pendingSubmissions} />
                )}
              </div>
              <ViewDescription collection={collection} />
              <ViewCollectedWorks collection={collection} />
            </div>
            {collection!.type.type === "COMMUNITY" && currentWorkspace != null && (
              <div className="col-span-2 w-full">
                <AddSubmmision
                  collection={collection}
                  currentWorkspace={currentWorkspace}
                  refetchFn={refetch}
                />
                <ViewContributors contributors={contributors} />
              </div>
            )}
          </div>
        )}
      </main>
    </>
  )
}

const CollectionPage = ({ collection }) => {
  // const router = useRouter()
  // const [{ collection, isAdmin, pendingSubmissions, contributors, isFollowing }, { refetch }] =
  //   useQuery(getCollection, router.query.suffix as string)

  return (
    <Layout
      title={`R= | ${collection.title}`}
      headChildren={
        <>
          <link
            rel="alternate"
            type="application/rss+xml"
            title={`RSS Feed for ${collection!.title}`}
            href={`/api/rss/collections/${collection!.suffix}`}
          />
          <meta name="twitter:title" content={collection.title} />
          <meta property="twitter:domain" content="researchequals.com" />
          <meta
            property="twitter:url"
            content={`https://researchequals.com/collections/${collection.suffix}`}
          />
          {collection.type.type === "COMMUNITY" && (
            <>
              <meta property="og:image" content={`${collection.header["cdnUrl"]}`} />
              <meta property="og:image:secure_url" content={`${collection.header["cdnUrl"]}`} />
              <meta
                property="og:image:alt"
                content={`Header image of the Collection ${collection.title}.`}
              />
              <meta name="twitter:card" content="summary_large_image" />

              <meta name="twitter:image" content={`${collection.header["cdnUrl"]}`} />
            </>
          )}
        </>
      }
    >
      <LayoutLoader>
        <Collection />
      </LayoutLoader>
    </Layout>
  )
}

export default CollectionPage

const SocialActivity = ({ collection, refetchFn, isFollowing }) => {
  const [followCollectionMutation] = useMutation(followCollection)

  return (
    <div className="mx-4 my-8">
      {/* Follow */}
      {isFollowing ? (
        <button
          type="button"
          className="my-2 flex w-full rounded-md bg-indigo-50 px-4 py-2 align-middle text-sm font-medium text-indigo-700 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0 dark:border dark:border-gray-600 dark:bg-gray-800 dark:text-indigo-500 dark:hover:border-gray-400 dark:hover:bg-gray-700"
          onClick={async () => {
            await toast.promise(
              followCollectionMutation({ followedId: collection!.id, follow: false }),
              {
                loading: "Unfollowing",
                success: () => {
                  refetchFn()
                  return "Unfollowed!"
                },
                error: (e) => {
                  return e.toString()
                },
              }
            )
          }}
        >
          <span className="mx-auto flex">
            <UserFollow
              size={32}
              className="h-5 w-5 fill-current pt-1 text-indigo-500"
              aria-hidden="true"
            />
            Unfollow
          </span>
        </button>
      ) : (
        <button
          type="button"
          className="my-2 flex w-full rounded-md bg-indigo-50 px-4 py-2 align-middle text-sm font-medium text-indigo-700 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0 dark:border dark:border-gray-600 dark:bg-gray-800 dark:text-indigo-500 dark:hover:border-gray-400 dark:hover:bg-gray-700"
          onClick={async () => {
            await toast.promise(
              followCollectionMutation({ followedId: collection!.id, follow: true }),
              {
                loading: "Following",
                success: () => {
                  refetchFn()
                  return "Followed!"
                },
                error: (e) => {
                  return e.toString()
                },
              }
            )
          }}
        >
          <span className="mx-auto flex">
            <UserFollow
              size={32}
              className="h-5 w-5 fill-current pt-1 text-indigo-500"
              aria-hidden="true"
            />
            Follow
          </span>
        </button>
      )}
    </div>
  )
}

const ViewContributors = ({ contributors }) => {
  return (
    <div className="mx-4 my-8 xl:mx-0">
      <h3 className="my-4 text-xl">Contributor{contributors.length > 1 && "s"}</h3>
      <p className="text-sm">These are all the people whose submissions have been accepted.</p>
      {contributors?.map((submission, index) => {
        return (
          <Link
            href={Routes.HandlePage({
              handle: submission.submittedBy?.handle as string,
            })}
            key={`contributor-submission-${submission.submittedBy?.handle}-${index}`}
            legacyBehavior
          >
            <img
              className="m-1 inline-block h-12 w-12 cursor-pointer rounded-full transition ease-in-out hover:scale-125"
              src={submission!.submittedBy?.avatar as string}
              alt={`Avatar of contributor ${submission.submittedBy?.handle}`}
              style={{ zIndex: 49 - index }}
            />
          </Link>
        )
      })}
    </div>
  )
}

const PendingBadge = ({ submissions }) => {
  return (
    <>
      <span
        className={`mx-1 my-2 inline-flex items-center rounded-full bg-red-100 px-3 py-0.5 text-sm font-medium text-red-800`}
      >
        {submissions.length} pending submissions
      </span>
    </>
  )
}

const AdminBanner = ({ suffix }) => {
  return (
    <div className="z-5 sticky top-0 flex  w-full bg-fuchsia-50 px-2 py-4 text-center dark:bg-fuchsia-800">
      <div className="mx-auto flex">
        <div className="inline-block align-middle">
          <UserAdmin
            size={32}
            className="inline-block h-5 w-5 stroke-current align-middle text-fuchsia-500 dark:text-fuchsia-200"
            aria-hidden="true"
          />
        </div>
        <div className="mx-3 text-fuchsia-800 dark:text-fuchsia-100">
          <h3 className="inline-block align-middle text-sm font-normal leading-4 text-fuchsia-800 dark:text-fuchsia-100">
            Want to update your collection?
          </h3>
        </div>
        <div className="">
          <Link href={Routes.CollectionsAdmin({ suffix })} legacyBehavior>
            <button
              type="button"
              className="rounded border border-fuchsia-500 px-2 py-1.5 text-sm font-medium leading-4 text-fuchsia-500 hover:bg-fuchsia-100 focus:outline-none focus:ring-2 focus:ring-fuchsia-600 focus:ring-offset-2 focus:ring-offset-fuchsia-50 dark:border-fuchsia-200 dark:text-fuchsia-200 dark:hover:bg-fuchsia-900"
            >
              Go to Admin Portal
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

const AddSubmmision = ({ collection, currentWorkspace, refetchFn }) => {
  const [addSubmissionMutation] = useMutation(addSubmission)
  const [createReferenceMutation] = useMutation(createReferenceModule)

  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false)
  const [selectedWorkParams, setSelectedWorkParams] = useState({} as any)

  const [selectedWorkType, setSelectedWorkType] = useState("")

  const onConfirm = async (params) => {
    const { item, setQuery } = params
    await toast.promise(
      addSubmissionMutation({
        collectionId: collection!.id,
        workspaceId: currentWorkspace!.id,
        moduleId: parseInt(item.objectID),
      }),
      {
        loading: "Submitting work to collection...",
        success: () => {
          refetchFn()
          return "Submitted work to collection!"
        },
        error: "Failed to add work to collection...",
      }
    )
  }

  const [selectedDoiWorkData, setSelectedDoiWorkData] = useState({} as any)
  const onDoiSubmitConfirm = async (data) => {
    await toast.promise(
      addSubmissionMutation({
        collectionId: collection!.id,
        workspaceId: currentWorkspace!.id,
        moduleId: data.id,
      }),
      {
        loading: "Submitting work to collection...",
        success: () => {
          refetchFn()
          return "Submitted work to collection!"
        },
        error: "Failed to submit work to collection...",
      }
    )
  }
  return (
    <div className="mx-4 my-8 xl:ml-0 xl:mr-4">
      <h3 className="my-4 text-xl">Become a Contributor</h3>
      <p className="text-sm">Find your DOI below and submit.</p>

      {collection?.type.type === "COMMUNITY" && (
        <>
          <Autocomplete
            className="w-full"
            openOnFocus={false}
            defaultActiveItemId="0"
            getSources={({ query }) => [
              {
                sourceId: "products",
                async onSelect(params) {
                  setSelectedWorkType("module")
                  setSelectedWorkParams(params)
                  setIsConfirmationOpen(true)
                },
                getItems() {
                  return getAlgoliaResults({
                    searchClient,
                    queries: [
                      {
                        indexName: `${process.env.ALGOLIA_PREFIX}_modules`,
                        query,
                      },
                    ],
                  })
                },

                templates: {
                  item({ item, components }) {
                    return (
                      <>
                        {item.__autocomplete_indexName.match(/_modules/g) ? (
                          <SearchResultModule item={item} />
                        ) : (
                          ""
                        )}
                      </>
                    )
                  },
                  noResults() {
                    const matchedQuery = query.match(/10.\d{4,9}\/[-._;()\/:A-Z0-9]+$/i)

                    return (
                      <>
                        {/* https://www.crossref.org/blog/dois-and-matching-regular-expressions/ */}
                        {matchedQuery ? (
                          <>
                            <button
                              className="text-sm font-normal leading-4 text-gray-900 dark:text-gray-200"
                              onClick={async () => {
                                await toast.promise(
                                  createReferenceMutation({
                                    doi: matchedQuery.slice(-1)[0].endsWith("/")
                                      ? matchedQuery.slice(-1)[0].slice(0, -1)
                                      : matchedQuery.slice(-1)[0],
                                  }),
                                  {
                                    loading: "Searching...",
                                    success: (data) => {
                                      setSelectedWorkType("doi")
                                      setSelectedDoiWorkData(data)
                                      setIsConfirmationOpen(true)

                                      return "Record added to database"
                                    },
                                    error: "Could not add record.",
                                  }
                                )
                              }}
                            >
                              Click here to add {matchedQuery.slice(-1)} to ResearchEquals database
                            </button>
                          </>
                        ) : (
                          <p className="text-sm font-normal leading-4 text-gray-900 dark:text-gray-200">
                            Input a DOI to add
                          </p>
                        )}
                      </>
                    )
                  },
                },
              },
            ]}
          />
          <Modal
            title="Confirm submission"
            body={
              <div>
                <span>Upon confirmation, you will submit the following work:</span>
                <span className="my-2 line-clamp-3 bg-gray-50 p-4 dark:bg-gray-800">
                  {selectedWorkType === "module" && (
                    <Link
                      href={`https://doi.org/${selectedWorkParams?.item?.doi}`}
                      passHref
                      target="_blank"
                    >
                      {selectedWorkParams?.item?.name}
                    </Link>
                  )}
                  {selectedWorkType === "doi" && (
                    <Link href={selectedDoiWorkData.url} passHref target="_blank">
                      {selectedDoiWorkData?.title}
                    </Link>
                  )}
                </span>
                Do you want to submit this work to the collection?
              </div>
            }
            primaryAction="Submit Work"
            isOpen={isConfirmationOpen}
            setIsOpen={setIsConfirmationOpen}
            onSubmit={async () => {
              selectedWorkType === "module" && void onConfirm(selectedWorkParams)
              selectedWorkType === "doi" && void onDoiSubmitConfirm(selectedDoiWorkData)
            }}
          />
        </>
      )}
    </div>
  )
}
