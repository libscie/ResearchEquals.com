import { BlitzPage, Link, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import Navbar from "../core/components/navbar"

const Dashboard: BlitzPage = () => {
  return (
    <>
      <Navbar />
      <main className="lg:relative">
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
      </main>
    </>
  )
}

Dashboard.authenticate = true
Dashboard.suppressFirstRenderFlicker = true
Dashboard.getLayout = (page) => <Layout title="Dashboard">{page}</Layout>

export default Dashboard
