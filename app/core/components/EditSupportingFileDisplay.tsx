import { useMutation } from "@blitzjs/rpc";
import { Download, TrashCan } from "@carbon/icons-react"
import toast from "react-hot-toast"
import { filesize } from "filesize"

import deleteSupportingFile from "../../modules/mutations/deleteSupportingFile"
import { useState } from "react"
import { Modal } from "../modals/Modal"

const EditSupportingFileDisplay = ({ name, size, url, uuid, moduleId, setQueryData }) => {
  const [deleteMutation] = useMutation(deleteSupportingFile)
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)

  return (
    <div className="my-2 flex">
      <a
        href={url}
        className="mr-1 flex flex-grow rounded border border-gray-100 px-2 py-1 text-xs font-normal leading-4 text-gray-900 shadow-sm hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
        target="_blank"
        rel="noreferrer"
      >
        <span className="inline-block  flex-grow align-middle">{name}</span>
        {/* https://www.npmjs.com/package/filesize */}
        <span>{filesize(size)}</span>
      </a>
      <p className="flex">
        <button className="mx-2">
          <TrashCan
            size={24}
            className="inline-block h-6 w-6 fill-current align-middle text-red-500"
            onClick={() => setConfirmDeleteOpen(true)}
            aria-label="Delete file"
          />
          <Modal
            title="Confirm deletion"
            body={
              <span>
                Upon confirmation, the supporting file &quot;{name}&quot; will be permanently
                deleted. Are you sure you want to delete this file?
              </span>
            }
            primaryAction="Delete File"
            primaryButtonClass="rounded-md bg-red-50 py-2 px-4 text-sm font-medium text-red-700 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-0 dark:border dark:border-gray-600 dark:bg-gray-800 dark:text-red-500 dark:hover:border-gray-400 dark:hover:bg-gray-700"
            isOpen={confirmDeleteOpen}
            setIsOpen={setConfirmDeleteOpen}
            onSubmit={async () => {
              toast.promise(deleteMutation({ id: moduleId, uuid }), {
                loading: "Deleting...",
                success: (data) => {
                  setQueryData(data)
                  return `Removed ${name}`
                },
                error: "Something went wrong...",
              })
            }}
          />
        </button>
        <a href={url} target="_blank" download rel="noreferrer">
          <Download
            size={24}
            className="inline-block h-6 w-6 fill-current align-middle text-gray-900 dark:text-gray-200"
            aria-label="Download file"
          />
        </a>
      </p>
    </div>
  )
}

export default EditSupportingFileDisplay
