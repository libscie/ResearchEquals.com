import Link from "next/link";
import { useMutation } from "@blitzjs/rpc";
import { useRouter } from "next/router";
import { BlitzPage, Routes } from "@blitzjs/next";
import Layout from "app/core/layouts/Layout"
import resetPassword from "app/auth/mutations/resetPassword"
import ResearchEqualsLogo from "app/core/components/ResearchEqualsLogo"
import { z } from "zod"
import { useFormik } from "formik"
import toast from "react-hot-toast"
import { useEffect } from "react"

const ResetPasswordPage: BlitzPage = () => {
  const query = useRouter().query;
  const [resetPasswordMutation] = useMutation(resetPassword)
  const router = useRouter()

  // Redirect to home when no token is found
  useEffect(() => {
    if (!query.token) router.push("/").catch(() => {})
  })

  const formik = useFormik({
    initialValues: {
      password: "",
      passwordConfirmation: "",
      token: query.token as string,
    },
    validate: validateZodSchema(
      z.object({
        password: z.string().min(10),
        passwordConfirmation: z.string().min(10),
      })
    ),
    onSubmit: async (values) => {
      if (values.password !== values.passwordConfirmation) {
        toast.error("Passwords do not match")
      } else {
        toast
          .promise(resetPasswordMutation(values), {
            loading: "Resetting...",
            success: "Reset!",
            error: "Reset unsuccessful",
          })
          .catch((error) => {
            // TODO: Add better error logging
            alert(error.toString())
          })
      }
    },
  })

  return (
    <div className="flex min-h-screen flex-col justify-center bg-gray-100 py-12 text-gray-900 dark:bg-gray-900 dark:text-white sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href={Routes.Home()}>
          <a>
            <ResearchEqualsLogo />
          </a>
        </Link>
        <h1 className="mt-6 text-center text-3xl font-extrabold ">Reset password</h1>
        <div className="my-8 mx-auto rounded bg-white py-4 px-6 shadow dark:bg-gray-800">
          <form onSubmit={formik.handleSubmit}>
            <div className="">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-100"
              >
                New password{" "}
                {formik.touched.password && formik.errors.password
                  ? " - " + formik.errors.password
                  : null}
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  type="password"
                  autoComplete="password"
                  required
                  className="placeholder-font-normal block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-sm font-normal placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500  dark:border-gray-500 dark:bg-gray-800 "
                  {...formik.getFieldProps("password")}
                />
              </div>
            </div>
            <div className="my-4">
              <label
                htmlFor="password"
                className=" my-1 block text-sm font-medium text-gray-700 dark:text-gray-100"
              >
                Repeat new password{" "}
                {formik.touched.passwordConfirmation && formik.errors.passwordConfirmation
                  ? " - " + formik.errors.passwordConfirmation
                  : null}
              </label>
              <div className="mt-1">
                <input
                  id="passwordConfirmation"
                  type="password"
                  autoComplete="passwordConfirmation"
                  required
                  className="placeholder-font-normal block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-sm font-normal placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500  dark:border-gray-500 dark:bg-gray-800 "
                  {...formik.getFieldProps("passwordConfirmation")}
                />
              </div>
            </div>
            <button
              type="submit"
              className="text-medium w-full rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Reset and log in
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

ResetPasswordPage.redirectAuthenticatedTo = "/dashboard"
ResetPasswordPage.getLayout = (page) => <Layout title="Reset Your Password">{page}</Layout>

export default ResetPasswordPage
