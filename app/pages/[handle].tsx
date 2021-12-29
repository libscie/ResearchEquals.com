import Layout from "app/core/layouts/Layout"
import db from "db"
import { Link, useRouter, usePaginatedQuery, useParams, useMutation, useQuery } from "blitz"
import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  LinkIcon,
  UserAddIcon,
} from "@heroicons/react/solid"
import { Suspense } from "react"
import toast from "react-hot-toast"
import moment from "moment"

import Navbar from "../core/components/Navbar"
import getHandleFeed from "../workspaces/queries/getHandleFeed"
import followWorkspace from "../workspaces/mutations/followWorkspace"
import unfollowWorkspace from "../workspaces/mutations/unfollowWorkspace"
import ModuleCard from "../core/components/ModuleCard"
import getCurrentWorkspace from "app/workspaces/queries/getCurrentWorkspace"
import SettingsModal from "../core/modals/settings"
import getCurrentUser from "app/users/queries/getCurrentUser"
import HandlePanel from "../modules/components/HandlePanel"
import UnfollowButton from "../workspaces/components/UnfollowButton"
import FollowButton from "../workspaces/components/FollowButton"
import FeedPagination from "../core/components/FeedPagination"

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
      <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 h-full">
        <Navbar />
        <div className="lg:flex max-w-full mx-4">
          <div className="w-full lg:w-1/2 xl:w-1/3">
            <div className="flex my-8 lg:mr-8">
              <div className="w-14 h-14">
                <img src={workspace.avatar} className="rounded-full h-14 w-14 max-h-14 max-w-14" />
              </div>
              <div className="flex-grow ml-4">
                <span className="inline-block h-full align-middle"> </span>
                <p className="inline-block align-middle text-base leading-6 font-medium text-gray-900 dark:text-gray-200">
                  {workspace.name ? workspace.name : ""}{" "}
                  {workspace.pronouns ? (
                    <span className="text-gray-500 dark:text-gray-200">({workspace.pronouns})</span>
                  ) : (
                    ""
                  )}
                  <p className="text-base leading-6 font-medium text-gray-500 dark:text-gray-200">
                    @{workspace.handle}
                  </p>
                </p>
              </div>
              {workspace ? (
                <div>
                  <Suspense fallback="Loading...">
                    <FollowHandleButton workspace={workspace} />
                  </Suspense>
                </div>
              ) : (
                ""
              )}
            </div>
            <div className="my-4 text-sm leading-4 font-normal text-gray-900 dark:text-gray-200 w-11/12">
              {workspace.bio}
            </div>

            <div>
              <p className="flex my-2 text-sm leading-4 font-normal text-gray-500 dark:text-gray-200">
                <p>
                  <span className="inline-block h-full align-middle"> </span>
                  <CalendarIcon className="w-4 h-4 inline-block align-middle mr-1 text-gray-700 dark:text-gray-400" />
                  Signed up {moment(workspace.createdAt).fromNow()}
                </p>
              </p>
              {workspace.orcid ? (
                <p className="flex my-2 text-sm leading-4 font-normal text-gray-500 dark:text-gray-200">
                  <p>
                    <span className="inline-block h-full align-middle"> </span>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4 inline-block align-middle mr-1 fill-current text-gray-700 dark:text-gray-400"
                    >
                      <path d="M12.6007 8.01734C12.3707 7.91001 12.1533 7.838 11.9473 7.804C11.742 7.76868 11.4127 7.752 10.9567 7.752H9.77266V12.6793H10.9867C11.46 12.6793 11.828 12.6467 12.0907 12.582C12.3533 12.5173 12.572 12.436 12.7473 12.336C12.9227 12.2367 13.0833 12.1147 13.2293 11.9687C13.6967 11.494 13.9307 10.8953 13.9307 10.1713C13.9307 9.45998 13.6907 8.87932 13.21 8.42998C13.0327 8.26331 12.8287 8.12531 12.6007 8.0173V8.01734ZM10 2C5.58134 2 2 5.582 2 10C2 14.418 5.58134 18 10 18C14.4187 18 18 14.418 18 10C18 5.582 14.4187 2 10 2ZM7.34399 13.5327H6.39598V6.908H7.34399V13.5327ZM6.86934 6.21601C6.51001 6.21601 6.21734 5.92534 6.21734 5.564C6.21734 5.20534 6.50933 4.91268 6.86934 4.91268C7.23 4.91268 7.522 5.20467 7.522 5.564C7.52129 5.926 7.23 6.21601 6.86934 6.21601ZM14.656 11.4933C14.4853 11.898 14.242 12.254 13.9253 12.5607C13.6033 12.878 13.2287 13.1153 12.8013 13.2767C12.5514 13.374 12.3227 13.44 12.114 13.474C11.9047 13.5067 11.5067 13.5227 10.918 13.5227H8.82269V6.908H11.056C11.958 6.908 12.67 7.04201 13.1954 7.31267C13.72 7.58266 14.1367 7.98134 14.4467 8.50534C14.7567 9.03001 14.912 9.60268 14.912 10.2213C14.9128 10.6653 14.826 11.0893 14.656 11.4933H14.656Z" />
                    </svg>
                    <Link href={`https://orcid.org/${workspace.orcid}`}>
                      <a
                        target="_blank"
                        className="underline text-sm leading-4 font-normal text-gray-500 dark:text-gray-200"
                      >
                        {workspace.orcid}
                      </a>
                    </Link>
                  </p>
                </p>
              ) : (
                <></>
              )}
              {workspace.url ? (
                <p className="flex my-2 text-sm leading-4 font-normal text-gray-500 dark:text-gray-200">
                  <p>
                    <span className="inline-block h-full align-middle"> </span>
                    <LinkIcon className="w-4 h-4 inline-block align-middle mr-1 text-gray-700 dark:text-gray-400" />
                    <Link href={workspace.url}>
                      <a
                        target="_blank"
                        className="underline text-sm leading-4 font-normal text-gray-500 dark:text-gray-200"
                      >
                        {workspace.url}
                      </a>
                    </Link>
                  </p>
                </p>
              ) : (
                <></>
              )}
              <Suspense fallback="">
                <HandlePanel
                  buttonText={
                    <p className="flex text-sm leading-4 font-normal text-gray-500 dark:text-gray-200 underline">
                      <p>
                        <span className="inline-block h-full align-middle"> </span>
                        <UserAddIcon className="w-4 h-4 inline-block align-middle mr-1 text-gray-700 dark:text-gray-400" />
                        Following{" "}
                        <Suspense fallback="Loading...">{workspace.following.length}</Suspense>
                      </p>
                    </p>
                  }
                  title="Following"
                  authors={workspace.following}
                />
              </Suspense>
            </div>
          </div>
          <div className="w-full ">
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

