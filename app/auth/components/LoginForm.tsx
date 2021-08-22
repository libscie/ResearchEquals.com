import { AuthenticationError, Link, useMutation, Routes } from "blitz"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import { Form, FORM_ERROR } from "app/core/components/Form"
import login from "app/auth/mutations/login"
import { Login } from "app/auth/validations"

type LoginFormProps = {
  onSuccess?: () => void
}

export const LoginForm = (props: LoginFormProps) => {
  const [loginMutation] = useMutation(login)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <img
            className="mx-auto h-12 w-auto"
            src="https://raw.githubusercontent.com/libscie/design/afdb943134244050d2af9e28f4c7c34b32a73e2c/libscie-logomark.svg"
            alt="Workflow"
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Sign in to your account
          </h2>
        </div>
        <Form
          className="m-0"
          submitText="Login"
          schema={Login}
          initialValues={{ email: "", password: "" }}
          onSubmit={async (values) => {
            console.log(values)
            try {
              await loginMutation(values)
              props.onSuccess?.()
            } catch (error) {
              if (error instanceof AuthenticationError) {
                return { [FORM_ERROR]: "Sorry, those credentials are invalid" }
              } else {
                return {
                  [FORM_ERROR]:
                    "Sorry, we had an unexpected error. Please try again. - " + error.toString(),
                }
              }
            }
          }}
        >
          <LabeledTextField
            className="w-full border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            name="email"
            placeholder="Email"
            label="Email address"
          />
          <LabeledTextField
            className="w-full border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            name="password"
            placeholder="Password"
            type="password"
            label="Password"
          />
        </Form>
        <div className="text-sm">
          <p>
            <Link href={Routes.ForgotPasswordPage()}>
              <a className="font-medium text-indigo-600 hover:text-indigo-500">
                Forgot your password?
              </a>
            </Link>
          </p>
          <p>
            <Link href={Routes.SignupPage()}>
              <a className="font-medium text-indigo-600 hover:text-indigo-500">Sign up here</a>
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginForm
