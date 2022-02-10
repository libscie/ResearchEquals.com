import { useQuery, useMutation, Link, validateZodSchema, Routes } from "blitz"
import { useState, useEffect } from "react"
import algoliasearch from "algoliasearch"
import { z } from "zod"
import { getAlgoliaResults } from "@algolia/autocomplete-js"
import { ArrowLeft32, Edit24, EditOff24 } from "@carbon/icons-react"
import { Prisma } from "prisma"
import { useFormik } from "formik"
import { WarningSquareFilled32, Maximize24, TrashCan24 } from "@carbon/icons-react"
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
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [addAuthors, setAddAuthors] = useState(false)
  const [addParentMutation] = useMutation(addParent)

  const [moduleEdit, { refetch, setQueryData }] = useQuery(
    useCurrentModule,
    { suffix: module.suffix },
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
      setQueryData(updatedModule)
      setIsEditing(false)
    },
  })

  useEffect(() => {
    formik.setFieldValue("type", moduleEdit!.type.id.toString())
    formik.setFieldValue("title", moduleEdit!.title)
    formik.setFieldValue("description", moduleEdit!.description)
    formik.setFieldValue("license", moduleEdit!.license!.id.toString())
  }, [moduleEdit])

  const ownAuthorship = moduleEdit?.authors.find(
    (author) => author.workspace?.handle === workspace.handle
  )

  return (
    <div className="p-5 max-w-4xl mx-auto overflow-y-auto text-base">
      {/* Publish module */}
      {(moduleEdit!.authors.filter((author) => author.readyToPublish !== true).length === 0 &&
        Object.keys(moduleEdit!.main!).length !== 0) ||
      (moduleEdit!.authors.length === 1 && moduleEdit!.main!["name"]) ? (
        <PublishModuleModal module={moduleEdit} user={user} workspace={workspace} />
      ) : (
        <>
          <div className="rounded-md bg-orange-50 dark:bg-orange-800 w-full p-2 flex my-4">
            <div className="flex-shrink-0 inline-block align-middle">
              <WarningSquareFilled32
                className="fill-current h-5 w-5 text-orange-500 dark:text-orange-200 inline-block align-middle"
                aria-hidden="true"
              />
            </div>
            <div className="ml-3 flex-grow text-orange-800 dark:text-orange-100">
              <h3 className="text-sm leading-4 font-normal text-orange-800 dark:text-orange-100 inline-block align-middle">
                To publish this module:
              </h3>
              <ol className="text-sm list-inside list-decimal">
                {moduleEdit!.main!["name"] ? "" : <li>Upload a main file</li>}
                {moduleEdit?.authors.filter(
                  (author) => !author.workspace!.firstName || !author.workspace!.lastName
                ).length! > 0 ? (
                  <li>All authors must add their author name</li>
                ) : (
                  ""
                )}
                {!ownAuthorship?.readyToPublish &&
                ownAuthorship?.workspace?.firstName &&
                ownAuthorship?.workspace?.lastName &&
                moduleEdit!.authors!.length > 1 ? (
                  <li>
                    <button
                      className="text-xs my-1 leading-4 font-medium text-orange-500 dark:text-orange-200 rounded border border-orange-300 dark:border-orange-200 bg-orange shadow-sm dark:bg-orange-800 px-4 py-2 hover:bg-orange-100 dark:hover:border-orange-200 dark:hover:bg-orange-700"
                      onClick={async () => {
                        toast.promise(
                          approveAuthorshipMutation({
                            id: ownAuthorship!.id,
                            suffix: moduleEdit!.suffix,
                          }),
                          {
                            loading: "Loading",
                            success: (data) => {
                              setQueryData(data)
                              return "Version approved for publication"
                            },
                            error: "Uh-oh something went wrong.",
                          }
                        )
                      }}
                    >
                      Approve to publish
                    </button>
                  </li>
                ) : (
                  <li>You must add your author name</li>
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
      <div className="w-full flex mb-28">
        {inboxOpen ? (
          <button
            onClick={() => {
              setInboxOpen(false)
            }}
          >
            <label className="sr-only">Go full screen</label>
            <Maximize24 className="h-6 w-6 fill-current text-gray-900 dark:text-gray-200" />
          </button>
        ) : (
          <button
            onClick={() => {
              setInboxOpen(true)
            }}
          >
            <label className="sr-only">Go full screen</label>
            <ArrowLeft32
              className="h-6 w-6 fill-current text-gray-900 dark:text-gray-200"
              aria-hidden="true"
            />
          </button>
        )}
        {/* Push all menu bars to the right */}
        <div className="flex-grow mx-4">
          <button
            className="flex px-2 mx-auto py-2 border dark:bg-gray-800 border-gray-300 dark:border-gray-600 dark:hover:border-gray-400 text-gray-700 dark:text-gray-200 rounded text-sm leading-4 font-normal shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 hover:bg-gray-100 dark:hover:bg-gray-700 my-2 disabled:opacity-50"
            onClick={() => {
              setPreviousOpen(true)
            }}
            disabled={moduleEdit?.parents.length === 0}
          >
            Links to {moduleEdit?.parents.length} previous steps
          </button>
          <div className="max-w-md mx-auto">
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
                      toast.promise(
                        addParentMutation({
                          currentId: module?.id,
                          connectId: item.objectID,
                        }),
                        {
                          loading: "Adding link...",
                          success: (data) => {
                            setQueryData(data)

                            return `Linked to: "${item.name}"`
                          },
                          error: "Failed to add link...",
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
                        // TODO: Need to update search results per Algolia index
                        return <SearchResultModule item={item} />
                      },
                      noResults() {
                        return (
                          <>
                            {/* https://www.crossref.org/blog/dois-and-matching-regular-expressions/ */}
                            {query.match(/^10.\d{4,9}\/[-._;()/:A-Z0-9]+$/i) ? (
                              <>
                                <button
                                  className="text-gray-900 dark:text-gray-200 text-sm leading-4 font-normal"
                                  onClick={async () => {
                                    toast.promise(createReferenceMutation({ doi: query }), {
                                      loading: "Searching...",
                                      success: (data) => {
                                        toast.promise(
                                          addParentMutation({
                                            currentId: module?.id,
                                            connectId: data.id,
                                          }),
                                          {
                                            loading: "Adding link...",
                                            success: (info) => {
                                              setQueryData(info)

                                              return `Linked to: "${data.title}"`
                                            },
                                            error: "Failed to add link...",
                                          }
                                        )

                                        return "Record added to database"
                                      },
                                      error: "Could not add record.",
                                    })
                                  }}
                                >
                                  Click here to add {query} to ResearchEquals database
                                </button>
                              </>
                            ) : (
                              <p className="text-gray-900 dark:text-gray-200 text-sm leading-4 font-normal">
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
          {isEditing ? (
            <EditOff24
              className="h-6 w-6 fill-current text-gray-900 dark:text-gray-200"
              onClick={() => {
                setIsEditing(false)
              }}
              aria-label="End editing mode without saving"
            />
          ) : (
            <Edit24
              className="h-6 w-6 fill-current text-gray-900 dark:text-gray-200"
              onClick={() => {
                setIsEditing(true)
              }}
              aria-label="Start editing mode"
            />
          )}
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
        <h2 className="text-lg leading-4 text-gray-500 dark:text-gray-200 my-2">
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
      <div className="md:grid grid-cols-2 gap-x-4 mb-28">
        {/* Supporting files */}
        <div className="my-3">
          <h2 className="text-lg leading-4 text-gray-500 dark:text-gray-200 my-2">
            Supporting file(s)
          </h2>
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
          <h2 className="text-lg leading-4 text-gray-500 dark:text-gray-200 my-2">
            Reference list
          </h2>
          <p className="text-xs leading-4 font-normal text-gray-900 dark:text-gray-200 my-2">
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
                      toast.promise(
                        addReferenceMutation({
                          currentId: moduleEdit?.id,
                          connectId: item.objectID,
                        }),
                        {
                          loading: "Adding reference...",
                          success: (data) => {
                            setQueryData(data)

                            return "Added reference!"
                          },
                          error: "Failed to add reference...",
                        }
                      )
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
                      return (
                        <>
                          {/* https://www.crossref.org/blog/dois-and-matching-regular-expressions/ */}
                          {query.match(/^10.\d{4,9}\/[-._;()/:A-Z0-9]+$/i) ? (
                            <>
                              <button
                                className="text-gray-900 dark:text-gray-200 text-sm leading-4 font-normal"
                                onClick={async () => {
                                  toast.promise(createReferenceMutation({ doi: query }), {
                                    loading: "Searching...",
                                    success: (data) => {
                                      toast.promise(
                                        addReferenceMutation({
                                          currentId: moduleEdit?.id,
                                          connectId: data.id,
                                        }),
                                        {
                                          loading: "Adding reference...",
                                          success: (data) => {
                                            setQueryData(data)

                                            return "Added reference!"
                                          },
                                          error: "Failed to add reference...",
                                        }
                                      )

                                      return "Reference added to database"
                                    },
                                    error: "Could not add reference.",
                                  })
                                }}
                              >
                                Click here to add {query} to ResearchEquals database
                              </button>
                            </>
                          ) : (
                            <p className="text-gray-900 dark:text-gray-200 text-sm leading-4 font-normal">
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
          <ol className="list-decimal list-outside my-4 pl-4 text-normal">
            {moduleEdit?.references!.map((reference) => (
              <>
                <li>
                  <button className="mx-2">
                    <TrashCan24
                      className="w-6 h-6 fill-current text-red-500 inline-block align-middle"
                      onClick={async () => {
                        toast.promise(
                          deleteReferenceMutation({
                            currentId: moduleEdit?.id,
                            disconnectId: reference.id,
                          }),
                          {
                            loading: "Deleting reference...",
                            success: (data) => {
                              setQueryData(data)
                              return `Removed reference: "${reference.title}"`
                            },
                            error: "Failed to delete reference...",
                          }
                        )
                      }}
                      aria-label="Delete reference"
                    />
                  </button>
                  {reference.publishedWhere === "ResearchEquals" ? (
                    <>
                      {reference.authors.map((author, index) => (
                        <>
                          <Link href={Routes.HandlePage({ handle: author!.workspace!.handle })}>
                            <a target="_blank">
                              {author!.workspace!.lastName}, {author!.workspace!.firstName}
                            </a>
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
                  >
                    <a target="_blank">
                      <span className="underline">{reference.url}</span>
                    </a>
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
