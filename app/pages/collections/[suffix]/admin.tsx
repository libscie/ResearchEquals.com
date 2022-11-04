import { useSession, useQuery, useRouter, useMutation, Routes, Link } from "blitz"
import Layout from "app/core/layouts/Layout"
import { MembershipRole } from "@prisma/client"

import Navbar from "../../../core/components/Navbar"
import getDrafts from "../../../core/queries/getDrafts"
import { useCurrentUser } from "../../../core/hooks/useCurrentUser"
import { useCurrentWorkspace } from "app/core/hooks/useCurrentWorkspace"
import generateSignature from "../../../signature"
import LayoutLoader from "app/core/components/LayoutLoader"
import getInvitedModules from "app/workspaces/queries/getInvitedModules"
import getCollectionInfo from "app/collections/queries/getCollectionInfo"
import toast from "react-hot-toast"
import Autocomplete from "../../../core/components/Autocomplete"
import algoliasearch from "algoliasearch"
import { getAlgoliaResults } from "@algolia/autocomplete-js"
import SearchResultWorkspace from "../../../core/components/SearchResultWorkspace"
import addEditor from "../../../collections/mutations/addEditor"
import changeEditorRole from "app/collections/mutations/changeEditorRole"
import SearchResultModule from "../../../core/components/SearchResultModule"
import addWork from "app/collections/mutations/addWork"
import SetEditorToInactiveModal from "app/core/modals/SetEditorToInactiveModal"
import DeleteEditorModal from "../../../core/modals/DeleteEditorModal"
import addComment from "app/collections/mutations/addComment"
import MakeCollectionPublicModal from "../../../core/modals/MakeCollectionPublicModal"
import UpgradeCollectionModal from "../../../core/modals/UpgradeCollectionModal"
import HeaderImage from "../../../collections/components/AdminHeaderImage"
import Icon from "../../../collections/components/AdminIcon"
import AdminSubtitle from "../../../collections/components/AdminSubtitle"
import Doi from "../../../collections/components/DoiCollection"
import AdminDescription from "../../../collections/components/AdminDescription"
import createReferenceModule from "app/modules/mutations/createReferenceModule"
import ActivityBadge from "../../../collections/components/ActivityBadge"
import ContributorsBadge from "../../../collections/components/ContributorsBadge"
import EditorsBadge from "../../../collections/components/EditorsBadge"
import AdminWorkCard from "../../../collections/components/AdminWorkCard"
import AdminSubmission from "app/collections/components/AdminSubmission"
import FinalizeUpgradeModal from "../../../core/modals/FinalizeUpgradeModal"
import { useMediaPredicate } from "react-media-hook"
import AdminTitle from "../../../collections/components/AdminTitle"
import AdminCollectedWorks from "../../../collections/components/AdminCollectedWorks"
import AdminEditors from "../../../collections/components/AdminEditors"

export async function getServerSideProps(context) {
  // Expires in 30 minutes
  const expire = Math.round(Date.now() / 1000) + 60 * 30
  const signature = generateSignature(process.env.UPLOADCARE_SECRET_KEY, expire.toString())

  return {
    props: {
      expire,
      signature,
    },
  }
}

