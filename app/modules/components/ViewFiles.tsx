import { Download32 } from "@carbon/icons-react"

const ViewFiles = ({ name, size, url }) => {
  return (
    <div className="flex my-2">
      <p className="flex-grow flex border-2 border-gray-700 px-2 py-1 hover:bg-indigo-500">
        <span className="flex-grow">{name}</span>
        <span>{size / 1000}KB</span>
      </p>
      <p className="flex">
        <a href={url} target="_blank" download rel="noreferrer">
          <Download32 />
        </a>
      </p>
    </div>
  )
}

export default ViewFiles
