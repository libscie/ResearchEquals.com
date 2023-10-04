import Link from "next/link"
import { useSession } from "@blitzjs/auth"
import { useRouter } from "next/router"
import { useQuery } from "@blitzjs/rpc"
import { BlitzPage } from "@blitzjs/next"
import Layout from "app/core/layouts/Layout"
import { SendAltFilled } from "@carbon/icons-react"
import Markdown from "markdown-it"

import Navbar from "app/core/components/Navbar"
import LayoutLoader from "app/core/components/LayoutLoader"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import { useCurrentWorkspace } from "app/core/hooks/useCurrentWorkspace"
import getDrafts from "app/core/queries/getDrafts"
import getInvitedModules from "app/workspaces/queries/getInvitedModules"

const cocMarkdown = `
# Code of Conduct

We work to make underlying power structures and its consequences visible, and we provide the Code of Conduct (CoC) as a means to do that within our work. The CoC is addresses power issues in our community and ensures we hold ourselves to our values. While no document can possibly make provisions for all the ethical and legal dilemmas that you may encounter in the course of your participation with any organisation, this Code provides guidance that is meant to keep you and us on the right course, and to prompt you when further guidance for specific situations may be necessary. The Code does not create any contractual rights enforceable against Liberate Science GmbH.

The CoC helps us create shared expectations in our community spaces. This is not a legal proceeding and we do not aim to arbitrate illegal conduct or be a courtroom. That means that we try to protect our space, not replace the judicial system.

## Our Pledge

We as members, contributors, and leaders pledge to do our best to make participation in our community a harassment-free experience for everyone, regardless of age, body size, visible or invisible disability, ethnicity, sex characteristics, gender identity and expression, level of experience, education, socio-economic status, nationality, personal appearance, race, religion, or sexual identity and orientation.

We pledge to act and interact in ways that contribute to an open, welcoming, diverse, inclusive, and healthy community.

## Our Standards

Examples of behavior that contributes to a positive environment for our community include:

- Demonstrating empathy and kindness toward other people
- Being respectful of differing opinions, viewpoints, and experiences
- Giving and gracefully accepting constructive feedback
- Accepting responsibility and apologizing to those affected by our mistakes, and learning from the experience
- Focusing on what is best not just for us as individuals, but for the overall community

Examples of unacceptable behavior that can lead to consequences in our community include:

- The use of sexualized language or imagery, and sexual attention or advances of any kind
- Trolling, insulting or derogatory comments, and personal or political attacks
- Public or private harassment
- Publishing others' private information, such as a physical or email address, without their explicit permission
- Other conduct which could reasonably be considered inappropriate in a professional setting

These lists are not exhaustive.

## Enforcement Responsibilities

Community leaders are responsible for clarifying and enforcing our standards of acceptable behavior and will take appropriate and fair corrective action in response to any behavior that they deem inappropriate, threatening, offensive, or harmful.

Community leaders have the right and responsibility to remove, edit, or reject comments, commits, code, wiki edits, issues, and other contributions that are not aligned to this Code of Conduct, and will communicate reasons for moderation decisions when appropriate.

## Scope

This Code of Conduct applies within all community spaces, and also applies when an individual is officially representing the community in public spaces. Examples of representing our community include using an official e-mail address, posting via an official social media account, or acting as an appointed representative at an online or offline event.

## Enforcement

Instances of abusive, harassing, or otherwise unacceptable behavior may be reported to the community leaders responsible for enforcement ([coc@libscie.org](mailto:coc@libscie.org); see also the entire team). All complaints will be reviewed and investigated promptly and fairly.

All community leaders are obligated to respect the privacy and security of the reporter of any incident.

### Recusal policy

Community leader can recuse themselves at any time for handling an incident. Community leaders must be reflexive in assessing whether they can handle an incident report. This is both in terms of capacity of whatever kind (e.g., related unprocessed trauma) and in relational capacity (e.g., a close friend is reported).

Two community leaders must remain to assess the incident. If fewer remain, an external advisor to the case may be requested who will be invited to assess the incident. They will be bound to confidential handling of the incident report.

If a community leader decides to not recuse themselves despite potential conflicts, they must disclose these potential conflicts to the rest of the community leaders. They can then assess and critically evaluate the handling of the incident. If at any point the conflict is deemed to be too influential in the handling, the community leader will be asked to recuse themselves after all.

## Enforcement Guidelines

Community leaders will follow these Community Impact Guidelines in determining the consequences for any action they deem in violation of this Code of Conduct:

### 1. Correction

**Community Impact**: Use of inappropriate language or other behavior deemed unprofessional or unwelcome in the community.

**Consequence**: A private, written warning from community leaders, providing clarity around the nature of the violation and an explanation of why the behavior was inappropriate. A public apology may be requested.

### 2. Warning

**Community Impact**: A violation through a single incident or series of actions.

**Consequence**: A warning with consequences for continued behavior. No interaction with the people involved, including unsolicited interaction with those enforcing the Code of Conduct, for a specified period of time. This includes avoiding interactions in community spaces as well as external channels like social media. Violating these terms may lead to a temporary or permanent ban.

### 3. Temporary Ban

**Community Impact**: A serious violation of community standards, including sustained inappropriate behavior.

**Consequence**: A temporary ban from any sort of interaction or public communication with the community for a specified period of time. No public or private interaction with the people
involved, including unsolicited interaction with those enforcing the Code of Conduct, is allowed during this period. Violating these terms may lead to a permanent ban.

### 4. Permanent Ban

**Community Impact**: Demonstrating a pattern of violation of community standards, including sustained inappropriate behavior, harassment of an individual, or aggression toward or disparagement of classes of individuals.

**Consequence**: A permanent ban from any sort of public interaction within the community.

# Reporting protocol

Our events and spaces strive to provide an environment for individuals to be unimpeded in their presence and in making contributions. We actively intervene in case this aim is threatened, we
have a no-barriers reporting standard, and we actively encourage reports to our own mishaps or improvement points.

"We" in this document refers to the space-coordinators of Liberate Science, who may always be contacted. All our space-coordinators have undergone or are going to undergo a Code of Conduct training.

Internal coordinators are always available, external coordinators are available if you feel there is a conflict in reporting to someone embedded within the space (e.g., about the person themselves, issues with our Liberate Science organizing).

| Who (alphabetical order)               | Pronouns          |
|-------------------|-------------------|
| Chris Hartgerink  | They/them           |
| Vinodh Ilangovan  | They/them, he/him |

To achieve a space where everyone can be present and contribute, our protocol is set up to, if reasonably possible, grow past the issues that occur *if people are willing to*.

We operate under the motto that we permit you to take part in our spaces and events; we can remove that permission at any time.

## Making a report

We have a no-barriers reporting standard. That means **you do not need to judge whether what  occurred is "bad enough" to be reported**. It also means **the incident does not need to happen to you personally**; if it affects you, you may report it.

All legal persons may be reported (e.g., individual persons, organizations).

To make a report, you can reach out to the space-coordinator(s) or email [coc@libscie.org](mailto:coc@libscie.org). At physical events, event specific information will contain additional information on how to recognize who you can make incident reports with on-site.

Reports are treated as confidential documents and include:

- Date and time
- Location
- Person taking the report
- Reported person's name/description
- Description of the incident
- Reporter name and contact info
- Witness information (optional)

We require this information to adequately deal with situations and be able to contact the people involved.

Information relating to natural persons (people) is not disclosed, except when actions are undertaken against a legal person (e.g., ban). Information relating to legal persons that are not natural persons (e.g., an organization) is publicly disclosed.

## What happens with an incident report?

The incident report will be discussed by the committee of relevant and available space-coordinators in a closed meeting. In case of severe reports, we may deviate from these guidelines based on an assessment of the situation at hand.

This meeting must start within 2 hours after the report has been taken if it is an ongoing event; otherwise within 48 hours after taking the report. If the report pertains to an acute situation (e.g., racist remarks by workshop leader), space-coordinators may take immediate action.

In the meeting, we will discuss the behavior, its reported impact, how public the behavior was, and the reported person's previous incidents and outcomes (if any). Anyone with a conflict of interest may not be part of this meeting.

Based on the impact-public assessment, a proposal will be made that allows the reported person to stay in the community if accepted. In case of multiple valid proposals, a majority vote will provide resolution. In case of a tie, the chair has the decisive vote between the tied proposals.

The larger the impact of the behavior, the more demanding the proposal must be for the reported; the more public the behavior, the more public the response. Proposals must include the reported person taking responsibility for the behavior's impact, and must provide a commitment to prevent repeating similar situations.

The consequences of rejecting the proposal by the reported person will be deliberated as well. These consequences must be specific and more demanding than the proposal, given that the unwillingness to take responsibility is something this community does not welcome.

Subsequently, we will reach out to the reported person with a description of the incident, the proposal, and consequences of rejecting it. Both are non-negotiable and non-dependent on declarations of intent.

Finally, a synopsis of the report, the proposal, and the outcome may be posted to [the Liberate Science Blog](https://libscie.org). For natural persons, the synopsis is anonymized.

## You have been reported

People make mistakes and we as space-coordinators recognize that. Whether people choose to take responsibility for their impact and address their behavior accordingly, is what is key in this community.

Depending on the impact and the publicness of the mistake, we will propose a way for you to stay in our events and spaces, if reasonably possible. We will also clearly state what will happen if you do not accept that proposal. These are non-negotiable at this stage.

Until you have reached a decision upon being presented with the proposal, you are not allowed to participate in any Liberate Science events and spaces for the protection of the reporter's mental health and privacy.

## Appeal

Appeals are only possible in case of substantial consequences as a result of the action taken against the reported person. All appeals must include the case of how the action has impacted them.

Appeals to procedures by internal space-coordinators are referred to the external space-coordinators. Appeals to procedures by the external space-coordinators will be referred to an independent third-party consultant.

Appeals must include a clear case upon submission and proportional outcome change. A case may include for example strong disconfirming evidence that the reported behavior ever occurred, joined with the proportional outcome change that a ban is lifted.

Synopses of appeals will also be posted to the [Liberate Science Blog](https://libscie.org) and crosslinked from the original post, to clearly indicate developments.
`

