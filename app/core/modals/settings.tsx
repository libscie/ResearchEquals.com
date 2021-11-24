import { useMutation, useRouter, Link, useQuery } from "blitz"
import { Dialog, Transition, Tab } from "@headlessui/react"
import { Fragment, useState } from "react"
import { Widget } from "@uploadcare/react-widget"
import changePassword from "app/auth/mutations/changePassword"
import changeBio from "app/workspaces/mutations/changeBio"
import changeEmail from "app/users/mutations/changeEmail"
import changeName from "app/users/mutations/changeName"
import changePronouns from "app/workspaces/mutations/changePronouns"
import deleteUser from "app/users/mutations/deleteUser"
import changeAvatar from "app/workspaces/mutations/changeAvatar"
import { XIcon } from "@heroicons/react/solid"

import { Form, FORM_ERROR } from "../components/Form"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import { ChangePassword, ChangeEmail, ChangeName } from "app/auth/validations"
import DeleteModal from "./delete"
import getSignature from "../../auth/queries/getSignature"

function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}

export default function SettingsModal({ button, styling, user, workspace }) {
  let [isOpen, setIsOpen] = useState(false)
  let [categories] = useState(["Workspace", "Account", "Billing"])

  const [changePasswordMutation, { isSuccess: passwordChanged }] = useMutation(changePassword)
  const [changeEmailMutation] = useMutation(changeEmail)
  const [changeNameMutation, { isSuccess: nameChanged }] = useMutation(changeName)
  const [changeAvatarMutation, { isSuccess: avatarChanged }] = useMutation(changeAvatar)
  const [changeBioMutation, { isSuccess: bioChanged }] = useMutation(changeBio)
  const [changePronounsMutation, { isSuccess: pronounsChanged }] = useMutation(changePronouns)
  const [uploadSecret] = useQuery(getSignature, undefined)

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setIsOpen(true)
        }}
        className={styling}
      >
        {button}
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed  inset-0 z-10 overflow-y-auto"
          onClose={() => {
            setIsOpen(false)
          }}
        >
          <div className="min-h-screen px-4 sm:px-0 text-center">
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
            <span className="inline-block h-screen max-h-screen align-middle" aria-hidden="true">
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
              <div className="inline-block sm:min-w-120 sm:max-w-120 max-h-120 px-6 overflow-y-scroll text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <div className="sm:w-120 sm:h-120">
                  <Tab.Group>
                    <Dialog.Title
                      as="div"
                      className="text-lg font-medium leading-6 text-gray-900 sticky top-0 pt-4 bg-white"
                    >
                      <Tab.List className="flex p-1 space-x-1 bg-indigo-900/20 rounded-xl  bg-white z-10">
                        {categories.map((category) => (
                          <Tab
                            key={category}
                            className={({ selected }) =>
                              classNames(
                                "w-full py-2.5 text-sm leading-5 font-medium text-indigo-700 rounded-lg",
                                "focus:outline-none focus:ring-2 ring-offset-2 ring-offset-indigo-400 ring-white ring-opacity-60 bg-white",
                                selected
                                  ? "bg-white shadow"
                                  : "text-indigo-100 hover:bg-white/[0.12] hover:text-white"
                              )
                            }
                          >
                            {category}
                          </Tab>
                        ))}
                        <button className="rounded-md p-2 inline-flex items-center justify-center text-gray-500 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                          <span className="sr-only">Close menu</span>
                          <XIcon
                            className="h-6 w-6"
                            aria-hidden="true"
                            onClick={() => {
                              setIsOpen(false)
                            }}
                          />
                        </button>
                      </Tab.List>
                    </Dialog.Title>

                    <Tab.Panels className="mt-2 mb-0">
                      <Tab.Panel
                        key="workspace-panel"
                        className={classNames(
                          "bg-white rounded-xl p-3",
                          "focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60"
                        )}
                      >
                        <div className="flex">
                          <img
                            src={workspace!.avatar}
                            width={120}
                            height={120}
                            className="rounded-full"
                          />
                          <div className="mx-2 align-center justify-center justify-items-center">
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
                        </div>
                        <div className="my-2">
                          <h3 className="font-bold text-2xl">ORCID</h3>
                          {!workspace!.orcid ? (
                            <Link href="/api/auth/orcid">
                              <button className="py-2 px-4 bg-green-500 rounded text-white">
                                Connect your ORCID
                              </button>
                            </Link>
                          ) : (
                            <p>{workspace!.orcid}</p>
                          )}
                        </div>
                        <div>
                          <Form
                            className="m-0"
                            // submitText="Change name"
                            // schema={ChangeName}
                            initialValues={{
                              name: workspace!.name! ?? "",
                              bio: workspace!.bio,
                              pronouns: workspace!.pronouns,
                            }}
                            onSubmit={async (values) => {
                              try {
                                await changeNameMutation({ name: values.name })
                                await changeBioMutation({
                                  handle: workspace!.handle,
                                  bio: values.bio,
                                })
                                await changePronounsMutation({
                                  handle: workspace!.handle,
                                  pronouns: values.pronouns,
                                })
                              } catch (error) {
                                return {
                                  [FORM_ERROR]:
                                    "Sorry, we had an unexpected error. Please try again.",
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
                            <LabeledTextField
                              className="w-full border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                              name="bio"
                              placeholder="Bio"
                              type="text"
                              label="Current Bio"
                            />
                            <LabeledTextField
                              className="w-full border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                              name="pronouns"
                              placeholder="Pronouns"
                              type="text"
                              label="Current pronouns"
                            />
                            <div className="bg-white sticky bottom-0 pb-4">
                              <button
                                type="submit"
                                className="bg-green-300 rounded py-2 px-4 text-white"
                              >
                                Save
                              </button>
                              <button
                                className="bg-red-300 rounded py-2 mt-2 ml-2 px-4 text-white"
                                onClick={() => {
                                  setIsOpen(false)
                                }}
                              >
                                Cancel
                              </button>
                            </div>
                          </Form>
                        </div>
                      </Tab.Panel>
                      <Tab.Panel
                        key="account-panel"
                        className={classNames(
                          "bg-white rounded-xl p-3",
                          "focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60"
                        )}
                      >
                        <div>
                          <Form
                            className="m-0"
                            // submitText="Change password"
                            // schema={ChangePassword}
                            initialValues={{
                              email: user!.email!,
                              currentPassword: "",
                              newPassword: "",
                              newRepeat: "",
                            }}
                            onSubmit={async (values) => {
                              try {
                                if (user!.email! !== values.email) {
                                  await changeEmailMutation(values)
                                }
                              } catch (error) {
                                return {
                                  [FORM_ERROR]:
                                    "Sorry, we had an unexpected error. Please try again.",
                                }
                              }

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
                              name="email"
                              placeholder="Email"
                              type="email"
                              label="Email"
                            />
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
                            <DeleteModal />
                            {/* text-center */}
                            <div className="bg-white sticky bottom-0 pb-4">
                              <button
                                type="submit"
                                className="bg-green-300 rounded py-2 px-4 text-white"
                              >
                                Save
                              </button>
                              <button
                                className="bg-red-300 rounded py-2 mt-2 ml-2 px-4 text-white"
                                onClick={() => {
                                  setIsOpen(false)
                                }}
                              >
                                Cancel
                              </button>
                            </div>
                          </Form>
                        </div>
                      </Tab.Panel>
                      <Tab.Panel
                        key="billing-panel"
                        className={classNames(
                          "bg-white rounded-xl p-3",
                          "focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60"
                        )}
                      ></Tab.Panel>
                    </Tab.Panels>
                  </Tab.Group>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
