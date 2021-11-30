import Layout from "app/core/layouts/Layout"
import db from "db"
import { Link, useRouter, usePaginatedQuery, useParams, useMutation } from "blitz"
import { Calendar32, Link32, UserFollow32 } from "@carbon/icons-react"
import { ChevronLeftIcon, ChevronRightIcon, ChevronUpIcon } from "@heroicons/react/solid"
import { Suspense } from "react"
import toast, { Toaster } from "react-hot-toast"
import moment from "moment"

import Navbar from "../core/components/Navbar"
import getHandleFeed from "../workspaces/queries/getHandleFeed"
import { useCurrentWorkspace } from "app/core/hooks/useCurrentWorkspace"
import followWorkspace from "../workspaces/mutations/followWorkspace"
import unfollowWorkspace from "../workspaces/mutations/unfollowWorkspace"
import ModuleCard from "../core/components/ModuleCard"

const ITEMS_PER_PAGE = 10

export const getServerSideProps = async ({ params }) => {
  const handle = params!.handle.toLowerCase()
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
    <Layout title={`R=${workspace.name || workspace.handle}`}>
      <div className="bg-gray-300 dark:bg-gray-300 text-gray-900 dark:text-gray-900 h-full">
        <Navbar />
        <Toaster position="bottom-center" reverseOrder={false} />{" "}
        <div className="max-w-7xl mx-2 sm:mx-auto">
          <div className="w-full">
            <div className="flex my-8">
              <div>
                <img src={workspace.avatar} className="rounded-full h-28 w-28" />
              </div>
              <div className="flex-grow ml-4">
                <span className="inline-block h-full align-middle"> </span>
                <p className="inline-block align-middle">
                  {workspace.name ? workspace.name : ""}{" "}
                  {workspace.pronouns ? (
                    <span className="text-gray-500">({workspace.pronouns})</span>
                  ) : (
                    ""
                  )}
                  {workspace.orcid ? (
                    <p>
                      <Link href={`https://orcid.org/${workspace.orcid}`}>
                        <a target="_blank" className="text-gray-500">
                          {workspace.orcid}
                        </a>
                      </Link>
                    </p>
                  ) : (
                    ""
                  )}
                  <p className="text-gray-500">@{workspace.handle}</p>
                </p>
              </div>
              {workspace ? (
                <div>
                  <Suspense fallback="Loading...">
                    <FollowButton workspace={workspace} />
                  </Suspense>
                </div>
              ) : (
                ""
              )}
            </div>
            <div className="my-4">{workspace.bio}</div>

            <div className="sm:flex">
              <p className="flex mr-2">
                <p>
                  <span className="inline-block h-full align-middle"> </span>
                  <Calendar32 className="w-4 h-4 inline-block align-middle mr-1" />
                  Signed up {moment(workspace.createdAt).fromNow()}
                </p>
              </p>
              {workspace.url ? (
                <p className="flex mr-2">
                  <p>
                    <span className="inline-block h-full align-middle"> </span>
                    <Link32 className="w-4 h-4  inline-block align-middle mr-1" />
                    <Link href={workspace.url}>
                      <a target="_blank" className="mr-2">
                        {workspace.url}
                      </a>
                    </Link>
                  </p>
                </p>
              ) : (
                <></>
              )}
              <p className="flex mr-2">
                <p>
                  <span className="inline-block h-full align-middle"> </span>
                  <UserFollow32 className="w-4 h-4  inline-block align-middle mr-1" />
                  Following <Suspense fallback="Loading...">{workspace.following.length}</Suspense>
                </p>
              </p>
            </div>
          </div>
          <div className="w-full ">
            <h2 className="text-2xl my-4">Published modules</h2>
            <Suspense fallback="Loading...">
              <HandleFeed handle={workspace.handle} />
            </Suspense>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default HandlePage

const FollowButton = ({ workspace }) => {
  const params = useParams()
  const ownWorkspace = useCurrentWorkspace()
  const [followWorkspaceMutation] = useMutation(followWorkspace)
  const [unfollowWorkspaceMutation] = useMutation(unfollowWorkspace)

  return (
    <>
      {ownWorkspace ? (
        ownWorkspace!.handle === params.handle ? (
          <></>
        ) : ownWorkspace?.following.filter((follows) => follows.handle === params.handle).length ===
          0 ? (
          <>
            <span className="inline-block h-full align-middle"></span>
            <button
              className="py-2 px-2 text-gray-500 rounded border border-gray-500 bg-gray-300 hover:bg-gray-400 inline-block align-middle"
              onClick={async () => {
                // TODO: Add action

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
          </>
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
        )
      ) : (
        ""
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
          <ul role="list" className="divide-y divide-gray-200 border border-gray-500">
            {modules.map((module) => (
              <>
                <li
                  onClick={() => {
                    router.push(`/modules/${module.suffix}`)
                  }}
                  className="cursor-pointer"
                >
                  <ModuleCard
                    type={module.type}
                    title={module.title}
                    status={`DOI: 10.53962/${module.suffix}`}
                    time={moment(module.publishedAt).fromNow()}
                    authors={module.authors}
                  />
                </li>
              </>
            ))}
          </ul>
          {/* TODO: Put into one component - also used in dashboard.tsx */}
          <div className="flex my-1">
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
              className="relative z-0 inline-flex rounded-md -space-x-px"
              aria-label="Pagination"
            >
              <button
                className="relative inline-flex items-center px-2 py-2 bg-gray-300 text-sm font-medium text-gray-500 hover:bg-gray-400"
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
                    className="relative inline-flex items-center px-2 py-2 bg-gray-300 text-sm font-medium text-gray-500 hover:bg-gray-400"
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
                className="relative inline-flex items-center px-2 py-2 bg-gray-300 text-sm font-medium text-gray-500 hover:bg-gray-400"
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
        <div className="flex flex-col flex-grow relative w-full border-2 border-gray-400 border-dashed rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 h-28">
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