const FollowHandleButton = ({ workspace }) => {
  const params = useParams()
  const [currentUser] = useQuery(getCurrentUser, null)
  const [ownWorkspace, { refetch }] = useQuery(getCurrentWorkspace, null)
  console.log(workspace.id)
  return (
    <>
      {ownWorkspace ? (
        ownWorkspace!.handle === params.handle ? (
          <>
            <span className="inline-block h-full align-middle"></span>
            <SettingsModal
              button="Edit Profile"
              styling="py-2 px-4 shadow-sm text-sm leading-4 font-medium bg-indigo-100 dark:bg-gray-800 hover:bg-indigo-200 dark:hover:bg-gray-700 text-indigo-700 dark:text-gray-200 rounded dark:border dark:border-gray-600 inline-block align-middle focus:outline-none focus:ring-2 focus:ring-offset-0   focus:ring-indigo-500"
              user={currentUser}
              workspace={ownWorkspace}
            />
          </>
        ) : ownWorkspace?.following.filter((follows) => follows.handle === params.handle).length ===
          0 ? (
          <FollowButton author={workspace} refetchFn={refetch} />
        ) : (
          <UnfollowButton author={workspace} refetchFn={refetch} />
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
  const goToPreviousPage = () => router.push({ query: { handle, page: page - 1 } })
  const goToPage = (number) => router.push({ query: { handle, page: number } })
  const goToNextPage = () => router.push({ query: { handle, page: page + 1 } })
  return (
    <>
      {modules.length > 0 ? (
        <>
          <div className="rounded-t-md border border-gray-300 dark:border-gray-600 mt-8 divide-y divide-gray-300 dark:divide-gray-600">
            <h1 className="text-xs leading-4 font-medium mx-4 my-2 text-gray-500 dark:text-gray-400 ">
              Published modules
            </h1>
            <ul role="list" className="divide-y divide-gray-300 dark:divide-gray-600">
              {modules.map((module) => (
                <>
                  <li
                    onClick={() => {
                      router.push(`/modules/${module.suffix}`)
                    }}
                    className="cursor-pointer"
                  >
                    <ModuleCard
                      type={module.type.name}
                      title={module.title}
                      status={`DOI: 10.53962/${module.suffix}`}
                      time={moment(module.publishedAt).fromNow()}
                      timeText="Published"
                      authors={module.authors}
                    />
                  </li>
                </>
              ))}
            </ul>
          </div>
          <FeedPagination
            ITEMS_PER_PAGE={ITEMS_PER_PAGE}
            page={page}
            count={count}
            goToPreviousPage={goToPreviousPage}
            goToPage={goToPage}
            goToNextPage={goToNextPage}
            hasMore={hasMore}
          />
        </>
      ) : (
        <div className="flex mt-8 flex-col flex-grow relative w-full border-2 border-gray-500 dark:border-gray-400 border-dashed rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 h-28">
          <div className="table flex-grow w-full">
            <div className="hidden sm:table-cell w-1/4"></div>
            <span className="mx-auto table-cell align-middle leading-normal text-sm font-medium text-gray-500 dark:text-gray-400">
              Nothing published yet
            </span>
            <div className="hidden sm:table-cell w-1/4"></div>
          </div>
        </div>
      )}
    </>
  )
}
