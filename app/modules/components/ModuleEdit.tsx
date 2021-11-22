import { useQuery, useMutation, Link, validateZodSchema } from "blitz"
import { useState, useEffect } from "react"
import moment from "moment"
import algoliasearch from "algoliasearch"
import { z } from "zod"
import { getAlgoliaResults } from "@algolia/autocomplete-js"
import { Toaster } from "react-hot-toast"
import { Edit32, EditOff32, Save32 } from "@carbon/icons-react"
import { Prisma } from "prisma"
import { useFormik } from "formik"

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

const searchClient = algoliasearch(process.env.ALGOLIA_APP_ID!, process.env.ALGOLIA_API_SEARCH_KEY!)

const ModuleEdit = ({ user, module, isAuthor }) => {
  const [isEditing, setIsEditing] = useState(false)
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
        suffix: moduleEdit?.suffix,
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
    formik.setFieldValue("license", moduleEdit!.license!.id)
  }, [moduleEdit])

  return (
    <div className="max-w-4xl mx-auto overflow-y-auto text-base">
      <Toaster position="bottom-center" reverseOrder={false} />
      {/* Menu bar */}
      <div className="w-full bg-gray-300 flex">
        {/* Push all menu bars to the right */}
        <div className="flex-grow"></div>
        <div>
          <span className="inline-block h-full align-middle"> </span>

          {isEditing ? (
            <EditOff32
              className="inline-block align-middle"
              onClick={() => {
                setIsEditing(false)
              }}
            />
          ) : (
            <Edit32
              className="inline-block align-middle"
              onClick={() => {
                setIsEditing(true)
              }}
            />
          )}
          {/* <span className="inline-block h-full align-middle"> </span> */}
          {/* <DocumentPdf32 className="inline-block align-middle" /> */}
        </div>
      </div>
      {/* Last updated */}
      <div className="text-center ">
        Last updated: {moment(moduleEdit?.updatedAt).fromNow()} (
        {moduleEdit?.updatedAt.toISOString()})
      </div>
      {/* Parents */}
      <div className="flex w-full max-h-8 my-2">
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
                  return <div>{JSON.stringify(item)}</div>
                },
              },
            },
          ]}
        />
      </div>
      {/* Display editable form or display content */}
      {isEditing ? (
        <div className="my-8">
          <form onSubmit={formik.handleSubmit}>
            <div>
              <label htmlFor="type" className="sr-only">
                Module type
              </label>
              <select className="rounded my-1" id="type" {...formik.getFieldProps("type")}>
                <option value="">--Please choose a module type--</option>
                {moduleTypes.map((type) => (
                  <>
                    <option value={type.id}>{type.name}</option>
                  </>
                ))}
              </select>
              {formik.touched.type && formik.errors.type ? <div>{formik.errors.type}</div> : null}
            </div>
            <div>
              <label htmlFor="title" className="sr-only block text-sm font-medium text-gray-700">
                Title
              </label>
              <div className="mt-1">
                <textarea
                  rows={2}
                  id="title"
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  {...formik.getFieldProps("title")}
                />
                {formik.touched.title && formik.errors.title ? (
                  <div>{formik.errors.title}</div>
                ) : null}
              </div>
            </div>
            <div>
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
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  {...formik.getFieldProps("description")}
                />
                {formik.touched.description && formik.errors.description ? (
                  <div>{formik.errors.description}</div>
                ) : null}
              </div>
            </div>
            <div>
              <label htmlFor="license" className="sr-only">
                License
              </label>
              <select className="rounded my-1" id="license" {...formik.getFieldProps("license")}>
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
              className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Save
              <Save32 className="ml-2 -mr-0.5 h-4 w-4" aria-hidden="true" />
            </button>
          </form>
        </div>
      ) : (
        <div className="w-full mt-8">
          <p className="text-gray-500 ">{moduleEdit!.type.name}</p>
          <h1 className="min-h-16">{moduleEdit!.title}</h1>
          {/* Description */}
          <div className="">{moduleEdit!.description}</div>
          {/* License */}
          {moduleEdit!.license ? (
            <div>
              License:{" "}
              {isEditing ? (
                <Link href={moduleEdit!.license!.url}>
                  <a target="_blank">{moduleEdit!.license!.name}</a>
                </Link>
              ) : (
                <Link href={moduleEdit!.license!.url}>
                  <a target="_blank">{moduleEdit!.license!.name}</a>
                </Link>
              )}
            </div>
          ) : (
            <></>
          )}
        </div>
      )}

      {/* Authors */}
      <div className="flex border-t border-b border-gray-800 mt-2 py-2">
        <div className="flex-grow flex -space-x-2 relative z-0 overflow-hidden">
          <div className="inline-block h-full align-middle">
            {moduleEdit?.authors.map((author) => (
              <>
                {/* Tricks it into the middle */}
                <span className="inline-block h-full align-middle"></span>
                <img
                  key={author.id + author.workspace!.handle}
                  alt={`Avatar of ${author.workspace!.handle}`}
                  className="inline-block align-middle relative z-30 inline-block h-8 w-8 rounded-full"
                  src={author.workspace?.avatar!}
                />
              </>
            ))}
          </div>
        </div>
        <ManageAuthors
          open={manageAuthorsOpen}
          setOpen={setManageAuthorsOpen}
          moduleEdit={moduleEdit}
          setQueryData={setQueryData}
        />
        <button
          type="button"
          className="inline-flex items-center h-8  px-6 py-3 border border-transparent  font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={() => {
            setManageAuthorsOpen(true)
          }}
        >
          Manage authors
        </button>
      </div>

      <div className="my-8">
        <h2 className="">Main file</h2>
        <EditMainFile mainFile={mainFile} setQueryData={setQueryData} moduleEdit={moduleEdit} />
      </div>

      {/* Supporting files */}
      <div className="my-8">
        <h2>Supporting file(s)</h2>
        {supportingRaw.files.length > 0 ? (
          <>
            {supportingRaw.files.map((file) => (
              <>
                <EditSupportingFileDisplay
                  name={file.original_filename}
                  size={file.size}
                  url={file.original_file_url}
                  uuid={file.uuid}
                  suffix={moduleEdit!.suffix}
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
        {/* Publish module */}
        {moduleEdit!.authors.filter((author) => author.readyToPublish !== true).length === 0 ? (
          <PublishModuleModal module={module} />
        ) : (
          <></>
        )}
        {/* Delete module */}
        <DeleteModuleModal module={module} />
      </div>
    </div>
  )
}

export default ModuleEdit
