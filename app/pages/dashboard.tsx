import { BlitzPage, useMutation, invokeWithMiddleware, InferGetServerSidePropsType } from "blitz"
import Layout from "app/core/layouts/Layout"
import { Widget } from "@uploadcare/react-widget"

import Navbar from "../core/components/navbar"
import updateWorkspaceAvatar from "../workspaces/mutations/updateWorkspaceAvatar"
import getCurrentWorkspace from "app/workspaces/queries/getCurrentWorkspace"

export const getServerSideProps = async ({ req, res }) => {
  const workspace = await invokeWithMiddleware(getCurrentWorkspace, null, { req, res })
  return { props: { workspace } }
}

const Dashboard = ({ workspace }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [updateWorkspaceAvatarMutation] = useMutation(updateWorkspaceAvatar)

  return (
    <>
      <Navbar />
      <Widget
        publicKey={process.env.UPLOADCARE_PUBLIC_KEY ?? "demopublickey"}
        onChange={async (info) => {
          try {
            await updateWorkspaceAvatarMutation({
              handle: workspace!.handle,
              avatar: info.cdnUrl ?? "",
            })
          } catch (err) {
            alert(err)
          }
          console.log("Upload completed:", info)
        }}
      />
    </>
  )
}

Dashboard.authenticate = true
Dashboard.suppressFirstRenderFlicker = true
Dashboard.getLayout = (page) => <Layout title="Dashboard">{page}</Layout>

export default Dashboard
