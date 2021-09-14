import { BlitzPage } from "blitz"
import Layout from "app/core/layouts/Layout"
import Navbar from "../core/components/navbar"

const DraftsPage: BlitzPage = () => {
  return (
    <>
      <Navbar />
      <main className="lg:relative">Drafts</main>
    </>
  )
}

DraftsPage.authenticate = true
DraftsPage.getLayout = (page) => <Layout title="Drafts">{page}</Layout>

export default DraftsPage
