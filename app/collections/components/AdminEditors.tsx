import Link from "next/link"
import { useMutation } from "@blitzjs/rpc"
import { Routes } from "@blitzjs/next"
import { getAlgoliaResults } from "@algolia/autocomplete-js"
import { MembershipRole } from "@prisma/client"
import algoliasearch from "algoliasearch"
import Autocomplete from "app/core/components/Autocomplete"
import SearchResultWorkspace from "app/core/components/SearchResultWorkspace"
import DeleteEditorModal from "app/core/modals/DeleteEditorModal"
import { Modal } from "app/core/modals/Modal"
import SetEditorToInactiveModal from "app/core/modals/SetEditorToInactiveModal"
import UpgradeCollectionModal from "app/core/modals/UpgradeCollectionModal"
import { useState } from "react"
import toast from "react-hot-toast"
import addEditor from "../mutations/addEditor"
import changeEditorRole from "../mutations/changeEditorRole"

const searchClient = algoliasearch(process.env.ALGOLIA_APP_ID!, process.env.ALGOLIA_API_SEARCH_KEY!)

const EditorCard = ({ editor, isAdmin, isSelf, refetchFn }) => {
  const [changeEditorRoleMutation] = useMutation(changeEditorRole)
  const [currentRole, setCurrentRole] = useState(editor.role)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)

  const onChangeEditorRole = async (editorId, role) => {
    await toast.promise(changeEditorRoleMutation({ editorId: editorId, role: role }), {
      loading: `Changing role to ${role.toLowerCase()}...`,
      success: () => {
        refetchFn()
        return `Changed role to ${role.toLowerCase()}!`
      },
      error: (err) => {
        setCurrentRole(editor.role)
        return `${err}`
      },
    })
  }

  return (
    <>
      <div className={`flex ${editor.isActive ? "" : "opacity-50"} my-2`}>
        <img src={editor.workspace.avatar} className="mx-2 h-12 w-12 rounded-full" />
        <div className="inline-block flex-grow">
          <Link href={Routes.HandlePage({ handle: editor.workspace.handle })} target="_blank">
            <p className="line-clamp-1">
              {editor.workspace.firstName} {editor.workspace.lastName}
            </p>
            <p className="text-sm">@{editor.workspace.handle}</p>
          </Link>
        </div>
        {isAdmin && (
          <>
            <select
              onChange={async (info) => {
                setCurrentRole(info.target.value)
                if (isSelf && isAdmin && info.target.value === "USER") {
                  return setIsConfirmOpen(true)
                }
                await onChangeEditorRole(editor.id, info.target.value)
              }}
              value={currentRole}
              className="placeholder-font-normal block appearance-none rounded-md border border-gray-400 bg-white px-4 py-2 pr-6 text-sm font-normal placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0 dark:border-gray-600 dark:bg-transparent dark:text-gray-200 "
            >
              {Object.values(MembershipRole).map((role) => {
                return <option key={role}>{role}</option>
              })}
            </select>
            <SetEditorToInactiveModal editor={editor} refetchFn={refetchFn} />
            <DeleteEditorModal editor={editor} refetchFn={refetchFn} />
            <Modal
              title="Confirm role change"
              body={
                <span>
                  Are you sure you want to remove yourself as {editor.role.toLowerCase()} of this
                  collection? You cannot undo this and will no longer be able to administrate the
                  editors of this collection.
                </span>
              }
              primaryAction="Change Role"
              primaryButtonClass="rounded-md bg-red-50 py-2 px-4 text-sm font-medium text-red-700 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-0 dark:border dark:border-gray-600 dark:bg-gray-800 dark:text-red-500 dark:hover:border-gray-400 dark:hover:bg-gray-700"
              isOpen={isConfirmOpen}
              setIsOpen={setIsConfirmOpen}
              onSubmit={async () => {
                await onChangeEditorRole(editor.id, currentRole)
              }}
              onCancel={() => setCurrentRole(editor.role)}
            />
          </>
        )}
      </div>
    </>
  )
}

const Editors = ({ collection, isAdmin, selfId, refetchFn, user }) => {
  const [addEditorMutation] = useMutation(addEditor)
  return (
    <div className="my-2 mx-4 xl:mx-0">
      <h3 className="my-4 text-xl">Editor{collection.editors.length > 1 && "s"}</h3>
      {(isAdmin && collection.type.type === "INDIVIDUAL") ||
      (collection.type.type === "COLLABORATIVE" && collection.editors.length >= 5) ? (
        <UpgradeCollectionModal collection={collection} email={user.email} />
      ) : (
        <>
          {isAdmin && (
            <Autocomplete
              className="h-full"
              openOnFocus={true}
              defaultActiveItemId="0"
              getSources={({ query }) => [
                {
                  sourceId: "products",
                  async onSelect(params) {
                    const { item, setQuery } = params
                    await toast.promise(
                      addEditorMutation({
                        collectionId: collection.id,
                        workspaceId: parseInt(item.objectID),
                      }),
                      {
                        loading: "Adding editor...",
                        success: () => {
                          refetchFn()
                          return "Added editor!"
                        },
                        error: (e) => {
                          return e.toString()
                        },
                      }
                    )
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
                      return (
                        <>
                          {item.__autocomplete_indexName.match(/_workspaces/g) ? (
                            <SearchResultWorkspace item={item} />
                          ) : (
                            ""
                          )}
                        </>
                      )
                    },
                  },
                },
              ]}
            />
          )}
        </>
      )}
      <div className="my-4">
        {collection.editors.map((editor) => {
          return (
            <>
              <EditorCard
                editor={editor}
                isAdmin={isAdmin}
                isSelf={selfId === editor.id}
                refetchFn={refetchFn}
              />
            </>
          )
        })}
      </div>
    </div>
  )
}

export default Editors
