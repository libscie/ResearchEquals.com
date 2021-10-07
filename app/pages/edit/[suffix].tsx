import { getSession, useMutation, useRouter } from "blitz"
import { Dialog, Transition } from "@headlessui/react"
import { Fragment, useState } from "react"
import Layout from "../../core/layouts/Layout"
import db from "db"
import publishModule from "app/modules/mutations/publishModule"
import NavbarApp from "../../core/components/navbarApp"
import ReadyToPublishModal from "../../core/modals/ReadyToPublishModal"
import DeleteModuleModal from "../../core/modals/DeleteModuleModal"

export const getServerSideProps = async ({ params, req, res }) => {
  const session = await getSession(req, res)

  console.log(params)

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
      !(module.authors.filter((e) => e.workspaceId === session.$publicData.workspaceId).length > 0))
  ) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      module,
      isAuthor: module.authors.filter((e) => e.workspaceId === session.$publicData.workspaceId)
        .length,
    },
  }
}

const ModuleEditPage = ({ module, isAuthor }) => {
  const [publishMutation] = useMutation(publishModule)
  const router = useRouter()
  let [isOpen, setIsOpen] = useState(false)

  return (
    <Layout title={`R= ${module.title}`}>
      <NavbarApp />
      <div className="flex justify-center items-center">
        <h1>{module.title}</h1>
        <p>{module.description}</p>
      </div>
      {isAuthor && !module.published ? (
        <>
          <ReadyToPublishModal module={module} />
          <DeleteModuleModal module={module} />
        </>
      ) : (
        ""
      )}
      <div>{JSON.stringify(module)}</div>
    </Layout>
  )
}

export default ModuleEditPage
