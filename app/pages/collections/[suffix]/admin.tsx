import { useSession, useQuery, useRouter, useMutation } from "blitz"
import Layout from "app/core/layouts/Layout"
import { JsonObject } from "prisma"
import { MembershipRole } from "@prisma/client"
import moment from "moment"
import { TrashCan, LogoTwitter } from "@carbon/icons-react"

import Navbar from "../../../core/components/Navbar"
import getDrafts from "../../../core/queries/getDrafts"
import { useCurrentUser } from "../../../core/hooks/useCurrentUser"
import { useCurrentWorkspace } from "app/core/hooks/useCurrentWorkspace"
import generateSignature from "../../../signature"
import LayoutLoader from "app/core/components/LayoutLoader"
import getInvitedModules from "app/workspaces/queries/getInvitedModules"
import getCollectionInfo from "app/collections/queries/getCollectionInfo"
import { Ref, useRef, useState } from "react"
import { Widget, WidgetAPI } from "@uploadcare/react-widget"
import toast from "react-hot-toast"
import changeIcon from "../../../collections/mutations/changeIcon"
import changeHeader from "../../../collections/mutations/changeHeader"
import { Field, Form, Formik } from "formik"
import changeTitle from "app/collections/mutations/changeTitle"
import changeSubtitle from "app/collections/mutations/changeSubtitle"
import changeDescription from "app/collections/mutations/changeDescription"
import UpgradeButton from "../../../collections/components/upgrade-button"
import Autocomplete from "../../../core/components/Autocomplete"
import algoliasearch from "algoliasearch"
import { getAlgoliaResults } from "@algolia/autocomplete-js"
import SearchResultWorkspace from "../../../core/components/SearchResultWorkspace"
import addEditor from "../../../collections/mutations/addEditor"
import changeEditorRole from "app/collections/mutations/changeEditorRole"
import changeEditorActive from "app/collections/mutations/changeEditorActive"
import deleteEditor from "app/collections/mutations/deleteEditor"
import SearchResultModule from "../../../core/components/SearchResultModule"
import addWork from "app/collections/mutations/addWork"
import SetEditorToInactiveModal from "app/core/modals/SetEditorToInactiveModal"
import DeleteEditorModal from "../../../core/modals/DeleteEditorModal"
import addComment from "app/collections/mutations/addComment"
import DeleteSubmissionModal from "../../../core/modals/DeleteSubmissionModal"

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
  const [{ collection, editorIdSelf, editorIsAdmin }, { refetch }] = useQuery(
    getCollectionInfo,
    router!.query!.suffix! as string
  )
  const [addWorkMutation] = useMutation(addWork)
  const [addCommentMutation] = useMutation(addComment)

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
      <main className="relative grid xl:grid-cols-8">
        {/* TODO: Add a make public for collab and community */}
        {/* Metadata */}
        <>
          <div className="col-span-2 p-4">
            <HeaderImage
              collection={collection}
              refetchFn={refetch}
              signature={signature}
              expire={expire}
            />
            <Icon
              collection={collection}
              refetchFn={refetch}
              signature={signature}
              expire={expire}
            />
            <Title collection={collection} refetchFn={refetch} />
            <Subtitle collection={collection} refetchFn={refetch} />
            <Doi collection={collection} />
            <Description collection={collection} refetchFn={refetch} />
            <Editors collection={collection} selfId={editorIdSelf} refetchFn={refetch} />
          </div>
          {/* Works */}
          <div className="col-span-4">
            <h2>Collected works</h2>
            {/* Search bar */}
            <div>
              {/* TODO: Add DOI ingestion */}
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
                    },
                  },
                ]}
              />
              {collection?.submissions.map((submission) => {
                return (
                  <>
                    {submission.accepted && (
                      <div className="bg-red-50">
                        <p>
                          <a
                            href={`https://doi.org/${submission.module.prefix}/${submission.module.suffix}`}
                          >
                            {submission.module.title}
                          </a>
                        </p>
                        <div className="grid grid-cols-2">
                          <div>
                            <p>{`${submission.module.prefix}/${submission.module.suffix}`}</p>
                            <p>Collected {moment(submission.updatedAt).fromNow()}</p>
                            <p>
                              Originally published{" "}
                              {moment(submission.module.publishedAt!).fromNow()}
                            </p>
                          </div>
                          <div>
                            {submission.editor.id === editorIdSelf && submission.comment === null && (
                              <>
                                <Formik
                                  initialValues={{
                                    comment: "",
                                  }}
                                  onSubmit={async (values) => {
                                    try {
                                      await addCommentMutation({
                                        id: submission.id,
                                        comment: values.comment,
                                      })
                                      refetch()
                                    } catch (error) {
                                      alert("Error saving product")
                                    }
                                  }}
                                >
                                  <Form>
                                    <label htmlFor="comment" className="sr-only">
                                      comment
                                    </label>
                                    <Field
                                      id="comment"
                                      name="comment"
                                      placeholder="comment"
                                      type="text"
                                      component="textarea"
                                      rows={3}
                                    />
                                    {false ? (
                                      <button
                                        className="whitespace-nowrap font-medium underline"
                                        type="submit"
                                      >
                                        Thanks!
                                      </button>
                                    ) : (
                                      <button
                                        className="whitespace-nowrap font-medium underline"
                                        type="submit"
                                      >
                                        Save comment <span aria-hidden="true">&rarr;</span>
                                      </button>
                                    )}
                                  </Form>
                                </Formik>
                              </>
                            )}
                            {submission.comment && submission.comment != "" && (
                              <>
                                {/* for inspiration https://shuffle.dev/components/all/all/testimonials */}
                                <blockquote className="bg-indigo-100">
                                  {submission.comment}
                                </blockquote>
                              </>
                            )}
                            <div className="">
                              <p className="flex">
                                <img
                                  src={submission.editor!.workspace!.avatar!}
                                  alt={`Avatar of ${submission.editor.workspace.firstName}
                                ${submission.editor.workspace.lastName}`}
                                  className="h-6 w-6 rounded-full"
                                />
                                {submission.editor.workspace.firstName}{" "}
                                {submission.editor.workspace.lastName}
                              </p>
                              {submission.submittedBy && (
                                <p className="text-xs">
                                  Submitted by {submission.editor.workspace.firstName}{" "}
                                  {submission.editor.workspace.lastName}
                                </p>
                              )}
                              {/* Tweet button */}
                              {/* https://developer.twitter.com/en/docs/twitter-for-websites/tweet-button/guides/web-intent */}
                            </div>
                            {submission.comment && submission.comment != "" && (
                              <a
                                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                                  submission.comment
                                )}&via=ResearchEquals`}
                                target="_blank"
                                rel="noreferrer"
                              >
                                <LogoTwitter size={32} className="fill-current text-indigo-400" />
                              </a>
                            )}
                            <DeleteSubmissionModal
                              submissionId={submission.id}
                              refetchFn={refetch}
                            />
                          </div>
                        </div>
                        {/* If no comment add option to add one */}
                      </div>
                    )}
                  </>
                )
              })}
            </div>

            {/* Show cards for each accepted submission */}
            {/* <div>{JSON.stringify(collection!.submissions)}</div> */}
          </div>
          <div className="col-span-2">
            <h2>Submissions</h2>
            <UpgradeButton />
          </div>
        </>
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

const Description = ({ collection, refetchFn }) => {
  const [changeDescriptionMutation, { isSuccess: isDescriptionSuccess }] =
    useMutation(changeDescription)

  return (
    <Formik
      initialValues={{
        description: "",
      }}
      onSubmit={async (values) => {
        try {
          await changeDescriptionMutation({
            id: collection.id,
            description: values.description,
          })
          refetchFn()
        } catch (error) {
          alert("Error saving product")
        }
      }}
    >
      <Form>
        <label htmlFor="description" className="sr-only">
          description
        </label>
        <Field
          id="description"
          name="description"
          placeholder="description"
          type="text"
          component="textarea"
          rows={8}
        />
        {isDescriptionSuccess ? (
          <button className="whitespace-nowrap font-medium underline" type="submit">
            Thanks!
          </button>
        ) : (
          <button className="whitespace-nowrap font-medium underline" type="submit">
            Save description <span aria-hidden="true">&rarr;</span>
          </button>
        )}
      </Form>
    </Formik>
  )
}

const searchClient = algoliasearch(process.env.ALGOLIA_APP_ID!, process.env.ALGOLIA_API_SEARCH_KEY!)

const Editors = ({ collection, selfId, refetchFn }) => {
  const [addEditorMutation] = useMutation(addEditor)
  return (
    <div>
      <h3 className="text-center text-sm">Editors</h3>
      {/* Search box to add editors */}
      {/* Add conditional upgrade button if collab and five editors present. */}
      {collection.type.type === "INDIVIDUAL" ? (
        <UpgradeButton />
      ) : (
        <>
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
        </>
      )}
      {collection.editors.map((editor) => {
        return (
          <>
            <EditorCard
              editor={editor}
              isAdmin={true}
              isSelf={selfId === editor.id}
              refetchFn={refetchFn}
            />
          </>
        )
      })}
    </div>
  )
}

const EditorCard = ({ editor, isAdmin, isSelf, refetchFn }) => {
  const [changeEditorRoleMutation] = useMutation(changeEditorRole)
  const [changeEditorActiveMutation] = useMutation(changeEditorActive)
  const [deleteEditorMutation] = useMutation(deleteEditor)

  return (
    <>
      {/* add actions if OWNER | ADMIN */}
      {/* 1 - Change role */}
      {/* 2 - Delete editor - with confirmation */}
      {/* 3 - Make editor inactive */}
      <div className={`flex ${editor.isActive ? "" : "opacity-50"}`}>
        <img src={editor.workspace.avatar} />
        {/* {editor.role} */}
        <div className="inline-block">
          <p>{editor.workspace.firstName}</p>
          {JSON.stringify(isAdmin)}

          {JSON.stringify(isSelf)}
        </div>
        <p>@{editor.workspace.handle}</p>
        {isAdmin && !isSelf && (
          <>
            <select
              onChange={(info) => {
                toast.promise(
                  changeEditorRoleMutation({ editorId: editor.id, role: info.target.value }),
                  {
                    loading: `Changing role to ${info.target.value.toLowerCase()}...`,
                    success: `Changed role to ${info.target.value.toLowerCase()}!`,
                    error: "Failed to change role...",
                  }
                )
              }}
              defaultValue={editor.role}
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
  const [changeTitleMutation, { isSuccess: isTitleSuccess }] = useMutation(changeTitle)

  return (
    <>
      {collection.title === null || !collection.public ? (
        <>
          <Formik
            initialValues={{
              title: "",
            }}
            onSubmit={async (values) => {
              try {
                await changeTitleMutation({ id: collection.id, title: values.title })
                refetchFn()
              } catch (error) {
                alert("Error saving product")
              }
            }}
          >
            <Form>
              <label htmlFor="title" className="sr-only">
                title
              </label>
              <Field id="title" name="title" placeholder="jane@acme.com" type="text" />
              {isTitleSuccess ? (
                <button className="whitespace-nowrap font-medium underline" type="submit">
                  Thanks!
                </button>
              ) : (
                <button className="whitespace-nowrap font-medium underline" type="submit">
                  Send again <span aria-hidden="true">&rarr;</span>
                </button>
              )}
            </Form>
          </Formik>
        </>
      ) : (
        <h2 className="mx-auto text-center text-xl font-bold">{collection.title}</h2>
      )}
    </>
  )
}
const Subtitle = ({ collection, refetchFn }) => {
  const [changeSubtitleMutation, { isSuccess: isSubtitleSuccess }] = useMutation(changeSubtitle)

  return (
    <>
      {collection.subtitle === null || !collection.public ? (
        <>
          <Formik
            initialValues={{
              subtitle: "",
            }}
            onSubmit={async (values) => {
              try {
                await changeSubtitleMutation({
                  id: collection.id,
                  subtitle: values.subtitle,
                })
                refetchFn()
              } catch (error) {
                alert("Error saving product")
              }
            }}
          >
            <Form>
              <label htmlFor="subtitle" className="sr-only">
                subtitle
              </label>
              <Field id="subtitle" name="subtitle" placeholder="Subtitle" type="text" />
              {isSubtitleSuccess ? (
                <button className="whitespace-nowrap font-medium underline" type="submit">
                  Thanks!
                </button>
              ) : (
                <button className="whitespace-nowrap font-medium underline" type="submit">
                  Save subtitle <span aria-hidden="true">&rarr;</span>
                </button>
              )}
            </Form>
          </Formik>
        </>
      ) : (
        <h2 className="mx-auto text-center text-base font-medium leading-5">
          {collection.subtitle}
        </h2>
      )}
    </>
  )
}

const Icon = ({ collection, refetchFn, signature, expire }) => {
  const widgetApiIcon = useRef() as Ref<WidgetAPI>
  const [changeIconMutation] = useMutation(changeIcon)

  return (
    <>
      {collection.type.type != "INDVIDUAL" ? (
        <>
          <img
            src={collection?.icon!["originalUrl"]}
            className="max-w-28 mx-auto h-28 max-h-28 w-28 rounded-full border border-2 border-gray-900 hover:cursor-pointer hover:border-4 hover:border-indigo-600 dark:border-white"
            alt={`Icon of ${collection.title}`}
            onClick={() => {
              widgetApiIcon!["current"].openDialog()
            }}
          />
          <Widget
            publicKey={process.env.UPLOADCARE_PUBLIC_KEY ?? ""}
            secureSignature={signature}
            secureExpire={expire}
            ref={widgetApiIcon}
            imagesOnly
            previewStep
            clearable
            onChange={async (info) => {
              try {
                toast.promise(
                  changeIconMutation({
                    id: collection.id,
                    iconInfo: info as JsonObject,
                  }),
                  {
                    loading: "Updating icon...",
                    success: () => {
                      refetchFn()
                      return "Success!"
                    },
                    error: "That did not work",
                  }
                )
              } catch (err) {
                alert(err)
              }
            }}
          />
        </>
      ) : (
        <img
          src={collection?.icon!["originalUrl"]}
          className="max-w-28 mx-auto h-28 max-h-28 w-28 rounded-full border border-2 border-gray-900 hover:cursor-pointer hover:border-4 hover:border-indigo-600 dark:border-white"
          alt={`Icon of ${collection.title}`}
        />
      )}
    </>
  )
}

const HeaderImage = ({ collection, refetchFn, signature, expire }) => {
  const widgetApiHeader = useRef() as Ref<WidgetAPI>
  const [changeHeaderMutation] = useMutation(changeHeader)

  return (
    <>
      {collection.type.type === "COMMUNITY" && (
        <>
          <img
            src={collection?.header!["originalUrl"]}
            className="h-28 max-h-28 w-full rounded-full border border-2 border-gray-900 hover:cursor-pointer hover:border-4 hover:border-indigo-600 dark:border-white"
            alt={`Header image of ${collection.title}`}
            onClick={() => {
              widgetApiHeader!["current"].openDialog()
            }}
          />
          <Widget
            publicKey={process.env.UPLOADCARE_PUBLIC_KEY ?? ""}
            secureSignature={signature}
            secureExpire={expire}
            ref={widgetApiHeader}
            imagesOnly
            previewStep
            clearable
            onChange={async (info) => {
              console.log(JSON.stringify(info))
              try {
                toast.promise(
                  changeHeaderMutation({
                    id: collection.id,
                    headerInfo: info as JsonObject,
                  }),
                  {
                    loading: "Updating header...",
                    success: () => {
                      refetchFn()
                      return "Success!"
                    },
                    error: "That did not work",
                  }
                )
              } catch (err) {
                alert(err)
              }
            }}
          />
        </>
      )}
    </>
  )
}

const Doi = ({ collection }) => {
  return <div>{`${process.env.DOI_PREFIX}/${collection!.suffix}`}</div>
}
