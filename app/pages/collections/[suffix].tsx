import { BlitzPage, useSession, useQuery, useRouter, Link, useMutation } from "blitz"
import Layout from "app/core/layouts/Layout"

import Navbar from "../../core/components/Navbar"
import { useCurrentUser } from "../../core/hooks/useCurrentUser"
import getInvitedModules from "app/workspaces/queries/getInvitedModules"
import { useCurrentWorkspace } from "../../core/hooks/useCurrentWorkspace"
import LayoutLoader from "app/core/components/LayoutLoader"
import getDrafts from "app/core/queries/getDrafts"
import getCollection from "../../collections/queries/getCollection"
import SearchResultModule from "../../core/components/SearchResultModule"
import { getAlgoliaResults } from "@algolia/autocomplete-js"
import toast from "react-hot-toast"
import Autocomplete from "app/core/components/Autocomplete"
import algoliasearch from "algoliasearch"
import addSubmission from "../../collections/mutations/addSubmission"

const searchClient = algoliasearch(process.env.ALGOLIA_APP_ID!, process.env.ALGOLIA_API_SEARCH_KEY!)

const CollectionPage: BlitzPage = () => {
  const currentUser = useCurrentUser()
  const session = useSession()
  const currentWorkspace = useCurrentWorkspace()
  const router = useRouter()
  const [drafts, { refetch }] = useQuery(getDrafts, { session })
  const [invitations] = useQuery(getInvitedModules, { session })
  const [collection] = useQuery(getCollection, router.query.suffix as string)
  const [addSubmissionMutation] = useMutation(addSubmission)

  return (
    <>
      <Navbar
        currentUser={currentUser}
        session={session}
        currentWorkspace={currentWorkspace}
        router={router}
        drafts={drafts}
        invitations={invitations}
        refetchFn={refetch}
      />
      <main className="relative flex">
        {JSON.stringify(collection)}
        {/* Admin portal if editor */}
        {/* add submission */}
        {collection?.type.type === "COMMUNITY" && (
          <Autocomplete
            className=""
            openOnFocus={false}
            defaultActiveItemId="0"
            getSources={({ query }) => [
              {
                sourceId: "products",
                async onSelect(params) {
                  const { item, setQuery } = params
                  toast.promise(
                    addSubmissionMutation({
                      collectionId: collection!.id,
                      workspaceId: currentWorkspace!.id,
                      moduleId: parseInt(item.objectID),
                    }),
                    {
                      loading: "Submitting work to collection...",
                      success: () => {
                        refetch()
                        return "Submitted work to collection!"
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
                },
              },
            ]}
          />
        )}
      </main>
    </>
  )
}

CollectionPage.authenticate = true
CollectionPage.getLayout = (page) => (
  <Layout title="R= Collection">
    <LayoutLoader>{page}</LayoutLoader>
  </Layout>
)

export default CollectionPage
