import { Link, Routes, useQuery, useSession, useRouter } from "blitz"
import { getAlgoliaResults } from "@algolia/autocomplete-js"
import algoliasearch from "algoliasearch"
import SearchResultWorkspace from "./SearchResultWorkspace"
import SearchResultModule from "./SearchResultModule"
import ResearchEqualsLogo from "./ResearchEqualsLogo"

import Autocomplete from "./Autocomplete"
import NavbarFullwidthMenu from "./NavbarFullwidthMenu"
import NavbarDropdown from "./NavbarDropdown"
import NavbarTabs from "./NavbarTabs"
import getInvitedModules from "app/workspaces/queries/getInvitedModules"
import { useCurrentUser } from "../hooks/useCurrentUser"
import { useCurrentWorkspace } from "../hooks/useCurrentWorkspace"
import getDrafts from "../queries/getDrafts"

const searchClient = algoliasearch(process.env.ALGOLIA_APP_ID!, process.env.ALGOLIA_API_SEARCH_KEY!)

const Navbar = ({ currentUser, session, currentWorkspace, router, drafts, invitations }) => {
  return (
    <>
      <div className="w-full bg-white dark:bg-gray-900 mx-auto px-4 sm:px-6 lg:px-8 z-50 border-b dark:border-gray-600 border-gray-100">
        <div className="relative flex justify-between xl:grid xl:grid-cols-12 lg:gap-8">
          <div className="flex md:absolute md:left-0 md:inset-y-0 lg:static xl:col-span-2">
            <div className="flex-shrink-0 flex items-center my-2">
              <Link href={Routes.Home()}>
                <a>
                  <ResearchEqualsLogo />
                </a>
              </Link>
            </div>
          </div>
          <div className="min-w-0 flex-1 md:px-8 lg:px-0 xl:col-span-6">
            <div className="flex items-center px-6 py-4 md:max-w-3xl md:mx-auto lg:max-w-none lg:mx-0 xl:px-0">
              <div className="flex-grow"></div>
              <div className="w-full">
                <label htmlFor="search" className="sr-only">
                  Search
                </label>
                <Autocomplete
                  className="h-full"
                  openOnFocus={true}
                  defaultActiveItemId="0"
                  getSources={({ query }) => [
                    {
                      sourceId: "products",
                      async onSelect(params) {
                        const { item, setQuery } = params
                        if (item.handle) {
                          router.push(`/${item.handle}`)
                        }
                        if (item.suffix) {
                          router.push(`/modules/${item.suffix}`)
                        }
                      },
                      getItems() {
                        return getAlgoliaResults({
                          searchClient,
                          queries: [
                            {
                              indexName: `${process.env.ALGOLIA_PREFIX}_workspaces`,
                              query,
                            },
                            {
                              indexName: `${process.env.ALGOLIA_PREFIX}_modules`,
                              query: `${query} ${process.env.DOI_PREFIX}`,
                            },
                          ],
                        })
                      },
                      templates: {
                        item({ item, components }) {
                          return (
                            <>
                              {item.__autocomplete_indexName.match(/_workspaces/g) ? (
                                <SearchResultWorkspace item={item} />
                              ) : (
                                ""
                              )}
                              {item.__autocomplete_indexName.match(/_modules/g) ? (
                                <SearchResultModule item={item} />
                              ) : (
                                ""
                              )}
                            </>
                          )
                        },
                      },
                    },
                  ]}
                />
              </div>
              <div className="flex-grow"></div>
            </div>
          </div>
          <div className="flex items-center md:absolute md:right-0 md:inset-y-0 lg:hidden">
            <NavbarDropdown
              currentUser={currentUser}
              currentWorkspace={currentWorkspace}
              router={router}
              invitedModules={invitations}
              drafts={drafts}
            />
          </div>
          <NavbarFullwidthMenu
            currentUser={currentUser}
            session={session}
            router={router}
            currentWorkspace={currentWorkspace}
            invitedModules={invitations}
          />
        </div>
      </div>
      <NavbarTabs
        currentUser={currentUser}
        currentWorkspace={currentWorkspace}
        session={session}
        router={router}
        drafts={drafts}
        invitations={invitations}
      />
    </>
  )
}

export default Navbar
