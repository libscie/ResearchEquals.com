import Navbar from "app/core/components/Navbar"
import Layout from "app/core/layouts/Layout"
import getBrowseGraphData from "app/core/queries/getBrowseGraphData"
import { useInfiniteQuery, useQuery, useRouter, useSession, Link, Routes } from "blitz"
import moment from "moment"
import { useMediaPredicate } from "react-media-hook"

import React from "react"
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts"

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

const BrowseContent = ({ graphData }) => {
  return (
    <div className="mx-4 py-16 text-gray-900 dark:text-gray-200">
      <h2 className="text-center text-3xl font-extrabold ">Published modules</h2>
      <div className="mx-auto text-center">
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart
            width={1280}
            height={250}
            data={graphData.data}
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
    <div className=" mx-4 py-16 text-gray-900 dark:text-gray-200">
      <h2 className="text-center text-3xl font-extrabold ">Signups</h2>
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
                <stop offset="5%" stopColor="#16a34a" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
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
              stroke="#16a34a"
              fillOpacity={1}
              fill="url(#colorWorkspaces)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

const StatsExtensions = ({ graphData }) => {
  const biggerWindow = useMediaPredicate("(min-width: 640px)")

  return (
    <>
      <div className="mx-4 py-16 text-gray-900 dark:text-gray-200">
        <h2 className="text-center text-3xl font-extrabold ">Main file extensions</h2>
        <div className="mx-auto text-center ">
          <RadarChart
            cx={biggerWindow ? 300 : 150}
            cy={biggerWindow ? 250 : 150}
            outerRadius={biggerWindow ? 150 : 100}
            width={biggerWindow ? 500 : 300}
            height={biggerWindow ? 500 : 300}
            data={graphData.mainExtensions}
            className="mx-auto h-full w-full fill-current text-gray-900 dark:text-gray-200"
          >
            <PolarGrid />
            <PolarAngleAxis dataKey="extension" />
            <PolarRadiusAxis />
            <Radar name="Main" dataKey="count" stroke="#090909" fill="#db2777" fillOpacity={0.6} />
          </RadarChart>
        </div>
      </div>
      <div className="mx-4 py-16 text-gray-900 dark:text-gray-200">
        <h2 className="text-center text-3xl font-extrabold ">Supporting file extensions</h2>
        <div className="mx-auto w-full text-center">
          <RadarChart
            cx={biggerWindow ? 300 : 150}
            cy={biggerWindow ? 250 : 150}
            outerRadius={biggerWindow ? 150 : 100}
            width={biggerWindow ? 500 : 300}
            height={biggerWindow ? 500 : 300}
            data={graphData.supportingExtensions}
            className="mx-auto h-full w-full fill-current text-gray-900 dark:text-gray-200"
          >
            <PolarGrid />
            <PolarAngleAxis dataKey="extension" />
            <PolarRadiusAxis />
            <Radar
              name="Supporting"
              dataKey="count"
              stroke="#090909"
              fill="#d946ef"
              fillOpacity={0.6}
            />
          </RadarChart>
        </div>
      </div>
    </>
  )
}

const Stats = () => {
  const currentUser = useCurrentUser()
  const session = useSession()
  const currentWorkspace = useCurrentWorkspace()
  const router = useRouter()
  const [drafts, { refetch }] = useQuery(getDrafts, { session })
  const [invitations] = useQuery(getInvitedModules, { session })
  const [graphData] = useQuery(getBrowseGraphData, undefined)

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
      <h1 className="mx-auto my-8 max-w-7xl text-center text-5xl font-black sm:text-6xl">
        Real-time statistics
      </h1>
      <div className="mx-auto max-w-7xl grid-cols-2 xl:grid">
        <BrowseContent graphData={graphData} />
        <BrowseWorkspaces />
        <StatsExtensions graphData={graphData} />
      </div>
    </>
  )
}

Stats.suppressFirstRenderFlicker = true
Stats.getLayout = (page) => (
  <Layout
    title="R= Stats"
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

export default Stats
