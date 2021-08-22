import { BlitzPage } from "blitz"
import Layout from "app/core/layouts/Layout"
import Navbar from "../core/components/navbar"

const Home: BlitzPage = () => {
  return <Navbar />
}

Home.suppressFirstRenderFlicker = true
Home.getLayout = (page) => <Layout title="Home">{page}</Layout>

export default Home
