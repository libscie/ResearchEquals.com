import { Download24 } from "@carbon/icons-react"
import filesize from "filesize"

const ViewFiles = ({ name, size, url }) => {
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
        <a href={url} target="_blank" download rel="noreferrer">
          <Download24 className="w-6 h-6 fill-current text-gray-900 dark:text-gray-200 inline-block align-middle" />
        </a>
      </p>
    </div>
  )
}

export default ViewFiles
