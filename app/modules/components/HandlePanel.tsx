import { Dialog, Transition } from "@headlessui/react"
import FollowButton from "app/workspaces/components/FollowButton"
import UnfollowButton from "app/workspaces/components/UnfollowButton"
import getCurrentWorkspace from "app/workspaces/queries/getCurrentWorkspace"
import { Link, Routes, useQuery } from "blitz"
import { Fragment, useState } from "react"
import { Close } from "@carbon/icons-react"

const AuthorPanel = ({ buttonText, title, authors, name }) => {
  const [openPanel, setPanelOpen] = useState(false)
  const [ownWorkspace, { refetch }] = useQuery(getCurrentWorkspace, null)

  return (
    <>
      <span
        onClick={() => {
          setPanelOpen(true)
        }}
      >
        <button>{buttonText}</button>
      </span>
      <Transition.Root show={openPanel} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 overflow-hidden" onClose={setPanelOpen}>
          <div className="absolute inset-0 overflow-hidden">
            <Dialog.Overlay className="fixed inset-0 bg-gray-900 bg-opacity-25 transition-opacity" />

            <div className="fixed inset-y-0 left-0 flex max-w-full pr-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <div className="max-w-screen w-screen border-l  border-gray-400 dark:border-gray-600 sm:max-w-lg">
                  <div className="flex h-full min-h-0 flex-1 flex-col overflow-y-auto bg-white py-6 shadow-xl dark:divide-gray-600 dark:bg-gray-900">
                    <div className="px-4 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-white">
                          {title}
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-gray-200 dark:hover:bg-gray-800 dark:hover:text-white"
                            onClick={() => setPanelOpen(false)}
                          >
                            <span className="sr-only">Close panel</span>
                            <Close size={32} className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 border-b border-gray-400 px-4 pb-4 text-sm font-normal leading-5 dark:border-gray-600 dark:text-white sm:px-6">
                      These are the authors {name} is following. Maybe there is somebody in this
                      list you find interesting?
                    </div>
                    {/* Replace with your content */}
                    <ul className="relative flex-1 divide-y divide-gray-400 dark:divide-gray-600">
                      {authors.map((author) => (
                        <>
                          <li className="flex py-2 px-2">
                            <img
                              src={author.avatar}
                              alt={`Avatar of ${author.handle}`}
                              className="max-w-14 mr-2 inline-block h-14 h-full max-h-14 w-14 rounded-full align-middle"
                            />
                            <div
                              className="hidden flex-grow xs:flex"
                              onClick={() => {
                                setPanelOpen(false)
                              }}
                            >
                              <span className="inline-block h-full align-middle"></span>
                              <Link href={Routes.HandlePage({ handle: author.handle })}>
                                <a className="my-auto inline-block overflow-hidden overflow-ellipsis align-middle text-sm font-normal leading-4 text-gray-700 dark:text-gray-200">
                                  {author.firstName} {author.lastName}
                                  <p className="text-xs font-normal leading-4 text-gray-500 dark:text-gray-400">
                                    @{author.handle}
                                  </p>
                                </a>
                              </Link>
                            </div>
                            <div>
                              {ownWorkspace ? (
                                ownWorkspace!.handle === author.handle ? (
                                  ""
                                ) : ownWorkspace!.following.filter(
                                    (follow) => follow.handle === author.handle
                                  ).length > 0 ? (
                                  <UnfollowButton author={author} refetchFn={refetch} />
                                ) : (
                                  <FollowButton author={author} refetchFn={refetch} />
                                )
                              ) : (
                                ""
                              )}
                            </div>
                          </li>
                        </>
                      ))}
                    </ul>
                    {/* /End replace */}
                  </div>
                </div>
                {/* </div> */}
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  )
}

export default AuthorPanel
