import { useMutation } from "blitz"
import { Widget } from "@uploadcare/react-widget"
import { useRef } from "react"
import toast from "react-hot-toast"
import { Add } from "@carbon/icons-react"

import addSupporting from "../mutations/addSupporting"
import getSupportingFiles from "../mutations/getSupportingFiles"
import { fileSizeLimit, fileTypeLimit } from "../../core/utils/fileTypeLimit"

const validators = [fileTypeLimit, fileSizeLimit]

const EditSupportingFiles = ({ setQueryData, moduleEdit, user, workspace, expire, signature }) => {
  const widgetApi = useRef()
  const [addSupportingMutation] = useMutation(addSupporting)
  const [getSupportingFilesMutation] = useMutation(getSupportingFiles)

  const updateSupporting = async (info) => {
    try {
      const newFiles = await getSupportingFilesMutation({ groupUuid: info.uuid })
      toast.promise(
        addSupportingMutation({
          id: moduleEdit.id,
          newFiles: newFiles.files,
        }),
        {
          loading: "Uploading...",
          success: (data) => {
            setQueryData(data)
            return "Uploaded!"
          },
          error: (error) => {
            return error.toString()
          },
        }
      )
    } catch (err) {
      alert(err)
    }
  }

  return (
    <>
      {user.emailIsVerified ? (
        <>
          <button
            type="button"
            className="my-4 flex  rounded border border-gray-300 px-2 py-2 text-xs font-normal leading-4 text-gray-700 shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:border-gray-400 dark:hover:bg-gray-700"
            onClick={() => {
              widgetApi.current.openDialog()
            }}
          >
            <Add size={32} className="h-4 w-4" aria-hidden="true" /> Add Supporting File(s)
            <Widget
              publicKey={process.env.UPLOADCARE_PUBLIC_KEY ?? ""}
              secureSignature={signature}
              secureExpire={expire}
              ref={widgetApi}
              validators={validators}
              previewStep
              multiple
              multipleMax={10}
              clearable
              onChange={updateSupporting}
            />
          </button>
        </>
      ) : (
        <p className="my-2 text-xs font-normal leading-4 text-gray-900 dark:text-gray-200">
          Please verify email to upload files.
        </p>
      )}
    </>
  )
}

export default EditSupportingFiles
