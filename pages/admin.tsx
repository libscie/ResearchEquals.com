import { useSession } from "@blitzjs/auth"
import { useRouter } from "next/router"
import { useQuery } from "@blitzjs/rpc"
import { BlitzPage } from "@blitzjs/next"
import Layout from "app/core/layouts/Layout"
import {
  Bullhorn,
  CategoryNew,
  Network_2,
  WatsonHealthStackedScrolling_1,
} from "@carbon/icons-react"

import "quill/dist/quill.snow.css"

import Navbar from "app/core/components/Navbar"
import LayoutLoader from "app/core/components/LayoutLoader"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import { useCurrentWorkspace } from "app/core/hooks/useCurrentWorkspace"
import getDrafts from "app/core/queries/getDrafts"
import getInvitedModules from "app/workspaces/queries/getInvitedModules"
import getAdminInfo from "app/core/queries/getAdminInfo"

const actions = [
  {
    title: "Broadcast to everyone",
    description:
      "Send an email to all the registered accounts on ResearchEquals, whose emails have been verified. Use this only for critical emails like changes to the terms or other emails we are legally required to send.",
    href: "/admin/broadcast-all",
    icon: Bullhorn,
    iconForeground: "text-sky-700",
    iconBackground: "bg-sky-50",
  },
  {
    title: "Broadcast to supporting members",
    description:
      "Send an email to all the active supporting members. This is used for announcing general assemblies, or other information we want to send to all supporting members.",
    href: "/admin/broadcast-supporting",
    icon: Bullhorn,
    iconForeground: "text-yellow-700",
    iconBackground: "bg-yellow-50",
  },
  {
    title: "Create supporting member event",
    description:
      "Add an event in the supporting member area. This can be an assembly, a petition, or an information request.",
    href: "/admin/supporting-event",
    icon: CategoryNew,
    iconForeground: "text-yellow-700",
    iconBackground: "bg-yellow-50",
  },
  {
    title: "Marketing broadcast",
    description: "Send an email to all the people who consented to receiving marketing emails.",
    href: "/admin/broadcast-marketing",
    icon: Bullhorn,
    iconForeground: "text-rose-700",
    iconBackground: "bg-rose-50",
  },
  {
    title: "Remint module metadata",
    description:
      "Update the metadata for a module with CrossRef. This can for example be used when a typo has been corrected, or if somebody linked their ORCID after publishing.",
    href: "/admin/remint-module",
    icon: Network_2,
    iconForeground: "text-teal-700",
    iconBackground: "bg-teal-50",
  },
  {
    title: "Remint collection metadata",
    description:
      "Update the metadata for a collection with CrossRef. This can for example be used when a typo has been corrected, or something else happened that requires it.",
    href: "/admin/remint-collection",
    icon: WatsonHealthStackedScrolling_1,
    iconForeground: "text-purple-700",
    iconBackground: "bg-purple-50",
  },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}

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
        <Navbar />

      <main className="bg-white dark:bg-gray-900 lg:relative">
        <div className="mx-auto divide-y divide-gray-200 overflow-hidden rounded-lg bg-gray-200 shadow sm:grid sm:grid-cols-2 sm:gap-px sm:divide-y-0">
          {actions.map((action, actionIdx) => (
            <div
              key={action.title}
              className={classNames(
                actionIdx === 0 ? "rounded-tl-lg rounded-tr-lg sm:rounded-tr-none" : "",
                actionIdx === 1 ? "sm:rounded-tr-lg" : "",
                actionIdx === actions.length - 2 ? "sm:rounded-bl-lg" : "",
                actionIdx === actions.length - 1
                  ? "rounded-bl-lg rounded-br-lg sm:rounded-bl-none"
                  : "",
                "group relative bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500",
              )}
            >
              <div>
                <span
                  className={classNames(
                    action.iconBackground,
                    action.iconForeground,
                    "inline-flex rounded-lg p-3 ring-4 ring-white",
                  )}
                >
                  <action.icon className="h-6 w-6" aria-hidden="true" />
                </span>
              </div>
              <div className="mt-8">
                <h3 className="text-lg font-medium">
                  <a href={action.href} className="focus:outline-none">
                    {/* Extend touch target to entire panel */}
                    <span className="absolute inset-0" aria-hidden="true" />
                    {action.title}
                  </a>
                </h3>
                <p className="mt-2 text-sm text-gray-500">{action.description}</p>
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
          ))}
        </div>
      </main>
    </>
  )
}

Admin.authenticate = { role: ["SUPERADMIN"] }
Admin.suppressFirstRenderFlicker = true
Admin.getLayout = (page) => (
  <Layout title="Admin Panel">
    <LayoutLoader>{page}</LayoutLoader>
  </Layout>
)

export default Admin
