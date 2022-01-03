import { Download32, TrashCan32 } from "@carbon/icons-react"
import { useQuery, useMutation } from "blitz"
import { Widget } from "@uploadcare/react-widget"
import { useRef } from "react"
import { PlusSmIcon } from "@heroicons/react/solid"

import getSignature from "../../auth/queries/getSignature"
import addSupporting from "../mutations/addSupporting"
import getSupportingFiles from "../mutations/getSupportingFiles"
import { fileSizeLimit, fileTypeLimit } from "../../core/utils/fileTypeLimit"

const validators = [fileTypeLimit, fileSizeLimit]

const EditSupportingFiles = ({ setQueryData, moduleEdit }) => {
  const [uploadSecret] = useQuery(getSignature, undefined)
  const widgetApi = useRef()
  const [addSupportingMutation] = useMutation(addSupporting)
  const [getSupportingFilesMutation] = useMutation(getSupportingFiles)

  const updateSupporting = async (info) => {
    try {
      const newFiles = await getSupportingFilesMutation({ groupUuid: info.uuid })
      const updatedModule = await addSupportingMutation({
        id: moduleEdit.id,
        newFiles: newFiles.files,
      })
      setQueryData(updatedModule)
    } catch (err) {
      alert(err)
    }
  }

  return (
    <>
      <button
        type="button"
        className="flex px-2  my-4 py-2 border dark:bg-gray-800 border-gray-300 dark:border-gray-600 dark:hover:border-gray-400 text-gray-700 dark:text-gray-200 rounded text-xs leading-4 font-normal shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 hover:bg-gray-100 dark:hover:bg-gray-700"
        onClick={() => {
          widgetApi.current.openDialog()
        }}
      >
        <PlusSmIcon className="w-4 h-4" aria-hidden="true" /> Add Supporting File(s)
        {moduleEdit.supporting ? (
          <Widget
            publicKey={process.env.UPLOADCARE_PUBLIC_KEY ?? ""}
            // secureSignature={uploadSecret.signature}
            // secureExpire={uploadSecret.expire}
            ref={widgetApi}
            validators={validators}
            previewStep
            multiple
            multipleMax={10}
            clearable
            onChange={updateSupporting}
          />
        ) : (
          <Widget
            publicKey={process.env.UPLOADCARE_PUBLIC_KEY ?? ""}
            // secureSignature={uploadSecret.signature}
            // secureExpire={uploadSecret.expire}
            ref={widgetApi}
            validators={validators}
            previewStep
            multiple
            multipleMax={10}
            clearable
            onChange={updateSupporting}
          />
        )}
      </button>
    </>
  )
}

export default EditSupportingFiles
