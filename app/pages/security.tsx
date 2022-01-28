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
# Security measures

In order to ensure the security of our IT systems we run ResearchEquals on Amazon Web Services (AWS), which has in place a variety of physical and digital security systems to prevent infiltration.

Our services on AWS run in a Virtual Private Cloud (VPC) that are not accessible to outsiders without a Virtual Private Network (VPN).

`

const md = new Markdown()

const SecurityPage: BlitzPage = () => {
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

SecurityPage.suppressFirstRenderFlicker = true
SecurityPage.getLayout = (page) => (
  <Layout title="R= Security measures">
    <LayoutLoader>{page}</LayoutLoader>
  </Layout>
)

export default SecurityPage
