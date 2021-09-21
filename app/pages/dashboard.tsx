import { BlitzPage, Link, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import Navbar from "../core/components/navbar"

const Dashboard: BlitzPage = () => {
  return (
    <>
      <Navbar />
      <main className="lg:relative">
        <Link href={Routes.SettingsPage()}>
          <a>Go to settings</a>
        </Link>
      </main>
    </>
  )
}

Dashboard.authenticate = true
Dashboard.suppressFirstRenderFlicker = true
Dashboard.getLayout = (page) => <Layout title="Dashboard">{page}</Layout>

export default Dashboard
