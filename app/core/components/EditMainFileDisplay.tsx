import { useMutation } from "@blitzjs/rpc"
import { Download, TrashCan } from "@carbon/icons-react"
import toast from "react-hot-toast"
import { filesize } from "filesize"

import deleteMainFile from "../../modules/mutations/deleteMainFile"

const EditFileDisplay = ({ name, size, url, uuid, moduleId, setQueryData }) => {
  const [deleteMainMutation] = useMutation(deleteMainFile)
  return (
    <div className="my-2 flex">
      <a
        href={url}
        className="mr-1 flex flex-grow rounded border border-gray-100 px-2 py-1 text-xs font-normal leading-4 text-gray-900 shadow-sm hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
        target="_blank"
        download
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
            onClick={async () => {
              toast
                .promise(deleteMainMutation({ id: moduleId, uuid }), {
                  loading: "Deleting...",
                  success: (data) => {
                    setQueryData(data)
                    return `Removed ${name}`
                  },
                  error: "Something went wrong...",
                })
                .catch(() => {})
            }}
            aria-label="Delete file"
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

export default EditFileDisplay
