import React, { useRef } from "react"
import { Link, useMutation, useSession } from "blitz"
import toast from "react-hot-toast"
import { Draggable } from "react-beautiful-dnd"

import acceptInvitation from "../../authorship/mutations/acceptInvitation"
import removeInvitation from "../../authorship/mutations/removeInvitation"
import approveAuthorship from "../../authorship/mutations/approveAuthorship"
import { CheckIcon, DotsVerticalIcon, MinusSmIcon } from "@heroicons/react/solid"

function AuthorList({
  authors,
  setAuthorState,
  suffix,
}: {
  authors: Array<any>
  setAuthorState: Function
  suffix: string
}) {
  const session = useSession()
  const [removeInvitationMutation] = useMutation(removeInvitation)
  const [approveAuthorshipMutation] = useMutation(approveAuthorship)
  const [acceptInvitationMutation] = useMutation(acceptInvitation)
  // 1. We get the authorship ids
  // 2. Reorder as you wish
  // 3. Update the authorshipRank according to id position in order

  return (
    <>
      {authors.map((author, index) => (
        <>
          <Draggable draggableId={author.workspace.id.toString()} index={index}>
            {(provided) => (
              <li
                className="py-2 px-2 flex"
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
              >
                <div className="mr-2 flex">
                  <div>
                    <span className="inline-block h-full align-middle"></span>
                    <DotsVerticalIcon className="fill-current text-gray-400 w-5 h-5 inline-block align-middle" />
                  </div>
                  <img
                    src={author!.workspace!.avatar}
                    alt={`Avatar of ${author!.workspace!.name}`}
                    className="w-10 h-10 rounded-full inline-block h-full align-middle"
                  />
                </div>
                <div className="flex-grow">
                  <span className="inline-block h-full align-middle"></span>
                  <p className="text-gray-700 dark:text-gray-200 text-sm leading-4 font-normal my-auto inline-block align-middle">
                    {author!.workspace!.name}
                    <p className="text-gray-500 dark:text-gray-400 text-xs leading-4 font-normal">
                      @{author!.workspace!.handle}
                    </p>
                  </p>
                </div>
                {/* <span className="inline-block h-full align-middle"></span> */}
                {author.workspace!.id === session.workspaceId &&
                author.acceptedInvitation === null ? (
                  <></>
                ) : author.acceptedInvitation === null ? (
                  // If invite is not yet accepted/rejected -> allow for deleting
                  <button
                    className="text-xs leading-4 font-medium text-red-700 rounded dark:border dark:border-gray-600 bg-red-100 shadow-sm dark:bg-gray-800 px-4 py-2 hover:bg-red-200 dark:hover:border-gray-200 dark:hover:bg-gray-700"
                    onClick={async () => {
                      try {
                        const updatedModule = await removeInvitationMutation({
                          id: author.id,
                          suffix,
                        })
                        toast("Removed author", { icon: "👋" })
                        setAuthorState(updatedModule)
                      } catch (error) {
                        toast.error("Something went wrong")
                      }
                    }}
                  >
                    Remove invite
                  </button>
                ) : author.readyToPublish === false &&
                  author.acceptedInvitation === true &&
                  author.workspace!.id === session.workspaceId ? (
                  // if author has accepted invite but not ready to publish
                  // button to indicate ready to publish
                  <button
                    className="text-xs leading-4 font-medium text-green-500 rounded border border-gray-300 dark:border-gray-600 bg-white shadow-sm dark:bg-gray-800 px-4 py-2 hover:bg-gray-100 dark:hover:border-gray-200 dark:hover:bg-gray-700"
                    onClick={async () => {
                      if (!author.workspace.orcid || !author.workspace.name) {
                        toast.error("You cannot publish until you link your ORCID")
                      } else {
                        const updatedModule = await approveAuthorshipMutation({
                          id: author.id,
                          suffix,
                        })
                        toast.success("Version approved for publication")
                        setAuthorState(updatedModule)
                      }
                    }}
                  >
                    Approve to publish
                  </button>
                ) : (
                  <div>
                    <span className="inline-block h-full align-middle"></span>
                    <p
                      className={`text-xs leading-4 font-medium  my-auto inline-block align-middle ${
                        author.readyToPublish
                          ? "text-green-500"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {author.readyToPublish ? (
                        <span className="flex mx-2">
                          <CheckIcon className="w-4 h-4 fill-current" />
                          Approved
                        </span>
                      ) : (
                        <span className="flex mx-2">
                          <MinusSmIcon className="w-4 h-4 fill-current text-gray-500 dark:text-gray-400" />
                          Pending
                        </span>
                      )}
                    </p>
                  </div>
                )}
              </li>
            )}
          </Draggable>
        </>
      ))}
    </>
  )
}

export default AuthorList
