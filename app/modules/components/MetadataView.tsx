import Autocomplete from "app/core/components/Autocomplete"
import { Link, useMutation } from "blitz"
import moment from "moment"
import toast from "react-hot-toast"
import algoliasearch from "algoliasearch"
import { getAlgoliaResults } from "@algolia/autocomplete-js"
import { Add } from "@carbon/icons-react"
import ISO6391 from "iso-639-1"

import addAuthor from "../mutations/addAuthor"
import AuthorAvatarsNew from "./AuthorAvatarsNew"
import SearchResultWorkspace from "../../core/components/SearchResultWorkspace"
import { useState } from "react"
import ManageAuthors from "./ManageAuthors"
import FollowsFromSearch from "./FollowsFromSearch"
import removeInvitation from "app/authorship/mutations/removeInvitation"
import ModuleEdit from "./ModuleEdit"

const searchClient = algoliasearch(process.env.ALGOLIA_APP_ID!, process.env.ALGOLIA_API_SEARCH_KEY!)

const MetadataView = ({ module, addAuthors, setQueryData, setAddAuthors }) => {
  const [addAuthorMutation] = useMutation(addAuthor)
  const [removeInvitationMutation] = useMutation(removeInvitation)

  const [manageAuthorsOpen, setManageAuthorsOpen] = useState(false)

  return (
    <div className="module my-4 bg-gray-100 dark:bg-gray-600" style={{ padding: "1px" }}>
      <div className="module divide-y divide-gray-100 border-0 border-gray-100 bg-white dark:divide-gray-600 dark:border-gray-600 dark:bg-gray-900">
        <div className="divide-y divide-gray-100 text-center text-sm font-normal leading-4 text-gray-500 dark:divide-gray-600 dark:bg-gray-800 dark:text-gray-200 lg:flex lg:divide-y-0 lg:divide-x">
          <div className="flex-grow py-2">Updated: {moment(module.updatedAt).fromNow()}</div>
          <div className="flex-grow py-2">
            DOI:{" "}
            <span className="text-gray-300 dark:text-gray-600">{`${module.prefix}/${module.suffix}`}</span>
          </div>
          <div className="flex-grow py-2">
            License:{" "}
            <Link href={module.license!.url!}>
              <a target="_blank">{module.license!.name}</a>
            </Link>
          </div>
          {ISO6391.getName(module.language) && (
            <div className="flex-grow py-2">{ISO6391.getName(module.language)}</div>
          )}
        </div>
        <div className="min-h-32 py-4 px-2">
          <p className="text-sm font-normal leading-4 text-gray-500 dark:text-white">
            {module.type.name}
          </p>
          <p className="text-xl font-medium leading-6  text-gray-900 dark:text-white">
            {module.title}
          </p>
        </div>
        {/* Authors section */}
        <div className="sm:place-items-left place-items-center px-1 py-1 sm:flex">
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
                <div className="h-full w-28 sm:w-56">
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
                                  return (
                                    <>
                                      Author invited.
                                      <button
                                        className="ml-1 underline"
                                        onClick={async () => {
                                          const updatedModule = await removeInvitationMutation({
                                            workspaceId: parseInt(item.objectID),
                                            moduleId: module.id,
                                          })
                                          setQueryData(updatedModule)
                                        }}
                                      >
                                        Undo invitation.
                                      </button>
                                    </>
                                  )
                                },
                                error: "Uh-oh something went wrong.",
                              },
                              { duration: 10000 }
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
                className="mx-1 flex rounded border border-gray-300 px-2 py-2 text-sm font-normal leading-4 text-gray-700 shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:border-gray-400 dark:hover:bg-gray-700"
                onClick={() => {
                  setAddAuthors(true)
                }}
              >
                <Add
                  size={32}
                  className="h-4 w-4 fill-current text-gray-500 dark:text-gray-200 dark:hover:text-gray-400"
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
                  className="mx-1 flex rounded border border-gray-300 px-2 py-2 text-sm font-normal leading-4 text-gray-700 shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:border-gray-400 dark:hover:bg-gray-700"
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
        <div className="pt-4 pl-2 pr-4 pb-2 text-base font-normal leading-6">
          <h2 className="italic">Summary</h2>
          {module.description}
        </div>
      </div>
    </div>
  )
}

export default MetadataView
