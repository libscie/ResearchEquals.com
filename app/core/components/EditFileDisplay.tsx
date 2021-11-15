import { Download32, TrashCan32 } from "@carbon/icons-react"

const EditFileDisplay = ({ name, size, url, uuid }) => {
  return (
    <div className="flex my-2">
      <p className="flex-grow flex border-2 border-gray-700 px-2 py-1 hover:bg-indigo-500">
        <span className="flex-grow">{name}</span>
        <span>{size / 1000}KB</span>
      </p>
      <p className="flex">
        <a href={url} download>
          <Download32 />
        </a>
        {/* TODO: Add action */}
        <TrashCan32
          className="cursor-pointer"
          onClick={async () => {
            alert(uuid)
          }}
        />
      </p>
    </div>
  )
}

export default EditFileDisplay
