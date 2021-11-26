import { Dialog, Transition } from "@headlessui/react"
import { XIcon } from "@heroicons/react/solid"
import getLicenses from "app/core/queries/getLicenses"
import getTypes from "app/core/queries/getTypes"
import { useMutation, useQuery, validateZodSchema } from "blitz"
import { useFormik } from "formik"
import { Fragment, useState } from "react"
import { z } from "zod"
import { HelpFilled32 } from "@carbon/icons-react"
import createModule from "../mutations/createModule"

const QuickDraft = ({ buttonText, buttonStyle }) => {
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
    },
    validate: validateZodSchema(
      z.object({
        title: z.string().max(300),
        description: z.string(),
        type: z.string().min(1),
        license: z.string().min(1),
      })
    ),
    onSubmit: async (values) => {
      // alert(JSON.stringify(values))
      try {
        await createModuleMutation({
          title: values.title,
          description: values.description,
          typeId: parseInt(values.type),
          licenseId: parseInt(values.license),
          authors: [],
        })
        setCreateOpen(false)
      } catch (error) {
        alert(error.toString())
      }
    },
  })

  return (
    <>
      <button
        onClick={() => {
          setCreateOpen(true)
        }}
        // className="ml-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        className={buttonStyle}
      >
        {buttonText}
        {/* Create module */}
      </button>
      <Transition.Root show={openCreate} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 overflow-hidden" onClose={setCreateOpen}>
          <div className="absolute inset-0 overflow-hidden">
            <Dialog.Overlay className="absolute inset-0" />

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
                <div className="w-screen max-w-md">
                  <form
                    onSubmit={formik.handleSubmit}
                    className="h-full divide-y divide-gray-200 flex flex-col bg-gray-300 shadow-xl"
                  >
                    <div className="min-h-0 flex-1 flex flex-col py-6 overflow-y-auto">
                      <div className="px-4 sm:px-6">
                        <div className="flex items-start justify-between">
                          <Dialog.Title className="text-lg font-medium text-gray-900">
                            Quick create
                          </Dialog.Title>
                          <div className="ml-3 h-7 flex items-center">
                            <button
                              type="button"
                              className=" rounded-md text-gray-900 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              onClick={() => setCreateOpen(false)}
                            >
                              <span className="sr-only">Close panel</span>
                              <XIcon className="h-6 w-6" aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="mt-6 relative flex-1 px-4 sm:px-6">
                        {/* Replace with your content */}
                        <div className="text-sm leading-5 font-normal border-b border-gray-200 pb-4">
                          Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Phasellus
                          hendrerit. Pellentesque aliquet nibh nec urna. In nisi neque, aliquet vel,
                          dapibus id, mattis vel, nisi.
                        </div>
                        <div className="my-4">
                          <label
                            htmlFor="title"
                            className=" my-1 block text-sm font-medium text-gray-700 dark:text-gray-100"
                          >
                            Title
                          </label>
                          <div className="mt-1">
                            <input
                              id="title"
                              type="title"
                              required
                              className="appearance-none block w-full px-3 py-2 border border-gray-500 bg-gray-300 dark:bg-gray-800 dark:border-gray-500 rounded-md shadow-sm placeholder-gray-400 placeholder-font-normal focus:outline-none focus:ring-indigo-500 focus:border-indigo-500  font-normal text-sm "
                              {...formik.getFieldProps("title")}
                            />
                            {formik.touched.title && formik.errors.title ? (
                              <div className="font-normal text-sm">{formik.errors.title}</div>
                            ) : null}
                          </div>
                        </div>
                        <div className="my-4">
                          <label
                            htmlFor="description"
                            className="my-1 block text-sm font-medium text-gray-700 dark:text-gray-100"
                          >
                            Description
                          </label>
                          <div className="mt-1">
                            <textarea
                              rows={4}
                              id="description"
                              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-500 bg-gray-300 dark:bg-gray-800 rounded-md"
                              {...formik.getFieldProps("description")}
                            />
                            {formik.touched.description && formik.errors.description ? (
                              <div className="font-normal text-sm">{formik.errors.description}</div>
                            ) : null}
                          </div>
                        </div>
                        {/* Content type */}
                        <div className="my-4">
                          <label
                            htmlFor="type"
                            className="my-1 block text-sm font-medium text-gray-700 dark:text-gray-100"
                          >
                            Module type
                          </label>
                          <div className="mt-1">
                            <select
                              id="type"
                              required
                              className="appearance-none block w-full px-3 py-2 border border-gray-500 bg-gray-300 dark:bg-gray-800 dark:border-gray-500 rounded-md shadow-sm placeholder-gray-400 placeholder-font-normal focus:outline-none focus:ring-indigo-500 focus:border-indigo-500  font-normal text-sm "
                              {...formik.getFieldProps("type")}
                            >
                              <option className="text-gray-900" value=""></option>
                              {moduleTypes.map((type) => (
                                <>
                                  <option value={type.id}>{type.name}</option>
                                </>
                              ))}
                            </select>
                            {formik.touched.type && formik.errors.type ? (
                              <div className="font-normal text-sm">{formik.errors.type}</div>
                            ) : null}
                          </div>
                        </div>
                        {/* License */}
                        <div className="my-4">
                          <label
                            htmlFor="license"
                            className="flex my-1 text-sm font-medium text-gray-700 dark:text-gray-100"
                          >
                            License{" "}
                            <HelpFilled32 className="ml-1 fill-current text-gray-400 w-4 h-4" />
                          </label>
                          <div className="mt-1">
                            <select
                              id="license"
                              required
                              className="appearance-none block w-full px-3 py-2 border border-gray-500 bg-gray-300 dark:bg-gray-800 dark:border-gray-500 rounded-md shadow-sm placeholder-gray-400 placeholder-font-normal focus:outline-none focus:ring-indigo-500 focus:border-indigo-500  font-normal text-sm "
                              {...formik.getFieldProps("license")}
                            >
                              <option className="text-gray-900" value=""></option>
                              {licenses.map((license) => (
                                <>
                                  <option value={license.id}>
                                    {license.name} (
                                    {license.price > 0 ? `${license.price / 100}EUR` : "Free"})
                                  </option>
                                </>
                              ))}
                            </select>
                            {formik.touched.license && formik.errors.license ? (
                              <div className="font-normal text-sm">{formik.errors.license}</div>
                            ) : null}
                          </div>
                        </div>
                        {/* /End replace */}
                      </div>
                    </div>
                    <div className="flex-shrink-0 px-4 py-4 flex justify-end">
                      <button
                        type="button"
                        className="mx-4  py-2 px-4 border border-gray-500 bg-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        onClick={() => setCreateOpen(false)}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className=" py-2 px-4 border border-gray-500 bg-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
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
