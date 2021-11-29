import { Link, Routes, useQuery } from "blitz"
import { Suspense } from "react"
import { ProgressBarRound32 } from "@carbon/icons-react"
import { getAlgoliaResults } from "@algolia/autocomplete-js"
import algoliasearch from "algoliasearch"
import { Blog32 } from "@carbon/icons-react"
import SearchResultWorkspace from "./SearchResultWorkspace"
import SearchResultModule from "./SearchResultModule"
import ResearchEqualsLogo from "./ResearchEqualsLogo"

import "@algolia/autocomplete-theme-classic"
import Autocomplete from "./Autocomplete"
import NavbarFullwidthMenu from "./NavbarFullwidthMenu"
import NavbarDropdown from "./NavbarDropdown"
import NavbarTabs from "./NavbarTabs"
import router from "next/router"

const searchClient = algoliasearch(process.env.ALGOLIA_APP_ID!, process.env.ALGOLIA_API_SEARCH_KEY!)

const Navbar = () => {
  return (
    <>
      <div className="w-full bg-gray-700 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex justify-between xl:grid xl:grid-cols-12 lg:gap-8">
          <div className="flex md:absolute md:left-0 md:inset-y-0 lg:static xl:col-span-2">
            <div className="flex-shrink-0 flex items-center">
              {/* TODO: Replace w logo */}
              <Link href={Routes.Home()}>
                <a>
                  <ResearchEqualsLogo />
                </a>
              </Link>
            </div>
          </div>
          <div className="min-w-0 flex-1 md:px-8 lg:px-0 xl:col-span-6">
            <div className="flex items-center px-6 py-4 md:max-w-3xl md:mx-auto lg:max-w-none lg:mx-0 xl:px-0">
              <div className="w-full">
                <label htmlFor="search" className="sr-only">
                  Search
                </label>
                {/* TODO: Add algolia search in here */}
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
                              query,
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
            </div>
          </div>
          <div className="flex items-center md:absolute md:right-0 md:inset-y-0 lg:hidden">
            <Suspense
              fallback={
                <div className="hidden lg:flex lg:items-center lg:justify-end xl:col-span-4">
                  <ProgressBarRound32 className="animate-spin text-white dark:text-white" />
                </div>
              }
            >
              <NavbarDropdown />
            </Suspense>
          </div>
          <Suspense
            fallback={
              <div className="hidden lg:flex lg:items-center lg:justify-end xl:col-span-4">
                <ProgressBarRound32 className="animate-spin text-white dark:text-white" />
              </div>
            }
          >
            <NavbarFullwidthMenu />
          </Suspense>
        </div>
      </div>
      <Suspense fallback="">
        <NavbarTabs />
      </Suspense>
    </>
  )
}

export default Navbar
