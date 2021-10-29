import { CheckmarkOutline32 } from "@carbon/icons-react"
import SettingsModal from "../modals/settings"

const quests = [
  {
    title: "Create first draft",
    description:
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec odio. Quisque volutpat mattis eros. Nullam malesuada erat ut turpis.",
    action: "Create",
  },
]

const OnboardingQuests = ({ data }) => {
  console.log(data)
  console.log("here")
  return (
    <>
      <OnboardingOrcid data={data.workspace.orcid} />
      <OnboardingProfile data={data} />
      {quests.map((quest, index) => (
        <div
          key={quest.title + "-" + index}
          className="rounded-md bg-blue-50 p-4 my-2 sm:my-0 sm:mr-2 w-full"
        >
          <div className="flex">
            <div className="">
              <CheckmarkOutline32 className="h-5 w-5 text-green-400" aria-hidden="true" />
            </div>
            <div className="ml-3 flex-1 md:flex">
              <p className="text-sm text-blue-700 mr-2">
                <span className=" font-bold">{quest.title}</span> {quest.description}
              </p>
            </div>
          </div>
          <div className="block text-right">
            <p className="mt-3 text-sm md:mt-0 md:ml-6">
              <a
                href="#"
                className="whitespace-nowrap font-medium text-blue-700 hover:text-blue-600 underline"
              >
                {quest.action} <span aria-hidden="true">&rarr;</span>
              </a>
            </p>
          </div>
        </div>
      ))}
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
