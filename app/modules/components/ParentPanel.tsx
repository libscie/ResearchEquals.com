import { Fragment, useState } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { Link, Routes } from "blitz"
import moment from "moment"
import { Close32 } from "@carbon/icons-react"
import ModuleCard from "../../core/components/ModuleCard"

const ParentPanel = ({ openObject, openFunction, module }) => {
  return (
    <>
      <Transition.Root show={openObject} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 overflow-hidden" onClose={openFunction}>
          <div className="absolute inset-0 overflow-hidden">
            <Dialog.Overlay className="fixed inset-0 bg-gray-900 bg-opacity-25 transition-opacity" />

            <div className="fixed inset-y-0 left-0 pr-10 max-w-full flex">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <div className="w-screen max-w-xs">
                  <div className="min-h-0 flex-1 flex flex-col pt-6 overflow-y-auto h-full dark:divide-gray-600 bg-white dark:bg-gray-900 shadow-xl">
                    <div className="px-4 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-white">
                          Previous steps
                        </Dialog.Title>
                        <div className="ml-3 h-7 flex items-center">
                          <button
                            type="button"
                            className="rounded-md text-gray-400 dark:text-gray-200 hover:text-gray-500 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            onClick={() => openFunction(false)}
                          >
                            <span className="sr-only">Close panel</span>
                            <Close32 className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 px-4 sm:px-6 text-sm leading-5 font-normal border-b border-gray-400 dark:border-gray-600 pb-4 dark:text-white">
                      These are the previous steps people took in this research journey.
                    </div>
                    {/* Replace with your content */}
                    <ul className="relative flex-1 divide-y divide-gray-400 dark:divide-gray-600">
                      {module.parents.map((child) => (
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

export default ParentPanel
