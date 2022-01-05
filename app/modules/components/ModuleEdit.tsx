import { useQuery, useMutation, Link, validateZodSchema, Routes } from "blitz"
import { useState, useEffect } from "react"
import moment from "moment"
import algoliasearch from "algoliasearch"
import { z } from "zod"
import { getAlgoliaResults } from "@algolia/autocomplete-js"
import { Edit24, EditOff24, Save32 } from "@carbon/icons-react"
import { Prisma } from "prisma"
import { useFormik } from "formik"
import { Maximize24, TrashCan24 } from "@carbon/icons-react"
import toast from "react-hot-toast"
import router from "next/router"

import EditMainFile from "./EditMainFile"
import ManageAuthors from "./ManageAuthors"
import EditSupportingFiles from "./EditSupportingFiles"

import DeleteModuleModal from "../../core/modals/DeleteModuleModal"
import useCurrentModule from "../queries/useCurrentModule"
import Autocomplete from "../../core/components/Autocomplete"
import PublishModuleModal from "../../core/modals/PublishModuleModal"
import addParent from "../mutations/addParent"
import getTypes from "../../core/queries/getTypes"
import getLicenses from "app/core/queries/getLicenses"
import editModuleScreen from "../mutations/editModuleScreen"
import EditSupportingFileDisplay from "../../core/components/EditSupportingFileDisplay"
import MetadataView from "./MetadataView"
import AuthorAvatars from "./AuthorAvatars"
import SearchResultModule from "../../core/components/SearchResultModule"
import { ArrowNarrowLeftIcon, PlusSmIcon } from "@heroicons/react/solid"
import AuthorAvatarsNew from "./AuthorAvatarsNew"
import SearchResultWorkspace from "../../core/components/SearchResultWorkspace"
import addAuthor from "../mutations/addAuthor"
import EditMainFileDisplay from "../../core/components/EditMainFileDisplay"
import MetadataEdit from "./MetadataEdit"
import { useCurrentWorkspace } from "app/core/hooks/useCurrentWorkspace"
import addReference from "../mutations/addReference"
import createReferenceModule from "../mutations/createReferenceModule"
import deleteReference from "../mutations/deleteReference"

const searchClient = algoliasearch(process.env.ALGOLIA_APP_ID!, process.env.ALGOLIA_API_SEARCH_KEY!)

