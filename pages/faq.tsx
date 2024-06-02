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

const termsMarkdown = `
## Frequently Asked Questions.

Got a question but it is not answered here? Let us know by [email](mailto:info@libscie.org) or in [Discord](https://discord.gg/SefsGJWWSw) and we'll get back to you!

# General

### Why would I publish step by step?

Managing projects is a lot of work. By publishing the steps of a project, you can manage pieces of a project separately and track your work over time. Come try it out and share your experiences!

### Another platform... Won't it be useless until its adopted widely?

All your publications on ResearchEquals receive a DOI and are recognized research outputs today.

We agree the platform will become more valuable as more people use it, and that is something that we monitor closely. You can too by viewing our real-time [stats page](https://researchequals.com/stats) and contributing to the platform's evolution.

### What distinguishes ResearchEquals from Zenodo or the Open Science Framework (OSF)?

Zenodo and the OSF are great tools, fit for their own purposes. ResearchEquals focuses on publishing research steps, where Zenodo and the OSF still focus on managing entire projects at once.

### How is ResearchEquals financed?

ResearchEquals is a Liberate Science GmbH project, which is funded by the Shuttleworth Foundation until the end of 2022. The Pay to Close model is our first product, but we have plans for other models that are also in line with the open philosophy. We won't mend words: We are on our journey to become financially self sustaining and time will tell whether we succeed. You can contribute to that success too!

### How is ResearchEquals different from Octopus? Isn't it the same?

We get that question a lot! Octopus is indeed similar. The main differences are:

- ResearchEquals allows you to link any steps together, Octopus has a specific order of events
- ResearchEquals allows for a wide variety of steps (focus on provenance), Octopus has 8 specific ones (focused on empirical cycles mostly)

It's a flavor difference mostly. Like onion rings and calamari.

### What assurances are there for the content I publish with you?

We are a proud member of [CrossRef](https://crossref.org). This includes [member obligations](https://www.crossref.org/documentation/metadata-stewardship/understanding-your-member-obligations/) such as archiving.

# Modules

### What files can I upload as part of a module?

You may upload any file with an Open File Format. This includes common files such as PDFs, Word files, and many more. Want to ensure a specific file can be uploaded? Ask us on [info@libscie.org](mailto:info@libscie.org).

The maximum size is 100MB at the moment, per file.

### Is there versioning in the module?

Currently, we do not offer versioning for a research module.

# Payment

#### What payment options can I use to complete my orders?

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

#### When will my module be published?

If you are publishing under a restrictive license, the publication will be immediately completed after your payment is processed.

# Liberate Science GmbH

### Why are you building ResearchEquals?

The following quote is from [our manifesto](https://libscie.org/blog/liberate-science-manifesto)

> We seek to distribute knowledge, such that what it enables becomes distributed too.

In other words, we want to give researchers the tools to publish with agency, and consumers to be able to access the knowledge they are seeking. Our journey led us to build a radically different publishing platform - ResearchEquals - to that end.

### What's a GmbH?

A GmbH is a limited liability company. We are committed to staying independent and have signed contracts with early supporting members to ensure the company stays in the hands of the workers.

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
        <Navbar />

      <main className="bg-white dark:bg-gray-900 lg:relative">
        <div className="mx-4 my-8 max-w-3xl text-black dark:text-white lg:mx-auto">
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
