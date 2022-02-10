import { Link, Routes } from "blitz"
import { Undo32 } from "@carbon/icons-react"

function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}

const NavTabs = ({ currentUser, currentWorkspace, session, router, drafts, invitations }) => {
  let tabs
  if (currentWorkspace) {
    tabs = [
      {
        name: "Dashboard",
        href: Routes.Dashboard(),
        current: router.asPath === Routes.Dashboard().pathname,
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
      {
        name: "Modules",
        href: Routes.HandlePage({ handle: currentWorkspace!.handle }),
        current: router.asPath === `/${currentWorkspace!.handle}`,
      },
    ]
  }

  if (currentUser && currentWorkspace) {
    return (
      <>
        <div className="mx-auto w-full border-b border-gray-100 bg-white px-4 text-gray-900 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200 sm:px-6 lg:px-8">
          <div className="hidden sm:block">
            <nav className="flex space-x-8" aria-label="Tabs">
              <button
                onClick={() => {
                  router.back()
                }}
                className="m-2 "
              >
                <Undo32 />{" "}
              </button>
              {tabs.map((tab) => (
                <Link key={tab.name} href={tab.href}>
                  <a
                    className={classNames(
                      tab.current
                        ? "bg-gray-100 dark:bg-gray-800"
                        : "hover:bg-gray-100 dark:hover:bg-gray-800",
                      // tab.count === 0 ? "pointer-events-none text-gray-400 dark:text-gray-700" : "",
                      "group disabled my-2 flex whitespace-nowrap rounded-md py-2 px-4 text-sm font-normal leading-5"
                    )}
                    aria-current={tab.current ? "page" : undefined}
                  >
                    {tab.name}
                    {tab.count ? (
                      <span
                        className={classNames(
                          tab.current
                            ? "bg-indigo-100 text-indigo-800 dark:border dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                            : "bg-gray-100 text-gray-800 group-hover:bg-indigo-100 group-hover:text-indigo-800 dark:border dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:group-hover:bg-gray-700 dark:group-hover:text-gray-200",
                          "ml-3 hidden rounded-full py-0.5 px-2.5 text-xs font-medium md:inline-block"
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
