import { useSession } from "@blitzjs/auth"
import { useRouter } from "next/router"
import { useQuery, useMutation } from "@blitzjs/rpc"
import { BlitzPage } from "@blitzjs/next"
import Layout from "app/core/layouts/Layout"
import { useQuill } from "react-quilljs"
import broadcastSupporting from "../../app/core/mutations/broadcast-supporting"
import "quill/dist/quill.snow.css"

import Navbar from "app/core/components/Navbar"
import LayoutLoader from "app/core/components/LayoutLoader"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import { useCurrentWorkspace } from "app/core/hooks/useCurrentWorkspace"
import getDrafts from "app/core/queries/getDrafts"
import getInvitedModules from "app/workspaces/queries/getInvitedModules"
import toast from "react-hot-toast"
import { z } from "zod"
import { useFormik } from "formik"
import { useState } from "react"
import { validateZodSchema } from "blitz"
import getAdminInfo from "app/core/queries/getAdminInfo"

const BroadcastSupporting: BlitzPage = () => {
  const currentUser = useCurrentUser()
  const session = useSession()
  const currentWorkspace = useCurrentWorkspace()
  const router = useRouter()
  const [drafts, { refetch }] = useQuery(getDrafts, { session })
  const [invitations] = useQuery(getInvitedModules, { session })
  const [broadcastMutation] = useMutation(broadcastSupporting)
  const { quill, quillRef } = useQuill()
  const [countSubmit, setCountSubmit] = useState(0)
  const [adminInfo] = useQuery(getAdminInfo, null)

  const formik = useFormik({
    initialValues: {
      subject: "",
      content: "",
    },
    validate: validateZodSchema(
      z.object({
        subject: z.string().max(100),
        content: z.string(),
      })
    ),
    onSubmit: async (values) => {
      if (countSubmit < 10) {
        toast.error(
          `To prevent mistakes, confirm another ${10 - countSubmit} time${
            countSubmit < 9 ? "s" : ""
          }`
        )
        setCountSubmit(countSubmit + 1)
      } else {
        await toast.promise(
          broadcastMutation({
            subject: values.subject,
            htmlContent: quill.root.innerHTML,
            textContent: quill.getText(),
          }),
          {
            loading: "Sending...",
            success: <b>Broadcast successful!</b>,
            error: "Broadcast failed.",
          }
        )
        setCountSubmit(0)
      }
    },
  })

  return (
    <>
      <Navbar
        currentUser={currentUser}
        session={session}
        currentWorkspace={currentWorkspace}
        router={router}
        drafts={drafts}
        invitations={invitations}
        refetchFn={refetch}
      />
      <main className="my-8 bg-white dark:bg-gray-900 lg:relative">
        <div>
          <h1 className="mx-auto my-8 text-center text-6xl font-black">
            Broadcast email to supporting members
          </h1>
          <p className="mx-auto my-8 text-center text-xl">
            This will be sent in name of the current CEO and chair of the General Assemblies
            (ceo@libscie.org).
          </p>
          <div className="mx-auto sm:w-1/2">
            <form onSubmit={formik.handleSubmit}>
              <input
                id="subject"
                type="subject"
                autoComplete="subject"
                required
                className="placeholder-font-normal block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-sm font-normal placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500  dark:border-gray-500 dark:bg-gray-800 "
                placeholder="Subject"
                {...formik.getFieldProps("subject")}
              />
              <div className="my-8">
                <div ref={quillRef} />
              </div>
              <button
                type="submit"
                className="text-medium w-full rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Send email
              </button>
            </form>
          </div>
        </div>
      </main>
    </>
  )
}

BroadcastSupporting.authenticate = { role: ["SUPERADMIN"] }
BroadcastSupporting.suppressFirstRenderFlicker = true
BroadcastSupporting.getLayout = (page) => (
  <Layout title="Broadcast (supporting)">
    <LayoutLoader>{page}</LayoutLoader>
  </Layout>
)

export default BroadcastSupporting
