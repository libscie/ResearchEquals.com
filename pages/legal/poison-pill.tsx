import { useSession } from "@blitzjs/auth"
import { useRouter } from "next/router"
import { useQuery } from "@blitzjs/rpc"
import { BlitzPage } from "@blitzjs/next"
import Layout from "app/core/layouts/Layout"
import Markdown from "markdown-it"

import Navbar from "app/core/components/Navbar"
import LayoutLoader from "app/core/components/LayoutLoader"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import { useCurrentWorkspace } from "app/core/hooks/useCurrentWorkspace"
import getDrafts from "app/core/queries/getDrafts"
import getInvitedModules from "app/workspaces/queries/getInvitedModules"

const poisonPillMarkdown = `
# Poison Pill Agreement

between

the Supporting Member signing up for the Supporting Membership (the “Supporting Member”)

and

Liberate Science GmbH (c/o ImpactHub), Rollbergstraße 28A, 12053 Berlin, Germany (“LibScie”)

and

its Shareholders, currently Chris Hartgerink (the ”Shareholder”)

each individually or collectively referred to as a “Party” or the “Parties”.

This Poison Pill Agreement supplements the legal relationship between LibScie and the Supporting Member (the “Agreement”) based on the General Terms for the ResearchEquals Supporting Membership (the “Terms”) and serves to implement a Poison Pill mechanism according to Section 5.3 of [the Terms](https://researchequals.com/terms).

## 1.	Preamble

The parties agree that their common goal is to keep LibScie in safe hands and that the Supporting Members shall be involved in any change of shareholder.

## 2.	Information about Offers

1. Specifically, the Shareholder promises to inform LibScie of any offer that they receive from a third party (meaning: not currently or previously employed by LibScie) to buy shares from them (the “Offer”).

2. LibScie will in turn inform the Supporting Member about the Offer.

## 3. Right to Hold a Vote about the Offer

1. The Supporting Member shall have a 1 month opportunity to call for a vote regarding the acceptance or rejection of the Offer.

2. During this period, the shareholders shall neither sell nor otherwise dispose of their shares.

3. If no Supporting Member calls for a vote within the month, the Shareholder is free to sell their shares.

## 4.	Process of the vote and binding decision

1. If one or more Supporting Member call for a vote, LibScie shall set a date for the election as early as possible and take all necessary organizational measures to hold the vote.

2. The subject of the vote is whether the sale of the shares by the shareholders should be permitted or prohibited. Each Supporting Member has 1 (one) vote. The winner of the vote is the option that receives more than 50% of all votes cast.

3. The Shareholder shall be directly bound to this decision in case of prohibition.

## 5.	Contractual Penalty

1. If a Shareholder sells any of their shares either in the one-month period without the permission of the Supporting Members or contrary the results of a vote which forbids the sell of shares, each supporting member shall be entitled to receive an appropriate contractual penalty.

2. The amount of the contractual penalty for each Supporting Member shall be equal to the selling price divided by the total number of Supporting Members.

3. LibScie assumes the contractual penalty owed to the Supporting Members.

## 6.	Change of Shareholder

Each new Shareholder shall enter into this Agreement in the role of a Shareholder.

## 7.	Term and Termination

This Agreement enters in force with the conclusion of the Agreement between LibScie and the Supporting Member under the Terms and remains in force until the Supporting Member or LibScie terminates the Agreement.

Berlin, December 2023
`

const md = new Markdown()

const PoisonPillPage: BlitzPage = () => {
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
          <div
            className="coc"
            dangerouslySetInnerHTML={{ __html: md.render(poisonPillMarkdown) }}
          ></div>
        </div>
      </main>
    </>
  )
}

PoisonPillPage.suppressFirstRenderFlicker = true
PoisonPillPage.getLayout = (page) => (
  <Layout title="Poison Pill Agreement">
    <LayoutLoader>{page}</LayoutLoader>
  </Layout>
)

export default PoisonPillPage
