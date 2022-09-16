import { BlitzPage, useSession, useQuery, useRouter, Link } from "blitz"
import Layout from "app/core/layouts/Layout"

import Navbar from "../core/components/Navbar"
import { useCurrentUser } from "../core/hooks/useCurrentUser"
import getInvitedModules from "app/workspaces/queries/getInvitedModules"
import { useCurrentWorkspace } from "../core/hooks/useCurrentWorkspace"
import LayoutLoader from "app/core/components/LayoutLoader"
import getDrafts from "app/core/queries/getDrafts"
import getCollections from "../collections/queries/getCollections"

const CollectionsPage: BlitzPage = () => {
  const currentUser = useCurrentUser()
  const session = useSession()
  const currentWorkspace = useCurrentWorkspace()
  const router = useRouter()
  const [drafts, { refetch }] = useQuery(getDrafts, { session })
  const [invitations] = useQuery(getInvitedModules, { session })
  // get collections
  const [collections] = useQuery(getCollections, null)
  // get my collections
  // get followed collections

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
      <main className="relative flex">
        {collections.map((collection) => {
          return (
            <Link key={collection.suffix} href={`/collections/${collection.suffix}/admin`}>
              <a>{collection.title}</a>
            </Link>
          )
        })}
      </main>
    </>
  )
}

CollectionsPage.authenticate = true
CollectionsPage.getLayout = (page) => (
  <Layout title="R= Collections">
    <LayoutLoader>{page}</LayoutLoader>
  </Layout>
)

export default CollectionsPage
