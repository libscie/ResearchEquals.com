import Navbar from "app/core/components/Navbar"
import Layout from "app/core/layouts/Layout"
import { useInfiniteQuery, useQuery, useRouter, useSession, Link, Routes } from "blitz"
import React, { useEffect, useState } from "react"
import ReactFlow, { Background, MiniMap, Controls } from "react-flow-renderer"

import LayoutLoader from "../core/components/LayoutLoader"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import { useCurrentWorkspace } from "app/core/hooks/useCurrentWorkspace"
import getDrafts from "app/core/queries/getDrafts"
import getInvitedModules from "app/workspaces/queries/getInvitedModules"
import getNodes from "../core/queries/getNodes"

const initialNodes = [
  {
    id: "10.53962/h0se-1577",
    type: "input",
    data: { label: "Test" },
    position: { x: 250 - 100, y: 250 },
  },
  {
    id: "10.1629/uksg.556",
    type: "input",

    data: { label: "Test" },
    position: { x: 250 - 150, y: 250 - 50 },
  },
  {
    id: "10.7551/mitpress/11087.001.0001",
    data: { label: "Test" },
    position: { x: 250, y: 250 },
  },
]

const initialEdges = [
  { id: "e1-2", source: "10.1629/uksg.556", target: "10.7551/mitpress/11087.001.0001" },
  {
    id: "e2-3",
    source: "10.7551/mitpress/11087.001.0001",
    target: "10.53962/snjp-2g0b",
    animated: true,
  },
]

const Graph = () => {
  const currentUser = useCurrentUser()
  const session = useSession()
  const currentWorkspace = useCurrentWorkspace()
  const router = useRouter()
  const [drafts, { refetch }] = useQuery(getDrafts, { session })
  const [nodesQuery] = useQuery(getNodes, undefined)
  const [invitations] = useQuery(getInvitedModules, { session })
  const [nodes, setNodes] = useState([])
  const [edges, setEdges] = useState([])

  useEffect(() => {
    setNodes(nodesQuery)
  }, [])

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
      {/* <div className="grid-cols-2 2xl:mx-4 2xl:grid"> */}
      <div className="h-[90vh] w-full">
        <ReactFlow nodes={nodes} edges={edges} fitView>
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>
      </div>
    </>
  )
}

Graph.suppressFirstRenderFlicker = true
Graph.getLayout = (page) => (
  <Layout
    title="R= Graph"
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

export default Graph
