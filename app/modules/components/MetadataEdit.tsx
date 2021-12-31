import Autocomplete from "app/core/components/Autocomplete"
import { Link, useMutation, useQuery, validateZodSchema } from "blitz"
import moment from "moment"
import toast from "react-hot-toast"
import algoliasearch from "algoliasearch"
import { getAlgoliaResults } from "@algolia/autocomplete-js"
import { Save32 } from "@carbon/icons-react"
import addAuthor from "../mutations/addAuthor"
import AuthorAvatarsNew from "./AuthorAvatarsNew"
import SearchResultWorkspace from "../../core/components/SearchResultWorkspace"
import { PlusSmIcon } from "@heroicons/react/solid"
import { useEffect, useState } from "react"
import ManageAuthors from "./ManageAuthors"
import { useFormik } from "formik"
import { z } from "zod"
import editModuleScreen from "../mutations/editModuleScreen"
import getTypes from "../../core/queries/getTypes"
import getLicenses from "app/core/queries/getLicenses"
import FollowsFromSearch from "./FollowsFromSearch"

const searchClient = algoliasearch(process.env.ALGOLIA_APP_ID!, process.env.ALGOLIA_API_SEARCH_KEY!)

const MetadataEdit = ({ module, addAuthors, setQueryData, setAddAuthors, setIsEditing }) => {
  const [addAuthorMutation] = useMutation(addAuthor)
  const [editModuleScreenMutation] = useMutation(editModuleScreen)
  const [moduleTypes] = useQuery(getTypes, undefined)
  const [licenses] = useQuery(getLicenses, undefined)

  const [manageAuthorsOpen, setManageAuthorsOpen] = useState(false)

  const formik = useFormik({
    initialValues: {
      type: module.type.id.toString(),
      title: module.title,
      description: module.description,
      license: module.license?.id.toString(),
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
        id: module.id,
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
    formik.setFieldValue("type", module.type.id.toString())
    formik.setFieldValue("title", module.title)
    formik.setFieldValue("description", module.description)
    formik.setFieldValue("license", module.license!.id.toString())
  }, [module])

  return (
    <div className="module bg-gray-100 dark:bg-gray-600 my-4" style={{ padding: "1px" }}>
      <form
        className="module bg-white dark:bg-gray-900 border-0 border-gray-100 dark:border-gray-600 divide-y divide-gray-100 dark:divide-gray-600"
        onSubmit={formik.handleSubmit}
      >
        <div className="lg:flex text-center divide-y lg:divide-y-0 lg:divide-x divide-gray-100 dark:divide-gray-600 text-gray-500 dark:text-gray-200 dark:bg-gray-800 text-xs leading-4 font-normal">
          <div className="flex-grow py-2">Last updated: {moment(module.updatedAt).fromNow()}</div>
          <div className="flex-grow py-2">
            DOI upon publish:{" "}
            <span className="text-gray-300 dark:text-gray-600">{`${module.prefix}/${module.suffix}`}</span>
          </div>
          <div className="flex-grow py-1">
            <label htmlFor="license">License: </label>
            <select
              className="rounded bg-transparent text-xs leading-4 font-normal border border-gray-300 dark:border-gray-600"
              id="license"
              {...formik.getFieldProps("license")}
            >
              <option value="" className="text-gray-900">
                --Please choose a license--
              </option>
              {licenses.map((license) => (
                <>
                  <option value={license.id} className="text-gray-900">
                    {license.name} ({license.price > 0 ? `${license.price / 100}EUR` : "Free"})
                  </option>
                </>
              ))}
            </select>
            {formik.touched.license && formik.errors.license ? (
              <div>{formik.errors.license}</div>
            ) : null}
          </div>
        </div>
        <div className="py-1 px-2 bg-white dark:bg-gray-800">
          <FollowsFromSearch module={module} setQueryData={setQueryData} />
        </div>

        <div className="py-4 px-2 min-h-32">
          <p className="text-xs leading-4 font-normal text-gray-500 dark:text-white">
            <label htmlFor="type" className="sr-only">
              Module type
            </label>
            <select
              className="border-gray-300 dark:border-gray-600 rounded bg-transparent text-xs leading-4 font-normal"
              id="type"
              {...formik.getFieldProps("type")}
            >
              <option value="" className="text-gray-900">
                --Please choose a module type--
              </option>
              {moduleTypes.map((type) => (
                <>
                  <option value={type.id} className="text-gray-900">
                    {type.name}
                  </option>
                </>
              ))}
            </select>
            {formik.touched.type && formik.errors.type ? <div>{formik.errors.type}</div> : null}
          </p>
          <p className="text-base leading-6 font-medium text-gray-900 dark:text-white">
            <label htmlFor="title" className="sr-only block text-sm font-medium text-gray-700">
              Title
            </label>
            <div className="mt-1 ">
              <textarea
                rows={2}
                id="title"
                className="border border-gray-300 dark:border-gray-600 bg-transparent shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border  rounded-md"
                {...formik.getFieldProps("title")}
              />
              {formik.touched.title && formik.errors.title ? (
                <div>{formik.errors.title}</div>
              ) : null}
            </div>
          </p>
        </div>
        {/* Authors section */}
        <div className="px-1 py-1 sm:flex place-items-center sm:place-items-left">
          <div className="flex sm:inline">
            <span className="flex-grow"></span>

            <AuthorAvatarsNew authors={module.authors} />
            <span className="flex-grow"></span>
          </div>
          <span className="sm:flex-grow"></span>
          <div className="flex sm:contents">
            <span className="flex-grow sm:hidden"></span>

            {addAuthors ? (
              <>
                <div className="w-28 sm:w-56 h-full">
                  <Autocomplete
                    openOnFocus={true}
                    defaultActiveItemId="0"
                    getSources={({ query }) => [
                      {
                        sourceId: "products",
                        async onSelect(params) {
                          const { item, setQuery } = params
                          try {
                            const updatedModule = await addAuthorMutation({
                              authorId: item.objectID,
                              moduleId: module.id,
                              authorshipRank:
                                Math.max.apply(
                                  Math,
                                  module.authors.map(function (o) {
                                    return o.authorshipRank
                                  })
                                ) + 1,
                            })
                            toast.success("Author invited")
                            setQueryData(updatedModule)
                          } catch (error) {
                            toast.error("Something went wrong")
                          }
                          setQuery("")
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
                            return <SearchResultWorkspace item={item} />
                          },
                        },
                      },
                    ]}
                  />
                </div>
              </>
            ) : (
              <button
                className="flex px-2 py-2 border dark:bg-gray-800 border-gray-300 dark:border-gray-600 dark:hover:border-gray-400 text-gray-700 dark:text-gray-200 rounded text-xs leading-4 font-normal shadow-sm mx-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => {
                  setAddAuthors(true)
                }}
              >
                <PlusSmIcon
                  className="fill-current text-gray-500 dark:text-gray-200 w-4 h-4 dark:hover:text-gray-400"
                  aria-hidden="true"
                />
                Add Authors
              </button>
            )}

            <button
              className="flex px-2 py-2 border dark:bg-gray-800 border-gray-300 dark:border-gray-600 dark:hover:border-gray-400 text-gray-700 dark:text-gray-200 rounded text-xs leading-4 font-normal shadow-sm mx-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => {
                setManageAuthorsOpen(true)
              }}
            >
              Manage Authors
            </button>
            <ManageAuthors
              open={manageAuthorsOpen}
              setOpen={setManageAuthorsOpen}
              moduleEdit={module}
              setQueryData={setQueryData}
            />
            <span className="flex-grow sm:hidden"></span>
          </div>
        </div>
        {/* Description section */}
        <div className="text-xs leading-4 font-normal pt-4 pl-2 pr-4 pb-2">
          <label htmlFor="description" className="sr-only block text-sm font-medium text-gray-700">
            Description
          </label>
          <div className="mt-1">
            <textarea
              rows={8}
              id="description"
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 dark:border-gray-600 bg-transparent rounded-md"
              {...formik.getFieldProps("description")}
            />
            {formik.touched.description && formik.errors.description ? (
              <div>{formik.errors.description}</div>
            ) : null}
          </div>
        </div>
        <div className="px-2 py-2 flex">
          <button
            type="submit"
            className="flex py-2 px-4 bg-green-50 dark:bg-gray-800 text-green-700 dark:text-green-500 hover:bg-green-200 dark:hover:bg-gray-700 dark:border dark:border-gray-600 dark:hover:border-gray-400 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-green-500"
          >
            Save changes
          </button>
          <button
            type="button"
            className="flex mx-2 py-2 px-4 bg-red-50 dark:bg-gray-800 text-red-700 dark:text-red-500 hover:bg-red-200 dark:hover:bg-gray-700 dark:border dark:border-gray-600 dark:hover:border-gray-400 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-red-500"
            onClick={() => {
              setIsEditing(false)
            }}
          >
            Cancel changes
          </button>
        </div>
      </form>
    </div>
  )
}

export default MetadataEdit
