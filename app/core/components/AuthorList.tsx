import React, { useRef } from "react"
import { useMutation, useSession } from "blitz"
import toast from "react-hot-toast"
import { Draggable } from "react-beautiful-dnd"

import acceptInvitation from "../../authorship/mutations/acceptInvitation"
import removeInvitation from "../../authorship/mutations/removeInvitation"
import approveAuthorship from "../../authorship/mutations/approveAuthorship"

function AuthorList({
  authors,
  refetch,
  setAuthorState,
}: {
  authors: Array<any>
  refetch: Function
  setAuthorState: Function
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
        // Only render if  acceptedInvitation != false
        <Draggable
          key={`author-${author.workspace.id}`}
          draggableId={author.workspace.id.toString()}
          index={index}
        >
          {(provided) => (
            <tr
              ref={provided.innerRef}
              // key={author!.workspace!.orcid}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  {author!.workspace!.avatar ? (
                    <div className="flex-shrink-0 h-10 w-10">
                      <img
                        className="h-10 w-10 rounded-full"
                        src={author!.workspace!.avatar}
                        alt={`Avatar of ${author!.workspace!.name}`}
                      />
                    </div>
                  ) : (
                    <div className="flex-shrink-0 h-10 w-10">
                      <img
                        className="h-10 w-10 rounded-full"
                        src={`https://eu.ui-avatars.com/api/?rounded=true&background=random&name=${author!
                          .workspace!.handle!}`}
                        alt={`Avatar of ${author!.workspace!.name!}`}
                      />
                    </div>
                  )}
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {author!.workspace!.name}
                    </div>
                    <div className="text-sm text-gray-500">@{author!.workspace!.handle}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-right whitespace-nowrap">
                {/* Placeholder for delete invite */}
                {author.workspace!.id === session.workspaceId &&
                author.acceptedInvitation === null ? (
                  <>
                    <button
                      className="bg-green-500 rounded text-white px-4 py-2 hover:bg-green-600"
                      onClick={async () => {
                        // TODO: Accept mutation
                        await acceptInvitationMutation({ id: author.id })
                        toast.success("Accepted invitation")
                        refetch()
                      }}
                    >
                      Accept
                    </button>
                    <button
                      className="ml-2 bg-red-500 rounded text-white px-4 py-2 hover:bg-red-600"
                      onClick={async () => {
                        await removeInvitationMutation({ id: author.id })
                        toast("Declined invitation")
                        refetch()
                      }}
                    >
                      Decline
                    </button>
                  </>
                ) : author.acceptedInvitation === null ? (
                  // If invite is not yet accepted/rejected -> allow for deleting
                  <button
                    className="bg-red-500 rounded text-white px-4 py-2 hover:bg-red-600"
                    onClick={async () => {
                      await removeInvitationMutation({ id: author.id })
                      toast("Removed author")
                      // TODO: Update state
                      refetch()
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
                    className="bg-green-500 rounded text-white px-4 py-2 hover:bg-green-600"
                    onClick={async () => {
                      await approveAuthorshipMutation({ id: author.id })
                      toast.success("Version approved for publication")
                      refetch()
                      // alert("This will approve to publish")
                    }}
                  >
                    Approve to publish
                  </button>
                ) : (
                  // Display publish readiness status
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      author.readyToPublish
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {author.readyToPublish ? "Approved" : "Pending"}
                  </span>
                )}
              </td>
            </tr>
          )}
        </Draggable>
      ))}
    </>
  )
}

export default AuthorList
