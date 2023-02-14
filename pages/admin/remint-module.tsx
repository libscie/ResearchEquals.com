import Link from "next/link"
import { useSession } from "@blitzjs/auth"
import { useRouter } from "next/router"
import { useQuery, useMutation } from "@blitzjs/rpc"
import { BlitzPage } from "@blitzjs/next"
import Layout from "app/core/layouts/Layout"
import "quill/dist/quill.snow.css"

import Navbar from "app/core/components/Navbar"
import LayoutLoader from "app/core/components/LayoutLoader"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import { useCurrentWorkspace } from "app/core/hooks/useCurrentWorkspace"
import getDrafts from "app/core/queries/getDrafts"
import getInvitedModules from "app/workspaces/queries/getInvitedModules"
import getAdminInfo from "app/core/queries/getAdminInfo"
import toast from "react-hot-toast"
import updateCrossRef from "app/modules/mutations/updateCrossRef"

const RemintModule: BlitzPage = () => {
  const currentUser = useCurrentUser()
  const session = useSession()
  const currentWorkspace = useCurrentWorkspace()
  const router = useRouter()
  const [drafts, { refetch }] = useQuery(getDrafts, { session })
  const [invitations] = useQuery(getInvitedModules, { session })
  const [adminInfo] = useQuery(getAdminInfo, null)
  const [updateCrossRefMutation] = useMutation(updateCrossRef)

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
          <h1 className="my-2 mx-auto text-center text-6xl font-black">Remint module metadata</h1>
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
                      {adminInfo.modules.map((module, moduleIdx) => (
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
                              target="_blank"
                              className="underline"
                            >
                              {`${module.prefix}/${module.suffix}`}
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
                                await toast.promise(updateCrossRefMutation({ id: module.id }), {
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

RemintModule.authenticate = true
RemintModule.suppressFirstRenderFlicker = true
RemintModule.getLayout = (page) => (
  <Layout title="Remint Module">
    <LayoutLoader>{page}</LayoutLoader>
  </Layout>
)

export default RemintModule
