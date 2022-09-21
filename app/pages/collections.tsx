import { BlitzPage, useSession, useQuery, useRouter, Link } from "blitz"
import Layout from "app/core/layouts/Layout"

import Navbar from "../core/components/Navbar"
import { useCurrentUser } from "../core/hooks/useCurrentUser"
import getInvitedModules from "app/workspaces/queries/getInvitedModules"
import { useCurrentWorkspace } from "../core/hooks/useCurrentWorkspace"
import LayoutLoader from "app/core/components/LayoutLoader"
import getDrafts from "app/core/queries/getDrafts"
import getCollections from "../collections/queries/getCollections"
import ActivityBadge from "app/collections/components/ActivityBadge"
import DoiCollection from "app/collections/components/DoiCollection"
import EditorsBadge from "app/collections/components/EditorsBadge"
import ContributorsBadge from "app/collections/components/ContributorsBadge"

const CollectionsPage: BlitzPage = () => {
  const currentUser = useCurrentUser()
  const session = useSession()
  const currentWorkspace = useCurrentWorkspace()
  const router = useRouter()
  const [drafts, { refetch }] = useQuery(getDrafts, { session })
  const [invitations] = useQuery(getInvitedModules, { session })
  // get collections
  const [collections] = useQuery(getCollections, null)
  // get my collections
  // get followed collections

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
      <main className="w-full p-8">
        <div className="collections mx-auto grid grid-cols-2 gap-x-8 gap-y-12 md:grid-cols-4 lg:grid-cols-7">
          {collections.map((collection, index) => {
            return (
              <Link key={collection.suffix} href={`/collections/${collection.suffix}`}>
                <div
                  className={`${
                    collection.type.type === "COMMUNITY"
                      ? `col-span-3 row-span-4 bg-indigo-200 text-2xl dark:bg-indigo-600 lg:row-span-2 collection-${
                          collection.submissions.length > 4 ? "4" : collection.submissions.length
                        }`
                      : collection.type.type === "COLLABORATIVE"
                      ? `col-span-2 bg-teal-200 text-lg dark:bg-teal-600 collection-${
                          collection.submissions.length > 4 ? "4" : collection.submissions.length
                        }-teal`
                      : `bg-amber-200 text-base dark:bg-amber-600 collection-${
                          collection.submissions.length > 4 ? "4" : collection.submissions.length
                        }-amber`
                  }  cursor-pointer rounded-md bg-cover bg-center`}
                  key={`${collection.title}-${index}`}
                >
                  <div className="relative flex h-full flex-col">
                    <div className="mx-auto flex w-full p-4">
                      {collection.type.type != "INDIVIDUAL" ? (
                        <>
                          <img
                            src={collection.icon!["cdnUrl"]!}
                            className="max-w-56 mx-4 inline-block max-h-12 w-auto align-middle"
                            alt=""
                            loading="lazy"
                          />
                          <div>
                            <span className="inline-block h-full align-middle"> </span>
                            <h2 className="inline-block align-middle font-serif font-medium leading-6">
                              {collection.title}
                            </h2>
                          </div>
                        </>
                      ) : (
                        <h2 className="font-serif font-medium leading-6">{collection.title}</h2>
                      )}
                    </div>
                    {collection.type.type === "COMMUNITY" && (
                      <div className="flex p-4">
                        <p className="flex-grow text-xs line-clamp-2">
                          <span
                            dangerouslySetInnerHTML={{
                              __html: collection.description as string,
                            }}
                            className="quilljs-collection text-white"
                          />
                        </p>
                        <div className="scale-90">
                          <DoiCollection collection={collection} />
                          <ActivityBadge collection={collection} />
                          <EditorsBadge collection={collection} />
                          <ContributorsBadge collection={collection} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </main>
    </>
  )
}

CollectionsPage.getLayout = (page) => (
  <Layout title="R= Collections">
    <LayoutLoader>{page}</LayoutLoader>
  </Layout>
)

export default CollectionsPage
