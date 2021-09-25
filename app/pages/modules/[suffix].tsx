import { getSession, useMutation, useRouter } from "blitz"
import Layout from "../../core/layouts/Layout"
import db from "db"
import publishModule from "app/modules/mutations/publishModule"

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

  return {
    props: {
      module,
      isAuthor: module.authors.filter((e) => e.id === session.$publicData.workspaceId).length,
    },
  }
}

const ModulePage = ({ module, isAuthor }) => {
  const [publishMutation] = useMutation(publishModule)
  const router = useRouter()

  return (
    <Layout title={`R= ${module.title}`}>
      <div className="flex justify-center items-center">
        <h1>{module.title}</h1>
        <p>{module.description}</p>
      </div>
      {isAuthor && !module.published ? (
        <button
          className="px-4 py-2 bg-indigo-500 text-white hover:bg-indigo-300"
          onClick={async () => {
            await publishMutation({ id: module.id })
            router.reload()
          }}
        >
          Publish
        </button>
      ) : (
        ""
      )}
      <div>{JSON.stringify(module)}</div>
    </Layout>
  )
}

export default ModulePage
