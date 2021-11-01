import { CheckmarkOutline32 } from "@carbon/icons-react"
import { useMutation, useQuery } from "blitz"
import { Widget } from "@uploadcare/react-widget"
import { useRef, Fragment, useState } from "react"
import { Dialog, Listbox, Menu, Transition } from "@headlessui/react"
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid"
import { XIcon } from "@heroicons/react/outline"

import SettingsModal from "../modals/settings"
import changeAvatar from "../../workspaces/mutations/changeAvatar"
import CreateModuleForm from "../../modules/components/CreateModuleForm"
import getSignature from "../../auth/queries/getSignature"

const OnboardingQuests = ({ data }) => {
  return (
    <>
      <OnboardingAvatar data={data.workspace} />
      <OnboardingOrcid data={data.workspace.orcid} />
      <OnboardingProfile data={data} />
      <OnboardingDraft data={data.workspace} />
      {/* TODO: Add first draft quest */}
    </>
  )
}

export default OnboardingQuests

const OnboardingOrcid = ({ data }) => {
  return (
    <>
      {!data ? (
        <div
          key="orcid-onboarding-quest"
          className="rounded-md bg-blue-50 p-4 my-2 sm:my-0 sm:mr-2 w-full"
        >
          <div className="flex">
            <div className="">
              <CheckmarkOutline32 className="h-5 w-5 text-green-400" aria-hidden="true" />
            </div>
            <div className="ml-3 flex-1 md:flex">
              <p className="text-sm text-blue-700 mr-2">
                <span className=" font-bold">Connect your ORCID account</span>{" "}
                <span>
                  Make sure your modules get linked to your ORCID account. This helps you easily
                  track your publications.
                </span>
              </p>
            </div>
          </div>
          <div className="block text-right">
            <p className="mt-3 text-sm md:mt-0 md:ml-6">
              <a
                href="/api/auth/orcid"
                className="whitespace-nowrap font-medium text-blue-700 hover:text-blue-600 underline"
              >
                Connect now <span aria-hidden="true">&rarr;</span>
              </a>
            </p>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  )
}

const OnboardingProfile = ({ data }) => {
  return (
    <>
      {!data.workspace.name ? (
        <div
          key="profile-onboarding-quest"
          className="rounded-md bg-blue-50 p-4 my-2 sm:my-0 sm:mr-2 w-full"
        >
          <div className="flex">
            <div className="">
              <CheckmarkOutline32 className="h-5 w-5 text-green-400" aria-hidden="true" />
            </div>
            <div className="ml-3 flex-1 md:flex">
              <p className="text-sm text-blue-700 mr-2">
                <span className=" font-bold">Complete your profile</span>{" "}
                <span>
                  Make sure people get to know who they are working with. Help them understand where
                  you are coming from. Add your name, bio, and pronouns.
                </span>
              </p>
            </div>
          </div>
          <div className=" text-right">
            <p className="mt-3 text-sm md:mt-0 md:ml-6">
              <SettingsModal
                styling="whitespace-nowrap font-medium text-blue-700 hover:text-blue-600 underline"
                button={
                  <>
                    Add information <span aria-hidden="true">&rarr;</span>
                  </>
                }
                user={data.user}
                workspace={data.workspace}
              />
            </p>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  )
}

const OnboardingAvatar = ({ data }) => {
  const [changeAvatarMutation] = useMutation(changeAvatar)
  const [uploadSecret] = useQuery(getSignature, undefined)
  const widgetApi = useRef()

  return (
    <>
      {!data.avatar ? (
        <div
          key="avatar-onboarding-quest"
          className="rounded-md bg-blue-50 p-4 my-2 sm:my-0 sm:mr-2 w-full"
        >
          <div className="flex">
            <div className="">
              <CheckmarkOutline32 className="h-5 w-5 text-green-400" aria-hidden="true" />
            </div>
            <div className="ml-3 flex-1 md:flex">
              <p className="text-sm text-blue-700 mr-2">
                <span className=" font-bold">Add an avatar</span> <span>Yes, just upload.</span>
              </p>
            </div>
          </div>
          <div className="block text-right">
            <p className="mt-3 text-sm md:mt-0 md:ml-6">
              <button
                className="whitespace-nowrap font-medium text-blue-700 hover:text-blue-600 underline"
                onClick={() => {
                  widgetApi.current.openDialog()
                }}
              >
                Upload avatar <span aria-hidden="true">&rarr;</span>
              </button>
              <Widget
                publicKey={process.env.UPLOADCARE_PUBLIC_KEY ?? ""}
                secureSignature={uploadSecret.signature}
                secureExpire={uploadSecret.expire}
                crop="1:1"
                ref={widgetApi}
                imageShrink="480x480"
                imagesOnly
                previewStep
                clearable
                onChange={async (info) => {
                  try {
                    alert(data.handle)
                    alert(info.cdnUrl)
                    await changeAvatarMutation({
                      handle: data.handle,
                      avatar: info.cdnUrl,
                    })
                  } catch (err) {
                    alert(err)
                  }
                }}
              />
            </p>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  )
}

const OnboardingDraft = ({ data }) => {
  const [openCreate, setCreateOpen] = useState(false)

  return (
    <>
      {!data.authorships.length > 0 ? (
        <div
          key="draft-onboarding-quest"
          className="rounded-md bg-blue-50 p-4 my-2 sm:my-0 sm:mr-2 w-full"
        >
          <div className="flex">
            <div className="">
              <CheckmarkOutline32 className="h-5 w-5 text-green-400" aria-hidden="true" />
            </div>
            <div className="ml-3 flex-1 md:flex">
              <p className="text-sm text-blue-700 mr-2">
                <span className=" font-bold">Create first draft</span> <span>PLACEHOLDER</span>
              </p>
            </div>
          </div>
          <div className="block text-right">
            <p className="mt-3 text-sm md:mt-0 md:ml-6">
              <button
                onClick={() => {
                  setCreateOpen(true)
                }}
                className="whitespace-nowrap font-medium text-blue-700 hover:text-blue-600 underline"
              >
                Create module <span aria-hidden="true">&rarr;</span>
              </button>
              <Transition.Root show={openCreate} as={Fragment}>
                <Dialog as="div" className="fixed inset-0 overflow-hidden" onClose={setCreateOpen}>
                  <div className="absolute inset-0 overflow-hidden">
                    <Dialog.Overlay className="absolute inset-0" />

                    <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex sm:pl-16">
                      <Transition.Child
                        as={Fragment}
                        enter="transform transition ease-in-out duration-500 sm:duration-700"
                        enterFrom="translate-x-full"
                        enterTo="translate-x-0"
                        leave="transform transition ease-in-out duration-500 sm:duration-700"
                        leaveFrom="translate-x-0"
                        leaveTo="translate-x-full"
                      >
                        <div className="w-screen max-w-2xl">
                          <div className="h-full flex flex-col py-0 bg-white shadow-xl overflow-y-scroll">
                            <div className="px-4 sm:px-6 py-6 bg-indigo-600">
                              <div className="flex items-start justify-between">
                                <Dialog.Title className="text-lg font-medium text-white">
                                  Create research module
                                </Dialog.Title>
                                <div className="ml-3 h-7 flex items-center">
                                  <button
                                    type="button"
                                    className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    onClick={() => setCreateOpen(false)}
                                  >
                                    <span className="sr-only">Close panel</span>
                                    <XIcon className="h-6 w-6" aria-hidden="true" />
                                  </button>
                                </div>
                              </div>
                            </div>
                            <div className="mt-6 relative flex-1 px-4 sm:px-6">
                              <CreateModuleForm workspace={data} />
                            </div>
                          </div>
                        </div>
                      </Transition.Child>
                    </div>
                  </div>
                </Dialog>
              </Transition.Root>
            </p>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  )
}
