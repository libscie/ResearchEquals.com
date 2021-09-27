import { BlitzPage, useRouter } from "blitz"
import Layout from "app/core/layouts/Layout"
import Navbar from "../core/components/navbarMarketing"
import CreateModuleForm from "../modules/components/CreateModuleForm"

const CreatePage: BlitzPage = () => {
  const router = useRouter()

  return (
    <>
      <Navbar />
      <main className="lg:relative">
        <CreateModuleForm
          onSuccess={(items) => {
            console.log(items)
            router.push("/dashboard")
          }}
        />
      </main>
    </>
  )
}

CreatePage.authenticate = true
CreatePage.getLayout = (page) => <Layout title="CreatePage">{page}</Layout>

export default CreatePage
