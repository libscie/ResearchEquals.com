import { AuthenticationError, getSession } from "blitz"
import Layout from "../../core/layouts/Layout"
import db from "db"

export const getServerSideProps = async ({ params, req, res }) => {
  const session = await getSession(req, res)

  const suffix = params!.suffix
  const module = await db.module.findFirst({
    where: { suffix },
    include: {
      authors: true,
    },
  })

  // Throw 404 if
  // 1. Module does not exist
  // 2. Module exists but is unpublished and not authored by current workspace
  if (
    !module ||
    (module.published === false &&
      !(module.authors.filter((e) => e.id === session.$publicData.workspaceId).length > 0))
  ) {
    return {
      notFound: true,
    }
  }

  return { props: { module } }
}

const ModulePage = ({ module }) => {
  return (
    <Layout title={`R= ${module.title}`}>
      <div className="flex justify-center items-center">
        <h1>{module.title}</h1>
        <p>{module.description}</p>
      </div>
      <div>{JSON.stringify(module)}</div>
    </Layout>
  )
}

export default ModulePage
