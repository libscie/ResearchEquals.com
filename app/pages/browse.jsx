import Navbar from "app/core/components/Navbar"
import Layout from "app/core/layouts/Layout"
import getBrowseGraphData from "app/core/queries/getBrowseGraphData"
import { useInfiniteQuery, useQuery, useRouter, useSession, Link, Routes } from "blitz"
import moment from "moment"
import React from "react"

import getBrowseData from "../core/queries/getBrowseData"
import LayoutLoader from "../core/components/LayoutLoader"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import { useCurrentWorkspace } from "app/core/hooks/useCurrentWorkspace"
import getDrafts from "app/core/queries/getDrafts"
import getInvitedModules from "app/workspaces/queries/getInvitedModules"
import ModuleBoxFeed from "app/core/components/ModuleBoxFeed"
import getBrowseWorkspaceData from "../core/queries/getBrowseWorkspaceData"
import getBrowseWorkspaceGraphData from "../core/queries/getBrowseWorkspaceGraphData"

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip bgborder-gray-400 rounded border border-b bg-white p-2 shadow-xl dark:border-gray-600 dark:bg-gray-900">
        <p className="label">{`${moment(label).format("YYYY-MM-DD")}`}</p>
        <p>Total modules: {`${payload[0].value}`}</p>
      </div>
    )
  }

  return null
}

const CustomTooltipWorkspace = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip bgborder-gray-400 rounded border border-b bg-white p-2 shadow-xl dark:border-gray-600 dark:bg-gray-900">
        <p className="label">{`${moment(label).format("YYYY-MM-DD")}`}</p>
        <p>Total signups: {`${payload[0].value}`}</p>
      </div>
    )
  }

  return null
}

const BrowseContent = () => {
  const [modulePages, { isFetching, isFetchingNextPage, fetchNextPage, hasNextPage }] =
    useInfiniteQuery(getBrowseData, (page = { take: 20, skip: 0 }) => page, {
      getNextPageParam: (lastPage) => lastPage.nextPage,
    })
  const [graphData] = useQuery(getBrowseGraphData, undefined)

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
              <>
                <>
                  <Link href={Routes.HandlePage({ handle: workspace.handle })}>
                    <a className="mx-auto text-center">
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
                    </a>
                  </Link>
                </>
              </>
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
      <Navbar
        currentUser={currentUser}
        session={session}
        currentWorkspace={currentWorkspace}
        router={router}
        drafts={drafts}
        invitations={invitations}
        refetchFn={refetch}
      />
      <div className="grid-cols-2 2xl:mx-4 2xl:grid">
        <BrowseContent />
        <BrowseWorkspaces />
      </div>
    </>
  )
}

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
