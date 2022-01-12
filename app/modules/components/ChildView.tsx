import { Fragment, useState } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { Link, Routes } from "blitz"
import moment from "moment"
import { Close32 } from "@carbon/icons-react"

import ModuleCard from "../../core/components/ModuleCard"

const LeadsToView = ({ module }) => {
  const [leadsToOpen, setLeadsToOpen] = useState(false)

  return (
    <>
      <div className="flex-grow flex">
        <div
          className="flex w-full text-gray-500 dark:text-gray-200 dark:bg-gray-800 text-xs leading-4 font-normal p-2 cursor-pointer"
          onClick={() => {
            setLeadsToOpen(true)
          }}
        >
          <div className="flex">
            <span className="mx-2">
              <svg
                width="17"
                height="20"
                viewBox="0 0 17 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="fill-current text-gray-600 dark:text-gray-200"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M1.19336 13.0801L1.19336 19.0801H0.193359L0.193359 13.0801C0.193359 7.28109 4.89437 2.58008 10.6934 2.58008H11.6934V0.193327L16.6934 3.08008L11.6934 5.96683V3.58008L10.6934 3.58008C5.44665 3.58008 1.19336 7.83337 1.19336 13.0801Z"
                />
              </svg>
            </span>
            Leads to ({module.children.length}):
            <span
              className="flex-grow cursor-pointer ml-1 underline"
              onClick={() => {
                setLeadsToOpen(true)
              }}
            >
              <div
                key={module.children[0].title + "object"}
                className="inline-block align-middle w-full"
              ></div>
            </span>
            <span className="flex-grow underline truncate">
              [{module.children[0].type.name}] {module.children[0].title}
            </span>
          </div>
        </div>
      </div>
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
                            <Close32 className="h-6 w-6" aria-hidden="true" />
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

export default LeadsToView
