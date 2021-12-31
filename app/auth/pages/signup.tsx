import { useRouter, BlitzPage, validateZodSchema, useMutation, Routes, Link } from "blitz"
import Layout from "app/core/layouts/Layout"
import { useFormik } from "formik"
import { z } from "zod"
import { useState } from "react"
import { Switch } from "@headlessui/react"
import signup from "../mutations/signup"
import ResearchEqualsLogo from "../../core/components/ResearchEqualsLogo"

function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}

const SignupPage: BlitzPage = () => {
  const [signupMutation] = useMutation(signup)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [cocAccepted, setCocAccepted] = useState(false)

  const router = useRouter()
  const formik = useFormik({
    initialValues: {
      email: "",
      handle: "",
      password: "",
    },
    validate: validateZodSchema(
      z.object({
        email: z.string().email(),
        handle: z.string().min(3),
        password: z.string(),
      })
    ),
    onSubmit: async (values) => {
      try {
        await signupMutation(values)
      } catch (error) {
        if (error.code === "P2002" && error.meta?.target?.includes("email")) {
          alert("This email is already being used")
        } else if (error.code === "P2002" && error.meta?.target?.includes("handle")) {
          alert("This handle is already being used")
        } else {
          alert(error.toString())
        }
      }
    },
  })

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <ResearchEqualsLogo />
        <h1 className="mt-6 text-center text-3xl font-extrabold ">Join ResearchEquals</h1>
        <div className="bg-white dark:bg-gray-800 shadow rounded py-4 px-6 my-8">
          <form onSubmit={formik.handleSubmit}>
            <div className="my-4">
              <label
                htmlFor="email"
                className=" my-1 block text-sm font-medium text-gray-700 dark:text-gray-100"
              >
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:bg-gray-800 dark:border-gray-500 rounded-md shadow-sm placeholder-gray-400 placeholder-font-normal focus:outline-none focus:ring-indigo-500 focus:border-indigo-500  font-normal text-sm "
                  placeholder="you@email.com"
                  {...formik.getFieldProps("email")}
                />
                {formik.touched.email && formik.errors.email ? (
                  <div className="font-normal text-sm">{formik.errors.email}</div>
                ) : null}
              </div>
            </div>
            {/* Handle */}
            <div className="my-4">
              <label
                htmlFor="handle"
                className="my-1 block text-sm font-medium text-gray-700 dark:text-gray-100"
              >
                Handle
              </label>
              <div className="max-w-lg flex rounded-md shadow-sm">
                <span className="inline-flex items-center px-3 leading-5 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 font-normal text-sm dark:bg-gray-700 dark:text-gray-300  dark:border-gray-500">
                  researchequals.com/
                </span>
                <input
                  type="text"
                  id="handle"
                  autoComplete="handle"
                  required
                  className="flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300 font-normal text-sm dark:bg-gray-800 dark:border-gray-500"
                  {...formik.getFieldProps("handle")}
                />
              </div>
              {formik.touched.handle && formik.errors.handle ? (
                <div className="font-normal text-sm">{formik.errors.handle}</div>
              ) : null}
            </div>
            {/* Password */}
            <div className="my-4">
              <label
                htmlFor="password"
                className="my-1 block text-sm font-medium text-gray-700 dark:text-gray-100"
              >
                Password
              </label>
              <div className="">
                <input
                  id="password"
                  type="password"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:text-gray-100 dark:bg-gray-800 dark:border-gray-500"
                  {...formik.getFieldProps("password")}
                />
                {formik.touched.password && formik.errors.password ? (
                  <div className="font-normal text-sm">{formik.errors.password}</div>
                ) : null}
              </div>
            </div>
            <div className="flex my-4">
              <Switch
                checked={termsAccepted}
                onChange={setTermsAccepted}
                className={classNames(
                  termsAccepted ? "bg-indigo-600" : "bg-gray-200 dark:bg-gray-700",
                  "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-indigo-500"
                )}
              >
                <span className="sr-only">Use setting</span>
                <span
                  className={classNames(
                    termsAccepted ? "translate-x-5" : "translate-x-0",
                    "pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
                  )}
                >
                  <span
                    className={classNames(
                      termsAccepted
                        ? "opacity-0 ease-out duration-100"
                        : "opacity-100 ease-in duration-200",
                      "absolute inset-0 h-full w-full flex items-center justify-center transition-opacity"
                    )}
                    aria-hidden="true"
                  >
                    <svg className="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 12 12">
                      <path
                        d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span
                    className={classNames(
                      termsAccepted
                        ? "opacity-100 ease-in duration-200"
                        : "opacity-0 ease-out duration-100",
                      "absolute inset-0 h-full w-full flex items-center justify-center transition-opacity"
                    )}
                    aria-hidden="true"
                  >
                    <svg
                      className="h-3 w-3 text-indigo-600"
                      fill="currentColor"
                      viewBox="0 0 12 12"
                    >
                      <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                    </svg>
                  </span>
                </span>
              </Switch>
              <p className="mx-2 text-gray-500 dark:text-gray-100 font-normal text-base">
                I agree to the{" "}
                <Link href="/terms">
                  <a target="_blank" className="text-gray-700  dark:text-gray-100 underline">
                    Terms of use
                  </a>
                </Link>
              </p>
            </div>
            <div className="flex my-4">
              <Switch
                checked={cocAccepted}
                onChange={setCocAccepted}
                className={classNames(
                  cocAccepted ? "bg-indigo-600" : "bg-gray-200 dark:bg-gray-700",
                  "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-indigo-500"
                )}
              >
                <span className="sr-only">Use setting</span>
                <span
                  className={classNames(
                    cocAccepted ? "translate-x-5" : "translate-x-0",
                    "pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
                  )}
                >
                  <span
                    className={classNames(
                      cocAccepted
                        ? "opacity-0 ease-out duration-100"
                        : "opacity-100 ease-in duration-200",
                      "absolute inset-0 h-full w-full flex items-center justify-center transition-opacity"
                    )}
                    aria-hidden="true"
                  >
                    <svg className="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 12 12">
                      <path
                        d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span
                    className={classNames(
                      cocAccepted
                        ? "opacity-100 ease-in duration-200"
                        : "opacity-0 ease-out duration-100",
                      "absolute inset-0 h-full w-full flex items-center justify-center transition-opacity"
                    )}
                    aria-hidden="true"
                  >
                    <svg
                      className="h-3 w-3 text-indigo-600"
                      fill="currentColor"
                      viewBox="0 0 12 12"
                    >
                      <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                    </svg>
                  </span>
                </span>
              </Switch>
              <p className="mx-2 text-gray-500 dark:text-gray-100 font-normal text-base">
                I agree to the{" "}
                <Link href="https://libscie.notion.site/Code-of-Conduct-580ab64832a2478fad7d9dfad9d3da15">
                  <a target="_blank" className="text-gray-700 dark:text-gray-100 underline">
                    Code of Conduct
                  </a>
                </Link>
              </p>
            </div>
            {termsAccepted && cocAccepted ? (
              <button
                type="submit"
                className="w-full px-3 py-2 border text-medium border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign up
              </button>
            ) : (
              <button
                type="submit"
                className="w-full px-3 py-2 border text-medium border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                disabled
              >
                Sign up
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}

SignupPage.redirectAuthenticatedTo = "/dashboard"
SignupPage.getLayout = (page) => <Layout title="Join ResearchEquals">{page}</Layout>

export default SignupPage