const ModuleEdit = ({ user, module, isAuthor, setInboxOpen, inboxOpen }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [addAuthors, setAddAuthors] = useState(false)
  const currentWorkspace = useCurrentWorkspace()

  const [manageAuthorsOpen, setManageAuthorsOpen] = useState(false)
  const [moduleEdit, { refetch, setQueryData }] = useQuery(
    useCurrentModule,
    { suffix: module.suffix },
    { refetchOnWindowFocus: true }
  )
  const [moduleTypes] = useQuery(getTypes, undefined)
  const [licenses] = useQuery(getLicenses, undefined)

  const mainFile = moduleEdit!.main as Prisma.JsonObject
  const supportingRaw = moduleEdit!.supporting as Prisma.JsonObject

  const [addReferenceMutation] = useMutation(addReference)
  const [deleteReferenceMutation] = useMutation(deleteReference)
  const [createReferenceMutation] = useMutation(createReferenceModule)
  const [editModuleScreenMutation] = useMutation(editModuleScreen)
  const [addAuthorMutation] = useMutation(addAuthor)

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

  return (
    <div className="p-5 max-w-7xl mx-auto overflow-y-auto text-base">
      {/* Publish module */}
      {moduleEdit!.authors.filter((author) => author.readyToPublish !== true).length === 0 &&
      Object.keys(moduleEdit!.main!).length !== 0 ? (
        <PublishModuleModal module={moduleEdit} user={user} />
      ) : (
        <></>
      )}
      {/* Menu bar */}
      <div className="w-full flex">
        {inboxOpen ? (
          <button
            onClick={() => {
              setInboxOpen(false)
            }}
          >
            <label className="sr-only">Go full screen</label>
            <Maximize24 className="h-6 w-6 fill-current text-gray-300 dark:text-gray-600" />
          </button>
        ) : (
          <button
            onClick={() => {
              setInboxOpen(true)
            }}
          >
            <label className="sr-only">Go full screen</label>
            <ArrowNarrowLeftIcon
              className="h-6 w-6 fill-current text-gray-300 dark:text-gray-600"
              aria-hidden="true"
            />
          </button>
        )}
        {/* Push all menu bars to the right */}
        <div className="flex-grow"></div>
        <div>
          {isEditing ? (
            <EditOff24
              className="h-6 w-6 fill-current text-gray-300 dark:text-gray-600"
              onClick={() => {
                setIsEditing(false)
              }}
              aria-label="End editing mode without saving"
            />
          ) : (
            <Edit24
              className="h-6 w-6 fill-current text-gray-300 dark:text-gray-600"
              onClick={() => {
                setIsEditing(true)
              }}
              aria-label="Start editing mode"
            />
          )}
          {/* <span className="inline-block h-full align-middle"> </span> */}
          {/* <DocumentPdf32 className="inline-block align-middle" /> */}
        </div>
      </div>

      {/* Display editable form or display content */}
      {isEditing ? (
        <MetadataEdit
          module={moduleEdit}
          addAuthors={addAuthors}
          setQueryData={setQueryData}
          setAddAuthors={setAddAuthors}
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
      <div className="my-4">
        <h2 className="text-xs leading-4 font-semibold text-gray-500 dark:text-gray-200 my-2">
          Main file
        </h2>
        <EditMainFile
          mainFile={mainFile}
          setQueryData={setQueryData}
          moduleEdit={moduleEdit}
          user={user}
          workspace={currentWorkspace}
        />
      </div>

      {/* Supporting files */}
      <div className="my-3">
        <h2 className="text-xs leading-4 font-semibold text-gray-500 dark:text-gray-200 my-2">
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
          workspace={currentWorkspace}
        />
      </div>

      {/* PLACEHOLDER References */}
      <div className="my-3">
        <h2 className="text-xs leading-4 font-semibold text-gray-500 dark:text-gray-200 my-2">
          Reference list
        </h2>
        <label htmlFor="search" className="sr-only">
          Search references
        </label>
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
                  // TODO: Add reference
                  const updatedModule = await addReferenceMutation({
                    currentId: moduleEdit?.id,
                    connectId: item.objectID,
                  })

                  setQueryData(updatedModule)
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
                          {/* <SearchResultDoi query={query} /> */}
                          <button
                            onClick={async () => {
                              // alert(query)
                              toast.promise(createReferenceMutation({ doi: query }), {
                                loading: "Searching...",
                                success: <b>Reference added!</b>,
                                error: <b>Could not find the reference.</b>,
                              })
                            }}
                          >
                            Find and add {query} to ResearchEquals reference database
                          </button>
                        </>
                      ) : (
                        "Input a DOI you'd like to reference."
                      )}
                    </>
                  )
                },
              },
            },
          ]}
        />
        <ol className="list-decimal list-inside my-4 text-normal">
          {moduleEdit?.references!.map((reference) => (
            <>
              <li>
                <button className="mx-2">
                  <TrashCan24
                    className="w-6 h-6 fill-current text-red-500 inline-block align-middle"
                    onClick={async () => {
                      const updatedModule = await deleteReferenceMutation({
                        currentId: moduleEdit?.id,
                        disconnectId: reference.id,
                      })

                      setQueryData(updatedModule)
                    }}
                    aria-label="Delete reference"
                  />
                </button>
                {reference.authors ? (
                  <>
                    {reference.authors.map((author, index) => (
                      <>
                        <Link href={Routes.HandlePage({ handle: author!.workspace!.handle })}>
                          <a target="_blank">{author!.workspace!.name}</a>
                        </Link>
                        {index === reference.authors.length - 1 ? "" : ", "}
                      </>
                    ))}
                  </>
                ) : (
                  "no"
                )}{" "}
                ({reference.publishedAt?.toISOString().substr(0, 10)}). {reference.title}.{" "}
                <Link href={reference.url!}>
                  <a target="_blank underline">{reference.url}</a>
                </Link>
                . <span className="italic">{reference.publishedWhere}</span>
              </li>
            </>
          ))}
        </ol>
      </div>
      <div className="text-center">
        <DeleteModuleModal module={module} />
      </div>
    </div>
  )
}

export default ModuleEdit
