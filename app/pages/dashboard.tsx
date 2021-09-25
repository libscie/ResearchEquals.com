import { getSession, Link, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import moment from "moment"

import Navbar from "../core/components/navbar"
import db from "db"

export const getServerSideProps = async ({ req, res }) => {
  const session = await getSession(req, res)
  const draftModules = await db.module.findMany({
    where: {
      published: false,
      authors: {
        some: {
          id: session.$publicData.workspaceId,
        },
      },
    },
    orderBy: [
      {
        updatedAt: "asc",
      },
    ],
  })

  const modules = await db.module.findMany({
    where: {
      published: true,
    },
    orderBy: [
      {
        publishedAt: "desc",
      },
    ],
    include: {
      authors: true,
    },
  })

  const workspaces = await db.workspace.findMany({
    orderBy: [
      {
        createdAt: "desc",
      },
    ],
  })

  return { props: { draftModules, modules, workspaces } }
}

const Dashboard = ({ draftModules, modules, workspaces }) => {
  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto">
        <div>
          <p>
            <Link href={Routes.CreatePage()}>
              <a>Lets create some shit</a>
            </Link>
          </p>
          <p>
            <Link href={Routes.SettingsPage()}>
              <a>Go to settings</a>
            </Link>
          </p>
        </div>
        <div className="flex">
          <div className="w-full">
            <h2 className="font-bold text-4xl">
              <Link href={Routes.DraftsPage()}>
                <a>
                  {draftModules.length} draft{draftModules.length !== 1 ? "s" : ""}
                </a>
              </Link>
            </h2>
            {draftModules.map((draft) => {
              return (
                <p key={draft.suffix}>
                  Last edited: {moment(draft.updatedAt).fromNow()}
                  <Link href={Routes.ModulePage({ suffix: draft.suffix })}>
                    <a>
                      10.53962/{draft.suffix} {draft.title}
                    </a>
                  </Link>
                </p>
              )
            })}
          </div>
          <div className="w-full">
            <h2 className="font-bold text-4xl">Feed</h2>
            {modules.map((module) => {
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
          {workspaces.map((workspace) => {
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
      </main>
    </>
  )
}

Dashboard.authenticate = true
Dashboard.suppressFirstRenderFlicker = true
Dashboard.getLayout = (page) => <Layout title="Dashboard">{page}</Layout>

export default Dashboard