const md = new Markdown()

const CodeOfConduct: BlitzPage = () => {
  const datetime = new Date()
  const currentUser = useCurrentUser()
  const session = useSession()
  const currentWorkspace = useCurrentWorkspace()
  const router = useRouter()
  const [drafts, { refetch }] = useQuery(getDrafts, { session })
  const [invitations] = useQuery(getInvitedModules, { session })

  return (
    <>
      <Navbar
        currentUser={currentUser}
        session={session}
        currentWorkspace={currentWorkspace}
        router={router}
        drafts={drafts}
        invitations={invitations}
        refetchFn={refetch}
      />
      <main className="bg-white dark:bg-gray-900 lg:relative">
        <div className="mx-4 my-8 max-w-3xl text-black dark:text-white lg:mx-auto">
          <div className="onboarding my-2 flex w-full flex-col rounded-r border-l-4 border-amber-400 bg-amber-50 p-4 dark:border-amber-200 dark:bg-amber-900 lg:my-0">
            <div className="flex flex-grow">
              <div className="">
                <SendAltFilled
                  size={32}
                  className="h-5 w-5 text-amber-400 dark:text-amber-200"
                  aria-hidden="true"
                />
              </div>
              <div className="ml-3 flex-1 text-amber-800 dark:text-amber-200 md:flex">
                <p className="mr-2 text-sm">
                  <span className="font-bold">Submit a report.</span>{" "}
                  <span>Reports are treated as confidential documents.</span>
                </p>
              </div>
            </div>
            <div className="block text-right text-amber-700 dark:text-amber-200">
              <Link
                href={`mailto:coc@libscie.org?subject=[${datetime
                  .toISOString()
                  .substr(
                    0,
                    10,
                  )}] Code of Conduct report&body=Dear%20Code%20of%20Conduct%20committee%2C%0A%0AI%20would%20like%20to%20submit%20a%20code%20of%20conduct%20report%20regarding%20%5Breported%20person's%20name%2Fdescription%2C%20organizations%20also%20allowed%5D.%0A%0A%5Bdescription%20of%20the%20incident%5D%20%0A%0AThis%20happened%20on%20%5Bdate%20and%20time%5D%20at%20%5Blocation%5D.%20%0A%0AMy%20name%20is%20%5Breporter%20name%5D%20and%20you%20can%20reach%20me%20at%20%5Bcontact%20info%5D.%20%0A%0AAdditional%20witnesses%20for%20this%20report%20are%3A%20%5Boptional%20witness%20information%5D.%0A%0AKind%20regards`}
                className="mt-3 text-sm underline md:ml-6 md:mt-0"
              >
                Email report
              </Link>
            </div>
          </div>
          <div className="coc " dangerouslySetInnerHTML={{ __html: md.render(cocMarkdown) }}></div>
        </div>
      </main>
    </>
  )
}

CodeOfConduct.suppressFirstRenderFlicker = true
CodeOfConduct.getLayout = (page) => (
  <Layout title="R= Code of Conduct">
    <LayoutLoader>{page}</LayoutLoader>
  </Layout>
)

export default CodeOfConduct
