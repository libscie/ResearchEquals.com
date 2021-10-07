import { getSession, useMutation, useRouter } from "blitz"
import { useState } from "react"
import Layout from "../../core/layouts/Layout"
import db from "db"
import publishModule from "app/modules/mutations/publishModule"
import NavbarApp from "../../core/components/navbarApp"
import ReadyToPublishModal from "../../core/modals/ReadyToPublishModal"
import DeleteModuleModal from "../../core/modals/DeleteModuleModal"
import Banner from "../../core/components/Banner"

const people = [
  {
    name: "Jane Cooper",
    title: "Regional Paradigm Technician",
    department: "Optimization",
    role: "Admin",
    email: "jane.cooper@example.com",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
  },
  // More people...
]

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
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-center items-center">
          <h1 className="text-8xl font-black">{module.title}</h1>
        </div>
        <div>
          <h2 className="text-4xl font-black">Abstract</h2>
          <p>{module.description}</p>
        </div>
        <div>
          <p>{module.updatedAt.toString()}</p>
        </div>
        <div className="flex flex-col">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Name
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Edit</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {module.authors.map((author) => (
                      <tr key={author.workspace.orcid}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {author.workspace.avatar ? (
                              <div className="flex-shrink-0 h-10 w-10">
                                <img
                                  className="h-10 w-10 rounded-full"
                                  src={author.workspace.avatar}
                                  alt={`Avatar of ${author.workspace.name}`}
                                />
                              </div>
                            ) : (
                              <div className="flex-shrink-0 h-10 w-10">
                                <img
                                  className="h-10 w-10 rounded-full"
                                  src={`https://eu.ui-avatars.com/api/?rounded=true&background=random&name=${author.workspace.handle}`}
                                  alt={`Avatar of ${author.workspace.name}`}
                                />
                              </div>
                            )}
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {author.workspace.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                @{author.workspace.handle}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {author.readyToPublish.toString()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <ReadyToPublishModal module={module} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div>{JSON.stringify(module)}</div>
        {isAuthor && !module.published && user.emailIsVerified ? (
          <ReadyToPublishModal module={module} />
        ) : (
          ""
        )}
        {isAuthor && !module.published ? <DeleteModuleModal module={module} /> : ""}
      </div>
    </Layout>
  )
}

export default ModuleEditPage
