import Autocomplete from "app/core/components/Autocomplete"
import { Link, useMutation } from "blitz"
import moment from "moment"
import toast from "react-hot-toast"
import algoliasearch from "algoliasearch"
import { getAlgoliaResults } from "@algolia/autocomplete-js"
import { Add32 } from "@carbon/icons-react"

import addAuthor from "../mutations/addAuthor"
import AuthorAvatarsNew from "./AuthorAvatarsNew"
import SearchResultWorkspace from "../../core/components/SearchResultWorkspace"
import { useState } from "react"
import ManageAuthors from "./ManageAuthors"
import FollowsFromSearch from "./FollowsFromSearch"

const searchClient = algoliasearch(process.env.ALGOLIA_APP_ID!, process.env.ALGOLIA_API_SEARCH_KEY!)

const MetadataView = ({ module, addAuthors, setQueryData, setAddAuthors }) => {
  const [addAuthorMutation] = useMutation(addAuthor)
  const [manageAuthorsOpen, setManageAuthorsOpen] = useState(false)

  return (
    <div className="module bg-gray-100 dark:bg-gray-600 my-4" style={{ padding: "1px" }}>
      <div className="module bg-white dark:bg-gray-900 border-0 border-gray-100 dark:border-gray-600 divide-y divide-gray-100 dark:divide-gray-600">
        <div className="lg:flex text-center divide-y lg:divide-y-0 lg:divide-x divide-gray-100 dark:divide-gray-600 text-gray-500 dark:text-gray-200 dark:bg-gray-800 text-sm leading-4 font-normal">
          <div className="flex-grow py-2">Last updated: {moment(module.updatedAt).fromNow()}</div>
          <div className="flex-grow py-2">
            DOI upon publish:{" "}
            <span className="text-gray-300 dark:text-gray-600">{`${module.prefix}/${module.suffix}`}</span>
          </div>
          <div className="flex-grow py-2">
            License:{" "}
            <Link href={module.license!.url!}>
              <a target="_blank">{module.license!.name}</a>
            </Link>
          </div>
        </div>
        <div className="py-4 px-2 min-h-32">
          <p className="text-sm leading-4 font-normal text-gray-500 dark:text-white">
            {module.type.name}
          </p>
          <p className="text-xl leading-6 font-medium  text-gray-900 dark:text-white">
            {module.title}
          </p>
        </div>
        {/* Authors section */}
        <div className="px-1 py-1 sm:flex place-items-center sm:place-items-left">
          <div className="flex sm:inline">
            <span className="flex-grow"></span>

            <AuthorAvatarsNew authors={module.authors} size="h-12 w-12" toDisplay={4} />
            <span className="flex-grow"></span>
          </div>
          <span className="sm:flex-grow"></span>
          <div className="flex sm:contents">
            <span className="flex-grow sm:hidden"></span>

            {addAuthors ? (
              <>
                <div className="w-28 sm:w-56 h-full">
                  <Autocomplete
                    openOnFocus={true}
                    defaultActiveItemId="0"
                    getSources={({ query }) => [
                      {
                        sourceId: "products",
                        async onSelect(params) {
                          const { item, setQuery } = params
                          try {
                            toast.promise(
                              addAuthorMutation({
                                authorId: item.objectID,
                                moduleId: module.id,
                                authorshipRank:
                                  Math.max.apply(
                                    Math,
                                    module.authors.map(function (o) {
                                      return o.authorshipRank
                                    })
                                  ) + 1,
                              }),
                              {
                                loading: "Loading",
                                success: (data) => {
                                  setQueryData(data)
                                  return "Author invited"
                                },
                                error: "Uh-oh something went wrong.",
                              }
                            )
                            // const updatedModule = await addAuthorMutation({
                            //   authorId: item.objectID,
                            //   moduleId: module.id,
                            //   authorshipRank:
                            //     Math.max.apply(
                            //       Math,
                            //       module.authors.map(function (o) {
                            //         return o.authorshipRank
                            //       })
                            //     ) + 1,
                            // })
                            // toast.success("Author invited")
                            // setQueryData(updatedModule)
                          } catch (error) {
                            toast.error("Something went wrong")
                          }
                          setQuery("")
                        },
                        getItems() {
                          return getAlgoliaResults({
                            searchClient,
                            queries: [
                              {
                                indexName: `${process.env.ALGOLIA_PREFIX}_workspaces`,
                                query,
                              },
                            ],
                          })
                        },
                        templates: {
                          item({ item, components }) {
                            return <SearchResultWorkspace item={item} />
                          },
                        },
                      },
                    ]}
                  />
                </div>
              </>
            ) : (
              <button
                className="flex px-2 py-2 border dark:bg-gray-800 border-gray-300 dark:border-gray-600 dark:hover:border-gray-400 text-gray-700 dark:text-gray-200 rounded text-sm leading-4 font-normal shadow-sm mx-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => {
                  setAddAuthors(true)
                }}
              >
                <Add32
                  className="fill-current text-gray-500 dark:text-gray-200 w-4 h-4 dark:hover:text-gray-400"
                  aria-hidden="true"
                />
                Add Authors
              </button>
            )}
            {module.authors.length === 1 ? (
              ""
            ) : (
              <>
                <button
                  className="flex px-2 py-2 border dark:bg-gray-800 border-gray-300 dark:border-gray-600 dark:hover:border-gray-400 text-gray-700 dark:text-gray-200 rounded text-sm leading-4 font-normal shadow-sm mx-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => {
                    setManageAuthorsOpen(true)
                  }}
                >
                  Manage Authors
                </button>
                <ManageAuthors
                  open={manageAuthorsOpen}
                  setOpen={setManageAuthorsOpen}
                  moduleEdit={module}
                  setQueryData={setQueryData}
                />{" "}
              </>
            )}

            <span className="flex-grow sm:hidden"></span>
          </div>
        </div>
        {/* Description section */}
        <div className="text-base leading-6 font-normal pt-4 pl-2 pr-4 pb-2">
          {module.description}
        </div>
      </div>
    </div>
  )
}

export default MetadataView
