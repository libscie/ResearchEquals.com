import { useMutation } from "blitz"
import { Widget } from "@uploadcare/react-widget"
import { useRef } from "react"
import toast from "react-hot-toast"

import addMain from "../mutations/addMain"
import EditMainFileDisplay from "../../core/components/EditMainFileDisplay"
import { PlusSmIcon } from "@heroicons/react/solid"
import { fileSizeLimit, fileTypeLimit } from "../../core/utils/fileTypeLimit"

const validators = [fileTypeLimit, fileSizeLimit]

const EditMainFile = ({
  mainFile,
  setQueryData,
  moduleEdit,
  user,
  workspace,
  expire,
  signature,
}) => {
  const widgetApi = useRef()
  const [addMainMutation] = useMutation(addMain)

  return (
    <>
      {Object.keys(mainFile).length > 0 ? (
        <EditMainFileDisplay
          name={mainFile.name}
          size={mainFile.size}
          url={mainFile.cdnUrl}
          uuid={mainFile.uuid}
          moduleId={moduleEdit.id}
          setQueryData={setQueryData}
        />
      ) : user.emailIsVerified ? (
        <>
          <button
            type="button"
            className="flex px-2 py-2 border dark:bg-gray-800 border-gray-300 dark:border-gray-600 dark:hover:border-gray-400 text-gray-700 dark:text-gray-200 rounded text-xs leading-4 font-normal shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => {
              widgetApi.current.openDialog()
            }}
          >
            <PlusSmIcon className="w-4 h-4" aria-hidden="true" /> Add Main File
            <Widget
              publicKey={process.env.UPLOADCARE_PUBLIC_KEY ?? ""}
              secureSignature={signature}
              secureExpire={expire}
              ref={widgetApi}
              previewStep
              validators={validators}
              clearable
              onChange={async (info) => {
                // TODO: Only store upon save
                try {
                  toast.promise(
                    addMainMutation({
                      id: moduleEdit?.id,
                      json: info,
                    }),
                    {
                      loading: "Uploading...",
                      success: (data) => {
                        setQueryData(data)
                        return "Uploaded!"
                      },
                      error: "Uh-oh this is embarassing.",
                    }
                  )
                } catch (err) {
                  alert(err)
                }
              }}
            />
          </button>
        </>
      ) : (
        <p className="text-xs leading-4 font-normal text-gray-900 dark:text-gray-200 my-2">
          Please verify email to upload files.
        </p>
      )}
    </>
  )
}

export default EditMainFile
