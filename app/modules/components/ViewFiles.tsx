import { Download } from "@carbon/icons-react"
import filesize from "filesize"

const ViewFiles = ({ name, size, url }) => {
  return (
    <div className="my-2 flex">
      <a
        href={url}
        className="mr-1 flex flex-grow rounded border border-gray-100 px-2 py-1 text-sm font-normal leading-4 text-gray-900 shadow-sm hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
        target="_blank"
        download
        rel="noreferrer"
      >
        <span className="inline-block  flex-grow align-middle">{name}</span>
        {/* https://www.npmjs.com/package/filesize */}
        <span>{filesize(size)}</span>
      </a>
      <p className="flex">
        <a href={url} target="_blank" download rel="noreferrer">
          <Download
            size={24}
            className="inline-block h-6 w-6 fill-current align-middle text-gray-900 dark:text-gray-200"
          />
        </a>
      </p>
    </div>
  )
}

export default ViewFiles
