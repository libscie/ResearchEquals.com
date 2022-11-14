import Link from "next/link";
import { useMutation } from "@blitzjs/rpc";
import { Routes } from "@blitzjs/next";
import { Fragment } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { Checkmark, Close, TrashCan } from "@carbon/icons-react"

import ModuleCard from "app/core/components/ModuleCard"
import moment from "moment"
import deleteParent from "../mutations/deleteParent"
import toast from "react-hot-toast"

const ManageParents = ({ open, setOpen, moduleEdit, setQueryData }) => {
  const [deleteParentMutation] = useMutation(deleteParent)

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 overflow-hidden" onClose={setOpen}>
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
              <div className="w-screen max-w-xs  border-r border-gray-400 dark:border-gray-600">
                <div className="flex h-full min-h-0 flex-1 flex-col overflow-y-auto bg-white pt-6 shadow-xl dark:divide-gray-600 dark:bg-gray-900">
                  <div className="px-4 sm:px-6">
                    <div className="flex items-start justify-between">
                      <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-white">
                        Linked previous steps
                      </Dialog.Title>
                      <div className="ml-3 flex h-7 items-center">
                        <button
                          type="button"
                          className="rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-gray-200 dark:hover:bg-gray-800 dark:hover:text-white"
                          onClick={() => setOpen(false)}
                        >
                          <span className="sr-only">Close panel</span>
                          <Close size={32} className="h-6 w-6" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 border-b border-gray-400 px-4 pb-4 text-sm font-normal leading-5 dark:border-gray-600 dark:text-white sm:px-6">
                    These are the previous steps your work links to. You can delete the connection
                    by clicking the delete icon. This action does not delete the previous step
                    itself.
                  </div>
                  {/* Replace with your content */}

                  <ul className="relative flex-1 divide-y divide-gray-400 dark:divide-gray-600">
                    {moduleEdit.parents.map((module) => (
                      <>
                        <div className="flex">
                          <Link
                            href={
                              module.prefix === process.env.DOI_PREFIX
                                ? Routes.ModulePage({ suffix: module.suffix })
                                : `https://doi.org/${module.prefix}/${module.suffix}`
                            }
                          >
                            <a target="_blank" className="flex-grow">
                              <ModuleCard
                                type={module.type.name}
                                title={module.title}
                                status={`${module.prefix}/${module.suffix}`}
                                time={moment(module.publishedAt).fromNow()}
                                timeText="Published"
                                authors={module.authors}
                              />
                            </a>
                          </Link>
                          <button
                            className="px-2 hover:bg-gray-50 dark:hover:bg-gray-800"
                            onClick={async () => {
                              toast.promise(
                                deleteParentMutation({
                                  currentId: moduleEdit.id,
                                  disconnectId: module.id,
                                }),
                                {
                                  loading: "Removing...",
                                  success: (data) => {
                                    setQueryData(data)

                                    if (data.parents.length === 0) {
                                      setOpen(false)
                                    }

                                    return `Removed link to: "${module.title}"`
                                  },
                                  error: "That link is not going anywhere...",
                                }
                              )
                            }}
                          >
                            <TrashCan
                              size={24}
                              className="inline-block h-4 w-4 fill-current align-middle text-red-500"
                              aria-hidden="true"
                            />
                          </button>
                        </div>
                      </>
                    ))}
                  </ul>
                  {/* /End replace */}
                  <div className="flex shrink-0 justify-end border-t border-gray-400 px-4 py-4 dark:border-gray-600">
                    <button
                      type="button"
                      className="mx-4 flex rounded-md bg-red-50 py-2 px-4 text-sm font-medium text-red-700 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-0 dark:border dark:border-gray-600 dark:bg-gray-800 dark:text-red-500 dark:hover:border-gray-400 dark:hover:bg-gray-700"
                      onClick={() => {
                        setOpen(false)
                      }}
                    >
                      <Close
                        size={32}
                        className="h-4 w-4 fill-current pt-1 text-red-500"
                        aria-hidden="true"
                      />
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex rounded-md bg-emerald-50 py-2 px-4 text-sm font-medium text-emerald-700 hover:bg-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-0 dark:border dark:border-gray-600 dark:bg-gray-800 dark:text-emerald-500 dark:hover:border-gray-400 dark:hover:bg-gray-700"
                      onClick={() => {
                        setOpen(false)
                      }}
                    >
                      <Checkmark
                        size={32}
                        className="h-4 w-4 stroke-current pt-1 text-emerald-500"
                        aria-hidden="true"
                      />
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default ManageParents
