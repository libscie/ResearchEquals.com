import { useMutation, useRouter, Link, useQuery } from "blitz"
import { Dialog, Transition } from "@headlessui/react"
import { Fragment, useState } from "react"
import { Widget } from "@uploadcare/react-widget"
import changePassword from "app/auth/mutations/changePassword"
import changeBio from "app/workspaces/mutations/changeBio"
import changeEmail from "app/users/mutations/changeEmail"
import changeName from "app/users/mutations/changeName"
import changePronouns from "app/workspaces/mutations/changePronouns"
import deleteUser from "app/users/mutations/deleteUser"
import changeAvatar from "app/workspaces/mutations/changeAvatar"
import { Form, FORM_ERROR } from "../components/Form"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import { ChangePassword, ChangeEmail, ChangeName } from "app/auth/validations"
import DeleteModal from "./delete"
import getSignature from "../queries/getSignature"

export default function SettingsModal({ user, workspace }) {
  let [isOpen, setIsOpen] = useState(false)
  const [changePasswordMutation, { isSuccess: passwordChanged }] = useMutation(changePassword)
  const [changeEmailMutation, { isSuccess: emailChanged }] = useMutation(changeEmail)
  const [changeNameMutation, { isSuccess: nameChanged }] = useMutation(changeName)
  const [changeAvatarMutation, { isSuccess: avatarChanged }] = useMutation(changeAvatar)
  const [changeBioMutation, { isSuccess: bioChanged }] = useMutation(changeBio)
  const [changePronounsMutation, { isSuccess: pronounsChanged }] = useMutation(changePronouns)
  const [deleteUserMutation] = useMutation(deleteUser)
  const router = useRouter()
  const [uploadSecret] = useQuery(getSignature)

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setIsOpen(true)
        }}
        className="ml-2 px-4 py-2 text-white bg-black rounded-md bg-opacity-20 hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 "
      >
        Settings
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={() => {
            setIsOpen(false)
          }}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span className="inline-block h-screen align-middle" aria-hidden="true">
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <Dialog.Title as="h1" className="text-lg font-medium leading-6 text-gray-900">
                  Settings
                </Dialog.Title>
                <div className="mt-2">
                  <h2>User</h2>
                  <div>
                    <h3 className="font-bold text-2xl">Name</h3>
                    {nameChanged ? (
                      <div>
                        <h2>Name changed successfully</h2>
                      </div>
                    ) : (
                      <Form
                        className="m-0"
                        submitText="Change name"
                        schema={ChangeName}
                        initialValues={{ name: user!.name! ?? "" }}
                        onSubmit={async (values) => {
                          try {
                            await changeNameMutation(values)
                          } catch (error) {
                            return {
                              [FORM_ERROR]: "Sorry, we had an unexpected error. Please try again.",
                            }
                          }
                        }}
                      >
                        <LabeledTextField
                          className="w-full border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                          name="name"
                          placeholder="Name"
                          label="Name"
                        />
                      </Form>
                    )}
                  </div>
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
                        initialValues={{ email: user!.email! }}
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
                        initialValues={{ currentPassword: "", newPassword: "", newRepeat: "" }}
                        onSubmit={async (values) => {
                          if (values.newPassword !== values.newRepeat) {
                            return {
                              [FORM_ERROR]: "Please check the new password for typo's",
                            }
                          }
                          try {
                            await changePasswordMutation(values)
                          } catch (error) {
                            if (error.name === "AuthenticationError") {
                              return {
                                [FORM_ERROR]: error.message,
                              }
                            } else {
                              return {
                                [FORM_ERROR]:
                                  "Sorry, we had an unexpected error. Please try again.",
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
                        <LabeledTextField
                          className="w-full border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                          name="newRepeat"
                          placeholder="Password"
                          type="password"
                          label="Repeat new password"
                        />
                      </Form>
                    )}
                  </div>
                </div>
                <h2 className="font-bold text-4xl">Workspace</h2>
                <div>
                  <h3 className="font-bold text-2xl">Avatar</h3>
                  {avatarChanged ? (
                    <div>
                      <h2>Avatar changed successfully</h2>
                    </div>
                  ) : (
                    <Widget
                      publicKey={process.env.UPLOADCARE_PUBLIC_KEY ?? ""}
                      secureSignature={uploadSecret.signature}
                      secureExpire={uploadSecret.expire}
                      crop="1:1"
                      imageShrink="480x480"
                      imagesOnly
                      previewStep
                      clearable
                      systemDialog
                      onChange={async (info) => {
                        try {
                          // TODO: Remove old avatar from uploadcare after successfully updating
                          // TODO: Secure uploading
                          // https://uploadcare.com/docs/security/secure-uploads/
                          await changeAvatarMutation({
                            handle: workspace!.handle,
                            avatar: info.cdnUrl ?? "",
                          })
                        } catch (err) {
                          alert(err)
                        }
                        console.log("Upload completed:", info)
                      }}
                    />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-2xl">Bio</h3>
                  {bioChanged ? (
                    <div>
                      <h2>Bio changed successfully</h2>
                    </div>
                  ) : (
                    <Form
                      className="m-0"
                      submitText="Change bio"
                      initialValues={{ bio: workspace!.bio }}
                      onSubmit={async (values) => {
                        try {
                          await changeBioMutation({
                            handle: workspace!.handle,
                            bio: values.bio,
                          })
                        } catch (error) {
                          return {
                            [FORM_ERROR]: "Sorry, we had an unexpected error. Please try again.",
                          }
                        }
                      }}
                    >
                      <LabeledTextField
                        className="w-full border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        name="bio"
                        placeholder="Bio"
                        type="text"
                        label="Current Bio"
                      />
                    </Form>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-2xl">Pronouns</h3>
                  {pronounsChanged ? (
                    <div>
                      <h2>Pronouns changed successfully</h2>
                    </div>
                  ) : (
                    <Form
                      className="m-0"
                      submitText="Change pronouns"
                      initialValues={{ pronouns: workspace!.pronouns }}
                      onSubmit={async (values) => {
                        try {
                          await changePronounsMutation({
                            handle: workspace!.handle,
                            pronouns: values.pronouns,
                          })
                        } catch (error) {
                          return {
                            [FORM_ERROR]: "Sorry, we had an unexpected error. Please try again.",
                          }
                        }
                      }}
                    >
                      <LabeledTextField
                        className="w-full border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        name="pronouns"
                        placeholder="Pronouns"
                        type="text"
                        label="Current pronouns"
                      />
                    </Form>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-2xl">Affiliation</h3>
                </div>
                <div>
                  <h3 className="font-bold text-2xl">ORCID</h3>
                  {!workspace!.orcid ? (
                    <Link href="/api/auth/orcid">
                      <a>Add ORCID</a>
                    </Link>
                  ) : (
                    <p>{workspace!.orcid}</p>
                  )}
                </div>
                <DeleteModal />
                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                    onClick={() => {
                      setIsOpen(false)
                    }}
                  >
                    Got it, thanks!
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
