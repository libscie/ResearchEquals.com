import { Fragment, useState } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { useMutation } from "blitz"
import { Checkmark32, Close32 } from "@carbon/icons-react"

import updateAuthorRank from "../../authorship/mutations/updateAuthorRank"
import AuthorList from "../../core/components/AuthorList"
import toast from "react-hot-toast"

const ManageAuthors = ({ open, setOpen, moduleEdit, setQueryData }) => {
  const [authorState, setAuthorState] = useState(moduleEdit!.authors)
  const [updateAuthorRankMutation] = useMutation(updateAuthorRank)

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 overflow-hidden" onClose={setOpen}>
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
              <div className="w-screen max-w-sm  border-l border-gray-400 dark:border-gray-600">
                <div className="min-h-0 flex-1 flex flex-col pt-6 overflow-y-auto h-full dark:divide-gray-600 bg-white dark:bg-gray-900 shadow-xl">
                  <div className="px-4 sm:px-6">
                    <div className="flex items-start justify-between">
                      <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-white">
                        Manage authors
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
                    Here you can manage your current and invited co-authors. Everyone needs to
                    approve the module before it can be published. You can rearrange authors by
                    clicking on the up and down arrows.
                  </div>
                  {/* Replace with your content */}
                  <ul className="relative flex-1 divide-y divide-gray-400 dark:divide-gray-600">
                    <AuthorList
                      authors={authorState}
                      setAuthorState={setAuthorState}
                      suffix={moduleEdit!.suffix}
                    />
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
                        // console.log(authorState)
                        authorState.map(async (author, index) => {
                          const updatedModule = await updateAuthorRankMutation({
                            id: author.id,
                            rank: index,
                            suffix: moduleEdit!.suffix,
                          })
                          setQueryData(updatedModule)
                        })
                        toast.success("Rearranged authors")
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

export default ManageAuthors
