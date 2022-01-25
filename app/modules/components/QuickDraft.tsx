import { Dialog, Transition } from "@headlessui/react"
import getLicenses from "app/core/queries/getLicenses"
import getTypes from "app/core/queries/getTypes"
import { useMutation, useQuery, validateZodSchema } from "blitz"
import { useFormik } from "formik"
import { Fragment, useState } from "react"
import { z } from "zod"
import { Checkmark32, Close32, HelpFilled32 } from "@carbon/icons-react"

import createModule from "../mutations/createModule"

const QuickDraft = ({ buttonText, buttonStyle, refetchFn }) => {
  const [openCreate, setCreateOpen] = useState(false)
  const [moduleTypes] = useQuery(getTypes, undefined)
  const [licenses] = useQuery(getLicenses, undefined)
  const [createModuleMutation] = useMutation(createModule)
  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      main: "",
      type: "",
      license: "",
      displayColor: "#574cfa",
    },
    validate: validateZodSchema(
      z.object({
        title: z.string().max(300),
        description: z.string(),
        type: z.string().min(1),
        license: z.string().min(1),
        displayColor: z.string().min(1),
      })
    ),
    onSubmit: async (values) => {
      try {
        await createModuleMutation({
          title: values.title,
          description: values.description,
          typeId: parseInt(values.type),
          licenseId: parseInt(values.license),
          authors: [],
          displayColor: values.displayColor,
        })
        refetchFn()
        setCreateOpen(false)
        formikReset()
      } catch (error) {
        alert(error.toString())
      }
    },
  })

  const formikReset = () => {
    formik.setFieldValue("title", "")
    formik.setFieldValue("description", "")
    formik.setFieldValue("main", "")
    formik.setFieldValue("type", "")
    formik.setFieldValue("license", "")
    formik.setFieldValue("displayColor", "#574cfa")
  }

  return (
    <>
      <button
        onClick={() => {
          setCreateOpen(true)
        }}
        className={buttonStyle}
      >
        {buttonText}
        {/* Create module */}
      </button>
      <Transition.Root show={openCreate} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 overflow-hidden z-10" onClose={setCreateOpen}>
          <div className="absolute inset-0 overflow-hidden">
            <Dialog.Overlay className="fixed inset-0 bg-gray-900 bg-opacity-25 transition-opacity" />

            <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <div className="w-screen max-w-xs  border-l border-gray-400 dark:border-gray-600">
                  <form
                    onSubmit={formik.handleSubmit}
                    className="h-full divide-y divide-gray-400 dark:divide-gray-600 flex flex-col bg-white dark:bg-gray-900 shadow-xl"
                  >
                    <div className="min-h-0 flex-1 flex flex-col py-6 overflow-y-auto">
                      <div className="px-4 sm:px-6">
                        <div className="flex items-start justify-between">
                          <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-white">
                            Quick draft
                          </Dialog.Title>
                          <div className="ml-3 h-7 flex items-center">
                            <button
                              type="button"
                              className="rounded-md text-gray-400 dark:text-gray-200 hover:text-gray-500 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              onClick={() => setCreateOpen(false)}
                            >
                              <span className="sr-only">Close panel</span>
                              <Close32 className="h-6 w-6" aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="mt-6 px-4 sm:px-6 text-sm leading-5 font-normal border-b border-gray-500 dark:border-gray-500 pb-4 dark:text-white">
                        What are you working on right now? Anything you create here, you can change
                        before publishing.
                      </div>
                      <div className="relative flex-1 px-4 sm:px-6">
                        {/* Replace with your content */}
                        <div className="my-4">
                          <label
                            htmlFor="title"
                            className="my-1 block text-sm leading-5 font-medium text-gray-700 dark:text-gray-200"
                          >
                            Title{" "}
                            {formik.touched.title && formik.errors.title
                              ? " - " + formik.errors.title
                              : null}
                          </label>
                          <div className="mt-1">
                            <input
                              id="title"
                              type="title"
                              required
                              className="appearance-none block w-full px-3 py-2 border border-gray-400 bg-white dark:bg-transparent dark:border-gray-600 dark:text-gray-200 rounded-md shadow-sm placeholder-gray-400 placeholder-font-normal focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-indigo-500 font-normal text-sm "
                              {...formik.getFieldProps("title")}
                            />
                          </div>
                        </div>
                        <div className="my-4">
                          <label
                            htmlFor="description"
                            className="my-1 block text-sm leading-5 font-medium text-gray-700 dark:text-gray-200"
                          >
                            Summary{" "}
                            {formik.touched.description && formik.errors.description
                              ? " - " + formik.errors.description
                              : null}
                          </label>
                          <div className="mt-1">
                            <textarea
                              rows={4}
                              id="description"
                              className="appearance-none block w-full px-3 py-2 border border-gray-400 bg-white dark:bg-transparent dark:border-gray-600 dark:text-gray-200 rounded-md shadow-sm placeholder-gray-400 placeholder-font-normal focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-indigo-500 font-normal text-sm "
                              {...formik.getFieldProps("description")}
                            />
                          </div>
                        </div>
                        {/* Content type */}
                        <div className="my-4">
                          <label
                            htmlFor="type"
                            className="my-1 block text-sm leading-5 font-medium text-gray-700 dark:text-gray-200"
                          >
                            Module type{" "}
                            {formik.touched.type && formik.errors.type
                              ? " - " + formik.errors.type
                              : null}
                            <p className="text-xs">Missing something? Let us know in the chat!</p>
                          </label>
                          <div className="mt-1">
                            <select
                              id="type"
                              required
                              className="appearance-none block w-full px-3 py-2 border border-gray-400 bg-white dark:bg-transparent dark:border-gray-600 dark:text-gray-200 rounded-md shadow-sm placeholder-gray-400 placeholder-font-normal focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-indigo-500 font-normal text-sm "
                              {...formik.getFieldProps("type")}
                            >
                              <option className="text-gray-900" value=""></option>
                              {moduleTypes.map((type) => (
                                <>
                                  <option value={type.id} className="text-gray-900">
                                    {type.name}
                                  </option>
                                </>
                              ))}
                            </select>
                          </div>
                        </div>
                        {/* License */}
                        <div className="my-4">
                          <label
                            htmlFor="license"
                            className="flex my-1 text-sm leading-5 font-medium text-gray-700 dark:text-gray-200"
                          >
                            License{" "}
                            {formik.touched.license && formik.errors.license
                              ? " - " + formik.errors.license
                              : null}
                          </label>
                          <div className="mt-1">
                            <select
                              id="license"
                              required
                              className="appearance-none block w-full px-3 py-2 border border-gray-400 bg-white dark:bg-transparent dark:border-gray-600 dark:text-gray-200 rounded-md shadow-sm placeholder-gray-400 placeholder-font-normal focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-indigo-500 font-normal text-sm "
                              {...formik.getFieldProps("license")}
                            >
                              <option className="text-gray-900" value=""></option>
                              {licenses.map((license) => (
                                <>
                                  <option value={license.id} className="text-gray-900">
                                    {license.name} (
                                    {license.price > 0 ? `${license.price / 100}EUR` : "Free"})
                                  </option>
                                </>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="my-4">
                          <label
                            htmlFor="displayColor"
                            className="flex my-1 text-sm leading-5 font-medium text-gray-700 dark:text-gray-200"
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
                              className="appearance-none block w-full px-3 py-2 border border-gray-400 bg-white dark:bg-transparent dark:border-gray-600 dark:text-gray-200 rounded-md shadow-sm placeholder-gray-400 placeholder-font-normal focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-indigo-500 font-normal text-sm"
                              {...formik.getFieldProps("displayColor")}
                            >
                              <option
                                value="#574cfa"
                                className="text-white"
                                style={{ backgroundColor: "#574cfa" }}
                              >
                                Purple
                              </option>
                              <option
                                value="#059669"
                                className="text-white"
                                style={{ backgroundColor: "#059669" }}
                              >
                                Green
                              </option>
                              <option
                                value="#db2777"
                                className="text-white"
                                style={{ backgroundColor: "#db2777" }}
                              >
                                Red
                              </option>
                            </select>
                          </div>
                        </div>
                        {/* /End replace */}
                      </div>
                    </div>
                    <div className="flex-shrink-0 px-4 py-4 flex justify-end">
                      <button
                        type="button"
                        className="flex mx-4 py-2 px-4 bg-red-50 dark:bg-gray-800 text-red-700 dark:text-red-500 hover:bg-red-200 dark:hover:bg-gray-700 dark:border dark:border-gray-600 dark:hover:border-gray-400 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-red-500"
                        onClick={() => {
                          setCreateOpen(false)
                          formikReset()
                        }}
                      >
                        <Close32
                          className="w-4 h-4 fill-current text-red-500 pt-1"
                          aria-hidden="true"
                        />
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex py-2 px-4 bg-green-50 dark:bg-gray-800 text-green-700 dark:text-green-500 hover:bg-green-200 dark:hover:bg-gray-700 dark:border dark:border-gray-600 dark:hover:border-gray-400 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-green-500"
                      >
                        <Checkmark32
                          className="w-4 h-4 fill-current text-green-500 pt-1"
                          aria-hidden="true"
                        />
                        Save
                      </button>
                    </div>
                  </form>
                </div>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  )
}

export default QuickDraft