const CollectionsAdmin = ({ expire, signature }, context) => {
  const currentUser = useCurrentUser()
  const session = useSession()
  const currentWorkspace = useCurrentWorkspace()
  const router = useRouter()
  const [drafts] = useQuery(getDrafts, { session })
  const [invitations] = useQuery(getInvitedModules, { session })
  const [{ collection, editorIdSelf, editorIsAdmin, pendingSubmissions }, { refetch }] = useQuery(
    getCollectionInfo,
    router!.query!.suffix! as string
  )
  const [addCommentMutation] = useMutation(addComment)
  const mdWindow = useMediaPredicate("(min-width: 768px)")
  const lgWindow = useMediaPredicate("(min-width: 1024px)")
  const xlWindow = useMediaPredicate("(min-width: 1280px)")

  return (
    <>
      <Navbar
        currentUser={currentUser}
        session={session}
        currentWorkspace={currentWorkspace}
        router={router}
        drafts={drafts}
        invitations={invitations}
        refetchFn={refetch}
      />
      <main className="relative">
        {!collection?.public && (
          <MakeCollectionPublicModal
            collection={collection}
            refetchFn={refetch}
            workspace={currentWorkspace}
          />
        )}
        {collection?.upgraded && (
          <FinalizeUpgradeModal collection={collection} refetchFn={refetch} />
        )}
        <HeaderImage
          collection={collection}
          refetchFn={refetch}
          signature={signature}
          expire={expire}
        />
        {/* mobile */}
        {!xlWindow && (
          <>
            <div className="w-full">
              <div className="flex">
                <div className="top-[50%] mx-auto mx-4 w-[25%] p-4 ">
                  {collection!.type.type !== "INDIVIDUAL" && (
                    <Icon
                      collection={collection}
                      refetchFn={refetch}
                      signature={signature}
                      expire={expire}
                    />
                  )}
                </div>
                <div className="flex-grow">
                  <AdminTitle collection={collection} refetchFn={refetch} isAdmin={editorIsAdmin} />
                  {collection!.type.type !== "INDIVIDUAL" && (
                    <AdminSubtitle
                      collection={collection}
                      refetchFn={refetch}
                      isAdmin={editorIsAdmin}
                    />
                  )}
                  <div className="my-4 w-full text-center align-middle">
                    <Doi collection={collection} />
                    <ActivityBadge collection={collection} />
                    {collection!.type.type !== "INDIVIDUAL" && (
                      <EditorsBadge collection={collection} />
                    )}
                    {collection!.type.type !== "INDIVIDUAL" && (
                      <ContributorsBadge collection={collection} nrContributors={{}} />
                    )}
                  </div>
                </div>
              </div>
              <AdminEditors
                collection={collection}
                user={currentUser}
                selfId={editorIdSelf}
                isAdmin={editorIsAdmin}
                refetchFn={refetch}
              />
              <AdminDescription
                collection={collection}
                refetchFn={refetch}
                isAdmin={editorIsAdmin}
              />
              <PendingSubmissions
                collection={collection}
                currentUser={currentUser}
                editorIdSelf={editorIdSelf}
                pendingSubmissions={pendingSubmissions}
                refetchFn={refetch}
              />
              <AdminCollectedWorks
                collection={collection}
                editorIdSelf={editorIdSelf}
                refetchFn={refetch}
                editorIsAdmin={editorIsAdmin}
              />
            </div>
          </>
        )}
        {/* desktop */}
        {xlWindow && (
          <div className="inline-block w-full md:grid md:grid-cols-4 xl:grid-cols-8">
            <div className="col-span-1 mx-4 p-4 xl:col-span-2">
              {collection!.type.type !== "INDIVIDUAL" && (
                <Icon
                  collection={collection}
                  refetchFn={refetch}
                  signature={signature}
                  expire={expire}
                />
              )}
              <AdminEditors
                collection={collection}
                user={currentUser}
                selfId={editorIdSelf}
                isAdmin={editorIsAdmin}
                refetchFn={refetch}
              />
            </div>
            <div className="col-span-4 mx-4 px-4">
              <AdminTitle collection={collection} refetchFn={refetch} isAdmin={editorIsAdmin} />
              {collection!.type.type !== "INDIVIDUAL" && (
                <AdminSubtitle
                  collection={collection}
                  refetchFn={refetch}
                  isAdmin={editorIsAdmin}
                />
              )}
              <div className="my-4 w-full text-center align-middle">
                <Doi collection={collection} />
                <ActivityBadge collection={collection} />
                {collection!.type.type !== "INDIVIDUAL" && <EditorsBadge collection={collection} />}
                {collection!.type.type !== "INDIVIDUAL" && (
                  <ContributorsBadge collection={collection} nrContributors={{}} />
                )}
              </div>
              <AdminDescription
                collection={collection}
                refetchFn={refetch}
                isAdmin={editorIsAdmin}
              />
              <AdminCollectedWorks
                collection={collection}
                editorIdSelf={editorIdSelf}
                refetchFn={refetch}
                editorIsAdmin={editorIsAdmin}
              />
            </div>
            <PendingSubmissions
              collection={collection}
              currentUser={currentUser}
              editorIdSelf={editorIdSelf}
              pendingSubmissions={pendingSubmissions}
              refetchFn={refetch}
            />
          </div>
        )}
      </main>
    </>
  )
}

