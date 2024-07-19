import Link from "next/link"
import { useMutation, useQuery } from "@blitzjs/rpc"
import { Widget } from "@uploadcare/react-widget"
import { useMemo, useRef, useState } from "react"
import { Formik, Form } from "formik"
import {
  Building,
  Email,
  UserAvatar,
  User,
  Parameter,
  LogoDiscord,
  ThumbsDown,
  ThumbsUp,
  WatsonHealthStackedScrolling_1,
  Sprout,
} from "@carbon/icons-react"
import { useRecoilState } from "recoil"
import { smallFile } from "../utils/fileTypeLimit"

import changeAvatar from "../../workspaces/mutations/changeAvatar"
import getSignature from "../../auth/queries/getSignature"
import QuickDraft from "../../modules/components/QuickDraft"
import resendVerification from "../../auth/mutations/resendVerification"
import { settingsModalAtom, userDiscordAtom, emailNotificationsAtom } from "../utils/Atoms"
import changeEmailConsent from "../../users/mutations/changeEmailConsent"
import CollectionsModal from "../modals/CollectionsModal"
import SupportingMemberSignupModal from "../modals/SupportingMemberSignupModal"
import SettingsModal from "../modals/settings"
import { useCurrentUser } from "../hooks/useCurrentUser"
import { useCurrentWorkspace } from "../hooks/useCurrentWorkspace"

const validators = [smallFile]

