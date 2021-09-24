import Layout from "../../core/layouts/Layout"
import db from "db"

export const getServerSideProps = async ({ params }) => {
  const suffix = params!.suffix
  const module = await db.module.findFirst({
    where: { suffix },
  })

  if (!module) {
    return {
      notFound: true,
    }
  }

  return { props: { module } }
}

const ModulePage = ({ module }) => {
  return (
    <Layout title={module.title}>
      <div className="flex justify-center items-center">
        <h1>{module.title}</h1>
        <p>{module.description}</p>
      </div>
    </Layout>
  )
}

export default ModulePage
