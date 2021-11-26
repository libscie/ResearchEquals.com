import { CheckmarkOutline32 } from "@carbon/icons-react"
import { useMutation, useQuery } from "blitz"
import { Widget } from "@uploadcare/react-widget"
import { useRef, Fragment, useState } from "react"
import { Dialog, Listbox, Menu, Transition } from "@headlessui/react"
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid"
import { XIcon } from "@heroicons/react/outline"

import SettingsModal from "../modals/settings"
import changeAvatar from "../../workspaces/mutations/changeAvatar"
import getSignature from "../../auth/queries/getSignature"
import QuickDraft from "../../modules/components/QuickDraft"

const OnboardingQuests = ({ data }) => {
  return (
    <>
      <OnboardingOrcid data={data.workspace.orcid} />
      <OnboardingAvatar data={data.workspace} />
      <OnboardingProfile data={data} />
      <OnboardingDraft data={data.workspace} />
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
          className="flex flex-col bg-gray-100 p-4 my-2 sm:my-0 sm:mr-2 w-full"
        >
          <div className="flex flex-grow">
            <div className="">
              <CheckmarkOutline32 className="h-5 w-5 text-black opacity-50" aria-hidden="true" />
            </div>
            <div className="ml-3 flex-1 md:flex">
              <p className="text-sm mr-2">
                <span className="font-bold">Connect your ORCID</span>{" "}
                <span>
                  This updates your name, helps track publications, and is required to publish on
                  ResearchEquals.
                </span>
              </p>
            </div>
          </div>
          <div className="block text-right">
            <p className="mt-3 text-sm md:mt-0 md:ml-6">
              <a href="/api/auth/orcid" className="whitespace-nowrap font-medium  underline">
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
      {!data.workspace.bio ? (
        <div
          key="profile-onboarding-quest"
          className="flex flex-col bg-gray-100 p-4 my-2 sm:my-0 sm:mr-2 w-full"
        >
          <div className="flex flex-grow">
            <div className="">
              <CheckmarkOutline32 className="h-5 w-5 text-black opacity-50" aria-hidden="true" />
            </div>
            <div className="ml-3 flex-1 md:flex">
              <p className="text-sm mr-2">
                <span className=" font-bold">Add your info</span>{" "}
                <span>
                  Make sure people know who you are. Add your bio, pronouns, and a link to your
                  website.
                </span>
              </p>
            </div>
          </div>
          <div className=" text-right">
            <p className="mt-3 text-sm md:mt-0 md:ml-6">
              <SettingsModal
                styling="whitespace-nowrap font-medium hover:text-blue-600 underline"
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
      {!data.avatar.match(/ucarecdn/g) ? (
        <div
          key="avatar-onboarding-quest"
          className="flex flex-col bg-gray-100 p-4 my-2 sm:my-0 sm:mr-2 w-full"
        >
          <div className="flex flex-grow">
            <div className="">
              <CheckmarkOutline32 className="h-5 w-5 text-black  opacity-50" aria-hidden="true" />
            </div>
            <div className="ml-3 flex-1 md:flex">
              <p className="text-sm mr-2">
                <span className=" font-bold">Add an avatar</span>{" "}
                <span>Help people recognize you throughout ResearchEquals.</span>
              </p>
            </div>
          </div>
          <div className="block text-right">
            <p className="mt-3 text-sm md:mt-0 md:ml-6">
              <button
                className="whitespace-nowrap font-medium hover:text-blue-600 underline"
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
                    console.log(JSON.stringify(info))
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
          className="flex flex-col bg-gray-100 p-4 my-2 sm:my-0 sm:mr-2 w-full"
        >
          <div className="flex flex-grow">
            <div className="">
              <CheckmarkOutline32 className="h-5 w-5 text-black  opacity-50" aria-hidden="true" />
            </div>
            <div className="ml-3 flex-1 md:flex">
              <p className="text-sm mr-2">
                <span className=" font-bold">Create your first module</span>{" "}
                <span>
                  What are you working on today? All research steps are building blocks. Start
                  sharing your progress.
                </span>
              </p>
            </div>
          </div>
          <div className="block text-right">
            <p className="mt-3 text-sm md:mt-0 md:ml-6">
              <QuickDraft
                buttonText={
                  <>
                    Create module <span aria-hidden="true">&rarr;</span>
                  </>
                }
                buttonStyle="whitespace-nowrap font-medium hover:text-blue-600 underline"
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
