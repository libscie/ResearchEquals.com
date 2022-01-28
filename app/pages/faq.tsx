import { BlitzPage, useQuery, useRouter, useSession } from "blitz"
import Layout from "app/core/layouts/Layout"
import Markdown from "markdown-it"

import Navbar from "../core/components/Navbar"
import Footer from "../core/components/Footer"
import LayoutLoader from "app/core/components/LayoutLoader"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import { useCurrentWorkspace } from "app/core/hooks/useCurrentWorkspace"
import getDrafts from "app/core/queries/getDrafts"
import getInvitedModules from "app/workspaces/queries/getInvitedModules"

const termsMarkdown = `
# FAQ

## Publishing

### What payment options can I use to complete my orders?

You can use a variety of payment options, among which:

- Apple Pay
- Bancontact
- Cartes Bancaires
- Credit card
- EPS
- giropay
- Google Pay
- iDeal
- Klarna
- Przelewy24

Some of these payment options, such as Apple Pay and Google Pay, may only be available in certain supported browsers.

### When will my module be published?

As soon as you press publish! If you are publishing under a restrictive license, the publication will be completed after your payment is completed.

## Research modules

### What files can I upload as part of a module?

You may upload any file with an Open File Format. This includes common files such as PDFs, Word files, and many more. Want to ensure a specific file can be uploaded? Ask us on [info@libscie.org](mailto:info@libscie.org).

The maximum size is 100MB at the moment, per file.

`

const md = new Markdown()

const FaqPage: BlitzPage = () => {
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
      <main className="lg:relative bg-white dark:bg-gray-900">
        <div className="mx-4 lg:mx-auto max-w-3xl text-black dark:text-white my-8">
          <div className="coc" dangerouslySetInnerHTML={{ __html: md.render(termsMarkdown) }}></div>
        </div>
      </main>
      <Footer />
    </>
  )
}

FaqPage.suppressFirstRenderFlicker = true
FaqPage.getLayout = (page) => (
  <Layout title="R= FAQ">
    <LayoutLoader>{page}</LayoutLoader>
  </Layout>
)

export default FaqPage
