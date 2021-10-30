import { CheckmarkOutline32 } from "@carbon/icons-react"
import { useMutation, useQuery } from "blitz"
import { Widget } from "@uploadcare/react-widget"
import { useRef } from "react"

import SettingsModal from "../modals/settings"
import changeAvatar from "../../workspaces/mutations/changeAvatar"
import getSignature from "../queries/getSignature"

const OnboardingQuests = ({ data }) => {
  return (
    <>
      <OnboardingAvatar data={data.workspace} />
      <OnboardingOrcid data={data.workspace.orcid} />
      <OnboardingProfile data={data} />
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
