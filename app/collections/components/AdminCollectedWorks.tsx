import { useMutation } from "@blitzjs/rpc"
import { getAlgoliaResults } from "@algolia/autocomplete-js"
import algoliasearch from "algoliasearch"
import SearchResultModule from "app/core/components/SearchResultModule"
import toast from "react-hot-toast"
import AdminWorkCard from "./AdminWorkCard"
import addWork from "../mutations/addWork"
import createReferenceModule from "../../modules/mutations/createReferenceModule"
import Autocomplete from "app/core/components/Autocomplete"

const searchClient = algoliasearch(process.env.ALGOLIA_APP_ID!, process.env.ALGOLIA_API_SEARCH_KEY!)

const CollectedWorks = ({ collection, editorIdSelf, refetchFn, editorIsAdmin }) => {
  const [addWorkMutation] = useMutation(addWork)
  const [createReferenceMutation] = useMutation(createReferenceModule)

  return (
    <div className="mx-4 my-8 xl:mx-0">
      <h2 className="my-4 text-xl">Collected works</h2>
      <div>
        <Autocomplete
          className=""
          openOnFocus={true}
          defaultActiveItemId="0"
          getSources={({ query }) => [
            {
              sourceId: "products",
              async onSelect(params) {
                const { item, setQuery } = params
                await toast.promise(
                  addWorkMutation({
                    collectionId: collection!.id,
                    editorId: editorIdSelf,
                    moduleId: parseInt(item.objectID),
                  }),
                  {
                    loading: "Adding work to collection...",
                    success: () => {
                      refetchFn()
                      return "Added work to collection!"
                    },
                    error: "Failed to add work to collection...",
                  }
                )
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
                  return (
                    <>
                      {item.__autocomplete_indexName.match(/_modules/g) ? (
                        <SearchResultModule item={item} />
                      ) : (
                        ""
                      )}
                    </>
                  )
                },
                noResults() {
                  const matchedQuery = query.match(/10.\d{4,9}\/[-._;()\/:A-Z0-9]+$/i)

                  return (
                    <>
                      {/* https://www.crossref.org/blog/dois-and-matching-regular-expressions/ */}
                      {matchedQuery ? (
                        <>
                          <button
                            className="text-sm font-normal leading-4 text-gray-900 dark:text-gray-200"
                            onClick={async () => {
                              await toast
                                .promise(
                                  createReferenceMutation({
                                    doi: matchedQuery.slice(-1)[0].endsWith("/")
                                      ? matchedQuery.slice(-1)[0].slice(0, -1)
                                      : matchedQuery.slice(-1)[0],
                                  }),
                                  {
                                    loading: "Searching...",
                                    success: "Record added to database",
                                    error: "Could not add record.",
                                  }
                                )
                                .then(async (data) => {
                                  await toast.promise(
                                    addWorkMutation({
                                      collectionId: collection!.id,
                                      editorId: editorIdSelf,
                                      moduleId: data.id,
                                    }),
                                    {
                                      loading: "Adding work to collection...",
                                      success: () => {
                                        refetchFn()
                                        return "Added work to collection!"
                                      },
                                      error: "Failed to add work to collection...",
                                    }
                                  )

                                  refetchFn()
                                })
                            }}
                          >
                            Click here to add {matchedQuery.slice(-1)} to ResearchEquals database
                          </button>
                        </>
                      ) : (
                        <p className="text-sm font-normal leading-4 text-gray-900 dark:text-gray-200">
                          Input a DOI to add
                        </p>
                      )}
                    </>
                  )
                },
              },
            },
          ]}
        />
        {collection?.submissions.map((submission, index) => {
          return (
            <>
              {submission.accepted && (
                <AdminWorkCard
                  submission={submission}
                  index={index}
                  editorIdSelf={editorIdSelf}
                  editorIsAdmin={editorIsAdmin}
                  refetchFn={refetchFn}
                />
              )}
            </>
          )
        })}
      </div>
    </div>
  )
}

export default CollectedWorks
