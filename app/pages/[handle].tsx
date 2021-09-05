import { BlitzPage, useParam } from "blitz"
import Layout from "app/core/layouts/Layout"

// TODO
// Check whether handle exists -> profile doesnt exist page
// getHandleData
// Check whether own profile is handle
// show view

const HandlePage: BlitzPage = () => {
  const handle = useParam("handle", "string")

  return <div className="flex justify-center items-center">{handle}</div>
}

HandlePage.getLayout = (page) => <Layout title="Handle">{page}</Layout>

export default HandlePage
