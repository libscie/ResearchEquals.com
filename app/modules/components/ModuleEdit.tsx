import Link from "next/link"
import { Routes } from "@blitzjs/next"
import { useQuery, useMutation } from "@blitzjs/rpc"
import { useState, useEffect } from "react"
import algoliasearch from "algoliasearch"
import { z } from "zod"
import { getAlgoliaResults } from "@algolia/autocomplete-js"
import { ArrowLeft, Edit, EditOff } from "@carbon/icons-react"
import { Prisma } from "prisma"
import { useFormik } from "formik"
import { WarningSquareFilled, Maximize, TrashCan } from "@carbon/icons-react"
import toast from "react-hot-toast"
import Xarrows from "react-xarrows"

import EditMainFile from "./EditMainFile"
import EditSupportingFiles from "./EditSupportingFiles"

import DeleteModuleModal from "../../core/modals/DeleteModuleModal"
import useCurrentModule from "../queries/useCurrentModule"
import Autocomplete from "../../core/components/Autocomplete"
import PublishModuleModal from "../../core/modals/PublishModuleModal"
import editModuleScreen from "../mutations/editModuleScreen"
import EditSupportingFileDisplay from "../../core/components/EditSupportingFileDisplay"
import MetadataView from "./MetadataView"
import SearchResultModule from "../../core/components/SearchResultModule"
import MetadataEdit from "./MetadataEdit"
import addReference from "../mutations/addReference"
import createReferenceModule from "../mutations/createReferenceModule"
import deleteReference from "../mutations/deleteReference"
import { useMediaPredicate } from "react-media-hook"
import addParent from "../mutations/addParent"
import ManageParents from "./ManageParents"
import approveAuthorship from "app/authorship/mutations/approveAuthorship"
import SettingsModal from "../../core/modals/settings"
import { Module, User, Workspace } from "@prisma/client"
import { UseCurrentWorkspace } from "app/core/hooks/useCurrentWorkspace"
import { validateZodSchema } from "blitz"

const searchClient = algoliasearch(process.env.ALGOLIA_APP_ID!, process.env.ALGOLIA_API_SEARCH_KEY!)

