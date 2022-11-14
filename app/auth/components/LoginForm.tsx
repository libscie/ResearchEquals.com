import Link from "next/link"
import { Routes } from "@blitzjs/next"
import { useMutation } from "@blitzjs/rpc"
import login from "app/auth/mutations/login"
import { useFormik } from "formik"
import { z } from "zod"
import ResearchEqualsLogo from "app/core/components/ResearchEqualsLogo"
import toast from "react-hot-toast"
import { validateZodSchema } from "blitz"

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
        password: z.string().min(10),
      })
    ),
    onSubmit: async (values) => {
      toast.promise(loginMutation(values), {
        loading: "Logging in...",
        success: "Logged in!",
        error: "Please check your log in credentials",
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
        <h1 className="mt-6 text-center text-3xl font-extrabold ">Log in to ResearchEquals</h1>
        <div className="my-8 mx-auto rounded bg-white py-4 px-6 shadow dark:bg-gray-800">
          <form onSubmit={formik.handleSubmit}>
            <div className="">
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
            {/* Password */}
            <div className="my-4">
              <label
                htmlFor="password"
                className="my-1 block text-sm font-medium text-gray-700 dark:text-gray-100"
              >
                Password{" "}
                {formik.touched.password && formik.errors.password
                  ? " - " + formik.errors.password
                  : null}
              </label>
              <div className="">
                <input
                  id="password"
                  type="password"
                  required
                  className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-500 dark:bg-gray-800 dark:text-gray-100 sm:text-sm"
                  {...formik.getFieldProps("password")}
                />
              </div>
            </div>
            <div className="my-4 text-center text-sm font-medium text-indigo-600 dark:text-gray-200">
              <Link href={Routes.ForgotPasswordPage()}>
                <a className="underline focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0">
                  Forgot your password?
                </a>
              </Link>
            </div>
            <button
              type="submit"
              className="text-medium w-full rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Log in
            </button>
          </form>
          <div className="mt-4 text-center text-sm font-medium text-gray-900 dark:text-white">
            Do not have an account?{" "}
            <Link href={Routes.SignupPage()}>
              <a className="text-indigo-600 underline focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0 dark:text-gray-200">
                Sign up
              </a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginForm
