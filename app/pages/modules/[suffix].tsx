import Layout from "../../core/layouts/Layout"
import db from "db"
import NavbarApp from "../../core/components/Navbar"

export async function getStaticPaths() {
  const modules = await db.module.findMany({
    where: {
      published: {
        equals: true,
      },
    },
  })
  const pathObject = modules.map((module) => {
    return {
      params: {
        suffix: module.suffix,
      },
    }
  })
  console.log(pathObject)

  return {
    paths: pathObject,
    fallback: false,
  }
}

export async function getStaticProps(context) {
  const module = await db.module.findFirst({
    where: {
      suffix: context.params.suffix,
    },
  })

  return {
    props: {
      module,
    }, // will be passed to the page component as props
  }
}

const ModulePage = ({ module }) => {
  return (
    <Layout title={`R= ${module.title}`}>
      <NavbarApp />
      <div className="flex justify-center items-center">
        <h1>{module.title}</h1>
        <p>{module.description}</p>
      </div>
      <div>{JSON.stringify(module)}</div>
    </Layout>
  )
}

export default ModulePage
