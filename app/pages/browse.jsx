import Footer from "app/core/components/Footer"
import Navbar from "app/core/components/Navbar"
import Layout from "app/core/layouts/Layout"
import getBrowseGraphData from "app/core/queries/getBrowseGraphData"
import { useInfiniteQuery, useQuery, useRouter, useSession } from "blitz"
import moment from "moment"
import React from "react"
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

import getBrowseData from "../core/queries/getBrowseData"
import LayoutLoader from "../core/components/LayoutLoader"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import { useCurrentWorkspace } from "app/core/hooks/useCurrentWorkspace"
import getDrafts from "app/core/queries/getDrafts"
import getInvitedModules from "app/workspaces/queries/getInvitedModules"
import ModuleBoxFeed from "app/core/components/ModuleBoxFeed"

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

const BrowseContent = () => {
  const [modulePages, { isFetching, isFetchingNextPage, fetchNextPage, hasNextPage }] =
    useInfiniteQuery(getBrowseData, (page = { take: 20, skip: 0 }) => page, {
      getNextPageParam: (lastPage) => lastPage.nextPage,
    })
  const [graphData] = useQuery(getBrowseGraphData, undefined)

  return (
    <div className="max-w-7xl text-gray-900 dark:text-gray-200 py-16 mx-4 xl:mx-auto">
      <h1 className="text-3xl text-center font-extrabold ">Browse modules</h1>
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
      <ModuleBoxFeed
        modules={modulePages}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
      />
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
