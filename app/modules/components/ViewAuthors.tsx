import { Fragment, useState } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { XIcon } from "@heroicons/react/outline"
import { Link, Routes, useQuery } from "blitz"
import FollowButton from "app/workspaces/components/FollowButton"
import UnfollowButton from "app/workspaces/components/UnfollowButton"

import getCurrentWorkspace from "../../workspaces/queries/getCurrentWorkspace"

const ViewAuthors = ({ button, module }) => {
  const [viewAuthorsOpen, setViewAuthorsOpen] = useState(false)
  const [ownWorkspace, { refetch }] = useQuery(getCurrentWorkspace, null)

  return (
    <>
      <button
        type="button"
        className="flex px-2 py-2 border dark:bg-gray-800 border-gray-300 dark:border-gray-600 dark:hover:border-gray-400 text-gray-700 dark:text-gray-200 rounded text-xs leading-4 font-normal shadow-sm mx-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 hover:bg-gray-100 dark:hover:bg-gray-700"
        onClick={() => {
          setViewAuthorsOpen(true)
        }}
      >
        View authors
      </button>
      <Transition.Root show={viewAuthorsOpen} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 overflow-hidden" onClose={setViewAuthorsOpen}>
          <div className="absolute inset-0 overflow-hidden">
            <Dialog.Overlay className="fixed inset-0 bg-gray-900 bg-opacity-25 transition-opacity" />

            <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <div className="w-screen max-w-xs">
                  <div className="min-h-0 flex-1 flex flex-col pt-6 overflow-y-auto h-full dark:divide-gray-600 bg-white dark:bg-gray-900 shadow-xl">
                    <div className="px-4 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-white">
                          Module Authors
                        </Dialog.Title>
                        <div className="ml-3 h-7 flex items-center">
                          <button
                            type="button"
                            className="rounded-md text-gray-400 dark:text-gray-200 hover:text-gray-500 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            onClick={() => setViewAuthorsOpen(false)}
                          >
                            <span className="sr-only">Close panel</span>
                            <XIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 px-4 sm:px-6 text-sm leading-5 font-normal border-b border-gray-400 dark:border-gray-600 pb-4 dark:text-white">
                      Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Phasellus hendrerit.
                      Pellentesque aliquet nibh nec urna. In nisi neque, aliquet vel, dapibus id,
                      mattis vel, nisi.
                    </div>
                    {/* Replace with your content */}

                    <ul className="relative flex-1 divide-y divide-gray-400 dark:divide-gray-600">
                      {module.authors.map((author) => (
                        <>
                          <li className="py-2 px-2 flex">
                            <div className="mr-2 flex">
                              <img
                                src={author!.workspace!.avatar}
                                alt={`Avatar of ${author!.workspace!.handle}`}
                                className="w-10 h-10 rounded-full inline-block h-full align-middle"
                              />
                            </div>
                            <div className="flex-grow">
                              <span className="inline-block h-full align-middle"></span>
                              <Link href={Routes.HandlePage({ handle: author.workspace.handle })}>
                                <a className="text-gray-700 dark:text-gray-200 text-sm leading-4 font-normal my-auto inline-block align-middle">
                                  {author!.workspace!.firstName} {author!.workspace!.lastName}
                                  <p className="text-gray-500 dark:text-gray-400 text-xs leading-4 font-normal">
                                    @{author!.workspace!.handle}
                                  </p>
                                </a>
                              </Link>
                            </div>
                            {ownWorkspace ? (
                              ownWorkspace!.handle === author.handle ? (
                                ""
                              ) : ownWorkspace!.following.filter(
                                  (follow) => follow.handle === author.workspace.handle
                                ).length > 0 ? (
                                <UnfollowButton author={author.workspace} refetchFn={refetch} />
                              ) : (
                                <FollowButton author={author.workspace} refetchFn={refetch} />
                              )
                            ) : (
                              ""
                            )}
                          </li>
                        </>
                      ))}
                    </ul>
                    {/* /End replace */}
                  </div>
                </div>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  )
}

export default ViewAuthors
