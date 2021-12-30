import { Download24, TrashCan24 } from "@carbon/icons-react"
import { useMutation } from "blitz"
import toast from "react-hot-toast"
import filesize from "filesize"

import deleteMainFile from "../../modules/mutations/deleteMainFile"

const EditFileDisplay = ({ name, size, url, uuid, moduleId, setQueryData }) => {
  const [deleteMainMutation] = useMutation(deleteMainFile)
  return (
    <div className="flex my-2">
      <a
        href={url}
        className="flex-grow flex border rounded border-gray-100 dark:border-gray-600 shadow-sm px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 text-xs leading-4 font-normal text-gray-900 dark:text-gray-200 mr-1"
        target="_blank"
        download
        rel="noreferrer"
      >
        <span className="flex-grow  inline-block align-middle">{name}</span>
        {/* https://www.npmjs.com/package/filesize */}
        <span>{filesize(size)}</span>
      </a>
      <p className="flex">
        <button className="mx-2">
          <TrashCan24
            className="w-6 h-6 fill-current text-red-500 inline-block align-middle"
            onClick={async () => {
              const updatedModule = await deleteMainMutation({ id: moduleId, uuid })
              toast(`Removed ${name}`, { icon: "🗑" })
              setQueryData(updatedModule)
            }}
            aria-label="Delete file"
          />
        </button>
        <a href={url} target="_blank" download rel="noreferrer">
          <Download24
            className="w-6 h-6 fill-current text-gray-900 dark:text-gray-200 inline-block align-middle"
            aria-label="Download file"
          />
        </a>
      </p>
    </div>
  )
}

export default EditFileDisplay
