import { BlitzPage, useMutation } from "blitz"
import Layout from "app/core/layouts/Layout"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import { ChangePassword, ChangeEmail } from "app/auth/validations"

import Navbar from "../core/components/navbar"
import { Form, FORM_ERROR } from "../core/components/Form"
import changePassword from "app/auth/mutations/changePassword"
import changeEmail from "../users/mutations/changeEmail"

const SettingsPage: BlitzPage = () => {
  const [changePasswordMutation, { isSuccess: passwordChanged }] = useMutation(changePassword)
  const [changeEmailMutation, { isSuccess: emailChanged }] = useMutation(changeEmail)

  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto lg:relative pt-4">
        <div className="">
          <h1 className="font-bold text-6xl">Settings</h1>
          <h2 className="font-bold text-4xl">User</h2>
          <div>
            <h3 className="font-bold text-2xl">Email</h3>
            {emailChanged ? (
              <div>
                <h2>Email changed successfully</h2>
              </div>
            ) : (
              <Form
                className="m-0"
                submitText="Change email"
                schema={ChangeEmail}
                initialValues={{ email: "" }}
                onSubmit={async (values) => {
                  try {
                    await changeEmailMutation(values)
                  } catch (error) {
                    return {
                      [FORM_ERROR]: "Sorry, we had an unexpected error. Please try again.",
                    }
                  }
                }}
              >
                <LabeledTextField
                  className="w-full border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  name="email"
                  placeholder="Email"
                  type="email"
                  label="Email"
                />
              </Form>
            )}
          </div>
          <div>
            <h3 className="font-bold text-2xl">Password</h3>
            {passwordChanged ? (
              <div>
                <h2>Password changed successfully</h2>
              </div>
            ) : (
              <Form
                className="m-0"
                submitText="Change password"
                schema={ChangePassword}
                initialValues={{ currentPassword: "", newPassword: "" }}
                onSubmit={async (values) => {
                  try {
                    await changePasswordMutation(values)
                  } catch (error) {
                    if (error.name === "AuthenticationError") {
                      return {
                        [FORM_ERROR]: error.message,
                      }
                    } else {
                      return {
                        [FORM_ERROR]: "Sorry, we had an unexpected error. Please try again.",
                      }
                    }
                  }
                }}
              >
                <LabeledTextField
                  className="w-full border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  name="currentPassword"
                  placeholder="Password"
                  type="password"
                  label="Current password"
                />
                <LabeledTextField
                  className="w-full border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  name="newPassword"
                  placeholder="Password"
                  type="password"
                  label="New password"
                />
              </Form>
            )}
          </div>
          <h2>Workspace</h2>
        </div>
      </main>
    </>
  )
}

SettingsPage.authenticate = true
SettingsPage.getLayout = (page) => <Layout title="SettingsPage">{page}</Layout>

export default SettingsPage
