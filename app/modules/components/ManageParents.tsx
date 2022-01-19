import { Fragment, useState } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { DragDropContext, Droppable, DroppableProvided } from "react-beautiful-dnd"
import { Link, Routes, useMutation } from "blitz"
import { Checkmark32, Close32, TrashCan24 } from "@carbon/icons-react"

import updateAuthorRank from "../../authorship/mutations/updateAuthorRank"
import AuthorList from "../../core/components/AuthorList"
import ModuleCard from "app/core/components/ModuleCard"
import moment from "moment"
import deleteParent from "../mutations/deleteParent"
import toast from "react-hot-toast"

// https://www.npmjs.com/package/array-move
function arrayMoveMutable(array, fromIndex, toIndex) {
  const startIndex = fromIndex < 0 ? array.length + fromIndex : fromIndex

  if (startIndex >= 0 && startIndex < array.length) {
    const endIndex = toIndex < 0 ? array.length + toIndex : toIndex

    const [item] = array.splice(fromIndex, 1)
    array.splice(endIndex, 0, item)
  }
}

function arrayMoveImmutable(array, fromIndex, toIndex) {
  array = [...array]
  arrayMoveMutable(array, fromIndex, toIndex)
  return array
}

const ManageParents = ({ open, setOpen, moduleEdit, setQueryData }) => {
  const [parentState, setParentState] = useState(moduleEdit!.parents)
  const [deleteParentMutation] = useMutation(deleteParent)

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 overflow-hidden" onClose={setOpen}>
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
                        Linked previous steps
                      </Dialog.Title>
                      <div className="ml-3 h-7 flex items-center">
                        <button
                          type="button"
                          className="rounded-md text-gray-400 dark:text-gray-200 hover:text-gray-500 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          onClick={() => setOpen(false)}
                        >
                          <span className="sr-only">Close panel</span>
                          <Close32 className="h-6 w-6" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 px-4 sm:px-6 text-sm leading-5 font-normal border-b border-gray-400 dark:border-gray-600 pb-4 dark:text-white">
                    These are the previous steps your work links to.
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
                              const updatedMod = await deleteParentMutation({
                                currentId: moduleEdit.id,
                                disconnectId: module.id,
                              })
                              setQueryData(updatedMod)
                              toast(`Removed parent: ${module.title}`, { icon: "🗑" })
                              if (updatedMod.parents.length === 0) {
                                setOpen(false)
                              }
                            }}
                          >
                            <TrashCan24
                              className="w-4 h-4 fill-current text-red-500 inline-block align-middle"
                              aria-hidden="true"
                            />
                          </button>
                        </div>
                      </>
                    ))}
                  </ul>
                  {/* /End replace */}
                  <div className="flex-shrink-0 px-4 py-4 flex justify-end border-t border-gray-400 dark:border-gray-600">
                    <button
                      type="button"
                      className="flex mx-4 py-2 px-4 bg-red-50 dark:bg-gray-800 text-red-700 dark:text-red-500 hover:bg-red-200 dark:hover:bg-gray-700 dark:border dark:border-gray-600 dark:hover:border-gray-400 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-red-500"
                      onClick={() => {
                        setOpen(false)
                      }}
                    >
                      <Close32
                        className="w-4 h-4 fill-current text-red-500 pt-1"
                        aria-hidden="true"
                      />
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex py-2 px-4 bg-green-50 dark:bg-gray-800 text-green-700 dark:text-green-500 hover:bg-green-200 dark:hover:bg-gray-700 dark:border dark:border-gray-600 dark:hover:border-gray-400 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-green-500"
                      onClick={() => {
                        setOpen(false)
                      }}
                    >
                      <Checkmark32
                        className="w-4 h-4 stroke-current text-green-500 pt-1"
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
