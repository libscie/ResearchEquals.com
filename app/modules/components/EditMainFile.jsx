import { useMutation } from "blitz"
import { Widget } from "@uploadcare/react-widget"
import { useRef } from "react"
import toast from "react-hot-toast"
import { Add } from "@carbon/icons-react"

import addMain from "../mutations/addMain"
import EditMainFileDisplay from "../../core/components/EditMainFileDisplay"
import { fileSizeLimit, fileTypeLimit } from "../../core/utils/fileTypeLimit"
import uploadcareError from "../../core/utils/uploadcareError"
import FilePreviewer from "../../core/components/FilePreviewer"

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
        <>
          <EditMainFileDisplay
            name={mainFile.name}
            size={mainFile.size}
            url={mainFile.cdnUrl}
            uuid={mainFile.uuid}
            moduleId={moduleEdit.id}
            setQueryData={setQueryData}
          />
          <FilePreviewer module={module} mainFile={mainFile} />
        </>
      ) : user.emailIsVerified ? (
        <>
          <button
            type="button"
            className="flex rounded border border-gray-300 px-2 py-2 text-xs font-normal leading-4 text-gray-700 shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:border-gray-400 dark:hover:bg-gray-700"
            onClick={() => {
              widgetApi.current.openDialog()
            }}
          >
            <Add size={32} className="h-4 w-4" aria-hidden="true" /> Upload Main File
            <Widget
              publicKey={process.env.UPLOADCARE_PUBLIC_KEY ?? ""}
              secureSignature={signature}
              secureExpire={expire}
              ref={widgetApi}
              previewStep
              validators={validators}
              clearable
              localeTranslations={uploadcareError}
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
                      error: "Uh-oh something went wrong.",
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
        <p className="my-2 text-xs font-normal leading-4 text-gray-900 dark:text-gray-200">
          Please verify email to upload files.
        </p>
      )}
    </>
  )
}

export default EditMainFile
