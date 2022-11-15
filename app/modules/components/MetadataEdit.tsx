import { useMutation, useQuery } from "@blitzjs/rpc"
import moment from "moment"
import algoliasearch from "algoliasearch"
import ISO6391 from "iso-639-1"

import AuthorAvatarsNew from "./AuthorAvatarsNew"
import { useEffect } from "react"
import { useFormik } from "formik"
import { z } from "zod"
import editModuleScreen from "../mutations/editModuleScreen"
import getTypes from "../../core/queries/getTypes"
import getLicenses from "app/core/queries/getLicenses"
import { validateZodSchema } from "blitz"

const MetadataEdit = ({ module, setQueryData, setIsEditing }) => {
  const [editModuleScreenMutation] = useMutation(editModuleScreen)
  const [moduleTypes] = useQuery(getTypes, undefined)
  const [licenses] = useQuery(getLicenses, undefined)

  const formik = useFormik({
    initialValues: {
      type: module.type.id.toString(),
      title: module.title,
      description: module.description,
      license: module.license?.id.toString(),
      displayColor: module.displayColor,
      language: module.language,
    },
    validate: validateZodSchema(
      z.object({
        type: z.string().min(1),
        title: z.string().max(300),
        description: z.string(),
        license: z.string().min(1),
        displayColor: z.string().min(1),
        language: z.enum([...ISO6391.getAllCodes()] as any),
      })
    ),
    onSubmit: async (values) => {
      const updatedModule = await editModuleScreenMutation({
        id: module.id,
        typeId: parseInt(values.type),
        title: values.title,
        description: values.description,
        licenseId: parseInt(values.license),
        displayColor: values.displayColor,
        language: values.language,
      })
      setQueryData(updatedModule)
      setIsEditing(false)
    },
  })

  useEffect(() => {
    formik.setFieldValue("type", module.type.id.toString()).catch(() => {})
    formik.setFieldValue("title", module.title).catch(() => {})
    formik.setFieldValue("description", module.description).catch(() => {})
    formik.setFieldValue("license", module.license!.id.toString()).catch(() => {})
    formik.setFieldValue("displayColor", module.displayColor).catch(() => {})
    formik.setFieldValue("language", module.language).catch(() => {})
  }, [module])

  return (
    <div className="module my-4 bg-gray-100 dark:bg-gray-600" style={{ padding: "1px" }}>
      <form
        className="module divide-y divide-gray-100 border-0 border-gray-100 bg-white dark:divide-gray-600 dark:border-gray-600 dark:bg-gray-900"
        onSubmit={formik.handleSubmit}
      >
        <div className="divide-y divide-gray-100 text-center text-sm font-normal leading-4 text-gray-500 dark:divide-gray-600 dark:bg-gray-800 dark:text-gray-200 lg:flex lg:divide-y-0 lg:divide-x">
          <div className="flex-grow py-2">
            <span className="inline-block h-full align-middle"> </span>
            <span className="">Updated: {moment(module.updatedAt).fromNow()}</span>
          </div>
          <div className="flex-grow py-2">
            <span className="inline-block h-full align-middle"> </span>
            <span className="">
              DOI:{" "}
              <span className="text-gray-300 dark:text-gray-600">{`${module.prefix}/${module.suffix}`}</span>
            </span>
          </div>
          <div className="px-2 py-2">
            <label
              htmlFor="license"
              className="sr-only my-1 flex text-sm font-medium leading-5 text-gray-700 dark:text-gray-200"
            >
              License{" "}
              {formik.touched.license && formik.errors.license
                ? " - " + formik.errors.license
                : null}
            </label>
            <div className="mt-1">
              <select
                className="placeholder-font-normal block w-full appearance-none rounded-md border border-gray-400 bg-white px-3 py-2 text-sm font-normal placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0 dark:border-gray-600 dark:bg-transparent dark:text-gray-200"
                id="license"
                {...formik.getFieldProps("license")}
              >
                {licenses.map((license) => (
                  <>
                    <option value={license.id} className="text-gray-900">
                      {license.name} ({license.price > 0 ? `${license.price / 100}EUR` : "Free"})
                    </option>
                  </>
                ))}
              </select>
            </div>
          </div>
          <div className="px-2 py-2">
            <label
              htmlFor="language"
              className="sr-only my-1 flex text-sm font-medium leading-5 text-gray-700 dark:text-gray-200"
            >
              Language{" "}
              {formik.touched.language && formik.errors.language
                ? " - " + formik.errors.language
                : null}
            </label>
            <div className="mt-1">
              <select
                id="language"
                required
                className="placeholder-font-normal block w-full appearance-none rounded-md border border-gray-400 bg-white px-3 py-2 text-sm font-normal placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0 dark:border-gray-600 dark:bg-transparent dark:text-gray-200"
                {...formik.getFieldProps("language")}
              >
                {ISO6391.getAllNames().map((lang) => (
                  <>
                    <option value={ISO6391.getCode(lang)} className="text-gray-900">
                      {ISO6391.getCode(lang) + " - " + lang}
                    </option>
                  </>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="min-h-32 py-4 px-2">
          <p className="text-sm font-normal leading-4 text-gray-900 dark:text-white">
            <label htmlFor="type" className="sr-only">
              Module type
            </label>
            <select
              className="rounded border-gray-300 bg-transparent text-sm font-normal leading-4 dark:border-gray-600"
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
          <p className="text-xl font-medium leading-6 text-gray-900 dark:text-white">
            <label htmlFor="title" className="sr-only block text-sm font-medium text-gray-700">
              Title
            </label>
            <div className="mt-1 ">
              <textarea
                rows={2}
                id="title"
                className="block w-full rounded-md border border-gray-300 bg-transparent shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600  sm:text-sm"
                {...formik.getFieldProps("title")}
              />
              {formik.touched.title && formik.errors.title ? (
                <div>{formik.errors.title}</div>
              ) : null}
            </div>
          </p>
        </div>
        {/* Authors section */}
        <div className="sm:place-items-left place-items-center px-1 py-1 sm:flex">
          <div className="flex sm:inline">
            <span className="flex-grow"></span>

            <AuthorAvatarsNew authors={module.authors} size="h-12 w-12" toDisplay={4} />
            <span className="flex-grow"></span>
          </div>
        </div>
        {/* Description section */}
        <div className="pt-4 pl-2 pr-4 pb-2 text-sm font-normal leading-4">
          <label htmlFor="description" className="sr-only block text-sm font-medium text-gray-700">
            Summary
          </label>
          <div className="mt-1">
            <textarea
              rows={8}
              id="description"
              className="block w-full rounded-md border border-gray-300 bg-transparent shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 sm:text-sm"
              {...formik.getFieldProps("description")}
            />
            {formik.touched.description && formik.errors.description ? (
              <div>{formik.errors.description}</div>
            ) : null}
          </div>
        </div>
        <div className="px-2 py-2">
          <label
            htmlFor="displayColor"
            className="my-1 flex text-sm font-medium leading-5 text-gray-700 dark:text-gray-200"
          >
            Display color{" "}
            {formik.touched.displayColor && formik.errors.displayColor
              ? " - " + formik.errors.displayColor
              : null}
          </label>
          <div className="mt-1">
            <select
              id="displayColor"
              required
              className="placeholder-font-normal block w-full appearance-none rounded-md border border-gray-400 bg-white px-3 py-2 text-sm font-normal placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0 dark:border-gray-600 dark:bg-transparent dark:text-gray-200"
              {...formik.getFieldProps("displayColor")}
            >
              <option value="#574cfa" className="text-white" style={{ backgroundColor: "#574cfa" }}>
                Purple
              </option>
              <option value="#059669" className="text-white" style={{ backgroundColor: "#059669" }}>
                Green
              </option>
              <option value="#db2777" className="text-white" style={{ backgroundColor: "#db2777" }}>
                Red
              </option>
            </select>
          </div>
        </div>

        <div className="flex px-2 py-2">
          <button
            type="submit"
            className="flex rounded-md bg-emerald-50 py-2 px-4 text-sm font-medium text-emerald-700 hover:bg-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-0 dark:border dark:border-gray-600 dark:bg-gray-800 dark:text-emerald-500 dark:hover:border-gray-400 dark:hover:bg-gray-700"
          >
            Save changes
          </button>
          <button
            type="button"
            className="mx-2 flex rounded-md bg-red-50 py-2 px-4 text-sm font-medium text-red-700 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-0 dark:border dark:border-gray-600 dark:bg-gray-800 dark:text-red-500 dark:hover:border-gray-400 dark:hover:bg-gray-700"
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
