import { useSession } from "@blitzjs/auth";
import { useRouter } from "next/router";
import { useQuery } from "@blitzjs/rpc";
import { BlitzPage } from "@blitzjs/next";
import Layout from "app/core/layouts/Layout"
import Markdown from "markdown-it"

import Navbar from "../core/components/Navbar"
import LayoutLoader from "app/core/components/LayoutLoader"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import { useCurrentWorkspace } from "app/core/hooks/useCurrentWorkspace"
import getDrafts from "app/core/queries/getDrafts"
import getInvitedModules from "app/workspaces/queries/getInvitedModules"

const termsMarkdown = `
# Addendum 1: Right of Withdrawal

## Right of Withdrawal

You have the right to withdraw from this contract within 14 days without giving any reason.

The withdrawal period is 14 days from the day of the conclusion of the contract.

In order to exercise your right of withdrawal, you must inform us (Liberate Science GmbH, Ebertystraße 44, 10249 Berlin , Germany, info@libscie.org) by means of a clear declaration (e.g. a letter sent by post, fax or e-mail) of your decision to withdraw from this contract. For this purpose, you may use the enclosed sample withdrawal form, which, however, is not mandatory.

In order to comply with the withdrawal period, it is sufficient that you send the notification of the exercise of the right of withdrawal before the expiry of the withdrawal period.

## Consequences of the Withdrawal

If you withdraw this contract, we shall reimburse you all payments we have received from you, including delivery costs (with the exception of additional costs resulting from the fact that you have chosen a type of delivery other than the most favorable standard delivery offered by us), without undue delay and no later than within fourteen days from the day on which we received the notification of your revocation of this contract. For this repayment, we will use the same means of payment that you used for the original transaction, unless expressly agreed otherwise with you; in no case will you be charged any fees because of this repayment.

If you have requested that the services begin before the end of the withdrawal period, you shall pay us a reasonable amount corresponding to the proportion of the services already provided up to the point in time at which you notify us of the exercise of the right of withdrawal with regard to this contract compared to the total scope of the services provided for in the contract.

## Other Information

Your right to revoke the contract exists independently of any warranty claims in the event of material defects. If there is a defect covered by warranty, you are entitled to demand supplementary performance, to withdraw from the contract or to reduce the purchase price within the framework of the statutory provisions.
 
## Withdrawal Form:

(If you wish to withdraw from the contract, please fill out and return this form).

- To Liberate Science GmbH, Ebertystraße 44, 10249 Berlin , Germany, info@libscie.org:
- I/we (+) hereby withdraw the contract concluded by me/us (+) for the purchase of the following goods (+)/the provision of the following service (+):
- Ordered on (+)/received on (+):
- Name of the consumer(s):
- Address of consumer(s):
- Signature of the consumer(s) (only in case of notification on paper):
- Date

(+) Delete where not applicable
`

const md = new Markdown()

const RightOfWithdrawalPage: BlitzPage = () => {
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
          <div className="coc" dangerouslySetInnerHTML={{ __html: md.render(termsMarkdown) }}></div>
        </div>
      </main>
    </>
  )
}

RightOfWithdrawalPage.suppressFirstRenderFlicker = true
RightOfWithdrawalPage.getLayout = (page) => (
  <Layout title="R= Right of withdrawal">
    <LayoutLoader>{page}</LayoutLoader>
  </Layout>
)

export default RightOfWithdrawalPage
