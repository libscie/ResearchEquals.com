import {
  BlitzPage,
  useQuery,
  useRouter,
  useSession,
  Link,
  useMutation,
  validateZodSchema,
} from "blitz"
import Layout from "app/core/layouts/Layout"
import { useQuill } from "react-quilljs"
import "quill/dist/quill.snow.css"

import Navbar from "../core/components/Navbar"
import LayoutLoader from "../core/components/LayoutLoader"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import { useCurrentWorkspace } from "app/core/hooks/useCurrentWorkspace"
import getDrafts from "app/core/queries/getDrafts"
import getInvitedModules from "app/workspaces/queries/getInvitedModules"
import getAdminInfo from "../core/queries/getAdminInfo"
import toast from "react-hot-toast"
import updateCrossRef from "../modules/mutations/updateCrossRef"
import { z } from "zod"
import { useFormik } from "formik"
import broadcastMessage from "../core/mutations/broadcast-message"
import { useState } from "react"

const Admin: BlitzPage = () => {
  const currentUser = useCurrentUser()
  const session = useSession()
  const currentWorkspace = useCurrentWorkspace()
  const router = useRouter()
  const [drafts, { refetch }] = useQuery(getDrafts, { session })
  const [invitations] = useQuery(getInvitedModules, { session })
  const [adminInfo] = useQuery(getAdminInfo, null)
  const [updateCrossRefMutation] = useMutation(updateCrossRef)
  const [broadcastMutation] = useMutation(broadcastMessage)
  const { quill, quillRef } = useQuill()
  const [countSubmit, setCountSubmit] = useState(0)

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
        toast.promise(
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
        <h1 className="mx-auto text-center text-6xl font-black">Admin portal</h1>
        <div>
          <h2 className="mx-auto my-8 text-center text-lg font-normal">Broadcast email to users</h2>
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
        <div>
          <h2 className="mx-auto my-8 text-center text-lg font-normal">DOI reminting</h2>
          <div className="flex flex-col">
            <div className="">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <div className="overflow-hidden border-b border-gray-200 shadow sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-900 dark:text-white"
                        >
                          DOI
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-900 dark:text-white"
                        >
                          Name
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-900 dark:text-white"
                        >
                          Type
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-900 dark:text-white"
                        >
                          License
                        </th>
                        <th scope="col" className="relative px-6 py-3">
                          <span className="sr-only">Update DOI registration</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {adminInfo.map((module, moduleIdx) => (
                        <tr
                          key={module.title}
                          className={
                            moduleIdx % 2 === 0
                              ? "bg-white dark:bg-gray-900"
                              : "bg-gray-50 dark:bg-gray-800"
                          }
                        >
                          <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white ">
                            <Link
                              href={`https://api.crossref.org/works/${module.prefix}/${module.suffix}`}
                            >
                              <a
                                target="_blank"
                                className="underline"
                              >{`${module.prefix}/${module.suffix}`}</a>
                            </Link>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                            {module.title}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                            {module.type.name}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                            {module.license?.name}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                            <button
                              onClick={async () => {
                                toast.promise(updateCrossRefMutation({ id: module.id }), {
                                  loading: "Updating...",
                                  success: "Updated metadata with CrossRef",
                                  error: "That did not work",
                                })
                              }}
                              className="whitespace-nowrap rounded border-0 bg-indigo-100 px-4 py-2 text-sm font-normal leading-5 text-indigo-700 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0 dark:border dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                            >
                              Update CrossRef
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

Admin.authenticate = true
Admin.suppressFirstRenderFlicker = true
Admin.getLayout = (page) => (
  <Layout title="R= Admin">
    <LayoutLoader>{page}</LayoutLoader>
  </Layout>
)

export default Admin
