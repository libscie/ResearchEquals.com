import { Dialog, Transition } from "@headlessui/react"
import { CheckIcon, XIcon } from "@heroicons/react/solid"
import FollowButton from "app/workspaces/components/FollowButton"
import UnfollowButton from "app/workspaces/components/UnfollowButton"
import followWorkspace from "app/workspaces/mutations/followWorkspace"
import unfollowWorkspace from "app/workspaces/mutations/unfollowWorkspace"
import getCurrentWorkspace from "app/workspaces/queries/getCurrentWorkspace"
import { useMutation, useQuery } from "blitz"
import { Fragment, useState } from "react"
import toast from "react-hot-toast"

const AuthorPanel = ({ buttonText, title, authors }) => {
  const [openPanel, setPanelOpen] = useState(false)
  // Used to display the follow / unfollow button
  const [ownWorkspace, { refetch }] = useQuery(getCurrentWorkspace, null)
  const [followWorkspaceMutation] = useMutation(followWorkspace)
  const [unfollowWorkspaceMutation] = useMutation(unfollowWorkspace)

  return (
    <>
      <span
        onClick={() => {
          setPanelOpen(true)
        }}
      >
        <button>
          {buttonText}
          {/* Create module */}
        </button>
      </span>
      <Transition.Root show={openPanel} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 overflow-hidden" onClose={setPanelOpen}>
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
                  <div className="min-h-0 flex-1 flex flex-col py-6 overflow-y-auto h-full dark:divide-gray-600 bg-white dark:bg-gray-900 shadow-xl">
                    <div className="px-4 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-white">
                          {title}
                        </Dialog.Title>
                        <div className="ml-3 h-7 flex items-center">
                          <button
                            type="button"
                            className="rounded-md text-gray-400 dark:text-gray-200 hover:text-gray-500 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            onClick={() => setPanelOpen(false)}
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
                    {/* <div className="relative flex-1"> */}
                    {/* Replace with your content */}
                    <ul className="relative flex-1 divide-y divide-gray-400 dark:divide-gray-600">
                      {authors.map((author) => (
                        <>
                          <li className="py-2 px-2 flex">
                            <div className="mr-2">
                              <img
                                src={author.avatar}
                                alt={`Avatar of ${author.name ? author.name : author.handle}`}
                                className="w-10 h-10 rounded-full inline-block h-full align-middle"
                              />
                            </div>
                            <div className="flex-grow">
                              <span className="inline-block h-full align-middle"></span>
                              <p className="text-gray-700 dark:text-gray-200 text-sm leading-4 font-normal my-auto inline-block align-middle">
                                {author.name}
                                <p className="text-gray-500 dark:text-gray-400 text-xs leading-4 font-normal">
                                  @{author.handle}
                                </p>
                              </p>
                            </div>
                            {ownWorkspace!.handle === author.handle ? (
                              ""
                            ) : ownWorkspace!.following.filter(
                                (follow) => follow.handle === author.handle
                              ).length > 0 ? (
                              <UnfollowButton author={author} refetchFn={refetch} />
                            ) : (
                              <FollowButton author={author} refetchFn={refetch} />
                            )}
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
