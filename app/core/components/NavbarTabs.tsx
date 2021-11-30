import getInvitedModules from "app/workspaces/queries/getInvitedModules"
import { Link, Routes, useQuery, useSession, useRouter } from "blitz"

import { useCurrentUser } from "../hooks/useCurrentUser"
import { useCurrentWorkspace } from "../hooks/useCurrentWorkspace"
import getDrafts from "../queries/getDrafts"

function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}

const NavTabs = () => {
  const currentUser = useCurrentUser()
  const session = useSession()
  const currentWorkspace = useCurrentWorkspace()
  const router = useRouter()
  const [drafts] = useQuery(getDrafts, { session })
  const [invitations] = useQuery(getInvitedModules, { session })

  let tabs
  if (currentWorkspace) {
    tabs = [
      {
        name: "Dashboard",
        href: Routes.Dashboard(),
        current: router.asPath === Routes.Dashboard().pathname,
      },
      {
        name: "Profile",
        href: Routes.HandlePage({ handle: currentWorkspace!.handle }),
        current: router.asPath === `/${currentWorkspace!.handle}`,
      },
      {
        name: "Drafts",
        href: Routes.DraftsPage(),
        count: drafts.length,
        current: router.asPath === Routes.DraftsPage().pathname,
      },
      {
        name: "Invitations",
        href: Routes.InvitationsPage(),
        count: invitations.length,
        current: router.asPath === Routes.InvitationsPage().pathname,
      },
    ]
  }

  if (currentUser && currentWorkspace) {
    return (
      <>
        <div className="w-full bg-gray-500 text-white mx-auto px-4 sm:px-6 lg:px-8">
          <div className="hidden sm:block">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {tabs.map((tab) => (
                <Link key={tab.name} href={tab.href}>
                  <a
                    className={classNames(
                      tab.current
                        ? "border-indigo-500 text-gray-200"
                        : "border-transparent hover:text-gray-300 hover:border-gray-200",
                      tab.count === 0 ? "pointer-events-none text-gray-300" : "",
                      "whitespace-nowrap flex py-4 px-1 border-b-2 font-medium text-sm disabled"
                    )}
                    aria-current={tab.current ? "page" : undefined}
                  >
                    {tab.name}
                    {tab.count ? (
                      <span
                        className={classNames(
                          tab.current
                            ? "bg-indigo-100 text-indigo-600"
                            : "bg-gray-100 text-gray-900",
                          "hidden ml-3 py-0.5 px-2.5 rounded-full text-xs font-medium md:inline-block"
                        )}
                      >
                        {tab.count}
                      </span>
                    ) : null}
                  </a>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </>
    )
  } else {
    return <></>
  }
}

export default NavTabs
