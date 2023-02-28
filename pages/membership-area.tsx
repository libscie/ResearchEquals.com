import { useSession } from "@blitzjs/auth"
import { useRouter } from "next/router"
import { useQuery } from "@blitzjs/rpc"
import { BlitzPage } from "@blitzjs/next"
import Layout from "app/core/layouts/Layout"
import { Edit, Help, AssemblyCluster } from "@carbon/icons-react"
import getEvents from "../app/core/queries/getEvents"
import Navbar from "app/core/components/Navbar"
import LayoutLoader from "app/core/components/LayoutLoader"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import { useCurrentWorkspace } from "app/core/hooks/useCurrentWorkspace"
import getDrafts from "app/core/queries/getDrafts"
import getInvitedModules from "app/workspaces/queries/getInvitedModules"
import moment from "moment"

function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}

function colorEvent(type) {
  if (type === "ASSEMBLY") {
    return "bg-purple-50 text-purple-700 dark:text-purple-50 dark:bg-purple-700"
  } else if (type === "REQUEST") {
    return "bg-yellow-50 text-yellow-700 dark:text-yellow-50 dark:bg-yellow-700"
  } else {
    return "bg-green-50 text-green-700 dark:text-green-50 dark:bg-green-700"
  }
}

const MembershipArea: BlitzPage = () => {
  const currentUser = useCurrentUser()
  const session = useSession()
  const currentWorkspace = useCurrentWorkspace()
  const [events] = useQuery(getEvents, undefined)
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
        <div className="mx-auto divide-y divide-gray-200 overflow-hidden rounded-lg sm:grid sm:grid-cols-2 sm:gap-px sm:divide-y-0">
          {events.map((event) => {
            return (
              <div
                key={event.title}
                className={classNames(
                  "group relative bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 dark:bg-gray-900"
                )}
              >
                <div>
                  <span
                    className={classNames(colorEvent(event.type), "inline-flex rounded-lg p-3")}
                  >
                    {event.type === "ASSEMBLY" ? (
                      <AssemblyCluster className="h-6 w-6" aria-hidden="true" />
                    ) : event.type === "REQUEST" ? (
                      <Help className="h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Edit className="h-6 w-6" aria-hidden="true" />
                    )}
                  </span>
                </div>
                <div className="mt-8">
                  <h3 className="text-lg font-medium">
                    <a href={`/membership-area/${event.slug}`} className="focus:outline-none">
                      {/* Extend touch target to entire panel */}
                      <span className="absolute inset-0" aria-hidden="true" />
                      {event.title}
                    </a>
                  </h3>
                  <span className="text-sm">
                    {moment(event.createdAt).toISOString().substr(0, 10)}
                  </span>
                </div>
                <span
                  className="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-gray-400"
                  aria-hidden="true"
                >
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
                  </svg>
                </span>
              </div>
            )
          })}
        </div>
      </main>
    </>
  )
}

MembershipArea.authenticate = { role: ["SUPERADMIN", "SUPPORTING"] }
MembershipArea.suppressFirstRenderFlicker = true
MembershipArea.getLayout = (page) => (
  <Layout title="Membership Area">
    <LayoutLoader>{page}</LayoutLoader>
  </Layout>
)

export default MembershipArea
