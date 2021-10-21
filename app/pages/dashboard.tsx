import { getSession, Link, Routes, useMutation, useSession, useQuery } from "blitz"
import Layout from "app/core/layouts/Layout"
import moment from "moment"
import React, { Suspense } from "react"
import getDashboardData from "../core/queries/getDashboardData"

import Navbar from "../core/components/Navbar"
import db from "db"
import updateInvitation from "../authorship/mutations/updateInvitation"
import Banner from "../core/components/Banner"

const DashboardContent = () => {
  const session = useSession()
  const [updateInvitationMutation, { isSuccess: invitationUpdated }] = useMutation(updateInvitation)

  const [data, { refetch }] = useQuery(getDashboardData, { session })
  console.log(data)

  return (
    <>
      <div className="bg-pink-500">
        {data!.user!.emailIsVerified ? (
          <Banner message="You can only start publishing once your email is verified. Please check your inbox." />
        ) : (
          ""
        )}
        TEST {data!.workspace!.handle}
      </div>
      <div className="w-full">
        <h2 className="font-bold text-4xl">
          <Link href={Routes.DraftsPage()}>
            <a>
              {data!.draftModules.length} draft{data!.draftModules.length !== 1 ? "s" : ""}
            </a>
          </Link>
        </h2>
        {data!.draftModules.map((draft) => {
          return (
            <p key={draft.suffix}>
              Last edited: {moment(draft.updatedAt).fromNow()}
              <Link href={Routes.ModuleEditPage({ suffix: draft.suffix })}>
                <a>
                  10.53962/{draft.suffix} {draft.title}
                </a>
              </Link>
            </p>
          )
        })}
      </div>
      <div className="flex">
        <div className="w-full">
          <h2 className="font-bold text-4xl">Feed</h2>
          {data!.modules.map((module) => {
            return (
              <p key={module.suffix}>
                <Link href={Routes.ModulePage({ suffix: module.suffix })}>
                  <a>
                    {moment(module.publishedAt).fromNow()} 10.53962/{module.suffix} {module.title}
                  </a>
                </Link>
              </p>
            )
          })}
        </div>
      </div>
      <div>
        <h2 className="font-bold text-4xl">Newest users</h2>
        {data!.workspaces.map((workspace) => {
          return (
            <p key={workspace.handle}>
              <Link href={Routes.HandlePage({ handle: workspace.handle })}>
                <a>
                  {moment(workspace.createdAt).fromNow()} @{workspace.handle}
                </a>
              </Link>
            </p>
          )
        })}
      </div>
      <div>
        <h2 className="font-bold text-4xl">Invitations</h2>
        {data!.invitedModules.map((invitation) => {
          return (
            <p key={invitation.suffix}>
              {invitationUpdated ? (
                <span>Thanks for responding to this invitation</span>
              ) : (
                <>
                  <Link href={Routes.ModuleEditPage({ suffix: invitation.suffix })}>
                    <a>
                      {moment(invitation.createdAt).fromNow()} 10.53962/{invitation.suffix}{" "}
                      {invitation.title}
                    </a>
                  </Link>
                  <div>
                    <button
                      onClick={async () => {
                        await updateInvitationMutation({
                          id: invitation!.authors[0]!.id,
                          accept: true,
                        })
                        refetch()
                      }}
                    >
                      Accept
                    </button>
                  </div>
                  <div>
                    <button
                      onClick={async () => {
                        await updateInvitationMutation({
                          id: invitation!.authors[0]!.id,
                          accept: false,
                        })
                        refetch()
                      }}
                    >
                      Decline
                    </button>
                  </div>
                </>
              )}
            </p>
          )
        })}
      </div>
    </>
  )
}

const Dashboard = ({ user, draftModules, invitedModules, modules, workspaces }) => {
  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto">
        <Suspense fallback="Loading...">
          <DashboardContent />
        </Suspense>
      </main>
    </>
  )
}

Dashboard.authenticate = true
Dashboard.suppressFirstRenderFlicker = true
Dashboard.getLayout = (page) => <Layout title="Dashboard">{page}</Layout>

export default Dashboard
