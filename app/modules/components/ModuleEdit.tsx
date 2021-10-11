import { useQuery, useMutation } from "blitz"
import { Wax } from "wax-prosemirror-core"
import { Popover, Transition } from "@headlessui/react"
import { ChevronDoubleDownIcon } from "@heroicons/react/solid"
import { Fragment } from "react"
import { DefaultSchema } from "wax-prosemirror-utilities"
import moment from "moment"

import ReadyToPublishModal from "../../core/modals/ReadyToPublishModal"
import DeleteModuleModal from "../../core/modals/DeleteModuleModal"
import useCurrentModule from "../queries/useCurrentModule"
import { useEffect } from "react"
import InstaLayout from "../../wax/InstaLayout"
import changeTitle from "../mutations/changeTitle"
import changeAbstract from "../mutations/changeAbstract"

const ModuleEdit = ({ user, module, isAuthor }) => {
  const [moduleEdit, { refetch }] = useQuery(useCurrentModule, { suffix: module.suffix })
  const [changeTitleMutation] = useMutation(changeTitle)
  const [changeAbstractMutation] = useMutation(changeAbstract)

  useEffect(() => {
    const interval = setInterval(() => {
      refetch()
    }, 1000)
    return () => clearInterval(interval)
  }, [refetch])

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-center items-center">
        <Popover className="relative">
          {({ open }) => (
            <>
              <Popover.Button
                className={`${open ? "" : "text-opacity-90"}
                text-black group bg-orange-700 px-3 py-2 rounded-md inline-flex items-center text-base font-medium hover:text-opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}
              >
                <h1 className="text-8xl font-black">{moduleEdit!.title!}</h1>
                <ChevronDoubleDownIcon
                  className={`${open ? "" : "text-opacity-70"}
                  ml-2 h-5 w-5 text-white group-hover:text-opacity-80 bg-black transition ease-in-out duration-150`}
                  aria-hidden="true"
                />
              </Popover.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-150"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <Popover.Panel className="absolute z-10 w-screen max-w-sm px-4 mt-3 transform -translate-x-1/2 left-1/2 sm:px-0 lg:max-w-3xl">
                  <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                    <div className="relative grid gap-8 bg-white p-7 lg:grid-cols-2">
                      <Wax
                        autoFocus
                        placeholder={moduleEdit!.title!}
                        value={moduleEdit!.title!}
                        config={{
                          SchemaService: DefaultSchema,
                          services: [],
                        }}
                        layout={InstaLayout}
                        onChange={(source) => {
                          changeTitleMutation({
                            suffix: moduleEdit!.suffix,
                            title: source.replace(/<\/?[^>]+(>|$)/g, ""),
                          })
                          refetch()
                        }}
                      />
                    </div>
                  </div>
                </Popover.Panel>
              </Transition>
            </>
          )}
        </Popover>
      </div>
      <div>
        <h2>Last edited:</h2>
        <p>{moment(module.updatedAt).fromNow()}</p>
      </div>
      <div>
        <h2 className="text-4xl font-black">Abstract</h2>
        <Popover className="relative">
          {({ open }) => (
            <>
              <Popover.Button
                className={`${open ? "" : "text-opacity-90"}
                group bg-orange-700 rounded-md inline-flex items-center hover:text-opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}
              >
                <p>{moduleEdit!.description!}</p>
                <ChevronDoubleDownIcon
                  className={`${open ? "" : "text-opacity-70"}
                  ml-2 h-5 w-5 text-white group-hover:text-opacity-80 bg-black transition ease-in-out duration-150`}
                  aria-hidden="true"
                />
              </Popover.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-150"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <Popover.Panel className="absolute z-10 w-screen max-w-sm px-4 mt-3 transform -translate-x-1/2 left-1/2 sm:px-0 lg:max-w-3xl">
                  <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                    <div className="relative grid gap-8 bg-white p-7 lg:grid-cols-2">
                      <Wax
                        autoFocus
                        placeholder={moduleEdit!.description!}
                        value={moduleEdit!.description!}
                        config={{
                          SchemaService: DefaultSchema,
                          services: [],
                        }}
                        layout={InstaLayout}
                        onChange={(source) => {
                          changeAbstractMutation({
                            suffix: moduleEdit!.suffix,
                            description: source.replace(/<\/?[^>]+(>|$)/g, ""),
                          })
                          refetch()
                        }}
                      />
                    </div>
                  </div>
                </Popover.Panel>
              </Transition>
            </>
          )}
        </Popover>
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
                            <div className="text-sm text-gray-500">@{author.workspace.handle}</div>
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
  )
}

export default ModuleEdit
