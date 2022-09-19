import {
  useSession,
  useQuery,
  useRouter,
  useMutation,
  Routes,
  Link,
  validateZodSchema,
} from "blitz"
import Layout from "app/core/layouts/Layout"
import { MembershipRole } from "@prisma/client"
import moment from "moment"
import { LogoTwitter } from "@carbon/icons-react"

import Navbar from "../../../core/components/Navbar"
import getDrafts from "../../../core/queries/getDrafts"
import { useCurrentUser } from "../../../core/hooks/useCurrentUser"
import { useCurrentWorkspace } from "app/core/hooks/useCurrentWorkspace"
import generateSignature from "../../../signature"
import LayoutLoader from "app/core/components/LayoutLoader"
import getInvitedModules from "app/workspaces/queries/getInvitedModules"
import getCollectionInfo from "app/collections/queries/getCollectionInfo"
import { Ref, useEffect, useRef, useState } from "react"
import { Widget, WidgetAPI } from "@uploadcare/react-widget"
import toast from "react-hot-toast"
import changeIcon from "../../../collections/mutations/changeIcon"
import changeHeader from "../../../collections/mutations/changeHeader"
import { Field, Form, Formik, useFormik } from "formik"
import changeTitle from "app/collections/mutations/changeTitle"
import changeSubtitle from "app/collections/mutations/changeSubtitle"
import changeDescription from "app/collections/mutations/changeDescription"
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
import DeleteSubmissionModal from "../../../core/modals/DeleteSubmissionModal"
import MakeCollectionPublicModal from "../../../core/modals/MakeCollectionPublicModal"
import UpgradeCollectionModal from "../../../core/modals/UpgradeCollectionModal"
import HandleSubmissionToCollectionModal from "../../../core/modals/HandleSubmissionToCollectionModal"
import HeaderImage from "../../../collections/components/HeaderImage"
import Icon from "../../../collections/components/Icon"
import AdminSubtitle from "../../../collections/components/AdminSubtitle"
import { useQuill } from "react-quilljs"
import { z } from "zod"
import Doi from "../../../collections/components/DoiCollection"
import AdminDescription from "../../../collections/components/AdminDescription"
import createReferenceModule from "app/modules/mutations/createReferenceModule"
import ActivityBadge from "../../../collections/components/ActivityBadge"
import ContributorsBadge from "../../../collections/components/ContributorsBadge"
import EditorsBadge from "../../../collections/components/EditorsBadge"
import AdminWorkCard from "../../../collections/components/AdminWorkCard"
import AdminSubmission from "app/collections/components/AdminSubmission"
import FinalizeUpgradeModal from "../../../core/modals/FinalizeUpgradeModal"

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
  const [addWorkMutation] = useMutation(addWork)
  const [addCommentMutation] = useMutation(addComment)
  const [createReferenceMutation] = useMutation(createReferenceModule)

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
          <MakeCollectionPublicModal collection={collection} refetchFn={refetch} />
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
        {/* TODO: Differentiate order for mobile */}
        {/* Avatar */}
        {/* Title */}
        <div className="inline-block w-full xl:grid xl:grid-cols-8">
          <div className="col-span-2 mx-4 p-4">
            {collection!.type.type !== "INDIVIDUAL" && (
              <Icon
                collection={collection}
                refetchFn={refetch}
                signature={signature}
                expire={expire}
              />
            )}
            <Editors
              collection={collection}
              user={currentUser}
              selfId={editorIdSelf}
              isAdmin={editorIsAdmin}
              refetchFn={refetch}
            />
          </div>
          <div className="col-span-4 mx-4 px-4">
            <Title collection={collection} refetchFn={refetch} />
            {collection!.type.type !== "INDIVIDUAL" && (
              <AdminSubtitle collection={collection} refetchFn={refetch} />
            )}
            <div className="my-4 w-full text-center align-middle">
              <Doi collection={collection} />
              <ActivityBadge collection={collection} />
              {collection!.type.type !== "INDIVIDUAL" && <EditorsBadge collection={collection} />}
              {collection!.type.type !== "INDIVIDUAL" && (
                <ContributorsBadge collection={collection} />
              )}
            </div>
            <AdminDescription collection={collection} refetchFn={refetch} />
            <h2 className="my-4 text-xl">Collected works</h2>
            <div>
              <Autocomplete
                className=""
                openOnFocus={false}
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
                            refetch()
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
                                                refetch()
                                                return "Added work to collection!"
                                              },
                                              error: "Failed to add work to collection...",
                                            }
                                          )

                                          refetch()

                                          return "Record added to database"
                                        },
                                        error: "Could not add record.",
                                      }
                                    )
                                  }}
                                >
                                  Click here to add {matchedQuery.slice(-1)} to ResearchEquals
                                  database
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
                        refetchFn={refetch}
                      />
                    )}
                  </>
                )
              })}
            </div>
          </div>
          <div className="col-span-2 mx-4 p-4">
            <h2 className="my-2 text-center text-lg font-bold">Pending Submissions</h2>

            {/* {pendingSubmissions.submissions.length} */}
            {collection?.type.type != "COMMUNITY" && (
              <div className="mx-auto w-full align-middle">
                <UpgradeCollectionModal collection={collection} email={currentUser!.email} />
              </div>
            )}
            {pendingSubmissions?.submissions.length! > 0 &&
            collection?.type.type === "COMMUNITY" ? (
              <>
                {collection.submissions.map((submission, index) => {
                  return (
                    <AdminSubmission
                      submission={submission}
                      editorIdSelf={editorIdSelf}
                      refetchFn={refetch}
                      key={`submission-${index}`}
                    />
                  )
                })}
              </>
            ) : (
              <div className="mx-8">
                <div className="relative my-4 mx-4 flex w-full flex-grow flex-col rounded-lg border-2 border-dashed border-gray-800 text-center focus:outline-none focus:ring-2 focus:ring-indigo-500  focus:ring-offset-2 dark:border-white">
                  <div className="table h-full w-full flex-grow">
                    <div className="h-28 w-1/4 sm:table-cell"></div>
                    <span className="mx-auto table-cell align-middle text-sm font-medium leading-4">
                      <>
                        <div className="mx-4">No pending submissions. Maybe request some?</div>
                      </>
                    </span>
                    <div className="hidden w-1/4 sm:table-cell"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
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

const Editors = ({ collection, isAdmin, selfId, refetchFn, user }) => {
  const [addEditorMutation] = useMutation(addEditor)
  return (
    <div className="my-2">
      <h3 className="my-2 text-center text-lg font-bold">
        Editor{collection.editors.length > 1 && "s"}
      </h3>
      {(isAdmin && collection.type.type === "INDIVIDUAL") ||
      (collection.type.type === "COLLABORATIVE" && collection.editors.length >= 5) ? (
        <UpgradeCollectionModal collection={collection} email={user.email} />
      ) : (
        <>
          {isAdmin && (
            <Autocomplete
              className="h-full"
              openOnFocus={true}
              defaultActiveItemId="0"
              getSources={({ query }) => [
                {
                  sourceId: "products",
                  async onSelect(params) {
                    const { item, setQuery } = params
                    toast.promise(
                      addEditorMutation({
                        collectionId: collection.id,
                        workspaceId: parseInt(item.objectID),
                      }),
                      {
                        loading: "Adding editor...",
                        success: () => {
                          refetchFn()
                          return "Added editor!"
                        },
                        error: "Failed to add editor...",
                      }
                    )
                  },
                  getItems() {
                    return getAlgoliaResults({
                      searchClient,
                      queries: [
                        {
                          indexName: `${process.env.ALGOLIA_PREFIX}_workspaces`,
                          query,
                        },
                      ],
                    })
                  },
                  templates: {
                    item({ item, components }) {
                      return (
                        <>
                          {item.__autocomplete_indexName.match(/_workspaces/g) ? (
                            <SearchResultWorkspace item={item} />
                          ) : (
                            ""
                          )}
                        </>
                      )
                    },
                  },
                },
              ]}
            />
          )}
        </>
      )}
      <div className="my-4">
        {collection.editors.map((editor) => {
          return (
            <>
              <EditorCard
                editor={editor}
                isAdmin={isAdmin}
                isSelf={selfId === editor.id}
                refetchFn={refetchFn}
              />
            </>
          )
        })}
      </div>
    </div>
  )
}

const EditorCard = ({ editor, isAdmin, isSelf, refetchFn }) => {
  const [changeEditorRoleMutation] = useMutation(changeEditorRole)

  return (
    <>
      <div className={`flex ${editor.isActive ? "" : "opacity-50"} my-2`}>
        <img src={editor.workspace.avatar} className="mx-2 h-12 w-12 rounded-full" />
        <div className="inline-block flex-grow">
          <Link href={Routes.HandlePage({ handle: editor.workspace.handle })}>
            <a target="_blank">
              <p className="line-clamp-1">
                {editor.workspace.firstName} {editor.workspace.lastName}
              </p>
              <p className="text-sm">@{editor.workspace.handle}</p>
            </a>
          </Link>
        </div>
        {isAdmin && (
          <>
            <select
              onChange={(info) => {
                toast.promise(
                  changeEditorRoleMutation({ editorId: editor.id, role: info.target.value }),
                  {
                    loading: `Changing role to ${info.target.value.toLowerCase()}...`,
                    success: () => {
                      refetchFn()
                      return `Changed role to ${info.target.value.toLowerCase()}!`
                    },
                    error: (err) => {
                      return `${err}`
                    },
                  }
                )
              }}
              defaultValue={editor.role}
              className="placeholder-font-normal block appearance-none rounded-md border border-gray-400 bg-white px-4 py-2 pr-6 text-sm font-normal placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0 dark:border-gray-600 dark:bg-transparent dark:text-gray-200 "
            >
              {Object.values(MembershipRole).map((role) => {
                return <option key={role}>{role}</option>
              })}
            </select>
            <SetEditorToInactiveModal editor={editor} refetchFn={refetchFn} />
            <DeleteEditorModal editor={editor} refetchFn={refetchFn} />
          </>
        )}
      </div>
    </>
  )
}

const Title = ({ collection, refetchFn }) => {
  const [changeTitleMutation] = useMutation(changeTitle)

  return (
    <>
      {collection.title === null || !collection.public || collection.upgraded ? (
        <>
          <Formik
            initialValues={{
              title: "",
            }}
            onSubmit={() => {}}
          >
            <Form
              className="my-4 w-full"
              onBlur={(values) => {
                if (collection.title != values.target.defaultValue) {
                  toast.promise(
                    changeTitleMutation({
                      id: collection.id,
                      title: values.target.defaultValue,
                    }),
                    {
                      loading: "Updating title...",
                      success: () => {
                        refetchFn()
                        return "Updated title"
                      },
                      error: "Failed to update title",
                    }
                  )
                }
              }}
            >
              <label htmlFor="title" className="sr-only">
                title
              </label>
              <Field
                id="title"
                name="title"
                // TODO: This is causing a bug
                placeholder={collection.title || "Your title here"}
                type="text"
                className="w-full select-none overflow-auto border-0 bg-white text-center text-6xl focus:ring-0 dark:bg-gray-900 "
              />
            </Form>
          </Formik>
        </>
      ) : (
        <h2 className="my-4 w-full border-0 bg-white text-center text-6xl focus:ring-0 dark:bg-gray-900">
          {collection.title}
        </h2>
      )}
    </>
  )
}
