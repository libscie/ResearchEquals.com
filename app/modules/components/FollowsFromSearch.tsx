import { useMutation } from "blitz"
import Autocomplete from "../../core/components/Autocomplete"
import addParent from "../mutations/addParent"
import { getAlgoliaResults } from "@algolia/autocomplete-js"
import algoliasearch from "algoliasearch"
import SearchResultModule from "../../core/components/SearchResultModule"
import { useState } from "react"
import ManageParents from "./ManageParents"

const searchClient = algoliasearch(process.env.ALGOLIA_APP_ID!, process.env.ALGOLIA_API_SEARCH_KEY!)

const FollowsFromSearch = ({ module, setQueryData }) => {
  const [addParentMutation] = useMutation(addParent)
  const [parentsOpen, setParentsOpen] = useState(false)

  return (
    <div className="flex w-full text-xs leading-4 font-normal text-gray-900 dark:text-gray-200">
      <button
        className="px-2 border dark:bg-gray-800 border-gray-300 dark:border-gray-600 dark:hover:border-gray-400 text-gray-700 dark:text-gray-200 rounded text-xs leading-4 font-normal shadow-sm mx-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 hover:bg-gray-100 dark:hover:bg-gray-700 "
        onClick={() => {
          setParentsOpen(true)
        }}
        disabled={module.parents.length === 0}
      >
        <span className="flex">
          <span>Follows from:</span>
          <span>
            <span className="inline-block h-full align-middle"></span>
            <span className="bg-indigo-100 text-indigo-800 dark:bg-gray-700 dark:text-gray-200 dark:border dark:border-gray-600 px-2 rounded-full text-xs font-medium inline-block align-middle">
              {module?.parents ? module?.parents.length : "0"}
            </span>
          </span>
        </span>
      </button>
      <ManageParents
        open={parentsOpen}
        setOpen={setParentsOpen}
        moduleEdit={module}
        setQueryData={setQueryData}
      />
      <Autocomplete
        className="h-full"
        openOnFocus={true}
        defaultActiveItemId="0"
        getSources={({ query }) => [
          {
            sourceId: "products",
            async onSelect(params) {
              const { item, setQuery } = params
              const updatedMod = await addParentMutation({
                currentId: module?.id,
                connectId: item.objectID,
              })
              setQueryData(updatedMod)
            },
            getItems() {
              return getAlgoliaResults({
                searchClient,
                queries: [
                  {
                    indexName: `${process.env.ALGOLIA_PREFIX}_modules`,
                    query,
                  },
                ],
              })
            },
            templates: {
              item({ item, components }) {
                // TODO: Need to update search results per Algolia index
                return <SearchResultModule item={item} />
              },
            },
          },
        ]}
      />
    </div>
  )
}

export default FollowsFromSearch