const ModuleEdit = ({
  user,
  workspace,
  module,
  isAuthor,
  setInboxOpen,
  inboxOpen,
  expire,
  signature,
  setModule,
  fetchDrafts,
}: {
  user: User
  workspace: UseCurrentWorkspace
  module: Module
  isAuthor: boolean
  setInboxOpen: (open: boolean) => void
  inboxOpen: boolean
  expire: number
  signature: string
  setModule: (module: Module) => void
  fetchDrafts: () => void
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [addAuthors, setAddAuthors] = useState(false)
  const [addParentMutation] = useMutation(addParent)

  const [moduleEdit, { refetch, setQueryData }] = useQuery(
    useCurrentModule,
    { suffix: module.suffix! },
    { refetchOnWindowFocus: false }
  )

  const mainFile = moduleEdit!.main as Prisma.JsonObject
  const supportingRaw = moduleEdit!.supporting as Prisma.JsonObject
  const [approveAuthorshipMutation] = useMutation(approveAuthorship)

  const [addReferenceMutation] = useMutation(addReference)
  const [deleteReferenceMutation] = useMutation(deleteReference)
  const [createReferenceMutation] = useMutation(createReferenceModule)
  const [editModuleScreenMutation] = useMutation(editModuleScreen)
  const prefersDarkMode = useMediaPredicate("(prefers-color-scheme: dark)")
  const [previousOpen, setPreviousOpen] = useState(false)

  const arrowColor = prefersDarkMode ? "white" : "#0f172a"
  const formik = useFormik({
    initialValues: {
      type: moduleEdit!.type.id.toString(),
      title: moduleEdit!.title,
      description: moduleEdit!.description,
      license: moduleEdit!.license?.id.toString(),
    },
    validate: validateZodSchema(
      z.object({
        type: z.string().min(1),
        title: z.string().max(300),
        description: z.string(),
        license: z.string().min(1),
      })
    ),
    onSubmit: async (values) => {
      const updatedModule = await editModuleScreenMutation({
        id: moduleEdit?.id,
        typeId: parseInt(values.type),
        title: values.title,
        description: values.description,
        licenseId: parseInt(values.license),
      })
      await setQueryData(updatedModule)
      setIsEditing(false)
    },
  })

  useEffect(() => {
    const updateFormik = async () => {
      await formik.setFieldValue("type", moduleEdit!.type.id.toString())
      await formik.setFieldValue("title", moduleEdit!.title)
      await formik.setFieldValue("description", moduleEdit!.description)
      await formik.setFieldValue("license", moduleEdit!.license!.id.toString())
    }
    updateFormik().catch((error) => console.log(error))
  }, [moduleEdit])

  const ownAuthorship = moduleEdit?.authors.find(
    (author) => author.workspace?.handle === workspace?.handle
  )

  return (
    <div className="mx-auto max-w-4xl overflow-y-auto p-5 text-base">
      {/* Publish module */}
      {(moduleEdit!.authors.filter((author) => author.readyToPublish !== true).length === 0 &&
        Object.keys(moduleEdit!.main!).length !== 0) ||
      (moduleEdit!.authors.length === 1 &&
        moduleEdit!.main!["name"] &&
        (ownAuthorship?.workspace?.firstName || ownAuthorship?.workspace?.lastName)) ? (
        <PublishModuleModal currentModule={moduleEdit!} user={user} workspace={workspace} />
      ) : (
        <>
          <div className="my-4 flex w-full rounded-md bg-orange-50 p-2 dark:bg-orange-800">
            <div className="inline-block shrink-0 align-middle">
              <WarningSquareFilled
                size={32}
                className="inline-block h-5 w-5 fill-current align-middle text-orange-500 dark:text-orange-200"
                aria-hidden="true"
              />
            </div>
            <div className="ml-3 flex-grow text-orange-800 dark:text-orange-100">
              <h3 className="inline-block align-middle text-sm font-normal leading-4 text-orange-800 dark:text-orange-100">
                To publish this module:
              </h3>
              <ol className="list-inside list-decimal text-sm">
                {moduleEdit!.main!["name"] ? "" : <li>Upload a main file</li>}
                {!ownAuthorship?.workspace?.firstName || !ownAuthorship?.workspace?.lastName ? (
                  <li>
                    You must add your author names in{" "}
                    <SettingsModal
                      styling="whitespace-nowrap font-medium hover:text-blue-600 underline"
                      button={<>settings</>}
                      user={user}
                      workspace={workspace}
                    />
                  </li>
                ) : (
                  ""
                )}
                {!ownAuthorship?.readyToPublish &&
                ownAuthorship?.workspace?.firstName &&
                ownAuthorship?.workspace?.lastName &&
                moduleEdit!.authors!.length > 1 ? (
                  <li>
                    <button
                      className="bg-orange my-1 rounded border border-orange-300 px-4 py-2 text-xs font-medium leading-4 text-orange-500 shadow-sm hover:bg-orange-100 dark:border-orange-200 dark:bg-orange-800 dark:text-orange-200 dark:hover:border-orange-200 dark:hover:bg-orange-700"
                      onClick={async () => {
                        await toast
                          .promise(
                            approveAuthorshipMutation({
                              id: ownAuthorship!.id,
                              suffix: moduleEdit!.suffix,
                              user,
                            }),
                            {
                              loading: "Loading",
                              success: "Version approved for publication",
                              error: "Uh-oh something went wrong.",
                            }
                          )
                          .then(async (data) => await setQueryData(data))
                      }}
                    >
                      Approve to publish
                    </button>
                  </li>
                ) : (
                  ""
                )}
                {moduleEdit!.authors.length > 1 ? (
                  <li>Your co-authors must approve to publish</li>
                ) : (
                  ""
                )}
              </ol>
              {moduleEdit!.authors.length > 1 ? (
                <p className="text-sm italic">
                  Any changes made after approval will force reapproval by all authors.
                </p>
              ) : (
                ""
              )}
            </div>
          </div>
        </>
      )}
      {/* Menu bar */}
      <div className="mb-28 flex w-full">
        {inboxOpen ? (
          <button
            onClick={() => {
              setInboxOpen(false)
            }}
          >
            <label className="sr-only">Go full screen</label>
            <Maximize size={24} className="h-6 w-6 fill-current text-gray-900 dark:text-gray-200" />
          </button>
        ) : (
          <button
            onClick={() => {
              setInboxOpen(true)
            }}
          >
            <label className="sr-only">Go full screen</label>
            <ArrowLeft
              size={32}
              className="h-6 w-6 fill-current text-gray-900 dark:text-gray-200"
              aria-hidden="true"
            />
          </button>
        )}
        {/* Push all menu bars to the right */}
        <div className="mx-4 flex-grow">
          <button
            className="mx-auto my-2 flex rounded border border-gray-300 px-2 py-2 text-sm font-normal leading-4 text-gray-700 shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:border-gray-400 dark:hover:bg-gray-700"
            onClick={() => {
              setPreviousOpen(true)
            }}
            disabled={moduleEdit?.parents.length === 0}
          >
            Links to {moduleEdit?.parents.length} previous steps
          </button>
          <div className="mx-auto max-w-md">
            <span id="previousStep">
              <Autocomplete
                className="h-full max-w-2xl"
                openOnFocus={true}
                defaultActiveItemId="0"
                getSources={({ query }) => [
                  {
                    sourceId: "products",
                    async onSelect(params) {
                      const { item, setQuery } = params
                      await toast
                        .promise(
                          addParentMutation({
                            currentId: module?.id,
                            connectId: item.objectID,
                          }),
                          {
                            loading: "Adding link...",
                            success: `Linked to: "${item.name}"`,
                            error: "Failed to add link...",
                          }
                        )
                        .then((data) => setQueryData(data))
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
                        // TODO: Need to update search results per Algolia index
                        return <SearchResultModule item={item} />
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
                                    await toast
                                      .promise(
                                        createReferenceMutation({
                                          doi: matchedQuery.slice(-1)[0].endsWith("/")
                                            ? matchedQuery.slice(-1)[0].slice(0, -1)
                                            : matchedQuery.slice(-1)[0],
                                        }),
                                        {
                                          loading: "Searching...",
                                          success: "Record added to database",
                                          error: "Could not add record.",
                                        }
                                      )
                                      .then(async (data) => {
                                        await toast
                                          .promise(
                                            addParentMutation({
                                              currentId: module?.id,
                                              connectId: data.id,
                                            }),
                                            {
                                              loading: "Adding link...",
                                              success: `Linked to: "${data.title}"`,
                                              error: "Failed to add link...",
                                            }
                                          )
                                          .then((info) => setQueryData(info))
                                      })
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
            </span>
          </div>
        </div>
        <div className="items-middle pt-8">
          <button
            onClick={() => {
              setIsEditing(!isEditing)
            }}
            aria-label={isEditing ? "End editing mode without saving" : "Start editing mode"}
          >
            {isEditing ? (
              <EditOff
                size={24}
                className="h-6 w-6 fill-current text-gray-900 dark:text-gray-200"
              />
            ) : (
              <Edit size={24} className="h-6 w-6 fill-current text-gray-900 dark:text-gray-200" />
            )}
          </button>
        </div>
      </div>
      <div className="relative">
        <Xarrows
          start="currentStep"
          end="previousStep"
          showHead={false}
          dashness
          color={arrowColor}
          startAnchor={{ position: "auto", offset: { x: -20 } }}
          endAnchor={{ position: "auto", offset: { x: 20 } }}
        />
      </div>
      {/* Display editable form or display content */}
      <div className="relative" id="currentStep">
        {isEditing ? (
          <MetadataEdit
            module={moduleEdit}
            setQueryData={setQueryData}
            setIsEditing={setIsEditing}
          />
        ) : (
          <MetadataView
            module={moduleEdit}
            addAuthors={addAuthors}
            setQueryData={setQueryData}
            setAddAuthors={setAddAuthors}
          />
        )}
      </div>

      <div className="my-4">
        <h2 className="my-2 text-lg leading-4 text-gray-500 dark:text-gray-200">
          Main file (required)
        </h2>
        <EditMainFile
          mainFile={mainFile}
          setQueryData={setQueryData}
          moduleEdit={moduleEdit}
          user={user}
          workspace={workspace}
          expire={expire}
          signature={signature}
        />
      </div>
      <div className="mb-28 grid-cols-2 gap-x-4 md:grid">
        {/* Supporting files */}
        <div className="my-3">
          <h2 className="my-2 text-lg leading-4 text-gray-500 dark:text-gray-200">
            Supporting file(s)
          </h2>
          <p className="my-2 text-xs font-normal leading-4 text-gray-900 dark:text-gray-200">
            Uploading an updated file with same name? Delete the original here first.
          </p>
          {supportingRaw.files.length > 0 ? (
            <>
              {supportingRaw.files.map((file) => (
                <>
                  <EditSupportingFileDisplay
                    name={file.original_filename}
                    size={file.size}
                    url={file.original_file_url}
                    uuid={file.uuid}
                    moduleId={moduleEdit!.id}
                    setQueryData={setQueryData}
                  />
                </>
              ))}
            </>
          ) : (
            <></>
          )}
          <EditSupportingFiles
            setQueryData={setQueryData}
            moduleEdit={moduleEdit}
            user={user}
            workspace={workspace}
            expire={expire}
            signature={signature}
          />
        </div>
        <div className="my-3">
          <h2 className="my-2 text-lg leading-4 text-gray-500 dark:text-gray-200">
            Reference list
          </h2>
          <p className="my-2 text-xs font-normal leading-4 text-gray-900 dark:text-gray-200">
            Add any references for your module here. You can cite published modules and objects with
            a DOI.
          </p>
          <label htmlFor="search" className="sr-only">
            Search references
          </label>
          <div>
            <Autocomplete
              className="h-full"
              openOnFocus={true}
              defaultActiveItemId="0"
              getSources={({ query }) => [
                {
                  sourceId: "products",
                  async onSelect(params) {
                    const { item, setQuery } = params
                    if (item.suffix) {
                      await toast
                        .promise(
                          addReferenceMutation({
                            currentId: moduleEdit?.id,
                            connectId: item.objectID,
                          }),
                          {
                            loading: "Adding reference...",
                            success: "Added reference!",
                            error: "Failed to add reference...",
                          }
                        )
                        .then((data) => setQueryData(data))
                    }
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
                                  await toast
                                    .promise(
                                      createReferenceMutation({
                                        doi: matchedQuery.slice(-1)[0].endsWith("/")
                                          ? matchedQuery.slice(-1)[0].slice(0, -1)
                                          : matchedQuery.slice(-1)[0],
                                      }),
                                      {
                                        loading: "Searching...",
                                        success: "Reference added to database",
                                        error: "Could not add reference.",
                                      }
                                    )
                                    .then(async (data) => {
                                      await toast
                                        .promise(
                                          addReferenceMutation({
                                            currentId: moduleEdit?.id,
                                            connectId: data.id,
                                          }),
                                          {
                                            loading: "Adding reference...",
                                            success: "Added reference!",
                                            error: "Failed to add reference...",
                                          }
                                        )
                                        .then(async (data) => {
                                          await setQueryData(data)
                                        })
                                    })
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
          </div>
          <ol className="text-normal my-4 list-outside list-decimal pl-4">
            {moduleEdit?.references!.map((reference) => (
              <>
                <li>
                  <button className="mx-2">
                    <TrashCan
                      size={24}
                      className="inline-block h-6 w-6 fill-current align-middle text-red-500"
                      onClick={async () => {
                        await toast
                          .promise(
                            deleteReferenceMutation({
                              currentId: moduleEdit?.id,
                              disconnectId: reference.id,
                            }),
                            {
                              loading: "Deleting reference...",
                              success: `Removed reference: "${reference.title}"`,
                              error: "Failed to delete reference...",
                            }
                          )
                          .then((data) => setQueryData(data))
                      }}
                      aria-label="Delete reference"
                    />
                  </button>
                  {reference.publishedWhere === "ResearchEquals" ? (
                    <>
                      {reference.authors.map((author, index) => (
                        <>
                          <Link
                            href={Routes.HandlePage({ handle: author!.workspace!.handle })}
                            target="_blank"
                          >
                            {author!.workspace!.lastName},{author!.workspace!.firstName}
                          </Link>
                          {index === reference.authors.length - 1 ? "" : "; "}
                        </>
                      ))}
                    </>
                  ) : (
                    <>
                      {reference!.authorsRaw!["object"] ? (
                        <>
                          {reference!.authorsRaw!["object"].map((author, index) => (
                            <>
                              {index === 3
                                ? "[...]"
                                : index > 3
                                ? ""
                                : author.given && author.family
                                ? `${author.family}, ${author.given}`
                                : `${author.name}`}
                              {index === reference!.authorsRaw!["object"].length - 1 || index > 2
                                ? ""
                                : "; "}
                            </>
                          ))}
                        </>
                      ) : (
                        <>
                          <p className="italic">{reference.publishedWhere}</p>
                        </>
                      )}
                    </>
                  )}{" "}
                  ({reference.publishedAt?.toISOString().substr(0, 4)}).{" "}
                  <span className="font-semibold">{reference.title}</span>
                  {reference.title.endsWith("." ? "" : ".")}{" "}
                  <Link
                    href={
                      reference.publishedWhere === "ResearchEquals"
                        ? Routes.ModulePage({ suffix: reference.suffix! })
                        : reference.url!
                    }
                    target="_blank"
                  >
                    <span className="underline">{reference.url}</span>
                  </Link>
                  . <span className="italic">{reference.publishedWhere}</span>.
                </li>
              </>
            ))}
          </ol>
        </div>
      </div>
      <div className="text-center">
        <DeleteModuleModal module={module} setModule={setModule} fetchDrafts={fetchDrafts} />
      </div>
      <ManageParents
        open={previousOpen}
        setOpen={setPreviousOpen}
        moduleEdit={moduleEdit}
        setQueryData={setQueryData}
      />
    </div>
  )
}

export default ModuleEdit
