import Layout from "app/core/layouts/Layout"
import db from "db"
import { Link, useRouter, usePaginatedQuery, useParams, useMutation } from "blitz"
import { Calendar32, Link32, UserFollow32 } from "@carbon/icons-react"
import { ChevronLeftIcon, ChevronRightIcon, ChevronUpIcon } from "@heroicons/react/solid"
import { Suspense } from "react"
import toast, { Toaster } from "react-hot-toast"

import Navbar from "../core/components/Navbar"
import getHandleFeed from "../workspaces/queries/getHandleFeed"
import { useCurrentWorkspace } from "app/core/hooks/useCurrentWorkspace"
import followWorkspace from "../workspaces/mutations/followWorkspace"
import unfollowWorkspace from "../workspaces/mutations/unfollowWorkspace"

const ITEMS_PER_PAGE = 10

export const getServerSideProps = async ({ params }) => {
  const handle = params!.handle
  const workspace = await db.workspace.findFirst({
    where: { handle },
    include: {
      following: true,
      authorships: {
        include: {
          module: true,
        },
      },
    },
  })

  if (!workspace) {
    return {
      notFound: true,
    }
  }

  return { props: { workspace } }
}

const HandlePage = ({ workspace }) => {
  return (
    <>
      <Navbar />
      <Toaster />
      <div className="max-w-7xl bg-pink-100 mx-auto">
        <div className="w-full">
          <div className="flex">
            <div>
              <img src={workspace.avatar} className="rounded-full h-14 w-14" />
            </div>
            <div className="flex-grow ml-4">
              <p className="align-middle">
                {workspace.name} <span className="text-gray-500">({workspace.pronouns})</span>
              </p>
              <p className="text-gray-500">@{workspace.handle}</p>
            </div>
            <div>
              <Suspense fallback="Loading...">
                <FollowButton workspace={workspace} />
              </Suspense>
            </div>
          </div>
          <div>{workspace.bio}</div>

          <div className="sm:flex">
            <p className="flex">
              <span>
                <Calendar32 className="w-4 h-4" />
              </span>
              {workspace.createdAt.toString()}
            </p>
            {workspace.url ? (
              <p className="flex">
                <span>
                  <Link32 className="w-4 h-4" />
                </span>
                <Link href={workspace.url}>
                  <a target="_blank">{workspace.url}</a>
                </Link>
              </p>
            ) : (
              <></>
            )}
            <p className="flex">
              <span>
                <Suspense fallback="Loading...">
                  <UserFollow32 className="w-4 h-4" />
                </Suspense>
              </span>
              Following {workspace.following.length}
            </p>
          </div>
        </div>
        <div className="w-full">
          <h2 className="text-2xl">Published modules</h2>
          <Suspense fallback="Loading...">
            <HandleFeed handle={workspace.handle} />
          </Suspense>
        </div>
      </div>
      {/* <div>{JSON.stringify(workspace)}</div> */}
    </>
  )
}

HandlePage.getLayout = (page) => <Layout title="Handle">{page}</Layout>

export default HandlePage

const FollowButton = ({ workspace }) => {
  const params = useParams()
  const ownWorkspace = useCurrentWorkspace()
  const [followWorkspaceMutation] = useMutation(followWorkspace)
  const [unfollowWorkspaceMutation] = useMutation(unfollowWorkspace)

  console.log(workspace)
  return (
    <>
      {ownWorkspace!.handle === params.handle ? (
        <></>
      ) : ownWorkspace?.following.filter((follows) => follows.handle === params.handle).length ===
        0 ? (
        // TODO: Add action
        <button
          className="py-4 px-2 bg-indigo-600"
          onClick={async () => {
            await followWorkspaceMutation({
              followerId: ownWorkspace?.id!,
              followedId: workspace.id,
            })

            toast((t) => (
              <span>
                Custom and <b>bold</b>
                <button
                  onClick={async () => {
                    await unfollowWorkspaceMutation({
                      followerId: ownWorkspace?.id!,
                      followedId: workspace.id,
                    })
                    toast.dismiss(t.id)
                  }}
                >
                  Undo
                </button>
              </span>
            ))
          }}
        >
          Follow
        </button>
      ) : (
        // TODO: Add action
        <button
          className="py-4 px-2 bg-indigo-600"
          onClick={async () => {
            await unfollowWorkspaceMutation({
              followerId: ownWorkspace?.id!,
              followedId: workspace.id,
            })

            toast((t) => (
              <span>
                Custom and <b>bold</b>
                <button
                  onClick={async () => {
                    await followWorkspaceMutation({
                      followerId: ownWorkspace?.id!,
                      followedId: workspace.id,
                    })
                    toast.dismiss(t.id)
                  }}
                >
                  Undo
                </button>
              </span>
            ))
          }}
        >
          Unfollow
        </button>
      )}
    </>
  )
}

const HandleFeed = ({ handle }) => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const [{ modules, hasMore, count }, { refetch: refetchFeed }] = usePaginatedQuery(getHandleFeed, {
    handle,
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })
  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToPage = (number) => router.push({ query: { page: number } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })
  return (
    <>
      {modules.length > 0 ? (
        <div>
          {modules.map((module) => (
            <div key={module.suffix} className="bg-pink-300 mb-2">
              <div>
                <p>{module.type}</p>
                <p>{module.title}</p>
              </div>
              <div className="flex">
                <div className="flex-grow">
                  <p>DOI: 10.53962/{module.suffix}</p>
                  <p>Published: {module.publishedAt?.toISOString().substring(0, 10)}</p>
                </div>
                <div className="flex -space-x-2 relative z-0 overflow-hidden text-right">
                  {module.authors.map((author) => (
                    <img
                      key={author.id + author.moduleId}
                      // Had an issue here before, noting for future
                      src={author.workspace!.avatar!}
                      className="relative z-30 inline-block h-6 w-6 rounded-full "
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
          <div className="flex">
            <div className="flex-1 flex items-center justify-between">
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{ITEMS_PER_PAGE * page + 1}</span> to{" "}
                <span className="font-medium">
                  {ITEMS_PER_PAGE + page > count ? count : ITEMS_PER_PAGE + page}
                </span>{" "}
                of <span className="font-medium">{count}</span> results
              </p>
            </div>
            <nav
              className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
              aria-label="Pagination"
            >
              <button
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                disabled={page === 0}
                onClick={goToPreviousPage}
              >
                <span className="sr-only">Previous</span>
                <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
              </button>
              {Array.from({ length: Math.ceil(count / ITEMS_PER_PAGE) }, (x, i) => i).map(
                (pageNr) => (
                  <button
                    key={`page-nav-feed-${pageNr}`}
                    className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    disabled={page === pageNr}
                    onClick={() => {
                      goToPage(pageNr)
                    }}
                  >
                    <span className="sr-only">Navigate to page {pageNr}</span>
                    <span className="h-5 w-5 " aria-hidden="true">
                      {pageNr + 1}
                    </span>
                  </button>
                )
              )}
              <button
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                disabled={!hasMore}
                onClick={goToNextPage}
              >
                <span className="sr-only">Previous</span>
                <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </nav>
          </div>
        </div>
      ) : (
        <div className="flex flex-col flex-grow relative block w-full border-2 border-gray-300 border-dashed rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 h-96">
          <div className="table flex-grow w-full">
            <div className="hidden sm:table-cell w-1/4"></div>
            <span className="mx-auto table-cell align-middle leading-normal text-sm font-medium text-gray-900">
              Nothing published yet!
            </span>
            <div className="hidden sm:table-cell w-1/4"></div>
          </div>
        </div>
      )}
    </>
  )
}
