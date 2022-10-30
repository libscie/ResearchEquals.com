import {
  BlitzPage,
  GetStaticProps,
  Image,
  InferGetStaticPropsType,
  Link,
  Routes,
  useQuery,
  useRouter,
  useSession,
} from "blitz"
import Layout from "app/core/layouts/Layout"
import {
  CurrencyEuro,
  Save,
  Checkmark,
  Favorite,
  CircleStroke,
  TableSplit,
  Terminal,
  Language,
  Alarm,
  Events,
  TextAlignLeft,
  Video,
  CircleFill,
  Fire,
} from "@carbon/icons-react"
import Xarrows from "react-xarrows"
import { useMediaPredicate } from "react-media-hook"
import ReactTooltip from "react-tooltip"

import Navbar from "../core/components/Navbar"
import db from "db"
import LayoutLoader from "../core/components/LayoutLoader"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import { useCurrentWorkspace } from "app/core/hooks/useCurrentWorkspace"
import getDrafts from "app/core/queries/getDrafts"
import getInvitedModules from "app/workspaces/queries/getInvitedModules"

import React, { useEffect } from "react"
import { createRoot } from "react-dom/client"
import CollectionsModal from "../core/modals/CollectionsModal"

import { ApproachSection } from "app/core/components/home/ApproachSection"
import { PublishYourJourneySection } from "app/core/components/home/PublishYourJourneySection"
import { OpenAccessSection } from "app/core/components/home/OpenAccessSection"
import { CollectionsSection } from "app/core/components/home/CollectionsSection"
import { TestimonialsSection } from "app/core/components/home/TestimonialsSection"
import { JoinCommunitySection } from "app/core/components/home/JoinCommunitySection"
import { Hero } from "app/core/components/home/Hero"
import { ModuleDiagram } from "app/core/components/home/ModuleDiagram"

export const getStaticProps: GetStaticProps = async (context) => {
  const licenses = await db.license.findMany({
    where: {
      source: "ResearchEquals",
    },
    orderBy: [
      {
        price: "asc",
      },
      {
        name: "asc",
      },
    ],
  })

  return {
    props: {
      licenses,
    },
  }
}

const Home: BlitzPage = ({ licenses }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const prefersDarkMode = useMediaPredicate("(prefers-color-scheme: dark)")
  const biggerWindow = useMediaPredicate("(min-width: 640px)")
  const currentUser = useCurrentUser()
  const session = useSession()
  const currentWorkspace = useCurrentWorkspace()
  const router = useRouter()
  const [drafts, { refetch }] = useQuery(getDrafts, { session })
  const [invitations] = useQuery(getInvitedModules, { session })

  const freeLicenses = licenses.filter((license) => license.price === 0)
  const payToClose = licenses.filter((license) => license.price > 0)

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
      <main className="bg-white dark:bg-gray-900 lg:relative">
        <Hero />
        <ModuleDiagram />
        <ApproachSection />
        <PublishYourJourneySection />
        <OpenAccessSection />
        <CollectionsSection />
        <TestimonialsSection />
        <JoinCommunitySection />
      </main>
    </>
  )
}

Home.suppressFirstRenderFlicker = true
Home.getLayout = (page) => (
  <Layout
    title="ResearchEquals.com"
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

export default Home
