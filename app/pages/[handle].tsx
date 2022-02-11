import Layout from "app/core/layouts/Layout"
import db from "db"
import { Link, useRouter, usePaginatedQuery, useParams, useQuery, useSession } from "blitz"
import { Suspense } from "react"
import moment from "moment"
import { Calendar32, UserFollow32, Link32 } from "@carbon/icons-react"

import Navbar from "../core/components/Navbar"
import getHandleFeed from "../workspaces/queries/getHandleFeed"
import ModuleCard from "../core/components/ModuleCard"
import getCurrentWorkspace from "app/workspaces/queries/getCurrentWorkspace"
import HandlePanel from "../modules/components/HandlePanel"
import FeedPagination from "../core/components/FeedPagination"
import LayoutLoader from "../core/components/LayoutLoader"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import { useCurrentWorkspace } from "app/core/hooks/useCurrentWorkspace"
import getDrafts from "app/core/queries/getDrafts"
import getInvitedModules from "app/workspaces/queries/getInvitedModules"
import generateSignature from "app/signature"
import FollowHandleButton from "../core/components/FollowHandleButton"
import HandleAvatar from "../core/components/HandleAvatar"

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

  // Expires in 30 minutes
  const expire = Math.round(Date.now() / 1000) + 60 * 30
  const signature = generateSignature(process.env.UPLOADCARE_SECRET_KEY, expire.toString())

  return { props: { workspace, expire, signature } }
}

