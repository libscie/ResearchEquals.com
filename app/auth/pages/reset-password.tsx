import { BlitzPage, useRouterQuery, Link, useMutation, Routes, validateZodSchema } from "blitz"
import Layout from "app/core/layouts/Layout"
import resetPassword from "app/auth/mutations/resetPassword"
import ResearchEqualsLogo from "app/core/components/ResearchEqualsLogo"
import { z } from "zod"
import { useFormik } from "formik"
import toast from "react-hot-toast"

const ResetPasswordPage: BlitzPage = () => {
  const query = useRouterQuery()
  const [resetPasswordMutation] = useMutation(resetPassword)

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
        try {
          toast.promise(resetPasswordMutation(values), {
            loading: "Resetting...",
            success: "Reset!",
            error: "Reset unsuccessful",
          })
        } catch (error) {
          // TODO: Add better error logging
          alert(error.toString())
        }
      }
    },
  })

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href={Routes.Home()}>
          <a>
            <ResearchEqualsLogo />
          </a>
        </Link>
        <h1 className="mt-6 text-center text-3xl font-extrabold ">Reset password</h1>
        <div className="bg-white dark:bg-gray-800 shadow rounded py-4 px-6 my-8 mx-auto">
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
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:bg-gray-800 dark:border-gray-500 rounded-md shadow-sm placeholder-gray-400 placeholder-font-normal focus:outline-none focus:ring-indigo-500 focus:border-indigo-500  font-normal text-sm "
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
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:bg-gray-800 dark:border-gray-500 rounded-md shadow-sm placeholder-gray-400 placeholder-font-normal focus:outline-none focus:ring-indigo-500 focus:border-indigo-500  font-normal text-sm "
                  {...formik.getFieldProps("passwordConfirmation")}
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full px-3 py-2 border text-medium border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
