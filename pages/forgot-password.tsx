import Link from "next/link"
import { useMutation } from "@blitzjs/rpc"
import { BlitzPage, Routes } from "@blitzjs/next"
import Layout from "app/core/layouts/Layout"
import forgotPassword from "app/auth/mutations/forgotPassword"
import ResearchEqualsLogo from "app/core/components/ResearchEqualsLogo"
import { useFormik } from "formik"
import { z } from "zod"
import toast from "react-hot-toast"
import { validateZodSchema } from "blitz"

const ForgotPasswordPage: BlitzPage = () => {
  const [forgotPasswordMutation, { isSuccess }] = useMutation(forgotPassword)

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validate: validateZodSchema(
      z.object({
        email: z.string().email(),
      })
    ),
    onSubmit: async (values) => {
      toast
        .promise(forgotPasswordMutation(values), {
          loading: "Loading...",
          success: "Success!",
          error: "That did not work",
        })
        .catch((error) => {
          alert(error.toString())
        })
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
        <h1 className="mt-6 text-center text-3xl font-extrabold ">Forgot your password?</h1>
        {isSuccess ? (
          <div className="my-8 mx-auto rounded bg-white py-4 px-6 shadow dark:bg-gray-800">
            <div>
              <p className="block text-sm font-medium text-gray-700 dark:text-gray-100">
                If your email is in our system, you will receive instructions to reset your password
                shortly.
              </p>
            </div>
          </div>
        ) : (
          <div className="my-8 mx-auto rounded bg-white py-4 px-6 shadow dark:bg-gray-800">
            <form onSubmit={formik.handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className=" my-1 block text-sm font-medium text-gray-700 dark:text-gray-100"
                >
                  Email address{" "}
                  {formik.touched.email && formik.errors.email ? " - " + formik.errors.email : null}
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
              <button
                type="submit"
                className="text-medium w-full rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Send reset password instructions
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
    // <div>
    //   <h1>Forgot your password?</h1>

    //   {isSuccess ? (
    //     <div>
    //       <h2>Request Submitted</h2>
    //       <p>
    //         If your email is in our system, you will receive instructions to reset your password
    //         shortly.
    //       </p>
    //     </div>
    //   ) : (
    //     <Form
    //       submitText="Send Reset Password Instructions"
    //       schema={ForgotPassword}
    //       initialValues={{ email: "" }}
    //       onSubmit={async (values) => {
    //         try {
    //           await forgotPasswordMutation(values)
    //         } catch (error) {
    //           return {
    //             [FORM_ERROR]: "Sorry, we had an unexpected error. Please try again.",
    //           }
    //         }
    //       }}
    //     >
    //       <LabeledTextField name="email" label="Email" placeholder="Email" />
    //     </Form>
    //   )}
    // </div>
  )
}

ForgotPasswordPage.redirectAuthenticatedTo = "/"
ForgotPasswordPage.getLayout = (page) => <Layout title="Forgot Your Password?">{page}</Layout>

export default ForgotPasswordPage
