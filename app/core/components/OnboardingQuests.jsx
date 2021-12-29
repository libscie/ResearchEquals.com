import { CheckmarkOutline32 } from "@carbon/icons-react"
import { useMutation, useQuery } from "blitz"
import { Widget } from "@uploadcare/react-widget"
import { useRef, Fragment, useState } from "react"
import { Dialog, Listbox, Menu, Transition } from "@headlessui/react"
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid"
import { MailIcon, UserCircleIcon, UserIcon, VariableIcon, XIcon } from "@heroicons/react/outline"
import { Formik, Form } from "formik"

import SettingsModal from "../modals/settings"
import changeAvatar from "../../workspaces/mutations/changeAvatar"
import getSignature from "../../auth/queries/getSignature"
import QuickDraft from "../../modules/components/QuickDraft"
import resendVerification from "../../auth/mutations/resendVerification"

const OnboardingQuests = ({ data }) => {
  return (
    <>
      <OnboardingEmail data={data.user.emailIsVerified} />
      <OnboardingOrcid data={data.workspace.orcid} />
      <OnboardingAvatar data={data.workspace} />
      <OnboardingProfile data={data} />
      <OnboardingDraft data={data.workspace} />
    </>
  )
}

export default OnboardingQuests

const OnboardingEmail = ({ data }) => {
  const [resendVerificationMutation, { isSuccess }] = useMutation(resendVerification)
  return (
    <>
      {!data ? (
        <div
          key="orcid-onboarding-quest"
          className="onboarding flex flex-col bg-yellow-50 dark:bg-yellow-900 p-4 my-2 lg:my-0 sm:mr-2 w-full border-l-4 border-yellow-400 dark:border-yellow-200 rounded-r"
        >
          <div className="flex flex-grow">
            <div className="">
              <MailIcon
                className="h-5 w-5 text-yellow-400 dark:text-yellow-200"
                aria-hidden="true"
              />
            </div>
            <div className="ml-3 flex-1 md:flex text-yellow-800 dark:text-yellow-200">
              <p className="text-sm mr-2">
                <span className="font-bold">Verify your email</span>{" "}
                <span>Please check your inbox to verify your email address.</span>
              </p>
            </div>
          </div>
          <div className="block text-right text-yellow-700 dark:text-yellow-200">
            <p className="mt-3 text-sm md:mt-0 md:ml-6">
              {isSuccess ? (
                <p className="whitespace-nowrap font-medium  underline">Email sent!</p>
              ) : (
                <Formik
                  initialValues={{}}
                  onSubmit={async () => {
                    try {
                      await resendVerificationMutation()
                    } catch (error) {
                      alert("Error saving product")
                    }
                  }}
                >
                  <Form>
                    <button className="whitespace-nowrap font-medium  underline" type="submit">
                      Send again <span aria-hidden="true">&rarr;</span>
                    </button>
                  </Form>
                </Formik>
              )}
            </p>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  )
}

const OnboardingOrcid = ({ data }) => {
  return (
    <>
      {!data ? (
        <div
          key="orcid-onboarding-quest"
          className="onboarding flex flex-col bg-green-50 dark:bg-green-900 p-4 my-2 lg:my-0 sm:mr-2 w-full border-l-4 border-green-400 dark:border-green-200 rounded-r"
        >
          <div className="flex flex-grow">
            <div className="">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 fill-current text-green-400 dark:text-green-200 "
                aria-hidden="true"
              >
                <path d="M12.6007 8.01734C12.3707 7.91001 12.1533 7.838 11.9473 7.804C11.742 7.76868 11.4127 7.752 10.9567 7.752H9.77266V12.6793H10.9867C11.46 12.6793 11.828 12.6467 12.0907 12.582C12.3533 12.5173 12.572 12.436 12.7473 12.336C12.9227 12.2367 13.0833 12.1147 13.2293 11.9687C13.6967 11.494 13.9307 10.8953 13.9307 10.1713C13.9307 9.45998 13.6907 8.87932 13.21 8.42998C13.0327 8.26331 12.8287 8.12531 12.6007 8.0173V8.01734ZM10 2C5.58134 2 2 5.582 2 10C2 14.418 5.58134 18 10 18C14.4187 18 18 14.418 18 10C18 5.582 14.4187 2 10 2ZM7.34399 13.5327H6.39598V6.908H7.34399V13.5327ZM6.86934 6.21601C6.51001 6.21601 6.21734 5.92534 6.21734 5.564C6.21734 5.20534 6.50933 4.91268 6.86934 4.91268C7.23 4.91268 7.522 5.20467 7.522 5.564C7.52129 5.926 7.23 6.21601 6.86934 6.21601ZM14.656 11.4933C14.4853 11.898 14.242 12.254 13.9253 12.5607C13.6033 12.878 13.2287 13.1153 12.8013 13.2767C12.5514 13.374 12.3227 13.44 12.114 13.474C11.9047 13.5067 11.5067 13.5227 10.918 13.5227H8.82269V6.908H11.056C11.958 6.908 12.67 7.04201 13.1954 7.31267C13.72 7.58266 14.1367 7.98134 14.4467 8.50534C14.7567 9.03001 14.912 9.60268 14.912 10.2213C14.9128 10.6653 14.826 11.0893 14.656 11.4933H14.656Z" />
              </svg>
            </div>
            <div className="ml-3 flex-1 md:flex text-green-800 dark:text-green-200">
              <p className="text-sm mr-2">
                <span className="font-bold">Connect your ORCID</span>{" "}
                <span>
                  This updates your name, helps track publications, and is required to publish on
                  ResearchEquals.
                </span>
              </p>
            </div>
          </div>
          <div className="block text-right text-green-700 dark:text-green-200">
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
          key="onboarding profile-onboarding-quest"
          className="onboarding flex flex-col bg-pink-50 dark:bg-pink-900 p-4 my-2 lg:my-0 sm:mr-2 w-full border-l-4 border-pink-400 dark:border-pink-200 rounded-r"
        >
          <div className="flex flex-grow">
            <div className="">
              <UserIcon className="h-5 w-5 text-pink-400 dark:text-pink-200" aria-hidden="true" />
            </div>
            <div className="ml-3 flex-1 md:flex text-pink-800 dark:text-pink-200">
              <p className="text-sm mr-2">
                <span className=" font-bold">Add your info</span>{" "}
                <span>
                  Make sure people know who you are. Add your bio, pronouns, and a link to your
                  website.
                </span>
              </p>
            </div>
          </div>
          <div className="block text-right text-pink-700 dark:text-pink-200">
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
          className="onboarding flex flex-col bg-indigo-50 dark:bg-indigo-900 p-4 my-2 lg:my-0 sm:mr-2 w-full border-l-4 border-indigo-400 dark:border-indigo-200 rounded-r"
        >
          <div className="flex flex-grow">
            <div className="">
              <UserCircleIcon
                className="h-5 w-5 text-indigo-400 dark:text-indigo-200"
                aria-hidden="true"
              />
            </div>
            <div className="ml-3 flex-1 md:flex text-indigo-800 dark:text-indigo-200">
              <p className="text-sm mr-2">
                <span className=" font-bold">Add an avatar</span>{" "}
                <span>Help people recognize you throughout ResearchEquals.</span>
              </p>
            </div>
          </div>
          <div className="block text-right text-indigo-700 dark:text-indigo-200">
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
                // secureSignature={uploadSecret.signature}
                // secureExpire={uploadSecret.expire}
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
  return (
    <>
      {!data.authorships.length > 0 ? (
        <div
          key="draft-onboarding-quest"
          className="onboarding flex flex-col bg-purple-50 dark:bg-purple-900 p-4 my-2 lg:my-0 sm:mr-2 w-full border-l-4 border-purple-400 dark:border-purple-200 rounded-r"
        >
          <div className="flex flex-grow">
            <div className="">
              <VariableIcon
                className="h-5 w-5 text-purple-400 dark:text-purple-200"
                aria-hidden="true"
              />
            </div>
            <div className="ml-3 flex-1 md:flex text-purple-800 dark:text-purple-200">
              <p className="text-sm mr-2">
                <span className=" font-bold">Create your first module</span>{" "}
                <span>
                  What are you working on today? All research steps are building blocks. Start
                  sharing your progress.
                </span>
              </p>
            </div>
          </div>
          <div className="block text-right text-purple-700 dark:text-purple-200">
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
