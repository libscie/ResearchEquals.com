import { BlitzPage, useRouter } from "blitz"
import Layout from "app/core/layouts/Layout"
import { Wax } from "wax-prosemirror-core"

import Navbar from "../core/components/navbarMarketing"
import CreateModuleForm from "../modules/components/CreateModuleForm"
import waxMini from "../wax/waxMini"
import ncbiMiniLayout from "../wax/ncbiMiniLayout"
import waxFullConfig from "../wax/waxFullConfig"
import waxFullLayout from "../wax/waxFullLayout"

const renderImage = (file) => {
  const reader = new FileReader()
  return new Promise((accept, fail) => {
    reader.onload = () => accept(reader.result)
    reader.onerror = () => fail(reader.error)
    // Some extra delay to make the asynchronicity visible
    setTimeout(() => reader.readAsDataURL(file), 150)
  })
}

const user = {
  userId: "b3cfc28e-0f2e-45b5-b505-e66783d4f946",
  userColor: {
    addition: "royalblue",
    deletion: "indianred",
  },
  username: "admin",
}

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
        <div className="mx-auto max-w-3xl w-full">
          <h1>Mini layout</h1>
          <Wax
            config={waxMini}
            autoFocus
            value=""
            layout={ncbiMiniLayout}
            placeholder="Start Typing ..."
            onChange={(source) => console.log(source)}
          />
        </div>
        <div className="w-screen w-full">
          <h1>Full layout</h1>
          <Wax
            config={waxFullConfig}
            key="wax"
            autoFocus
            value=""
            layout={waxFullLayout}
            placeholder="Start Typing ..."
            onChange={(source) => console.log(source)}
            user={user}
            fileUpload={(file) => renderImage(file)}
          />
        </div>
      </main>
    </>
  )
}

CreatePage.authenticate = true
CreatePage.getLayout = (page) => <Layout title="CreatePage">{page}</Layout>

export default CreatePage
