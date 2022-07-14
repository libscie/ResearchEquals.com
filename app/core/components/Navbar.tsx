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

const searchClient = algoliasearch(process.env.ALGOLIA_APP_ID!, process.env.ALGOLIA_API_SEARCH_KEY!)

const Navbar = () => {
  const router = useRouter()

  return (
    <>
      <div className="z-50 mx-auto w-full border-b border-gray-100 bg-white px-4 dark:border-gray-600 dark:bg-gray-900 sm:px-6 lg:px-8">
        <div className="relative flex justify-between lg:gap-8 xl:grid xl:grid-cols-12">
          <div className="flex md:absolute md:inset-y-0 md:left-0 lg:static xl:col-span-2">
            <div className="my-2 flex shrink-0 items-center">
              <Link href={Routes.Home()}>
                <a>
                  <ResearchEqualsLogo />
                </a>
              </Link>
            </div>
          </div>
          <div className="min-w-0 flex-1 md:px-8 lg:px-0 xl:col-span-6">
            <div className="flex items-center px-6 py-4 md:mx-auto md:max-w-3xl lg:mx-0 lg:max-w-none xl:px-0">
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
          <div className="flex items-center md:absolute md:inset-y-0 md:right-0 lg:hidden">
            <NavbarDropdown router={router} />
          </div>
          <NavbarFullwidthMenu router={router} />
        </div>
      </div>
      <NavbarTabs router={router} />
    </>
  )
}

export default Navbar
