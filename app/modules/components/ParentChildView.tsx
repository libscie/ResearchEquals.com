import { Fragment, useState } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { XIcon } from "@heroicons/react/outline"
import { Link, Routes } from "blitz"
import moment from "moment"

import ModuleCard from "../../core/components/ModuleCard"

const ParentChildView = ({ module }) => {
  const [followsFromOpen, setFollowsFromOpen] = useState(false)
  const [leadsToOpen, setLeadsToOpen] = useState(false)

  return (
    <>
      <div className="lg:flex">
        <div
          className="flex-grow w-full text-gray-500 dark:text-gray-200 dark:bg-gray-800 text-xs leading-4 font-normal p-2 cursor-pointer text-center"
          onClick={() => {
            setFollowsFromOpen(true)
          }}
        >
          Follows from ({module.parents.length}):
          <span className="flex-grow underline">
            <div
              key={module.parents[0].title + "object"}
              className="inline-block align-middle w-full"
            >
              <div className="flex">
                <span className="flex-grow underline truncate">
                  [{module.parents[0].type.name}] {module.parents[0].title}
                </span>
              </div>
            </div>
          </span>
        </div>
        <div className="dark:text-gray-200 dark:bg-gray-800 px-2 flex lg:inline">
          <span className="flex-grow"></span>
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="fill-current text-gray-600 dark:text-gray-200"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M27 13L32 15.8868L27 18.7735V16.3868H26C21.5298 16.3868 17.7807 19.4742 16.7689 23.6331C16.6473 23.0488 16.4793 22.4815 16.2689 21.9352C17.83 18.0946 21.5988 15.3868 26 15.3868H27V13Z"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M6 16.3867H0V15.3867H6C11.799 15.3867 16.5 20.0877 16.5 25.8867V26.8867H18.8868L16 31.8867L13.1132 26.8867H15.5V25.8867C15.5 20.64 11.2467 16.3867 6 16.3867Z"
            />
          </svg>
          <span className="flex-grow"></span>
        </div>
        <div
          className="flex-grow w-full text-gray-500 dark:text-gray-200 dark:bg-gray-800 text-xs leading-4 font-normal p-2 cursor-pointer"
          onClick={() => {
            setLeadsToOpen(true)
          }}
        >
          Leads to ({module.children.length}):
          <span className="flex-grow underline">
            <div
              key={module.parents[0].title + "object"}
              className="inline-block align-middle w-full"
            >
              <div className="flex">
                <span className="flex-grow underline truncate">
                  [{module.children[0].type.name}] {module.children[0].title}
                </span>
              </div>
            </div>
          </span>
        </div>
      </div>
      <Transition.Root show={followsFromOpen} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 overflow-hidden" onClose={setFollowsFromOpen}>
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
                          Parent modules
                        </Dialog.Title>
                        <div className="ml-3 h-7 flex items-center">
                          <button
                            type="button"
                            className="rounded-md text-gray-400 dark:text-gray-200 hover:text-gray-500 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            onClick={() => setFollowsFromOpen(false)}
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
                      {module.parents.map((parent) => (
                        <>
                          <li className="">
                            <Link href={`https://doi.org/${parent.prefix}/${parent.suffix}`}>
                              <a>
                                <ModuleCard
                                  type={parent.type.name}
                                  title={parent.title}
                                  status={`${parent.prefix}/${parent.suffix}`}
                                  time={moment(parent.publishedAt).fromNow()}
                                  timeText="Published"
                                  authors={parent.authors}
                                />
                              </a>
                            </Link>
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

      <Transition.Root show={leadsToOpen} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 overflow-hidden" onClose={setLeadsToOpen}>
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
                          Child modules
                        </Dialog.Title>
                        <div className="ml-3 h-7 flex items-center">
                          <button
                            type="button"
                            className="rounded-md text-gray-400 dark:text-gray-200 hover:text-gray-500 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            onClick={() => setLeadsToOpen(false)}
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
                      {module.children.map((child) => (
                        <>
                          <li className="">
                            <Link href={`https://doi.org/${child.prefix}/${child.suffix}`}>
                              <a>
                                <ModuleCard
                                  type={child.type.name}
                                  title={child.title}
                                  status={`${child.prefix}/${child.suffix}`}
                                  time={moment(child.publishedAt).fromNow()}
                                  timeText="Published"
                                  authors={child.authors}
                                />
                              </a>
                            </Link>
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

export default ParentChildView
