import Navbar from "app/core/components/Navbar"
import Layout from "app/core/layouts/Layout"
import { useInfiniteQuery, useQuery, useRouter, useSession, Link, Routes } from "blitz"
import React, { useEffect, useState } from "react"
import ReactFlow, { Background, MiniMap, Controls } from "react-flow-renderer"
import dagre from "dagre"
import { useMediaPredicate } from "react-media-hook"
import { Connect16 } from "@carbon/icons-react"

import LayoutLoader from "../core/components/LayoutLoader"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import { useCurrentWorkspace } from "app/core/hooks/useCurrentWorkspace"
import getDrafts from "app/core/queries/getDrafts"
import getInvitedModules from "app/workspaces/queries/getInvitedModules"
import getNodes from "../core/queries/getNodes"

const dagreGraph = new dagre.graphlib.Graph()
dagreGraph.setDefaultEdgeLabel(() => ({}))

const nodeWidth = 150
const nodeHeight = 36

const getLayoutedElements = (nodes, edges, direction = "TB") => {
  const isHorizontal = direction === "LR"
  dagreGraph.setGraph({ rankdir: direction })

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight })
  })

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target)
  })

  dagre.layout(dagreGraph)

  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id)
    node.targetPosition = isHorizontal ? "left" : "top"
    node.sourcePosition = isHorizontal ? "right" : "bottom"

    // We are shifting the dagre node position (anchor=center center) to the top left
    // so it matches the React Flow node anchor point (top left).
    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    }

    return node
  })

  return { nodes, edges }
}

const Graph = () => {
  const currentUser = useCurrentUser()
  const session = useSession()
  const currentWorkspace = useCurrentWorkspace()
  const router = useRouter()
  const [drafts, { refetch }] = useQuery(getDrafts, { session })
  const [{ nodesData: nodesQuery, edgesData: edgesQuery }] = useQuery(getNodes, undefined)
  const [invitations] = useQuery(getInvitedModules, { session })
  const [nodes, setNodes] = useState([])
  const [edges, setEdges] = useState([])
  const [onlyConnected, setOnlyConnected] = useState(true)
  const prefersDarkMode = useMediaPredicate("(prefers-color-scheme: dark)")

  useEffect(() => {
    edgesQuery.forEach((edge) => {
      edge.style = { stroke: prefersDarkMode ? "#fff" : "#000" }
      return edge
    })

    if (onlyConnected) {
      const x = nodesQuery.filter((node) => {
        return edgesQuery.some((edge) => {
          return edge.source === node.id || edge.target === node.id
        })
      })
      const ele = getLayoutedElements(x, edgesQuery, "TB")
      setNodes(ele.nodes)
      setEdges(ele.edges)
    } else {
      const ele = getLayoutedElements(nodesQuery, edgesQuery, "TB")
      setNodes(ele.nodes)
      setEdges(ele.edges)
    }
  }, [onlyConnected, nodesQuery, edgesQuery, prefersDarkMode])

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
        <ReactFlow nodes={nodes} edges={edges} panOnScroll={true} minZoom={-0.3} fitView>
          <MiniMap
            style={{ backgroundColor: prefersDarkMode ? "#1e293b" : "#fff", color: "red" }}
            nodeColor={prefersDarkMode ? "#fff" : "#000"}
          />
          <Controls style={{ fill: prefersDarkMode ? "#fff" : "#000" }}>
            <button
              onClick={() => {
                setOnlyConnected(!onlyConnected)
              }}
              className="react-flow__controls-button react-flow__controls-interactive"
              title="toggle connected view"
              aria-label="toggle view to show only connected modules or all modules"
            >
              <Connect16 className={`${onlyConnected ? "rotate-180" : ""}`} />
            </button>
          </Controls>
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
