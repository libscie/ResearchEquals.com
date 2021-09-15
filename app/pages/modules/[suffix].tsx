import { BlitzPage, useParam } from "blitz"
import Layout from "../../core/layouts/Layout"

// TODO
// Check whether suffix exists -> module doesn't exist page
// getModuleData
// show view

const ModulePage: BlitzPage = () => {
  const suffix = useParam("suffix", "string")

  return (
    <Layout title={suffix}>
      <div className="flex justify-center items-center">{suffix}</div>
    </Layout>
  )
}

export default ModulePage
