import { BlitzPage } from "blitz"
import Layout from "app/core/layouts/Layout"
import Navbar from "../core/components/navbar"

const SettingsPage: BlitzPage = () => {
  return (
    <>
      <Navbar />
      <main className="lg:relative">TEST</main>
    </>
  )
}

SettingsPage.authenticate = true
SettingsPage.getLayout = (page) => <Layout title="SettingsPage">{page}</Layout>

export default SettingsPage
