import { BlitzPage, useQuery, useRouter, useSession } from "blitz"
import Layout from "app/core/layouts/Layout"

import Navbar from "../core/components/Navbar"
import LayoutLoader from "../core/components/LayoutLoader"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import { useCurrentWorkspace } from "app/core/hooks/useCurrentWorkspace"
import getDrafts from "app/core/queries/getDrafts"
import getInvitedModules from "app/workspaces/queries/getInvitedModules"
import getAdminInfo from "../core/queries/getAdminInfo"

const Admin: BlitzPage = () => {
  const currentUser = useCurrentUser()
  const session = useSession()
  const currentWorkspace = useCurrentWorkspace()
  const router = useRouter()
  const [drafts, { refetch }] = useQuery(getDrafts, { session })
  const [invitations] = useQuery(getInvitedModules, { session })
  const [adminInfo] = useQuery(getAdminInfo, null)

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
      <main className="bg-white dark:bg-gray-900 lg:relative"></main>
    </>
  )
}

Admin.authenticate = true
Admin.suppressFirstRenderFlicker = true
Admin.getLayout = (page) => (
  <Layout title="R= Admin">
    <LayoutLoader>{page}</LayoutLoader>
  </Layout>
)

export default Admin
