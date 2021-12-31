import { AuthenticationError, BlitzPage, useMutation, validateZodSchema } from "blitz"
import Layout from "app/core/layouts/Layout"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import { Form, FORM_ERROR } from "app/core/components/Form"
import { ForgotPassword } from "app/auth/validations"
import forgotPassword from "app/auth/mutations/forgotPassword"
import ResearchEqualsLogo from "app/core/components/ResearchEqualsLogo"
import { useFormik } from "formik"
import { z } from "zod"

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
      try {
        await forgotPasswordMutation(values)
      } catch (error) {
        alert(error.toString())
      }
    },
  })

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <ResearchEqualsLogo />
        <h1 className="mt-6 text-center text-3xl font-extrabold ">Forgot your password?</h1>
        {isSuccess ? (
          <div className="bg-white dark:bg-gray-800 shadow rounded py-4 px-6 my-8  mx-auto">
            <div className="my-4">
              <p className=" my-1 block text-sm font-medium text-gray-700 dark:text-gray-100">
                If your email is in our system, you will receive instructions to reset your password
                shortly.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 shadow rounded py-4 px-6 my-8  mx-auto">
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
              <button
                type="submit"
                className="w-full px-3 py-2 border text-medium border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
