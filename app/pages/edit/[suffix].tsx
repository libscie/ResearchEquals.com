import { getSession, useMutation, useRouter } from "blitz"
import { useState } from "react"
import Layout from "../../core/layouts/Layout"
import db from "db"
import publishModule from "app/modules/mutations/publishModule"
import NavbarApp from "../../core/components/navbarApp"
import ReadyToPublishModal from "../../core/modals/ReadyToPublishModal"
import DeleteModuleModal from "../../core/modals/DeleteModuleModal"
import Banner from "../../core/components/Banner"
import useCurrentModule from "../../modules/queries/useCurrentModule"
import ModuleEdit from "../../modules/components/ModuleEdit"

export const getServerSideProps = async ({ params, req, res }, ctx) => {
  const session = await getSession(req, res)

  const suffix = params!.suffix
  const module = await db.module.findFirst({
    where: { suffix },
    include: {
      authors: {
        include: {
          workspace: true,
        },
      },
    },
  })

  const user = await db.user.findFirst({
    where: {
      id: session.$publicData.userId == null ? 0 : session.$publicData.userId,
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
      user,
    },
  }
}

const ModuleEditPage = ({ user, module, isAuthor }) => {
  return (
    <Layout title={`R= ${module.title}`}>
      {!user.emailIsVerified ? (
        <Banner message="You can only start publishing once your email is verified. Please check your inbox." />
      ) : (
        ""
      )}
      <NavbarApp />
      <ModuleEdit user={user} module={module} isAuthor={isAuthor} />
    </Layout>
  )
}

export default ModuleEditPage
