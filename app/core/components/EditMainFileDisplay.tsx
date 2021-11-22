import { Download32, TrashCan32 } from "@carbon/icons-react"
import { useMutation } from "blitz"

import deleteMainFile from "../../modules/mutations/deleteMainFile"

const EditFileDisplay = ({ name, size, url, uuid, suffix, setQueryData }) => {
  const [deleteMainMutation] = useMutation(deleteMainFile)
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
        <TrashCan32
          className="cursor-pointer"
          onClick={async () => {
            const updatedModule = await deleteMainMutation({ suffix, uuid })
            setQueryData(updatedModule)
          }}
        />
      </p>
    </div>
  )
}

export default EditFileDisplay
