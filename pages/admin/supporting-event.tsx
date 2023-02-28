import { useSession } from "@blitzjs/auth"
import { useRouter } from "next/router"
import { useQuery, useMutation } from "@blitzjs/rpc"
import { BlitzPage } from "@blitzjs/next"
import Layout from "app/core/layouts/Layout"
import { useQuill } from "react-quilljs"
import { SupportingEvent } from "@prisma/client"

import broadcastSupporting from "../../app/core/mutations/broadcast-supporting"
import createEvent from "../../app/membership-area/mutations/createEvent"

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

const CreateSupportingEvent: BlitzPage = () => {
  const currentUser = useCurrentUser()
  const session = useSession()
  const currentWorkspace = useCurrentWorkspace()
  const router = useRouter()
  const [drafts, { refetch }] = useQuery(getDrafts, { session })
  const [invitations] = useQuery(getInvitedModules, { session })
  const [createEventMutation] = useMutation(createEvent)
  const { quill, quillRef } = useQuill()
  const [countSubmit, setCountSubmit] = useState(0)

  const formik = useFormik({
    initialValues: {
      type: "ASSEMBLY",
      title: "",
      slug: "",
      content: "",
      attachments: "",
    },
    validate: validateZodSchema(
      z.object({
        type: z.string(),
        title: z.string().max(200),
        slug: z.string().min(1).max(50),
        content: z.string(),
        attachments: z.string(),
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
          createEventMutation({
            title: values.title,
            type: values.type,
            slug: values.slug,
            content: quill.root.innerHTML,
          }),
          {
            loading: "Creating event...",
            success: "Event created!",
            error: "Event failed.",
          }
        )
        setCountSubmit(0)
        await router.push(`/membership-area/${values.slug}`)
      }
      // quill.root.innerHTML
      // alert(JSON.stringify(quill.root.innerHTML))
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
            Create a supporting member event
          </h1>
          <p className="mx-auto my-8 text-center text-xl">
            This will add a event into the membership area. Use this to announce, document, or
            further disclose assemblies, petitions, or requests.
          </p>
          <div className="mx-auto sm:w-1/2">
            <form onSubmit={formik.handleSubmit}>
              <input
                id="title"
                type="title"
                autoComplete="title"
                required
                className="placeholder-font-normal block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-sm font-normal placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500  dark:border-gray-500 dark:bg-gray-800 "
                placeholder="Title"
                {...formik.getFieldProps("title")}
              />
              <input
                id="slug"
                type="slug"
                autoComplete="slug"
                required
                className="placeholder-font-normal my-8 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-sm font-normal placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none  focus:ring-indigo-500 dark:border-gray-500 dark:bg-gray-800"
                placeholder="Slug (no spaces)"
                {...formik.getFieldProps("slug")}
              />
              <select
                id="type"
                required
                className="placeholder-font-normal block w-full appearance-none rounded-md border border-gray-400 bg-white px-3 py-2 text-sm font-normal placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0 dark:border-gray-600 dark:bg-transparent dark:text-gray-200 "
                {...formik.getFieldProps("type")}
              >
                {Object.values(SupportingEvent).map((role) => {
                  return <option key={role}>{role}</option>
                })}
              </select>
              <div className="my-8">
                <div ref={quillRef} />
              </div>
              <button
                type="submit"
                className="text-medium w-full rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Create event
              </button>
            </form>
          </div>
        </div>
      </main>
    </>
  )
}

CreateSupportingEvent.authenticate = { role: ["SUPERADMIN"] }
CreateSupportingEvent.suppressFirstRenderFlicker = true
CreateSupportingEvent.getLayout = (page) => (
  <Layout title="Create supporting event">
    <LayoutLoader>{page}</LayoutLoader>
  </Layout>
)

export default CreateSupportingEvent
