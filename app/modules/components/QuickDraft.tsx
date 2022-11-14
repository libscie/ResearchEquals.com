import Link from "next/link"
import { useRouter } from "next/router"
import { useMutation, useQuery } from "@blitzjs/rpc"
import { Dialog, Transition } from "@headlessui/react"
import getLicenses from "app/core/queries/getLicenses"
import getTypes from "app/core/queries/getTypes"
import { useFormik } from "formik"
import { Fragment, useState } from "react"
import { z } from "zod"
import { Checkmark, Close, InformationSquareFilled } from "@carbon/icons-react"
import ISO6391 from "iso-639-1"

import createModule from "../mutations/createModule"
import toast from "react-hot-toast"
import { validateZodSchema } from "blitz"

const QuickDraft = ({ buttonText, buttonStyle, refetchFn }) => {
  const [openCreate, setCreateOpen] = useState(false)
  const [moduleTypes] = useQuery(getTypes, undefined)
  const [licenses] = useQuery(getLicenses, undefined)
  const [createModuleMutation] = useMutation(createModule)
  const router = useRouter()
  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      main: "",
      type: "",
      license: "",
      language: "en",
      displayColor: "#574cfa",
    },
    validate: validateZodSchema(
      z.object({
        title: z.string().max(300),
        description: z.string(),
        type: z.string().min(1),
        license: z.string().min(1),
        language: z.enum([...ISO6391.getAllCodes()] as any),
        displayColor: z.string().min(1),
      })
    ),
    onSubmit: async (values) => {
      toast
        .promise(
          createModuleMutation({
            title: values.title,
            description: values.description,
            typeId: parseInt(values.type),
            licenseId: parseInt(values.license),
            language: values.language,
            authors: [],
            displayColor: values.displayColor,
          }),
          {
            loading: "Creating draft...",
            success: (data) => {
              refetchFn()
              setCreateOpen(false)
              formikReset()
              router.push(`/drafts?suffix=${data}`).catch(() => {})
              return "Created!"
            },
            error: (error) => {
              return error
            },
          }
        )
        .catch(() => {})
      // try {
      //   await createModuleMutation({
      //     title: values.title,
      //     description: values.description,
      //     typeId: parseInt(values.type),
      //     licenseId: parseInt(values.license),
      //     authors: [],
      //     displayColor: values.displayColor,
      //   })
      //   refetchFn()
      //   setCreateOpen(false)
      //   formikReset()
      // } catch (error) {
      //   alert(error.toString())
      // }
    },
  })

  const formikReset = () => {
    formik.setFieldValue("title", "").catch(() => {})
    formik.setFieldValue("description", "").catch(() => {})
    formik.setFieldValue("main", "").catch(() => {})
    formik.setFieldValue("type", "").catch(() => {})
    formik.setFieldValue("license", "").catch(() => {})
    formik.setFieldValue("language", "en").catch(() => {})
    formik.setFieldValue("displayColor", "#574cfa").catch(() => {})
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
        <Dialog as="div" className="fixed inset-0 z-10 overflow-hidden" onClose={setCreateOpen}>
          <div className="absolute inset-0 overflow-hidden">
            <Dialog.Overlay className="fixed inset-0 bg-gray-900 bg-opacity-25 transition-opacity" />

            <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <div className="w-screen max-w-sm  border-l border-gray-400 dark:border-gray-600">
                  <form
                    onSubmit={formik.handleSubmit}
                    className="flex h-full flex-col divide-y divide-gray-400 bg-white shadow-xl dark:divide-gray-600 dark:bg-gray-900"
                  >
                    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto py-6">
                      <div className="px-4 sm:px-6">
                        <div className="flex items-start justify-between">
                          <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-white">
                            Quick draft
                          </Dialog.Title>
                          <div className="ml-3 flex h-7 items-center">
                            <button
                              type="button"
                              className="rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-gray-200 dark:hover:bg-gray-800 dark:hover:text-white"
                              onClick={() => setCreateOpen(false)}
                            >
                              <span className="sr-only">Close panel</span>
                              <Close size={32} className="h-6 w-6" aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="mt-6 border-b border-gray-500 px-4 pb-4 text-sm font-normal leading-5 dark:border-gray-500 dark:text-white sm:px-6">
                        What are you working on right now? Anything you create here, you can change
                        before publishing.
                      </div>
                      <div className="relative flex-1 px-4 sm:px-6">
                        {/* Replace with your content */}
                        <div className="my-4">
                          <label
                            htmlFor="title"
                            className="my-1 block text-sm font-medium leading-5 text-gray-700 dark:text-gray-200"
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
                              className="placeholder-font-normal block w-full appearance-none rounded-md border border-gray-400 bg-white px-3 py-2 text-sm font-normal placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0 dark:border-gray-600 dark:bg-transparent dark:text-gray-200 "
                              {...formik.getFieldProps("title")}
                            />
                          </div>
                        </div>
                        <div className="my-4">
                          <label
                            htmlFor="description"
                            className="my-1 block text-sm font-medium leading-5 text-gray-700 dark:text-gray-200"
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
                              className="placeholder-font-normal block w-full appearance-none rounded-md border border-gray-400 bg-white px-3 py-2 text-sm font-normal placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0 dark:border-gray-600 dark:bg-transparent dark:text-gray-200 "
                              {...formik.getFieldProps("description")}
                            />
                          </div>
                        </div>
                        {/* Content type */}
                        <div className="my-4">
                          <label
                            htmlFor="type"
                            className="my-1 block text-sm font-medium leading-5 text-gray-700 dark:text-gray-200"
                          >
                            Module type{" "}
                            {formik.touched.type && formik.errors.type ? (
                              <span className="text-red-500">- Required</span>
                            ) : null}
                            <p className="text-xs">
                              Missing something?{" "}
                              <Link href="mailto:info@libscie.org?subject=Missing module type">
                                <a className="underline">Let us know!</a>
                              </Link>
                            </p>
                          </label>
                          <div className="mt-1">
                            <select
                              id="type"
                              required
                              className="placeholder-font-normal block w-full appearance-none rounded-md border border-gray-400 bg-white px-3 py-2 text-sm font-normal placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0 dark:border-gray-600 dark:bg-transparent dark:text-gray-200 "
                              {...formik.getFieldProps("type")}
                            >
                              <option className="text-gray-900" value=""></option>
                              {moduleTypes.map((type) => (
                                <option key={type.id} value={type.id} className="text-gray-900">
                                  {type.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        {/* License */}
                        <div className="my-4">
                          <label
                            htmlFor="license"
                            className="my-1 flex text-sm font-medium leading-5 text-gray-700 dark:text-gray-200"
                          >
                            License{" "}
                            <Link href="https://creativecommons.org/about/cclicenses">
                              <a target="_blank">
                                <InformationSquareFilled
                                  size={32}
                                  className="h-5 w-5 fill-current text-gray-700 dark:text-gray-200"
                                />
                              </a>
                            </Link>
                            {formik.touched.license && formik.errors.license ? (
                              <span className="text-red-500">- Required</span>
                            ) : null}
                          </label>
                          <p className="text-xs text-gray-700 dark:text-gray-200">
                            Get more information about licenses{" "}
                            <Link href="https://creativecommons.org/about/cclicenses">
                              <a className="underline" target="_blank">
                                here.
                              </a>
                            </Link>
                          </p>
                          <div className="mt-1">
                            <select
                              id="license"
                              required
                              className="placeholder-font-normal block w-full appearance-none rounded-md border border-gray-400 bg-white px-3 py-2 text-sm font-normal placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0 dark:border-gray-600 dark:bg-transparent dark:text-gray-200 "
                              {...formik.getFieldProps("license")}
                            >
                              <option className="text-gray-900" value=""></option>
                              {licenses.map((license) => (
                                <option
                                  key={license.id}
                                  value={license.id}
                                  className="text-gray-900"
                                >
                                  {license.name} (
                                  {license.price > 0
                                    ? `${license.price / 100}EUR incl. VAT`
                                    : "Pay what you want"}
                                  )
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="my-4">
                          <label
                            htmlFor="displayColor"
                            className="my-1 text-sm font-medium leading-5 text-gray-700 dark:text-gray-200"
                          >
                            Display color{" "}
                            {formik.touched.displayColor && formik.errors.displayColor
                              ? " - " + formik.errors.displayColor
                              : null}
                            <p className="text-xs">This is the module color upon publication.</p>
                          </label>
                          <div className="mt-1">
                            <select
                              id="displayColor"
                              required
                              className="placeholder-font-normal block w-full appearance-none rounded-md border border-gray-400 bg-white px-3 py-2 text-sm font-normal placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0 dark:border-gray-600 dark:bg-transparent dark:text-gray-200"
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
                                Emerald
                              </option>
                              <option
                                value="#16a34a"
                                className="text-white"
                                style={{ backgroundColor: "#16a34a" }}
                              >
                                Green
                              </option>
                              <option
                                value="#db2777"
                                className="text-white"
                                style={{ backgroundColor: "#db2777" }}
                              >
                                Pink
                              </option>
                            </select>
                          </div>
                        </div>
                        <div className="my-4">
                          <label
                            htmlFor="language"
                            className="my-1 block text-sm font-medium leading-5 text-gray-700 dark:text-gray-200"
                          >
                            Language{" "}
                            {formik.touched.language && formik.errors.language
                              ? " - " + formik.errors.language
                              : null}
                            <p className="text-xs">Publish in your preferred language.</p>
                          </label>
                          <div className="mt-1">
                            <select
                              id="language"
                              required
                              className="placeholder-font-normal block w-full appearance-none rounded-md border border-gray-400 bg-white px-3 py-2 text-sm font-normal placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0 dark:border-gray-600 dark:bg-transparent dark:text-gray-200 "
                              {...formik.getFieldProps("language")}
                            >
                              {ISO6391.getAllNames().map((lang) => (
                                <option
                                  key={lang}
                                  value={ISO6391.getCode(lang)}
                                  className="text-gray-900"
                                >
                                  {ISO6391.getCode(lang) + " - " + lang}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        {/* /End replace */}
                      </div>
                    </div>
                    <div className="flex shrink-0 justify-end px-4 py-4">
                      <button
                        type="button"
                        className="mx-4 flex rounded-md bg-red-50 py-2 px-4 text-sm font-medium text-red-700 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-0 dark:border dark:border-gray-600 dark:bg-gray-800 dark:text-red-500 dark:hover:border-gray-400 dark:hover:bg-gray-700"
                        onClick={() => {
                          setCreateOpen(false)
                          formikReset()
                        }}
                      >
                        <Close
                          size={32}
                          className="h-4 w-4 fill-current pt-1 text-red-500"
                          aria-hidden="true"
                        />
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex rounded-md bg-emerald-50 py-2 px-4 text-sm font-medium text-emerald-700 hover:bg-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-0 dark:border dark:border-gray-600 dark:bg-gray-800 dark:text-emerald-500 dark:hover:border-gray-400 dark:hover:bg-gray-700"
                      >
                        <Checkmark
                          size={32}
                          className="h-4 w-4 fill-current pt-1 text-emerald-500"
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
