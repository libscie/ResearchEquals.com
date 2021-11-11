import { useQuery, useMutation, Link } from "blitz"
import { Wax } from "wax-prosemirror-core"
import { Popover, Transition } from "@headlessui/react"
import { ChevronDoubleDownIcon } from "@heroicons/react/solid"
import { Fragment, useState, useRef } from "react"
import { DefaultSchema } from "wax-prosemirror-utilities"
import moment from "moment"
import algoliasearch from "algoliasearch"
import { getAlgoliaResults } from "@algolia/autocomplete-js"
import { Toaster, toast } from "react-hot-toast"
import { DragDropContext, Droppable, DroppableProvided } from "react-beautiful-dnd"
import { DocumentPdf32, TrashCan32, Download32 } from "@carbon/icons-react"
import { Widget } from "@uploadcare/react-widget"
import { Prisma } from "prisma"

import addAuthor from "../mutations/addAuthor"
import AuthorList from "../../core/components/AuthorList"
import updateAuthorRank from "../../authorship/mutations/updateAuthorRank"
import getSignature from "../../auth/queries/getSignature"
import addMain from "../mutations/addMain"
import EditMainFile from "./EditMainFile"

import "@algolia/autocomplete-theme-classic"

import ReadyToPublishModal from "../../core/modals/ReadyToPublishModal"
import DeleteModuleModal from "../../core/modals/DeleteModuleModal"
import useCurrentModule from "../queries/useCurrentModule"
import InstaLayout from "../../wax/InstaLayout"
import changeTitle from "../mutations/changeTitle"
import changeAbstract from "../mutations/changeAbstract"
import Autocomplete from "../../core/components/Autocomplete"

const searchClient = algoliasearch(process.env.ALGOLIA_APP_ID!, process.env.ALGOLIA_API_SEARCH_KEY!)

