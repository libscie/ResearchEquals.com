import Footer from "app/core/components/Footer"
import Navbar from "app/core/components/Navbar"
import Layout from "app/core/layouts/Layout"
import getBrowseGraphData from "app/core/queries/getBrowseGraphData"
import { Link, Routes, useInfiniteQuery, useQuery, useRouter, useSession } from "blitz"
import moment from "moment"
import React from "react"
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

import getBrowseData from "../core/queries/getBrowseData"
import AuthorAvatarsNew from "../modules/components/AuthorAvatarsNew"
import LayoutLoader from "../core/components/LayoutLoader"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import { useCurrentWorkspace } from "app/core/hooks/useCurrentWorkspace"
import getDrafts from "app/core/queries/getDrafts"
import getInvitedModules from "app/workspaces/queries/getInvitedModules"
import getBrowseWorkspaceData from "../core/queries/getBrowseWorkspaceData"
import getBrowseWorkspaceGraphData from "../core/queries/getBrowseWorkspaceGraphData"

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip bg-white dark:bg-gray-900 shadow-xl border dark:border-gray-600 rounded p-2 border-b bgborder-gray-400">
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
      <div className="custom-tooltip bg-white dark:bg-gray-900 shadow-xl border dark:border-gray-600 rounded p-2 border-b bgborder-gray-400">
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
    <div className="max-w-7xl text-gray-900 dark:text-gray-200 py-16 mx-4 xl:mx-auto">
      <h1 className="text-3xl text-center font-extrabold ">Browse recent modules</h1>
      <div className="mx-auto text-center">
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart
            width={1280}
            height={250}
            data={graphData}
            margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorModules" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#574cfa" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#574cfa" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="time"
              domain={["dataMin", "dataMax"]}
              name="Time"
              tickFormatter={(unixTime) => moment(unixTime).format("YYYY-MM-DD")}
              type="number"
              tickLine={false}
              axisLine={false}
              style={{
                fontSize: "0.8rem",
              }}
            />
            <YAxis
              dataKey="modules"
              name="Modules"
              tickLine={false}
              axisLine={false}
              style={{
                fontSize: "0.8rem",
              }}
              orientation="right"
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="modules"
              stroke="#574cfa"
              fillOpacity={1}
              fill="url(#colorModules)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      {modulePages.map((page, i) => (
        <React.Fragment key={i}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 my-4">
            {page.modules.map((module) => (
              <>
                <>
                  <Link href={Routes.ModulePage({ suffix: module.suffix })}>
                    <a
                      className={`flex flex-col module ${
                        i % 2 === 0
                          ? "bg-indigo-600 dark:bg-indigo-600"
                          : "bg-purple-600 dark:bg-purple-600"
                      } cursor-pointer p-4 text-white`}
                    >
                      <h2 className="text-base font-normal leading-5 flex-grow mb-2">
                        {module.title}
                      </h2>
                      <span className="w-full flex">
                        <span className="flex-grow align-text-bottom text-gray-300"></span>
                        <AuthorAvatarsNew authors={module.authors} />
                      </span>
                    </a>
                  </Link>
                </>
              </>
            ))}
          </div>
        </React.Fragment>
      ))}
      <div className="text-center my-4">
        <button
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || !!isFetchingNextPage}
          className="whitespace-nowrap text-sm leading-5 font-normal text-indigo-700 dark:text-gray-200 bg-indigo-100 hover:bg-indigo-200 dark:bg-gray-800 dark:hover:bg-gray-700 border-0 dark:border dark:border-gray-600 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-indigo-500"
        >
          {isFetchingNextPage
            ? "Loading more modules..."
            : hasNextPage
            ? "Load more modules"
            : "No more modules to load"}
        </button>
      </div>
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
    <div className="max-w-7xl text-gray-900 dark:text-gray-200 py-16 mx-4 xl:mx-auto">
      <h1 className="text-3xl text-center font-extrabold ">Browse recent signups</h1>
      <div className="mx-auto text-center">
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart
            width={1280}
            height={250}
            data={graphData}
            margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorWorkspaces" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#574cfa" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#574cfa" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="time"
              domain={["dataMin", "dataMax"]}
              name="Time"
              tickFormatter={(unixTime) => moment(unixTime).format("YYYY-MM-DD")}
              type="number"
              tickLine={false}
              axisLine={false}
              style={{
                fontSize: "0.8rem",
              }}
              // hide={true}
            />
            <YAxis
              dataKey="workspaces"
              name="Workspaces"
              tickLine={false}
              axisLine={false}
              style={{
                fontSize: "0.8rem",
              }}
              orientation="right"
              // hide={true}
            />
            <Tooltip content={<CustomTooltipWorkspace />} />
            <Area
              type="monotone"
              dataKey="workspaces"
              stroke="#574cfa"
              fillOpacity={1}
              fill="url(#colorWorkspaces)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      {workspacePages.map((page, i) => (
        <React.Fragment key={i}>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 gap-y-10 my-4">
            {page.workspaces.map((workspace) => (
              <>
                <>
                  <Link href={Routes.HandlePage({ handle: workspace.handle })}>
                    <a className="mx-auto text-center">
                      <img
                        src={workspace.avatar}
                        alt={`Avatar of ${workspace.handle}`}
                        className="h-28 w-28 rounded-full mx-auto"
                      />
                      <p className="mx-auto text-center my-2">
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
      <div className="text-center my-4">
        <button
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || !!isFetchingNextPage}
          className="whitespace-nowrap text-sm leading-5 font-normal text-indigo-700 dark:text-gray-200 bg-indigo-100 hover:bg-indigo-200 dark:bg-gray-800 dark:hover:bg-gray-700 border-0 dark:border dark:border-gray-600 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-indigo-500"
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
      <BrowseContent />
      <BrowseWorkspaces />
      <Footer />
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
