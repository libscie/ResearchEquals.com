import { Fragment } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { Link, Routes } from "blitz"
import moment from "moment"
import { Close } from "@carbon/icons-react"
import ModuleCard from "../../core/components/ModuleCard"

const ChildPanel = ({ openObject, openFunction, module }) => {
  return (
    <>
      <Transition.Root show={openObject} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 overflow-hidden" onClose={openFunction}>
          <div className="absolute inset-0 overflow-hidden">
            <Dialog.Overlay className="fixed inset-0 bg-gray-900 bg-opacity-25 transition-opacity" />

            <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <div className="w-screen max-w-xs  border-l border-gray-400 dark:border-gray-600">
                  <div className="flex h-full min-h-0 flex-1 flex-col overflow-y-auto bg-white pt-6 shadow-xl dark:divide-gray-600 dark:bg-gray-900">
                    <div className="px-4 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-white">
                          Next steps
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-gray-200 dark:hover:bg-gray-800 dark:hover:text-white"
                            onClick={() => openFunction(false)}
                          >
                            <span className="sr-only">Close panel</span>
                            <Close size={32} className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 border-b border-gray-400 px-4 pb-4 text-sm font-normal leading-5 dark:border-gray-600 dark:text-white sm:px-6">
                      These are the next steps people took in this research journey.
                    </div>
                    {/* Replace with your content */}
                    <ul className="relative flex-1 divide-y divide-gray-400 dark:divide-gray-600">
                      {module.children.map((child) => (
                        <>
                          <li className="">
                            {child.publishedWhere === "ResearchEquals" ? (
                              <Link href={Routes.ModulePage({ suffix: child.suffix })}>
                                <a target="_blank">
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
                            ) : (
                              <Link href={`https://doi.org/${child.prefix}/${child.suffix}`}>
                                <a target="_blank">
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

export default ChildPanel
