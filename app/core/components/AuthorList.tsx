import React, { useRef } from "react"
import { Link, Routes, useMutation, useSession } from "blitz"
import toast from "react-hot-toast"
import {
  ChevronUp32,
  ChevronDown32,
  Checkmark32,
  Subtract32,
  Draggable32,
} from "@carbon/icons-react"

import removeInvitation from "../../authorship/mutations/removeInvitation"
import approveAuthorship from "../../authorship/mutations/approveAuthorship"

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
  // 1. We get the authorship ids
  // 2. Reorder as you wish
  // 3. Update the authorshipRank according to id position in order

  return (
    <>
      {authors.map((author, index) => (
        <li className="py-2 px-2 flex" key={`author-${author.workspace.handle}`}>
          <div className="mr-2 flex">
            <div className="flex flex-col mr-2">
              <button
                onClick={() => {
                  setAuthorState(arrayMoveImmutable(authors, index, index - 1))
                }}
                disabled={index === 0}
                className="disabled:opacity-0"
              >
                <ChevronUp32 className="w-5 h-5 text-gray-400" />
              </button>
              <button
                onClick={() => {
                  setAuthorState(arrayMoveImmutable(authors, index, index + 1))
                }}
                disabled={index === authors.length - 1}
                className="disabled:opacity-0"
              >
                <ChevronDown32 className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <Link href={Routes.HandlePage({ handle: author.workspace.handle })}>
              <a target="_blank">
                <img
                  src={author!.workspace!.avatar}
                  alt={`Avatar of ${author!.workspace!.handle}`}
                  className="w-10 h-10 rounded-full inline-block h-full align-middle"
                />
              </a>
            </Link>
          </div>
          <div className="flex-grow">
            <span className="inline-block h-full align-middle"></span>
            <p className="text-gray-700 dark:text-gray-200 text-sm leading-4 font-normal my-auto inline-block align-middle">
              {author!.workspace!.firstName} {author!.workspace!.lastName}
              <span className="block text-gray-500 dark:text-gray-400 text-xs leading-4 font-normal">
                @{author!.workspace!.handle}
              </span>
            </p>
          </div>
          <div>
            {author.workspace!.id === session.workspaceId && author.acceptedInvitation === null ? (
              <></>
            ) : author.acceptedInvitation === null ? (
              // If invite is not yet accepted/rejected -> allow for deleting
              <>
                <span className="inline-block h-full align-middle"></span>
                <button
                  className="text-xs leading-4 font-medium text-red-700 dark:text-red-500 rounded dark:border dark:border-gray-600 bg-red-100 shadow-sm dark:bg-gray-800 px-4 py-2 hover:bg-red-200 dark:hover:border-gray-200 dark:hover:bg-gray-700"
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
              </>
            ) : author.readyToPublish === false &&
              author.acceptedInvitation === true &&
              author.workspace!.id === session.workspaceId ? (
              // if author has accepted invite but not ready to publish
              // button to indicate ready to publish
              <>
                <span className="inline-block h-full align-middle"></span>

                <button
                  className="text-xs leading-4 font-medium text-green-500 rounded border border-gray-300 dark:border-gray-600 bg-white shadow-sm dark:bg-gray-800 px-4 py-2 hover:bg-gray-100 dark:hover:border-gray-200 dark:hover:bg-gray-700"
                  onClick={async () => {
                    if (!author.workspace.firstName && !author.workspace.lastName) {
                      toast.error("You cannot publish until you add your name")
                    } else {
                      toast.promise(
                        approveAuthorshipMutation({
                          id: author.id,
                          suffix,
                        }),
                        {
                          loading: "Loading",
                          success: (data) => {
                            setAuthorState(data)
                            return "Version approved for publication"
                          },
                          error: "Uh-oh something went wrong.",
                        }
                      )
                    }
                  }}
                >
                  Approve to publish
                </button>
              </>
            ) : (
              <>
                {author.readyToPublish ? (
                  <span
                    className={`text-xs flex py-2 mx-2 leading-4 font-medium h-1 my-auto align-middle ${
                      author.readyToPublish ? "text-green-500" : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    <Checkmark32 className="w-4 h-4 fill-current" aria-hidden="true" />
                    Approved
                  </span>
                ) : (
                  <span
                    className={`text-xs flex py-2 mx-2 leading-4 font-medium h-1 my-auto align-middle ${
                      author.readyToPublish ? "text-green-500" : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    <Subtract32
                      className="w-4 h-4 fill-current text-gray-500 dark:text-gray-400"
                      aria-hidden="true"
                    />
                    Pending
                  </span>
                )}
              </>
            )}
          </div>
        </li>
      ))}
    </>
  )
}

export default AuthorList
