import { gSP } from "app/blitz-server"
import { useSession } from "@blitzjs/auth"
import { useRouter } from "next/router"
import { useQuery } from "@blitzjs/rpc"
import { BlitzPage } from "@blitzjs/next"
import { InferGetStaticPropsType } from "next"
import Layout from "app/core/layouts/Layout"
import { useMediaPredicate } from "react-media-hook"

import db from "db"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import { useCurrentWorkspace } from "app/core/hooks/useCurrentWorkspace"
import getDrafts from "app/core/queries/getDrafts"
import getInvitedModules from "app/workspaces/queries/getInvitedModules"

import React from "react"

import { ApproachSection } from "app/core/components/home/ApproachSection"
import { PublishYourJourneySection } from "app/core/components/home/PublishYourJourneySection"
import { OpenAccessSection } from "app/core/components/home/OpenAccessSection"
import { CollectionsSection } from "app/core/components/home/CollectionsSection"
import { TestimonialsSection } from "app/core/components/home/TestimonialsSection"
import { JoinCommunitySection } from "app/core/components/home/JoinCommunitySection"
import { Hero } from "app/core/components/home/Hero"
import { ModuleDiagram } from "app/core/components/home/ModuleDiagram"
import Navbar from "app/core/components/Navbar"
import LayoutLoader from "app/core/components/LayoutLoader"
import { SupportingMemberSection } from "../app/core/components/home/SupportingMemberSection"
import Link from "next/link"
import Button from "../app/core/components/home/Button"
import { NoRegular } from "../app/core/components/home/NoRegular"
import Container from "../app/core/components/home/Container"
import InstitutionalSupportingMembers from "../app/core/components/InstitutionalSupportingMembers"
import SupportingMemberPricing from "../app/core/components/SupportingMemberPricing"
import getSupporting from "app/users/queries/getSupporting"

const SupportingMemberPage: BlitzPage = () => {
  const prefersDarkMode = useMediaPredicate("(prefers-color-scheme: dark)")
  const biggerWindow = useMediaPredicate("(min-width: 640px)")
  const currentUser = useCurrentUser()
  const session = useSession()
  const currentWorkspace = useCurrentWorkspace()
  const router = useRouter()
  const [drafts, { refetch }] = useQuery(getDrafts, { session })
  const [invitations] = useQuery(getInvitedModules, { session })
  const [supporters] = useQuery(getSupporting, null)

  const stats = [
    { name: "Active supporting members", value: supporters.length },
    // { name: 'Sponsored memberships available', value: 3 },
  ]

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
        <section id="hero" className="py-10 dark:bg-transparent md:py-28 md:text-center">
          <div className="flex flex-col items-center gap-4 px-7">
            <h1 className="max-w-5xl text-4xl font-bold text-slate-800 dark:text-white md:text-7xl md:font-extrabold ">
              You can now govern a publisher like never before.
            </h1>
            <p className="max-w-[800px] text-base text-slate-600 dark:text-slate-300 md:text-xl">
              As a supporting member, we give you power we could easily keep to ourselves.
            </p>
          </div>
          <div className="bg-gray-900"></div>
        </section>
        {/* <InstitutionalSupportingMembers /> */}
        <NoRegular />
        <div className="mx-auto grid max-w-2xl  grid-cols-1 md:grid-cols-2">
          {stats.map((stat) => (
            <div key={stat.name} className="px-4 py-6 sm:px-6 lg:px-8">
              <p className="text-sm font-medium leading-6 text-gray-400">{stat.name}</p>
              <p className="mt-2 flex items-baseline gap-x-2">
                <span className="text-4xl font-semibold tracking-tight text-slate-800">
                  {stat.value}
                </span>
              </p>
            </div>
          ))}
        </div>
        <SupportingMemberPricing />
        <section className="bg-indigo-700 text-white ">
          <Container className="flex flex-col items-center gap-10 py-20 md:py-24 lg:flex-row lg:justify-between lg:gap-6">
            <p className="text-center text-3xl font-bold leading-10 md:text-5xl lg:text-left">
              Create an account first, become a supporter second.
            </p>
            <Link href="/signup">
              <Button variant="outlined" color="inherit" className="lg:min-w-[340px]">
                Create account for ResearchEquals
              </Button>
            </Link>
          </Container>
        </section>
      </main>
    </>
  )
}

SupportingMemberPage.suppressFirstRenderFlicker = true
SupportingMemberPage.getLayout = (page) => (
  <Layout
    title="Supporting Membership"
    headChildren={
      <>
        <meta property="og:title" content="ResearchEquals Supporting Membership" />
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

export default SupportingMemberPage
