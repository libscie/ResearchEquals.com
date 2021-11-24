import { AuthenticationError, Link, useMutation, Routes, validateZodSchema } from "blitz"
import login from "app/auth/mutations/login"
import { useFormik } from "formik"
import { z } from "zod"
import ResearchEqualsLogo from "app/core/components/ResearchEqualsLogo"

type LoginFormProps = {
  onSuccess?: () => void
}

export const LoginForm = (props: LoginFormProps) => {
  const [loginMutation] = useMutation(login)

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validate: validateZodSchema(
      z.object({
        email: z.string().email(),
        password: z.string(),
      })
    ),
    onSubmit: async (values) => {
      try {
        await loginMutation(values)
      } catch (error) {
        if (error instanceof AuthenticationError) {
          alert("Sorry, those credentials are invalid")
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
        <h1 className="mt-6 text-center text-3xl font-extrabold ">Log in to ResearchEquals</h1>
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
            <div className="text-indigo-600 text-center my-4 font-medium text-sm">
              <Link href={Routes.ForgotPasswordPage()}>
                <a>Forgot your password?</a>
              </Link>
            </div>
            <button
              type="submit"
              className="w-full px-3 py-2 border text-medium border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Log in
            </button>
          </form>
          <div className="text-gray-900 dark:text-white text-center my-4 font-medium text-sm">
            Do not have an account?{" "}
            <Link href={Routes.SignupPage()}>
              <a className="text-indigo-600">Sign up</a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginForm
