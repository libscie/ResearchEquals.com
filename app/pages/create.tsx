import { BlitzPage } from "blitz"
import Layout from "app/core/layouts/Layout"
import Navbar from "../core/components/navbar"

const CreatePage: BlitzPage = () => {
  return (
    <>
      <Navbar />
      <main className="lg:relative">TEST</main>
    </>
  )
}

CreatePage.authenticate = true
CreatePage.getLayout = (page) => <Layout title="CreatePage">{page}</Layout>

export default CreatePage
