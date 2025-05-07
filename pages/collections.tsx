import Link from "next/link"
import { useRouter } from "next/router"
import { useQuery } from "@blitzjs/rpc"
import { useSession } from "@blitzjs/auth"
import { BlitzPage } from "@blitzjs/next"
import Layout from "app/core/layouts/Layout"

import Navbar from "app/core/components/Navbar"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import getInvitedModules from "app/workspaces/queries/getInvitedModules"
import { useCurrentWorkspace } from "app/core/hooks/useCurrentWorkspace"
import LayoutLoader from "app/core/components/LayoutLoader"
import getDrafts from "app/core/queries/getDrafts"
import getCollections from "app/collections/queries/getCollections"
import ActivityBadge from "app/collections/components/ActivityBadge"
import DoiCollection from "app/collections/components/DoiCollection"
import EditorsBadge from "app/collections/components/EditorsBadge"
import ContributorsBadge from "app/collections/components/ContributorsBadge"
import CollectionsModal from "app/core/modals/CollectionsModal"
import getMyCollections from "app/collections/queries/getMyCollections"

const CollectionsPage: BlitzPage = () => {
  const currentUser = useCurrentUser()
  const session = useSession()
  const currentWorkspace = useCurrentWorkspace()
  const router = useRouter()
  const [drafts, { refetch }] = useQuery(getDrafts, { session })
  const [invitations] = useQuery(getInvitedModules, { session })
  // get collections
  const [collections] = useQuery(getCollections, null)
  const [draftCollections] = useQuery(getMyCollections, { session: session.workspaceId })

  return (
    <>
      <Navbar />

      <main className="w-full p-8">
        {session.workspaceId && draftCollections.length > 0 && (
          <>
            <h2 className="mb-4 text-center text-3xl font-extrabold">Your Collections</h2>
            <div className="collections mx-auto grid grid-cols-2 grid-cols-3 gap-x-8 gap-y-12 md:grid-cols-4 lg:grid-cols-6">
              {draftCollections.map((collection, index) => {
                return <CollectionCard collection={collection} isAdmin={true} key={collection.id} />
              })}
            </div>
          </>
        )}
        {session.workspaceId && draftCollections.length > 0 && (
          <h2 className="my-8 text-center text-3xl font-extrabold">All Collections</h2>
        )}
        <div className="collections mx-auto grid grid-cols-2 grid-cols-3 gap-x-8 gap-y-12 md:grid-cols-4 lg:grid-cols-6">
          {collections.map((collection, index) => {
            return <CollectionCard collection={collection} isAdmin={false} key={collection.id} />
          })}
        </div>
        <div className="collection-4-sky my-12 rounded-md bg-sky-200 dark:bg-sky-700">
          <div className="mx-auto max-w-2xl py-16 px-4 text-center sm:py-20 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              <span className="block font-serif">Start collecting today.</span>
            </h2>
            <p className="mt-4 text-lg leading-6 text-gray-900 dark:text-gray-200">
              This is your opportunity to become your own editor.
            </p>
            <CollectionsModal
              styling="mt-8 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-sky-50 px-5 py-3 text-base font-medium text-sky-700  hover:bg-sky-100 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-0 dark:border dark:border-gray-600 dark:bg-gray-800 dark:text-sky-500 dark:hover:border-gray-400 dark:hover:bg-gray-700 sm:w-auto"
              button={"Create a collection"}
              user={currentUser}
              workspace={currentWorkspace}
            />
          </div>
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

const CollectionCard = ({ collection, isAdmin }) => {
  return (
    <Link
      key={collection.suffix}
      href={
        isAdmin ? `/collections/${collection.suffix}/admin` : `/collections/${collection.suffix}`
      }
      legacyBehavior
    >
      <div
        className={`${
          collection.type.type === "COMMUNITY"
            ? `col-span-3 row-span-4 bg-indigo-200 text-2xl dark:bg-indigo-600 lg:row-span-2 collection-${
                collection.submissions.length > 4 ? "4" : collection.submissions.length
              }`
            : collection.type.type === "COLLABORATIVE"
              ? `col-span-2 row-span-2 bg-teal-200 text-lg dark:bg-teal-600 collection-${
                  collection.submissions.length > 4 ? "4" : collection.submissions.length
                }-teal`
              : `col-span-1 bg-amber-200 text-base dark:bg-amber-600 md:col-span-1 collection-${
                  collection.submissions.length > 4 ? "4" : collection.submissions.length
                }-amber`
        }  cursor-pointer rounded-md bg-cover bg-center`}
        key={collection.id}
      >
        <div className="relative flex h-full flex-col">
          <div className="mx-auto flex w-full p-4">
            {collection.type.type != "INDIVIDUAL" ? (
              <>
                <img
                  src={collection.icon!["cdnUrl"]!}
                  className="max-w-56 mx-4 inline-block max-h-12 w-auto align-middle dark:invert"
                  alt={`Icon of ${collection.title}`}
                  loading="lazy"
                />
                <div>
                  <span className="inline-block h-full align-middle"> </span>
                  <h2 className="inline-block text-ellipsis align-middle font-serif font-medium leading-6">
                    {collection.title}
                  </h2>
                </div>
              </>
            ) : (
              <h2 className="overflow-hidden text-ellipsis font-serif font-medium leading-6 ">
                {collection.title}
              </h2>
            )}
          </div>
          {collection.type.type != "INDIVIDUAL" && (
            <div className="flex p-4">
              <p className="flex-grow text-xs">
                <span
                  dangerouslySetInnerHTML={{
                    __html: collection.description as string,
                  }}
                  className="quilljs-collection line-clamp-6 text-gray-900 dark:text-white"
                />
              </p>
              <div className="scale-90">
                <DoiCollection collection={collection} />
                {!isAdmin && <ActivityBadge collection={collection} />}
                <EditorsBadge collection={collection} />
                <ContributorsBadge collection={collection} nrContributors="" />
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