const OnboardingQuests = ({ expire, signature }) => {
  const currentUser = useCurrentUser()
  const currentWorkspace = useCurrentWorkspace()

  return (
    <>
      {currentUser && (
        <>
          <OnboardingSupporting data={currentUser.supporting} />
          <OnboardingEmail data={currentUser.emailIsVerified} />
          <OnboardingEmailAccept data={currentUser} />
          <OnboardingAvatar data={currentWorkspace} expire={expire} signature={signature} />
          <OnboardingProfile data={currentWorkspace} />
          <OnboardingDraft data={currentWorkspace} />
          <OnboardingCollection data={currentWorkspace} />
          <OnboardingAffiliation data={currentWorkspace} />
          <OnboardingDiscord />
        </>
      )}
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
          className="onboarding my-2 flex w-full flex-col rounded-r border-l-4 border-amber-400 bg-amber-50 p-4 dark:border-amber-200 dark:bg-amber-900 lg:my-0"
        >
          <div className="flex flex-grow">
            <div className="">
              <Email
                size={32}
                className="h-5 w-5 text-amber-400 dark:text-amber-200"
                aria-hidden="true"
              />
            </div>
            <div className="ml-3 flex-1 text-amber-800 dark:text-amber-200 md:flex">
              <p className="mr-2 text-sm">
                <span className="font-bold">Verify your email</span>{" "}
                <span>Please check your inbox to verify your email address.</span>
              </p>
            </div>
          </div>
          <div className="block text-right text-amber-700 dark:text-amber-200">
            <p className="mt-3 text-sm md:ml-6 md:mt-0">
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

const OnboardingEmailAccept = ({ data }) => {
  const [emailConsentMutation, { isSuccess }] = useMutation(changeEmailConsent)
  const [emailNotifications, setEmailNotifications] = useRecoilState(emailNotificationsAtom)
  const [showCard, setShowCard] = useState(
    data.emailConsent === null || emailNotifications.emailConsent === null
  )

  return (
    <>
      {showCard && (
        <div className="onboarding my-2 flex w-full flex-col rounded-r border-l-4 border-cyan-400 bg-cyan-50 p-4 dark:border-cyan-200 dark:bg-cyan-900 lg:my-0">
          <div className="flex flex-grow">
            <div className="">
              <Email
                size={32}
                className="h-5 w-5 text-cyan-400 dark:text-cyan-200"
                aria-hidden="true"
              />
            </div>
            <div className="ml-3 flex-1 text-cyan-800 dark:text-cyan-200 md:flex">
              <p className="mr-2 text-sm">
                <span className="font-bold">Email notifications</span>{" "}
                <span>
                  Would you like to receive emails about ResearchEquals? You can manage which in
                  your settings.
                </span>
              </p>
            </div>
          </div>
          <div className="block text-right text-cyan-700 dark:text-cyan-200">
            <p className="mt-3 text-sm md:ml-6 md:mt-0">
              {isSuccess ? (
                <button
                  className="whitespace-nowrap font-medium underline hover:cursor-pointer hover:text-blue-600"
                  onClick={() => setShowCard(false)}
                >
                  Got it!
                </button>
              ) : (
                <p className="whitespace-nowrap font-medium  underline">
                  <button
                    className="mx-2 whitespace-nowrap font-medium  underline"
                    type="submit"
                    onClick={async () => {
                      await emailConsentMutation({ emailConsent: true, marketingConsent: true })
                      let emailNotis = { ...emailNotifications }
                      emailNotis.emailConsent = true
                      emailNotis.marketingConsent = true
                      setEmailNotifications(emailNotis)
                    }}
                  >
                    Yes
                    <ThumbsUp size={16} className="inline" />
                  </button>
                  <button
                    className="whitespace-nowrap font-medium  underline"
                    type="submit"
                    onClick={async () => {
                      await emailConsentMutation({ emailConsent: false, marketingConsent: false })
                      let emailNotis = { ...emailNotifications }
                      emailNotis.emailConsent = false
                      emailNotis.marketingConsent = false
                      setEmailNotifications(emailNotis)
                    }}
                  >
                    No
                    <ThumbsDown size={16} className="inline" />
                  </button>
                </p>
              )}
            </p>
          </div>
        </div>
      )}
    </>
  )
}

const OnboardingProfile = () => {
  const currentUser = useCurrentUser()
  const currentWorkspace = useCurrentWorkspace()

  const isInfoMissing = useMemo(() => {
    return (
      !currentWorkspace.firstName ||
      !currentWorkspace.lastName ||
      !currentWorkspace.bio ||
      !currentWorkspace.pronouns ||
      !currentWorkspace.url
    )
  }, [currentWorkspace])

  return (
    <>
      {isInfoMissing ? (
        <div
          key="onboarding profile-onboarding-quest"
          className="onboarding my-2 flex w-full flex-col rounded-r border-l-4 border-pink-400 bg-pink-50 p-4 dark:border-pink-200 dark:bg-pink-900 lg:my-0"
        >
          <div className="flex flex-grow">
            <div className="">
              <User
                size={32}
                className="h-5 w-5 text-pink-400 dark:text-pink-200"
                aria-hidden="true"
              />
            </div>
            <div className="ml-3 flex-1 text-pink-800 dark:text-pink-200 md:flex">
              <p className="mr-2 text-sm">
                <span className=" font-bold">Add your info</span>{" "}
                <span>
                  Make sure people know who you are. Add your author name, bio, pronouns, and a link
                  to your website.
                </span>
              </p>
            </div>
          </div>
          <div className="block text-right text-pink-700 dark:text-pink-200">
            {
              <SettingsModal
                button={
                  <button className="mt-3 whitespace-nowrap text-sm font-medium underline hover:text-blue-600 md:ml-6 md:mt-0">
                    Add information <span aria-hidden="true">&rarr;</span>
                  </button>
                }
                user={currentUser}
                workspace={currentWorkspace}
              />
            }
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  )
}

const OnboardingAffiliation = ({ data }) => {
  // State management
  const [settingsModal, setSettingsModal] = useRecoilState(settingsModalAtom)

  return (
    <>
      {data.affiliations.length === 0 ? (
        <div
          key="onboarding profile-onboarding-quest"
          className="onboarding my-2 flex w-full flex-col rounded-r border-l-4 border-teal-400 bg-teal-50 p-4 dark:border-teal-200 dark:bg-teal-900 lg:my-0"
        >
          <div className="flex flex-grow">
            <div className="">
              <Building
                size={32}
                className="h-5 w-5 text-teal-800 dark:text-teal-200"
                aria-hidden="true"
              />
            </div>
            <div className="ml-3 flex-1 text-teal-800 dark:text-teal-200 md:flex">
              <p className="mr-2 text-sm">
                <span className=" font-bold">Add affiliation</span>{" "}
                <span>
                  Set your affiliation and make sure it gets added to your module metadata.
                </span>
              </p>
            </div>
          </div>
          <div className="block text-right text-teal-700 dark:text-teal-200">
            <button
              className="mt-3 whitespace-nowrap text-sm font-medium underline hover:text-blue-600 md:ml-6 md:mt-0"
              onClick={() => {
                setSettingsModal(!settingsModal)
              }}
            >
              <>
                Add information <span aria-hidden="true">&rarr;</span>
              </>
            </button>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  )
}

const OnboardingAvatar = ({ data, expire, signature }) => {
  const [changeAvatarMutation] = useMutation(changeAvatar)
  const [uploadSecret] = useQuery(getSignature, undefined)
  const widgetApi = useRef()

  return (
    <>
      {!data.avatar.match(/ucarecdn/g) ? (
        <div
          key="avatar-onboarding-quest"
          className="onboarding my-2 flex w-full flex-col rounded-r border-l-4 border-indigo-400 bg-indigo-50 p-4 dark:border-indigo-200 dark:bg-indigo-900 lg:my-0"
        >
          <div className="flex flex-grow">
            <div className="">
              <UserAvatar
                size={32}
                className="h-5 w-5 text-indigo-400 dark:text-indigo-200"
                aria-hidden="true"
              />
            </div>
            <div className="ml-3 flex-1 text-indigo-800 dark:text-indigo-200 md:flex">
              <p className="mr-2 text-sm">
                <span className=" font-bold">Add an avatar</span>{" "}
                <span>Help people recognize you throughout ResearchEquals.</span>
              </p>
            </div>
          </div>
          <div className="block text-right text-indigo-700 dark:text-indigo-200">
            <p className="mt-3 text-sm md:ml-6 md:mt-0">
              <button
                className="whitespace-nowrap font-medium underline hover:text-blue-600"
                onClick={() => {
                  widgetApi.current.openDialog()
                }}
              >
                Upload avatar <span aria-hidden="true">&rarr;</span>
              </button>
              <Widget
                publicKey={process.env.UPLOADCARE_PUBLIC_KEY ?? ""}
                secureSignature={signature}
                secureExpire={expire}
                crop="1:1"
                ref={widgetApi}
                imageShrink="480x480"
                imagesOnly
                previewStep
                validators={validators}
                clearable
                onChange={async (info) => {
                  try {
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
          className="onboarding my-2 flex w-full flex-col rounded-r border-l-4 border-violet-400 bg-violet-50 p-4 dark:border-violet-200 dark:bg-violet-900 lg:my-0"
        >
          <div className="flex flex-grow">
            <div className="">
              <Parameter
                size={32}
                className="h-5 w-5 text-violet-400 dark:text-violet-200"
                aria-hidden="true"
              />
            </div>
            <div className="ml-3 flex-1 text-violet-800 dark:text-violet-200 md:flex">
              <p className="mr-2 text-sm">
                <span className=" font-bold">Create your first draft</span>{" "}
                <span>
                  What are you working on today? All research steps are building blocks. Start
                  sharing your progress.
                </span>
              </p>
            </div>
          </div>
          <div className="block text-right text-violet-700 dark:text-violet-200">
            <p className="mt-3 text-sm md:ml-6 md:mt-0">
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

const OnboardingCollection = ({ data }) => {
  return (
    <>
      {data.editorships.length === 0 ? (
        <div
          key="draft-onboarding-quest"
          className="onboarding my-2 flex w-full flex-col rounded-r border-l-4 border-orange-400 bg-orange-50 p-4 dark:border-orange-200 dark:bg-orange-900 lg:my-0"
        >
          <div className="flex flex-grow">
            <div className="">
              <WatsonHealthStackedScrolling_1
                size={32}
                className="h-5 w-5 text-orange-400 dark:text-orange-200"
                aria-hidden="true"
              />
            </div>
            <div className="ml-3 flex-1 text-orange-800 dark:text-orange-200 md:flex">
              <p className="mr-2 text-sm">
                <span className=" font-bold">Create collection(s)</span>{" "}
                <span>
                  Start curating DOIs for your peers. Create a research portfolio, track grant
                  outputs, or get creative.
                </span>
              </p>
            </div>
          </div>
          <div className="block text-right text-orange-700 dark:text-orange-200">
            <p className="mt-3 text-sm md:ml-6 md:mt-0">
              <CollectionsModal
                button={
                  <>
                    Create collection <span aria-hidden="true">&rarr;</span>
                  </>
                }
                styling="whitespace-nowrap font-medium hover:text-blue-600 underline"
                user={data.user}
                workspace={data}
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

const OnboardingDiscord = () => {
  const [userDiscord, setUserDiscord] = useRecoilState(userDiscordAtom)

  return (
    <>
      {userDiscord ? (
        <div
          key="draft-onboarding-quest"
          className="onboarding my-2 flex w-full flex-col rounded-r border-l-4 border-fuchsia-400 bg-fuchsia-50 p-4 dark:border-fuchsia-200 dark:bg-fuchsia-900 lg:my-0"
        >
          <div className="flex flex-grow">
            <div className="">
              <LogoDiscord
                size={32}
                className="h-5 w-5 text-fuchsia-400 dark:text-fuchsia-200"
                aria-hidden="true"
              />
            </div>
            <div className="ml-3 flex-1 text-fuchsia-800 dark:text-fuchsia-200 md:flex">
              <p className="mr-2 text-sm">
                <span className=" font-bold">Meeting space</span>{" "}
                <span>
                  We have an informal chat room to exchange best practices, support each other, and
                  find collaborators!
                </span>
              </p>
            </div>
          </div>
          <div className="block text-right text-fuchsia-700 dark:text-fuchsia-200">
            <p className="mt-3 text-sm md:ml-6 md:mt-0">
              <Link
                href="https://discord.gg/SefsGJWWSw"
                target="_blank"
                className="underline"
                onClick={() => {
                  setUserDiscord(!userDiscord)
                }}
              >
                Join chat<span aria-hidden="true">&rarr;</span>
              </Link>
            </p>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  )
}

const OnboardingSupporting = ({ data }) => {
  return (
    <>
      {!data ? (
        <div
          key="supporting-onboarding-quest"
          className="onboarding my-2 flex w-full flex-col rounded-r border-l-4 border-green-400 bg-green-50 p-4 dark:border-green-200 dark:bg-green-900 lg:my-0"
        >
          <div className="flex flex-grow">
            <div className="">
              <Sprout
                size={32}
                className="h-5 w-5 text-green-400 dark:text-green-200"
                aria-hidden="true"
              />
            </div>
            <div className="ml-3 flex-1 text-green-800 dark:text-green-200 md:flex">
              <p className="mr-2 text-sm">
                <Link href="/supporting-member">
                  <span className=" font-bold">Supporting membership</span>{" "}
                  <span>
                    Join assemblies, prevent buy-outs, and help decide where our profits go.
                  </span>
                </Link>
              </p>
            </div>
          </div>
          <div className="block text-right text-green-700 dark:text-green-200">
            <div className="mt-3 text-sm md:ml-6 md:mt-0">
              <SupportingMemberSignupModal
                button={
                  <span className="underline">
                    Subscribe<span aria-hidden="true">&rarr;</span>
                  </span>
                }
              />
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  )
}
