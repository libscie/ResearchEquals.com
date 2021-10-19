import Layout from "app/core/layouts/Layout"
import db from "db"
import Navbar from "../core/components/Navbar"

export const getServerSideProps = async ({ params }) => {
  const handle = params!.handle
  const workspace = await db.workspace.findFirst({
    where: { handle },
  })

  if (!workspace) {
    return {
      notFound: true,
    }
  }

  return { props: { workspace } }
}

const HandlePage = ({ workspace }) => {
  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center">{workspace.handle}</div>
      <div>{JSON.stringify(workspace)}</div>
    </>
  )
}

HandlePage.getLayout = (page) => <Layout title="Handle">{page}</Layout>

export default HandlePage