const Handle = ({ workspace, expire, signature }) => {
  const currentUser = useCurrentUser()
  const session = useSession()
  const currentWorkspace = useCurrentWorkspace()
  const [ownWorkspace, { refetch }] = useQuery(getCurrentWorkspace, null)
  const router = useRouter()
  const [drafts, { refetch: refetchDrafts }] = useQuery(getDrafts, { session })
  const [invitations] = useQuery(getInvitedModules, { session })
  const params = useParams()

  return (
    <div className="h-full bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-200">
      <Navbar
        currentUser={currentUser}
        session={session}
        currentWorkspace={currentWorkspace}
        router={router}
        drafts={drafts}
        invitations={invitations}
        refetchFn={refetchDrafts}
      />
      <div className="mx-4 max-w-full lg:flex">
        <div className="w-full lg:w-1/2 xl:w-1/3">
          <div className="lg:sticky lg:top-8">
            <div className="my-8 flex lg:mr-8">
              <HandleAvatar
                params={params}
                refetch={refetch}
                workspace={workspace}
                ownWorkspace={ownWorkspace}
                expire={expire}
                signature={signature}
              />
              <div className="ml-4 flex-grow">
                <span className="inline-block h-full align-middle"> </span>
                <p className="inline-block align-middle text-base font-medium leading-6 text-gray-900 dark:text-gray-200">
                  {workspace.firstName ? workspace.firstName : ""}{" "}
                  {workspace.lastName ? workspace.lastName : ""}{" "}
                  {workspace.pronouns ? (
                    <span className="text-gray-500 dark:text-gray-200">({workspace.pronouns})</span>
                  ) : (
                    ""
                  )}
                  <p className="text-base font-medium leading-6 text-gray-500 dark:text-gray-200">
                    @{workspace.handle}
                  </p>
                </p>
              </div>
              {workspace ? (
                <div>
                  <FollowHandleButton
                    params={params}
                    currentUser={currentUser}
                    workspace={workspace}
                    ownWorkspace={ownWorkspace}
                    refetch={refetch}
                  />
                </div>
              ) : (
                ""
              )}
            </div>
            <div className="my-4 w-11/12 text-sm font-normal leading-4 text-gray-900 dark:text-gray-200">
              {workspace.bio}
            </div>

            <div>
              <p className="flex text-sm font-normal leading-4 text-gray-500 dark:text-gray-200">
                <p>
                  <span className="inline-block h-full align-middle"> </span>
                  <Calendar32
                    className="mr-1 inline-block h-4 w-4 align-middle text-gray-700 dark:text-gray-400"
                    aria-hidden="true"
                  />
                  Signed up {moment(workspace.createdAt).fromNow()}
                </p>
              </p>
              {workspace.orcid ? (
                <p className="my-2 flex text-sm font-normal leading-4 text-gray-500 dark:text-gray-200">
                  <p>
                    <span className="inline-block h-full align-middle"> </span>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                      className="mr-1 inline-block h-4 w-4 fill-current align-middle text-gray-700 dark:text-gray-400"
                    >
                      <path d="M12.6007 8.01734C12.3707 7.91001 12.1533 7.838 11.9473 7.804C11.742 7.76868 11.4127 7.752 10.9567 7.752H9.77266V12.6793H10.9867C11.46 12.6793 11.828 12.6467 12.0907 12.582C12.3533 12.5173 12.572 12.436 12.7473 12.336C12.9227 12.2367 13.0833 12.1147 13.2293 11.9687C13.6967 11.494 13.9307 10.8953 13.9307 10.1713C13.9307 9.45998 13.6907 8.87932 13.21 8.42998C13.0327 8.26331 12.8287 8.12531 12.6007 8.0173V8.01734ZM10 2C5.58134 2 2 5.582 2 10C2 14.418 5.58134 18 10 18C14.4187 18 18 14.418 18 10C18 5.582 14.4187 2 10 2ZM7.34399 13.5327H6.39598V6.908H7.34399V13.5327ZM6.86934 6.21601C6.51001 6.21601 6.21734 5.92534 6.21734 5.564C6.21734 5.20534 6.50933 4.91268 6.86934 4.91268C7.23 4.91268 7.522 5.20467 7.522 5.564C7.52129 5.926 7.23 6.21601 6.86934 6.21601ZM14.656 11.4933C14.4853 11.898 14.242 12.254 13.9253 12.5607C13.6033 12.878 13.2287 13.1153 12.8013 13.2767C12.5514 13.374 12.3227 13.44 12.114 13.474C11.9047 13.5067 11.5067 13.5227 10.918 13.5227H8.82269V6.908H11.056C11.958 6.908 12.67 7.04201 13.1954 7.31267C13.72 7.58266 14.1367 7.98134 14.4467 8.50534C14.7567 9.03001 14.912 9.60268 14.912 10.2213C14.9128 10.6653 14.826 11.0893 14.656 11.4933H14.656Z" />
                    </svg>
                    <Link href={`https://orcid.org/${workspace.orcid}`}>
                      <a
                        target="_blank"
                        className="text-sm font-normal leading-4 text-gray-500 underline dark:text-gray-200"
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
                <p className="my-2 flex text-sm font-normal leading-4 text-gray-500 dark:text-gray-200">
                  <p>
                    <span className="inline-block h-full align-middle"> </span>
                    <Link32
                      className="mr-1 inline-block h-4 w-4 align-middle text-gray-700 dark:text-gray-400"
                      aria-hidden="true"
                    />
                    <Link href={workspace.url}>
                      <a
                        target="_blank"
                        className="text-sm font-normal leading-4 text-gray-500 underline dark:text-gray-200"
                      >
                        {workspace.url}
                      </a>
                    </Link>
                  </p>
                </p>
              ) : (
                <></>
              )}
              {workspace.following.length > 0 ? (
                <HandlePanel
                  buttonText={
                    <p className="flex text-sm font-normal leading-4 text-gray-500 underline dark:text-gray-200">
                      <p>
                        <span className="inline-block h-full align-middle"> </span>
                        <UserFollow32
                          className="mr-1 inline-block h-4 w-4 align-middle text-gray-700 dark:text-gray-400"
                          aria-hidden="true"
                        />
                        Following{" "}
                        <Suspense fallback="Loading...">{workspace.following.length}</Suspense>
                      </p>
                    </p>
                  }
                  title="Following"
                  name={workspace.firstName + " " + workspace.lastName || workspace.handle}
                  authors={workspace.following}
                />
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
        <div className="w-full ">
          <HandleFeed handle={workspace.handle} />
        </div>
      </div>
    </div>
  )
}

const HandlePage = ({ workspace, expire, signature }) => {
  return (
    <Layout
      title={`R= ${workspace.handle}`}
      headChildren={
        <>
          <meta property="og:title" content={workspace.firstName || workspace.handle} />
          {workspace.bio ? <meta property="og:description" content={workspace.bio} /> : ""}
          <meta
            property="og:image"
            content={`http://og-images.herokuapp.com/api/workspace?title=${
              encodeURIComponent(workspace.firstName) || ""
            } ${encodeURIComponent(workspace.lastName) || ""}&avatar=${encodeURIComponent(
              workspace.avatar
            )}&handle=${encodeURIComponent(workspace.handle)}&orcid=${workspace.orcid || ""}`}
          />
          <meta
            property="og:image:secure_url"
            content={`http://og-images.herokuapp.com/api/workspace?title=${
              encodeURIComponent(workspace.firstName) || ""
            } ${encodeURIComponent(workspace.lastName) || ""}&avatar=${encodeURIComponent(
              workspace.avatar
            )}&handle=${encodeURIComponent(workspace.handle)}&orcid=${workspace.orcid || ""}`}
          />
          <meta
            property="og:image:alt"
            content={`Social media sharing image of the profile for ${workspace.handle}, including the avatar, name, handle, and ORCID.`}
          />
          <meta name="twitter:card" content="summary_large_image" />
          <meta property="twitter:domain" content="researchequals.com" />
          <meta property="twitter:url" content={`https://researchequals.com/${workspace.handle}`} />
          <meta
            name="twitter:title"
            content={
              workspace.firstName && workspace.lastName
                ? `${workspace.firstName} ${workspace.lastName}`
                : workspace.handle
            }
          />
          {workspace.bio ? <meta name="twitter:description" content={workspace.bio} /> : ""}
          <meta
            name="twitter:image"
            content={`http://og-images.herokuapp.com/api/workspace?title=${
              encodeURIComponent(workspace.firstName) || ""
            } ${encodeURIComponent(workspace.lastName) || ""}&avatar=${encodeURIComponent(
              workspace.avatar
            )}&handle=${encodeURIComponent(workspace.handle)}&orcid=${workspace.orcid || ""}`}
          />
        </>
      }
    >
      <LayoutLoader>
        <Handle workspace={workspace} expire={expire} signature={signature} />
      </LayoutLoader>
    </Layout>
  )
}

export default HandlePage

const HandleFeed = ({ handle }) => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const [{ modules, hasMore, count }, { refetch: refetchFeed }] = usePaginatedQuery(getHandleFeed, {
    handle,
    orderBy: { publishedAt: "desc" },
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
          <div className="mt-8 divide-y divide-gray-300 rounded-t-md border border-gray-300 dark:divide-gray-600 dark:border-gray-600">
            <div className="mx-4 my-2 flex text-sm font-medium leading-4 text-gray-500 dark:text-gray-400 ">
              <h1 className="flex-grow">{modules.length} published modules</h1>
              <p className="">Most to least recent</p>
            </div>
            <ul role="list" className="divide-y divide-gray-300 dark:divide-gray-600">
              {modules.map((module) => (
                <>
                  <li
                    onClick={() => {
                      router.push(`/modules/${module.suffix}`)
                    }}
                    className="cursor-pointer"
                  >
                    <a className="w-full text-left focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0">
                      <ModuleCard
                        type={module.type.name}
                        title={module.title}
                        status={`DOI: 10.53962/${module.suffix}`}
                        time={moment(module.publishedAt).fromNow()}
                        timeText="Published"
                        authors={module.authors}
                      />
                    </a>
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
        <div className="relative mt-8 flex h-28 w-full flex-grow flex-col rounded-lg border-2 border-dashed border-gray-500 text-center focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:border-gray-400">
          <div className="table w-full flex-grow">
            <div className="hidden w-1/4 sm:table-cell"></div>
            <span className="mx-auto table-cell align-middle text-sm font-medium leading-normal text-gray-500 dark:text-gray-400">
              Nothing published yet
            </span>
            <div className="hidden w-1/4 sm:table-cell"></div>
          </div>
        </div>
      )}
    </>
  )
}