const ModuleEdit = ({ user, module, isAuthor }) => {
  // const widgetApiSupporting = useRef()
  const [moduleEdit, { refetch, setQueryData }] = useQuery(
    useCurrentModule,
    { suffix: module.suffix },
    { refetchOnWindowFocus: true }
  )
  const [authorState, setAuthorState] = useState(moduleEdit!.authors)
  const [changeTitleMutation] = useMutation(changeTitle)
  const [changeAbstractMutation] = useMutation(changeAbstract)
  const [addAuthorMutation] = useMutation(addAuthor)
  const [updateAuthorRankMutation] = useMutation(updateAuthorRank)

  const mainFile = moduleEdit!.main as Prisma.JsonObject

  return (
    <div className="max-w-4xl mx-auto">
      <Toaster />
      {/* Menu bar */}
      <div className="w-full bg-gray-300 flex">
        <div className="flex-grow"></div>
        <DocumentPdf32 />
        <DeleteModuleModal module={module} />
      </div>
      {/* Last updated */}
      <div className="text-center">
        Last updated: {moment(moduleEdit?.updatedAt).fromNow()} (
        {moduleEdit?.updatedAt.toISOString()})
      </div>
      {/* Parents */}
      <div className="flex w-full">
        Follows from: <Autocomplete />
      </div>
      {/* Metadata */}
      <div className="w-full">
        <p>{moduleEdit!.type}</p>
        <h1 className="min-h-16">{moduleEdit!.title}</h1>
      </div>
      {/* Authors */}
      <div className="flex border-t-2 border-b-2 border-gray-800">
        <div className="flex-grow">
          {moduleEdit?.authors.map((author) => (
            <img
              key={author.id + author.workspace!.handle}
              alt={`Avatar of ${author.workspace!.handle}`}
              className="w-8 h-8 rounded-full"
              src={author.workspace?.avatar!}
            />
          ))}
        </div>
        <button
          className="px-4 py-2 bg-indigo-500 text-white rounded"
          onClick={() => {
            alert("this should open a popover")
          }}
        >
          Manage authors
        </button>
      </div>
      {/* Description */}
      <div>{moduleEdit!.description}</div>
      {/* Main file */}
      <div>
        <h2>Main file</h2>
        <EditMainFile mainFile={mainFile} setQueryData={setQueryData} moduleEdit={moduleEdit} />
      </div>

      {/* {JSON.stringify(mainFile)} */}
      {/* Supporting files */}
      {/* <div>
        <h2>Supporting file(s)</h2>
        <button
          type="button"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={() => {
            widgetApiSupporting.current.openDialog()
          }}
        >
          Upload supporting files
        </button>

        <Widget
          publicKey={process.env.UPLOADCARE_PUBLIC_KEY ?? ""}
          secureSignature={uploadSecret.signature}
          secureExpire={uploadSecret.expire}
          // value="8fd6d947-4d03-4114-8054-c0ee7b3bda03~4"
          ref={widgetApiSupporting}
          previewStep
          multiple
          multipleMax={10}
          clearable
          onChange={async (info) => {
            console.log(info)
            try {
              // TODO: Only store upon save
              // await addSupportingMutation({ suffix: moduleEdit?.suffix, json: info })
              //  TODO: add action
            } catch (err) {
              alert(err)
            }
            console.log("Upload completed:", info)
          }}
        />
      </div> */}
      {/* References */}
      {/* License */}
      <div>License: {moduleEdit!.license}</div>

      {/* Old code */}
      <div className="flex justify-center items-center">
        <Popover className="relative">
          {({ open }) => (
            <>
              <Popover.Button
                className={`${open ? "" : "text-opacity-90"}
                text-black group bg-orange-700 px-3 py-2 rounded-md inline-flex items-center text-base font-medium hover:text-opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}
              >
                <h1 className="text-8xl font-black">{moduleEdit!.title!}</h1>
                <ChevronDoubleDownIcon
                  className={`${open ? "" : "text-opacity-70"}
                  ml-2 h-5 w-5 text-white group-hover:text-opacity-80 bg-black transition ease-in-out duration-150`}
                  aria-hidden="true"
                />
              </Popover.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-150"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <Popover.Panel className="absolute z-10 w-screen max-w-sm px-4 mt-3 transform -translate-x-1/2 left-1/2 sm:px-0 lg:max-w-3xl">
                  <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                    <div className="relative grid gap-8 bg-white p-7 lg:grid-cols-2">
                      <Wax
                        autoFocus
                        placeholder={moduleEdit!.title!}
                        value={moduleEdit!.title!}
                        config={{
                          SchemaService: DefaultSchema,
                          services: [],
                        }}
                        layout={InstaLayout}
                        onChange={async (source) => {
                          const updatedModule = await changeTitleMutation({
                            suffix: moduleEdit!.suffix,
                            title: source.replace(/<\/?[^>]+(>|$)/g, ""),
                          })
                          // refetch()
                          setQueryData(updatedModule)
                        }}
                      />
                    </div>
                  </div>
                </Popover.Panel>
              </Transition>
            </>
          )}
        </Popover>
      </div>
      <div>
        <h2>Last edited:</h2>
        <p>{moment(moduleEdit!.updatedAt).fromNow()}</p>
      </div>
      <div>
        <h2 className="text-4xl font-black">Abstract</h2>
        <Popover className="relative">
          {({ open }) => (
            <>
              <Popover.Button
                className={`${open ? "" : "text-opacity-90"}
                group bg-orange-700 rounded-md inline-flex items-center hover:text-opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}
              >
                <p>{moduleEdit!.description!}</p>
                <ChevronDoubleDownIcon
                  className={`${open ? "" : "text-opacity-70"}
                  ml-2 h-5 w-5 text-white group-hover:text-opacity-80 bg-black transition ease-in-out duration-150`}
                  aria-hidden="true"
                />
              </Popover.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-150"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <Popover.Panel className="absolute z-10 w-screen max-w-sm px-4 mt-3 transform -translate-x-1/2 left-1/2 sm:px-0 lg:max-w-3xl">
                  <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                    <div className="relative grid gap-8 bg-white p-7 lg:grid-cols-2">
                      <Wax
                        autoFocus
                        placeholder={moduleEdit!.description!}
                        value={moduleEdit!.description!}
                        config={{
                          SchemaService: DefaultSchema,
                          services: [],
                        }}
                        layout={InstaLayout}
                        onChange={async (source) => {
                          // TODO: Add instant edit
                          const updatedModule = await changeAbstractMutation({
                            suffix: moduleEdit!.suffix,
                            title: source.replace(/<\/?[^>]+(>|$)/g, ""),
                          })
                          // refetch()
                          console.log(updatedModule)
                          setQueryData(updatedModule)
                        }}
                      />
                    </div>
                  </div>
                </Popover.Panel>
              </Transition>
            </>
          )}
        </Popover>
      </div>
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

          const newAuthorState = Array.from(moduleEdit!.authors)
          newAuthorState.splice(source.index, 1)
          newAuthorState.splice(
            destination.index,
            0,
            authorState.filter((author) => {
              return author.workspaceId === parseInt(draggableId)
            })[0]!
          )

          let i = 0
          newAuthorState.map((author) => {
            author.authorshipRank = i
            i += 1
          })

          // Update database
          newAuthorState.map(async (author) => {
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
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Name
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
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
      {/* <div>{JSON.stringify(module)}</div>
      {isAuthor && !module.published && user.emailIsVerified ? (
        <ReadyToPublishModal module={module} />
      ) : (
        ""
      )}
       */}
    </div>
  )
}

export default ModuleEdit
