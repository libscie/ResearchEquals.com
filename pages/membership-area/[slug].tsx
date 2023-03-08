import { useSession } from "@blitzjs/auth"
import { useRouter } from "next/router"
import { useQuery } from "@blitzjs/rpc"
import getCurrentEvent from "../../app/core/queries/getCurrentEvent"
import "quill/dist/quill.snow.css"

import Layout from "app/core/layouts/Layout"
import Navbar from "app/core/components/Navbar"
import LayoutLoader from "app/core/components/LayoutLoader"
import getInvitedModules from "app/workspaces/queries/getInvitedModules"
import getDrafts from "app/core/queries/getDrafts"
import { useCurrentWorkspace } from "app/core/hooks/useCurrentWorkspace"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import authSupportingMember from "app/core/queries/authSupportingMember"

const SupportingEventPage = () => {
  const currentUser = useCurrentUser()
  const session = useSession()
  const currentWorkspace = useCurrentWorkspace()
  const router = useRouter()
  const [drafts, { refetch }] = useQuery(getDrafts, { session })
  const [currentEvent] = useQuery(getCurrentEvent, "ga-1")
  const [invitations] = useQuery(getInvitedModules, { session })
  const [authSupporting] = useQuery(authSupportingMember, {} as any)

  return (
    <Layout title={`${currentEvent!.title} | Membership Area`}>
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
          <h1 className="mx-auto my-8 text-center text-5xl font-black">{currentEvent!.title}</h1>
          <div
            className="coc ql-editor"
            dangerouslySetInnerHTML={{ __html: currentEvent!.content }}
          ></div>
        </div>
      </main>
    </Layout>
  )
}

SupportingEventPage.authenticate = true
SupportingEventPage.authenticate = { role: ["SUPERADMIN", "SUPPORTING"] }
SupportingEventPage.suppressFirstRenderFlicker = true
SupportingEventPage.getLayout = (page) => <LayoutLoader>{page}</LayoutLoader>

export default SupportingEventPage
