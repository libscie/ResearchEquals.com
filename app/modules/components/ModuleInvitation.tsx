import { useQuery, useMutation } from "blitz"
import { useState } from "react"
import { Prisma } from "prisma"
import toast from "react-hot-toast"

import useCurrentModule from "../queries/useCurrentModule"
import ViewFiles from "./ViewFiles"
import { Maximize24 } from "@carbon/icons-react"
import { ArrowNarrowLeftIcon } from "@heroicons/react/solid"
import { UserAddIcon } from "@heroicons/react/outline"
import acceptInvitation from "app/authorship/mutations/acceptInvitation"
import removeInvitation from "app/authorship/mutations/removeInvitation"
import MetadataImmutable from "./MetadataImmutable"

const ModuleInvitation = ({
  user,
  module,
  setModule,
  workspace,
  isAuthor,
  inboxOpen,
  setInboxOpen,
}) => {
  const [manageAuthorsOpen, setManageAuthorsOpen] = useState(false)
  const [moduleEdit, { refetch, setQueryData }] = useQuery(
    useCurrentModule,
    { suffix: module.suffix },
    { refetchOnWindowFocus: true }
  )
  const [acceptMutation] = useMutation(acceptInvitation)
  const [declineMutation] = useMutation(removeInvitation)

  const mainFile = moduleEdit!.main as Prisma.JsonObject
  const supportingRaw = moduleEdit!.supporting as Prisma.JsonObject

  return (
    <div className="p-5 max-w-7xl mx-auto overflow-y-auto text-base">
      {/* Invitation handling */}
      <div className="rounded-md bg-blue-50 dark:bg-blue-800 w-full p-2 lg:flex my-4">
        <div className="flex-grow flex my-2 lg:my-0">
          <div className="flex-shrink-0 inline-block align-middle">
            <UserAddIcon
              className="stroke-current h-5 w-5 text-blue-500 dark:text-blue-200 inline-block align-middle"
              aria-hidden="true"
            />
          </div>
          <div className="ml-3 flex-grow text-blue-800 dark:text-blue-100">
            <h3 className="text-xs leading-4 font-normal text-blue-800 dark:text-blue-100 inline-block align-middle">
              You got invited to co-author this research module! Would you like to accept or decline
              this invitation?
            </h3>
          </div>
        </div>
        <div className="inline-block pl-8 lg:pl-0">
          <button
            type="button"
            className="border rounded border-blue-500 text-blue-500 dark:border-blue-200 dark:text-blue-200 px-2 py-1.5 text-xs leading-4 font-medium hover:bg-blue-100 dark:hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-50 focus:ring-blue-600"
            onClick={async () => {
              await acceptMutation({
                id: module.authors.filter((author) => author.workspaceId === workspace.id)[0].id,
                suffix: module.suffix,
              })
              refetch()
              // TODO: Move to next invitation on the list
              setModule(undefined)

              toast.success("Accepted invitation")
            }}
          >
            Accept
          </button>
          <button
            className="text-blue-500 dark:text-blue-200 text-xs leading-4 font-normal mx-2"
            onClick={async () => {
              await declineMutation({
                id: module.authors.filter((author) => author.workspaceId === workspace.id)[0].id,
                suffix: module.suffix,
              })
              refetch()
              setModule(undefined)

              toast("Declined invitation", { icon: "👋" })
            }}
          >
            Decline
          </button>
        </div>
      </div>
      {/* Menu bar */}
      <div className="w-full flex">
        {inboxOpen ? (
          <button
            onClick={() => {
              setInboxOpen(false)
            }}
          >
            <label className="sr-only">Go full screen</label>
            <Maximize24 className="h-6 w-6 fill-current text-gray-300 dark:text-gray-600" />
          </button>
        ) : (
          <button
            onClick={() => {
              setInboxOpen(true)
            }}
          >
            <label className="sr-only">Go full screen</label>
            <ArrowNarrowLeftIcon
              className="h-6 w-6 fill-current text-gray-300 dark:text-gray-600"
              aria-hidden="true"
            />
          </button>
        )}
        {/* Push all menu bars to the right */}
        <div className="flex-grow"></div>
        <div></div>
      </div>

      <MetadataImmutable module={moduleEdit} />
      {mainFile.name ? (
        <div className="my-8">
          <h2 className="">Main file</h2>
          <ViewFiles name={mainFile.name} size={mainFile.size} url={mainFile.cdnUrl} />
        </div>
      ) : (
        ""
      )}
      {/* Supporting files */}
      {supportingRaw.files.length > 0 ? (
        <div className="my-8">
          <h2>Supporting file(s)</h2>
          {supportingRaw.files.map((file) => (
            <>
              <ViewFiles
                name={file.original_filename}
                size={file.size}
                url={file.original_file_url}
              />
            </>
          ))}
        </div>
      ) : (
        ""
      )}
      {/* PLACEHOLDER References */}
    </div>
  )
}

export default ModuleInvitation
