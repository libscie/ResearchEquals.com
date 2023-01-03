import Link from "next/link"
import { useMutation } from "@blitzjs/rpc"
import { BlitzPage, Routes } from "@blitzjs/next"
import Layout from "app/core/layouts/Layout"
import { useFormik } from "formik"
import { z } from "zod"
import { useState } from "react"
import { Switch } from "@headlessui/react"
import { Close, Checkmark } from "@carbon/icons-react"
import toast from "react-hot-toast"
import signup from "app/auth/mutations/signup"
import ResearchEqualsLogo from "app/core/components/ResearchEqualsLogo"
import { validateZodSchema } from "blitz"

function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}

const SignupPage: BlitzPage = () => {
  const [signupMutation] = useMutation(signup)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [cocAccepted, setCocAccepted] = useState(false)
  const [passwordField, setPasswordField] = useState("password")

  const togglePasswordField = () => {
    if (passwordField === "password") {
      setPasswordField("text")
    } else {
      setPasswordField("password")
    }
  }

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
        password: z.string().min(10),
      })
    ),
    onSubmit: async (values) => {
      try {
        await toast.promise(signupMutation(values), {
          loading: "Signing up...",
          success: "Success!",
          error: (error) => {
            if (error.code === "P2002" && error.meta?.target?.includes("email")) {
              return "This email is already being used"
            } else if (error.code === "P2002" && error.meta?.target?.includes("handle")) {
              return "This handle is already being used"
            } else {
              return error.toString()
            }
          },
        })
      } catch (error) {}
    },
  })

  return (
    <div className="flex min-h-screen flex-col justify-center bg-gray-100 py-12 text-gray-900 dark:bg-gray-900 dark:text-white sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href={Routes.Home()}>
          <ResearchEqualsLogo />
        </Link>
        <h1 className="mt-6 text-center text-3xl font-extrabold ">Join ResearchEquals</h1>
        <div className="my-8 rounded bg-white py-4 px-6 shadow dark:bg-gray-800">
          <form onSubmit={formik.handleSubmit}>
            <div className="">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-100"
              >
                Email address
                {formik.touched.email && formik.errors.email ? (
                  <span className="text-red-500">{` - ${formik.errors.email}`}</span>
                ) : null}
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="placeholder-font-normal block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-sm font-normal placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500  dark:border-gray-500 dark:bg-gray-800 "
                  placeholder="you@email.com"
                  {...formik.getFieldProps("email")}
                />
              </div>
            </div>
            {/* Handle */}
            <div className="my-4">
              <label
                htmlFor="handle"
                className="my-1 block text-sm font-medium text-gray-700 dark:text-gray-100"
              >
                Username
                {formik.touched.handle && formik.errors.handle ? (
                  <span className="text-red-500">{` - ${formik.errors.handle}`}</span>
                ) : null}
              </label>
              <div className="flex max-w-lg rounded-md shadow-sm">
                <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm font-normal leading-5 text-gray-500 dark:border-gray-500 dark:bg-gray-700  dark:text-gray-300">
                  researchequals.com/
                </span>
                <input
                  type="text"
                  id="handle"
                  autoComplete="handle"
                  required
                  className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 text-sm font-normal focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-500 dark:bg-gray-800 sm:text-sm"
                  {...formik.getFieldProps("handle")}
                />
              </div>
            </div>
            {/* Password */}
            <div className="my-4">
              <label
                htmlFor="password"
                className="my-1 block text-sm font-medium text-gray-700 dark:text-gray-100"
              >
                Password
                {formik.touched.password && formik.errors.password ? (
                  <span className="text-red-500">{` - ${formik.errors.password}`}</span>
                ) : null}
              </label>
              <div className="">
                <input
                  id="password"
                  type={passwordField}
                  required
                  className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-500 dark:bg-gray-800 dark:text-gray-100 sm:text-sm"
                  {...formik.getFieldProps("password")}
                />
              </div>
              <input
                type="checkbox"
                onClick={togglePasswordField}
                className="my-2 h-4 w-4 rounded border-gray-300 bg-gray-200 text-indigo-600 focus:ring-indigo-500 dark:bg-gray-700"
              />
              <span className="m-2 text-sm font-medium text-gray-700 dark:text-gray-100">
                Show Password
              </span>
            </div>
            <div className="my-4 flex">
              <Switch
                checked={termsAccepted}
                onChange={setTermsAccepted}
                className={classNames(
                  termsAccepted ? "bg-indigo-600" : "bg-gray-200 dark:bg-gray-700",
                  "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0"
                )}
              >
                <span className="sr-only">Use setting</span>
                <span
                  className={classNames(
                    termsAccepted ? "translate-x-5" : "translate-x-0",
                    "pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                  )}
                >
                  <span
                    className={classNames(
                      termsAccepted
                        ? "opacity-0 duration-100 ease-out"
                        : "opacity-100 duration-200 ease-in",
                      "absolute inset-0 flex h-full w-full items-center justify-center transition-opacity"
                    )}
                    aria-hidden="true"
                  >
                    <Close size={32} className="h-3 w-3 stroke-current stroke-2 text-gray-400" />
                  </span>
                  <span
                    className={classNames(
                      termsAccepted
                        ? "opacity-100 duration-200 ease-in"
                        : "opacity-0 duration-100 ease-out",
                      "absolute inset-0 flex h-full w-full items-center justify-center transition-opacity"
                    )}
                    aria-hidden="true"
                  >
                    <Checkmark
                      size={32}
                      className="h-3 w-3 stroke-current stroke-2 text-indigo-600"
                    />
                  </span>
                </span>
              </Switch>
              <p className="mx-2 text-base font-normal text-gray-500 dark:text-gray-100">
                I agree to the{" "}
                <Link
                  href="/terms"
                  target="_blank"
                  className="text-gray-700  underline focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0 dark:text-gray-100"
                >
                  Terms of use
                </Link>{" "}
                and to the processing of my personal data according to the{" "}
                <Link
                  href="/privacy"
                  target="_blank"
                  className="text-gray-700  underline focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0 dark:text-gray-100"
                >
                  Privacy policy
                </Link>
              </p>
            </div>
            <div className="my-4 flex">
              <Switch
                checked={cocAccepted}
                onChange={setCocAccepted}
                className={classNames(
                  cocAccepted ? "bg-indigo-600" : "bg-gray-200 dark:bg-gray-700",
                  "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0"
                )}
              >
                <span className="sr-only">Use setting</span>
                <span
                  className={classNames(
                    cocAccepted ? "translate-x-5" : "translate-x-0",
                    "pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                  )}
                >
                  <span
                    className={classNames(
                      cocAccepted
                        ? "opacity-0 duration-100 ease-out"
                        : "opacity-100 duration-200 ease-in",
                      "absolute inset-0 flex h-full w-full items-center justify-center transition-opacity"
                    )}
                    aria-hidden="true"
                  >
                    <Close size={32} className="h-3 w-3 stroke-current stroke-2 text-gray-400" />
                  </span>
                  <span
                    className={classNames(
                      cocAccepted
                        ? "opacity-100 duration-200 ease-in"
                        : "opacity-0 duration-100 ease-out",
                      "absolute inset-0 flex h-full w-full items-center justify-center transition-opacity"
                    )}
                    aria-hidden="true"
                  >
                    <Checkmark
                      size={32}
                      className="h-3 w-3 stroke-current stroke-2 text-indigo-600"
                    />
                  </span>
                </span>
              </Switch>
              <p className="mx-2 text-base font-normal text-gray-500 dark:text-gray-100">
                I agree to the{" "}
                <Link
                  href={Routes.CodeOfConduct()}
                  target="_blank"
                  className="text-gray-700 underline focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0 dark:text-gray-100"
                >
                  Code of Conduct
                </Link>
              </p>
            </div>
            {termsAccepted && cocAccepted ? (
              <button
                type="submit"
                className="text-medium w-full rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-transparent"
              >
                Sign up
              </button>
            ) : (
              <button
                type="submit"
                className="text-medium w-full rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
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
