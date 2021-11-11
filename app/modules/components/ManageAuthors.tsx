import { Fragment, useState } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { XIcon } from "@heroicons/react/outline"
import { DragDropContext, Droppable, DroppableProvided } from "react-beautiful-dnd"
import { useMutation } from "blitz"
import toast from "react-hot-toast"
import algoliasearch from "algoliasearch"
import { getAlgoliaResults } from "@algolia/autocomplete-js"

import Autocomplete from "../../core/components/Autocomplete"
import addAuthor from "../mutations/addAuthor"
import updateAuthorRank from "../../authorship/mutations/updateAuthorRank"
import AuthorList from "../../core/components/AuthorList"

const searchClient = algoliasearch(process.env.ALGOLIA_APP_ID!, process.env.ALGOLIA_API_SEARCH_KEY!)

const ManageAuthors = ({ open, setOpen, moduleEdit, setQueryData }) => {
  const [authorState, setAuthorState] = useState(moduleEdit!.authors)
  const [addAuthorMutation] = useMutation(addAuthor)
  const [updateAuthorRankMutation] = useMutation(updateAuthorRank)

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 overflow-hidden"
        onClose={() => {
          console.log("dont")
        }}
      >
        <div className="absolute inset-0 overflow-hidden">
          <Dialog.Overlay className="absolute inset-0" />

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
              <div className="w-screen max-w-md">
                <div className="h-full flex flex-col py-6 bg-white shadow-xl overflow-y-scroll">
                  <div className="px-4 sm:px-6">
                    <div className="flex items-start justify-between">
                      <Dialog.Title className="text-lg font-medium text-gray-900">
                        Manage authors
                      </Dialog.Title>
                      <div className="ml-3 h-7 flex items-center">
                        <button
                          type="button"
                          className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          onClick={() => setOpen(false)}
                        >
                          <span className="sr-only">Close panel</span>
                          <XIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 relative flex-1 px-4 sm:px-6">
                    {/* Replace with your content */}
                    <DragDropContext
                      onDragEnd={async (result) => {
                        const { destination, source, draggableId } = result
                        // If no destination, do nothing
                        if (!destination) {
                          return
                        }
                        // If destination and source are equivalent, do nothing
                        if (
                          destination.droppableId === source.droppableId &&
                          destination.index === source.index
                        ) {
                          return
                        }

                        // const newAuthorState = Array.from(moduleEdit!.authors)
                        console.log(moduleEdit!.authors)
                        moduleEdit!.authors.splice(source.index, 1)
                        moduleEdit!.authors.splice(
                          destination.index,
                          0,
                          authorState.filter((author) => {
                            return author.workspaceId === parseInt(draggableId)
                          })[0]!
                        )

                        let i = 0
                        console.log(moduleEdit!.authors)
                        moduleEdit!.authors.map((author) => {
                          author.authorshipRank = i
                          i += 1
                        })

                        // Update database
                        console.log(moduleEdit!.authors)
                        moduleEdit!.authors.map(async (author) => {
                          const updatedModule = await updateAuthorRankMutation({
                            id: author.id,
                            rank: author.authorshipRank,
                            suffix: moduleEdit!.suffix,
                          })
                          console.log(`Updated ${author.id} to rank ${author.authorshipRank}`)
                          setQueryData(updatedModule!)
                        })
                      }}
                    >
                      <div className="flex flex-col">
                        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                          <div className="py-2 align-middle inline-block sm:px-6 lg:px-8">
                            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                              <table className="divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                  <tr>
                                    <th
                                      scope="col"
                                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                      Name
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                  <tr>
                                    <Autocomplete
                                      openOnFocus={true}
                                      defaultActiveItemId="0"
                                      getSources={({ query }) => [
                                        {
                                          sourceId: "products",
                                          async onSelect(params) {
                                            const { item, setQuery } = params
                                            try {
                                              const updatedModule = await addAuthorMutation({
                                                authorId: item.objectID,
                                                moduleId: moduleEdit!.id,
                                              })
                                              toast.success("Author invited")
                                              setQueryData(updatedModule)
                                            } catch (error) {
                                              toast.error("Something went wrong")
                                            }
                                            setQuery("")
                                          },
                                          getItems() {
                                            return getAlgoliaResults({
                                              searchClient,
                                              queries: [
                                                {
                                                  indexName: `${process.env.ALGOLIA_PREFIX}_workspaces`,
                                                  query,
                                                },
                                              ],
                                            })
                                          },
                                          templates: {
                                            item({ item, components }) {
                                              return <div>{item.handle}</div>
                                            },
                                          },
                                        },
                                      ]}
                                    />
                                  </tr>
                                  <Droppable droppableId="authors-ranking">
                                    {(provided: DroppableProvided) => (
                                      <tr
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        style={{ height: `${moduleEdit!.authors.length * 72}px` }}
                                      >
                                        <AuthorList
                                          authors={moduleEdit!.authors}
                                          setAuthorState={setQueryData}
                                          suffix={moduleEdit!.suffix}
                                        />
                                        {provided.placeholder}
                                      </tr>
                                    )}
                                  </Droppable>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </DragDropContext>
                    {/* /End replace */}
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
