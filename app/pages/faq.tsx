import { BlitzPage, useQuery, useRouter, useSession } from "blitz"
import Layout from "app/core/layouts/Layout"
import Markdown from "markdown-it"

import Navbar from "../core/components/Navbar"
import LayoutLoader from "app/core/components/LayoutLoader"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import { useCurrentWorkspace } from "app/core/hooks/useCurrentWorkspace"
import getDrafts from "app/core/queries/getDrafts"
import getInvitedModules from "app/workspaces/queries/getInvitedModules"

const termsMarkdown = `
# FAQ

Here you can find some Frequently Asked Questions.

Got a question but it is not answered here? Let us know by [email](mailto:info@libscie.org) or in [Discord](https://discord.gg/SefsGJWWSw) and we'll get back to you!

## General

### Why would I publish step by step?

Managing projects is a lot of work. By publishing the steps of a project, you can manage pieces of a project separately and track your work over time.

### Another platform... Won't it be useless until its adopted widely?

All your publications on ResearchEquals receive a DOI and are recognized research outputs today.

We agree the platform will become more valuable as more people use it, and that is something that we monitor closely. You can too by viewing our real-time [stats page](https://researchequals.com/stats).

### What distinguishes ResearchEquals from Zenodo or the Open Science Framework (OSF)?

Zenodo and the OSF are great tools, fit for their own purposes. ResearchEquals focuses on publishing research steps, where Zenodo and the OSF still focus on managing entire projects at once.

### Is there versioning in the module?

Currently, we do not offer versioning for a research module.

## Modules

### What files can I upload as part of a module?

You may upload any file with an Open File Format. This includes common files such as PDFs, Word files, and many more. Want to ensure a specific file can be uploaded? Ask us on [info@libscie.org](mailto:info@libscie.org).

The maximum size is 100MB at the moment, per file.

## Payment

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

If you are publishing under a restrictive license, the publication will be immediately completed after your payment is processed.

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
