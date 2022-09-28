import { getAlgoliaResults } from "@algolia/autocomplete-js"
import { MembershipRole } from "@prisma/client"
import algoliasearch from "algoliasearch"
import Autocomplete from "app/core/components/Autocomplete"
import SearchResultWorkspace from "app/core/components/SearchResultWorkspace"
import DeleteEditorModal from "app/core/modals/DeleteEditorModal"
import SetEditorToInactiveModal from "app/core/modals/SetEditorToInactiveModal"
import UpgradeCollectionModal from "app/core/modals/UpgradeCollectionModal"
import { Link, Routes, useMutation } from "blitz"
import { useState } from "react"
import toast from "react-hot-toast"
import addEditor from "../mutations/addEditor"
import changeEditorRole from "../mutations/changeEditorRole"

const searchClient = algoliasearch(process.env.ALGOLIA_APP_ID!, process.env.ALGOLIA_API_SEARCH_KEY!)

const EditorCard = ({ editor, isAdmin, isSelf, refetchFn }) => {
  const [changeEditorRoleMutation] = useMutation(changeEditorRole)
  const [currentRole, setCurrentRole] = useState(editor.role)

  return (
    <>
      <div className={`flex ${editor.isActive ? "" : "opacity-50"} my-2`}>
        <img src={editor.workspace.avatar} className="mx-2 h-12 w-12 rounded-full" />
        <div className="inline-block flex-grow">
          <Link href={Routes.HandlePage({ handle: editor.workspace.handle })}>
            <a target="_blank">
              <p className="line-clamp-1">
                {editor.workspace.firstName} {editor.workspace.lastName}
              </p>
              <p className="text-sm">@{editor.workspace.handle}</p>
            </a>
          </Link>
        </div>
        {isAdmin && (
          <>
            <select
              onChange={(info) => {
                toast.promise(
                  changeEditorRoleMutation({ editorId: editor.id, role: info.target.value }),
                  {
                    loading: `Changing role to ${info.target.value.toLowerCase()}...`,
                    success: () => {
                      refetchFn()
                      setCurrentRole(info.target.value)
                      return `Changed role to ${info.target.value.toLowerCase()}!`
                    },
                    error: (err) => {
                      return `${err}`
                    },
                  }
                )
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
                    toast.promise(
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
                        error: "Failed to add editor...",
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