CollectionsAdmin.authenticate = true
CollectionsAdmin.getLayout = (page) => (
  <Layout title="R= Collections Admin Portal">
    <LayoutLoader>{page}</LayoutLoader>
  </Layout>
)

export default CollectionsAdmin

const searchClient = algoliasearch(process.env.ALGOLIA_APP_ID!, process.env.ALGOLIA_API_SEARCH_KEY!)

const PendingSubmissions = ({
  collection,
  currentUser,
  editorIdSelf,
  pendingSubmissions,
  refetchFn,
}) => {
  return (
    <div className="col-span-2 m-4 xl:p-4">
      <h2 className="my-4 text-xl">Pending Submissions</h2>
      {collection?.type.type != "COMMUNITY" && (
        <div className="mx-auto w-full align-middle">
          <UpgradeCollectionModal collection={collection} email={currentUser!.email} />
        </div>
      )}
      {pendingSubmissions?.submissions.length! > 0 && collection?.type.type === "COMMUNITY" && (
        <>
          {collection.submissions.map((submission, index) => {
            return (
              <AdminSubmission
                submission={submission}
                editorIdSelf={editorIdSelf}
                refetchFn={refetchFn}
                key={`submission-${index}`}
              />
            )
          })}
        </>
      )}
      {pendingSubmissions?.submissions.length! === 0 && collection?.type.type === "COMMUNITY" && (
        <div className="">
          <div className="relative flex w-full flex-grow flex-col rounded-lg border-2 border-dashed border-gray-800 text-center focus:outline-none focus:ring-2 focus:ring-indigo-500  focus:ring-offset-2 dark:border-white">
            <div className="table h-full w-full flex-grow">
              <div className="h-28 w-1/4 sm:table-cell"></div>
              <span className="mx-auto table-cell align-middle text-sm font-medium leading-4">
                <>
                  <div className="">No pending submissions. Maybe request some?</div>
                </>
              </span>
              <div className="hidden w-1/4 sm:table-cell"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const CollectedWorks = ({ collection, editorIdSelf, refetchFn, editorIsAdmin }) => {
  const [addWorkMutation] = useMutation(addWork)
  const [createReferenceMutation] = useMutation(createReferenceModule)

  return (
    <div className="mx-4 my-8 xl:mx-0">
      <h2 className="my-4 text-xl">Collected works</h2>
      <div>
        <Autocomplete
          className=""
          openOnFocus={true}
          defaultActiveItemId="0"
          getSources={({ query }) => [
            {
              sourceId: "products",
              async onSelect(params) {
                const { item, setQuery } = params
                toast.promise(
                  addWorkMutation({
                    collectionId: collection!.id,
                    editorId: editorIdSelf,
                    moduleId: parseInt(item.objectID),
                  }),
                  {
                    loading: "Adding work to collection...",
                    success: () => {
                      refetchFn()
                      return "Added work to collection!"
                    },
                    error: "Failed to add work to collection...",
                  }
                )
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
                              toast.promise(
                                createReferenceMutation({
                                  doi: matchedQuery.slice(-1)[0].endsWith("/")
                                    ? matchedQuery.slice(-1)[0].slice(0, -1)
                                    : matchedQuery.slice(-1)[0],
                                }),
                                {
                                  loading: "Searching...",
                                  success: (data) => {
                                    toast.promise(
                                      addWorkMutation({
                                        collectionId: collection!.id,
                                        editorId: editorIdSelf,
                                        moduleId: data.id,
                                      }),
                                      {
                                        loading: "Adding work to collection...",
                                        success: () => {
                                          refetchFn()
                                          return "Added work to collection!"
                                        },
                                        error: "Failed to add work to collection...",
                                      }
                                    )

                                    refetchFn()

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
        {collection?.submissions.map((submission, index) => {
          return (
            <>
              {submission.accepted && (
                <AdminWorkCard
                  submission={submission}
                  index={index}
                  editorIdSelf={editorIdSelf}
                  editorIsAdmin={editorIsAdmin}
                  refetchFn={refetchFn}
                />
              )}
            </>
          )
        })}
      </div>
    </div>
  )
}
