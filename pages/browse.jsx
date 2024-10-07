import Link from "next/link"
import { Routes } from "@blitzjs/next"
import { useSession } from "@blitzjs/auth"
import { useRouter } from "next/router"
import { useInfiniteQuery, useQuery } from "@blitzjs/rpc"
import Navbar from "app/core/components/Navbar"
import Layout from "app/core/layouts/Layout"
import React from "react"
import { Fire } from "@carbon/icons-react"
import getBrowseData from "app/core/queries/getBrowseData"

import LayoutLoader from "app/core/components/LayoutLoader"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import { useCurrentWorkspace } from "app/core/hooks/useCurrentWorkspace"
import getDrafts from "app/core/queries/getDrafts"
import getInvitedModules from "app/workspaces/queries/getInvitedModules"
import ModuleBoxFeed from "app/core/components/ModuleBoxFeed"
import getBrowseWorkspaceData from "app/core/queries/getBrowseWorkspaceData"
import getBrowseWorkspaceGraphData from "app/core/queries/getBrowseWorkspaceGraphData"

const BrowseContent = () => {
  const [modulePages, { isFetching, isFetchingNextPage, fetchNextPage, hasNextPage }] =
    useInfiniteQuery(getBrowseData, (page = { take: 20, skip: 0 }) => page, {
      getNextPageParam: (lastPage) => lastPage.nextPage,
    })

  return (
    <div className="mx-4 max-w-7xl py-16 text-gray-900 dark:text-gray-200 xl:mx-auto">
      <h1 className="text-center text-3xl font-extrabold ">Recent modules</h1>

      <ModuleBoxFeed
        modules={modulePages}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
      />
    </div>
  )
}

const BrowseWorkspaces = () => {
  const [workspacePages, { isFetching, isFetchingNextPage, fetchNextPage, hasNextPage }] =
    useInfiniteQuery(getBrowseWorkspaceData, (page = { take: 20, skip: 0 }) => page, {
      getNextPageParam: (lastPage) => lastPage.nextPage,
    })
  const [graphData] = useQuery(getBrowseWorkspaceGraphData, undefined)

  return (
    <div className="mx-4 max-w-7xl py-16 text-gray-900 dark:text-gray-200 xl:mx-auto">
      <h1 className="text-center text-3xl font-extrabold ">Recent signups</h1>

      {workspacePages.map((page, i) => (
        <React.Fragment key={i}>
          <div className="my-4 grid grid-cols-2 gap-4 gap-y-10 md:grid-cols-3 xl:grid-cols-4">
            {page.workspaces.map((workspace) => (
              <Link
                key={workspace.id}
                href={Routes.HandlePage({ handle: workspace.handle })}
                className="mx-auto text-center"
              >
                <img
                  src={workspace.avatar}
                  alt={`Avatar of ${workspace.handle}`}
                  className="mx-auto h-28 w-28 rounded-full"
                />
                <p className="mx-auto my-2 text-center">
                  {workspace.firstName && workspace.lastName
                    ? `${workspace.firstName} ${workspace.lastName}`
                    : `@${workspace.handle}`}{" "}
                </p>
              </Link>
            ))}
          </div>
        </React.Fragment>
      ))}
      <div className="my-4 text-center">
        <button
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || !!isFetchingNextPage}
          className="whitespace-nowrap rounded border-0 bg-indigo-100 px-4 py-2 text-sm font-normal leading-5 text-indigo-700 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0 dark:border dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
        >
          {isFetchingNextPage
            ? "Loading more authors..."
            : hasNextPage
            ? "Load more authors"
            : "No more authors to load"}
        </button>
      </div>
    </div>
  )
}

const Browse = () => {
  const currentUser = useCurrentUser()
  const session = useSession()
  const currentWorkspace = useCurrentWorkspace()
  const router = useRouter()
  const [drafts, { refetch }] = useQuery(getDrafts, { session })
  const [invitations] = useQuery(getInvitedModules, { session })

  return (
    <>
        <Navbar />

      <div className="sticky top-0 z-10 flex w-full bg-rose-50 py-4 px-2 text-center dark:bg-rose-800">
        <div className="mx-auto flex">
          <div className="inline-block align-middle">
            <Fire
              size={32}
              className="inline-block h-5 w-5 stroke-current align-middle text-rose-500 dark:text-rose-200"
              aria-hidden="true"
            />
          </div>
          <div className="mx-3 text-rose-800 dark:text-rose-100">
            <h3 className="inline-block align-middle text-sm font-normal leading-4 text-rose-800 dark:text-rose-100">
              Looking for ResearchEquals Collections?
            </h3>
          </div>
          <div className="">
            <Link href={Routes.CollectionsPage()} legacyBehavior>
              <button
                type="button"
                className="rounded border border-rose-500 px-2 py-1.5 text-sm font-medium leading-4 text-rose-500 hover:bg-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-600 focus:ring-offset-2 focus:ring-offset-rose-50 dark:border-rose-200 dark:text-rose-200 dark:hover:bg-rose-900"
              >
                Browse Collections
              </button>
            </Link>
          </div>
        </div>
      </div>
      <div className="grid-cols-2 2xl:mx-4 2xl:grid">
        <BrowseContent />
        <BrowseWorkspaces />
      </div>
    </>
  )
}

Browse.authenticate = false
Browse.suppressFirstRenderFlicker = true
Browse.getLayout = (page) => (
  <Layout
    title="R= Browse"
    headChildren={
      <>
        <meta property="og:title" content="ResearchEquals.com" />
        <meta
          property="og:description"
          content="Step by step publishing of your research, with a new publishing format: Research modules."
        />
        <meta property="og:image" content="https://og-images.herokuapp.com/api/researchequals" />
        <meta
          property="og:image:alt"
          content="Screenshot of the homepage of ResearchEquals.com, including the description and a sign up button for release updates."
        />
      </>
    }
  >
    <LayoutLoader>{page}</LayoutLoader>
  </Layout>
)

export default Browse
