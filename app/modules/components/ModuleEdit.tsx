import { useQuery, useMutation, Link, validateZodSchema } from "blitz"
import { useState, useEffect } from "react"
import moment from "moment"
import algoliasearch from "algoliasearch"
import { z } from "zod"
import { getAlgoliaResults } from "@algolia/autocomplete-js"
import { Edit24, EditOff24, Save32 } from "@carbon/icons-react"
import { Prisma } from "prisma"
import { useFormik } from "formik"
import { Maximize24, Minimize24 } from "@carbon/icons-react"
import toast from "react-hot-toast"

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

const searchClient = algoliasearch(process.env.ALGOLIA_APP_ID!, process.env.ALGOLIA_API_SEARCH_KEY!)

const ModuleEdit = ({ user, module, isAuthor, setInboxOpen, inboxOpen }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [addAuthors, setAddAuthors] = useState(false)
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

  const [addParentMutation] = useMutation(addParent)
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
            <ArrowNarrowLeftIcon className="h-6 w-6 fill-current text-gray-300 dark:text-gray-600" />
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
            />
          ) : (
            <Edit24
              className="h-6 w-6 fill-current text-gray-300 dark:text-gray-600"
              onClick={() => {
                setIsEditing(true)
              }}
            />
          )}
          {/* <span className="inline-block h-full align-middle"> </span> */}
          {/* <DocumentPdf32 className="inline-block align-middle" /> */}
        </div>
      </div>
      {/* Publish module */}
      {moduleEdit!.authors.filter((author) => author.readyToPublish !== true).length === 0 ? (
        <PublishModuleModal module={module} />
      ) : (
        <></>
      )}
      {/* <div className="flex w-full max-h-8 my-2">
        <span>
          Follows from:{" "}
          <span className="bg-gray-200 sgroup-hover:bg-gray-200 ml-auto inline-block py-0.5 px-3 text-xs rounded-full">
            {moduleEdit?.parents ? moduleEdit?.parents.length : "0"}
          </span>
        </span>
        <Autocomplete
          className="h-full"
          openOnFocus={true}
          defaultActiveItemId="0"
          getSources={({ query }) => [
            {
              sourceId: "products",
              async onSelect(params) {
                const { item, setQuery } = params
                const updatedMod = await addParentMutation({
                  currentId: moduleEdit?.id,
                  connectId: item.objectID,
                })
                setQueryData(updatedMod)
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
              },
            },
          ]}
        />
      </div> */}
      {/* Display editable form or display content */}
      {isEditing ? (
        <div className="my-8">
          <form onSubmit={formik.handleSubmit}>
            <div className="my-2">
              <label htmlFor="type" className="sr-only">
                Module type
              </label>
              <select
                className="rounded my-1 bg-gray-300 dark:bg-gray-300"
                id="type"
                {...formik.getFieldProps("type")}
              >
                <option value="">--Please choose a module type--</option>
                {moduleTypes.map((type) => (
                  <>
                    <option value={type.id}>{type.name}</option>
                  </>
                ))}
              </select>
              {formik.touched.type && formik.errors.type ? <div>{formik.errors.type}</div> : null}
            </div>
            <div className="my-2">
              <label htmlFor="title" className="sr-only block text-sm font-medium text-gray-700">
                Title
              </label>
              <div className="mt-1">
                <textarea
                  rows={2}
                  id="title"
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-500 bg-gray-300 dark:bg-gray-300 rounded-md"
                  {...formik.getFieldProps("title")}
                />
                {formik.touched.title && formik.errors.title ? (
                  <div>{formik.errors.title}</div>
                ) : null}
              </div>
            </div>
            <div className="my-2">
              <label
                htmlFor="description"
                className="sr-only block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <div className="mt-1">
                <textarea
                  rows={8}
                  id="description"
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-500  bg-gray-300 dark:bg-gray-300 rounded-md"
                  {...formik.getFieldProps("description")}
                />
                {formik.touched.description && formik.errors.description ? (
                  <div>{formik.errors.description}</div>
                ) : null}
              </div>
            </div>
            <div className="my-2">
              <label htmlFor="license" className="sr-only">
                License
              </label>
              <select
                className="rounded my-1 bg-gray-300 dark:bg-gray-300"
                id="license"
                {...formik.getFieldProps("license")}
              >
                <option value="">--Please choose a license--</option>
                {licenses.map((license) => (
                  <>
                    <option value={license.id}>
                      {license.name} ({license.price > 0 ? `${license.price / 100}EUR` : "Free"})
                    </option>
                  </>
                ))}
              </select>
              {formik.touched.license && formik.errors.license ? (
                <div>{formik.errors.license}</div>
              ) : null}
            </div>
            <button
              type="submit"
              className="my-2 inline-flex items-center px-3 py-2 text-sm leading-4 font-medium rounded-md bg-gray-300 dark:bg-gray-300 text-gray-900 dark:text-gray-900  hover:bg-indigo-300 border border-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Save
              <Save32 className="ml-2 -mr-0.5 h-4 w-4" aria-hidden="true" />
            </button>
          </form>
        </div>
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
        <EditMainFile mainFile={mainFile} setQueryData={setQueryData} moduleEdit={moduleEdit} />
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
        <EditSupportingFiles setQueryData={setQueryData} moduleEdit={moduleEdit} />
      </div>

      {/* PLACEHOLDER References */}
      <div className="text-center">
        <DeleteModuleModal module={module} />
      </div>
    </div>
  )
}

export default ModuleEdit
