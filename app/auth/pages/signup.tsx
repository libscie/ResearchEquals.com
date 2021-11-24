import { useRouter, BlitzPage, validateZodSchema, useMutation, Routes, Link } from "blitz"
import Layout from "app/core/layouts/Layout"
import { useFormik } from "formik"
import { z } from "zod"
import { useState } from "react"
import { Switch } from "@headlessui/react"
import signup from "../mutations/signup"

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
        <svg
          className="fill-current text-indigo-600 mx-auto h-12 w-auto"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 453.54 453.54"
        >
          <path
            className="cls-1"
            d="M408.31,263.54c0-31.31-21.57-31.65-34.79-31.65h-32.7L318.9,332.78h15.31c24.35-.7,43.83-1,56.36-13.92C401,308.08,408.31,280.59,408.31,263.54Z"
            transform="translate(-194.17 -65.82)"
          />
          <path
            className="cls-1"
            d="M194.17,65.82V519.36h341L647.72,406.83v-341ZM451.8,470.2A90,90,0,0,1,425.71,474c-47,0-49.06-41.06-50.45-64l-1.39-24c-.7-10.79-1.39-24.71-10.09-34.79s-20.53-10.44-30.27-10.79h-16L291.07,462.89h32l-1.39,7.31H220.79l1.74-7.31h29.92l49.05-231H268.8l2.09-7.31H376.3c15,0,26.1,0,37.92,3.48,32,9.39,34.45,36.53,34.45,46.62a52.85,52.85,0,0,1-15.31,37.92c-20.87,21.92-56.71,24.35-74.1,25.4,57.75,17.39,59.14,49.05,59.49,85.93v11.13c.35,11.13.69,16.35,2.78,20.53,2.44,5.22,8,9.74,16.35,9.74,3.48,0,4.53-.35,13.92-2.44ZM616,406.83H472.1V388.1H616Zm0-55.23-143.87.31V333.17H616Z"
            transform="translate(-194.17 -65.82)"
          />
        </svg>
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
                <Link href="https://google.com">
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
                <Link href="https://google.com">
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
