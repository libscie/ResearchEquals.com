import { BlitzPage, Link, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import moment from "moment"

import Navbar from "../core/components/navbar"
import db from "db"

export const getServerSideProps = async () => {
  const modules = await db.module.findMany()
  const workspaces = await db.workspace.findMany({
    orderBy: [
      {
        createdAt: "desc",
      },
    ],
  })

  return { props: { modules, workspaces } }
}

const Dashboard = ({ modules, workspaces }) => {
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
            <Link href={Routes.DraftsPage()}>
              <a>Check yo drafts</a>
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
            <h2 className="font-bold text-4xl">Feed</h2>
            {modules.map((module) => {
              return (
                <p key={module.suffix}>
                  <Link href={Routes.ModulePage({ suffix: module.suffix })}>
                    <a>
                      {module.suffix} {module.title}
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
