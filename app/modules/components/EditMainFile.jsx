import { useQuery, useMutation } from "blitz"
import { Widget } from "@uploadcare/react-widget"
import { useRef } from "react"

import getSignature from "../../auth/queries/getSignature"
import addMain from "../mutations/addMain"
import EditMainFileDisplay from "../../core/components/EditMainFileDisplay"
import { PlusSmIcon } from "@heroicons/react/solid"

const EditMainFile = ({ mainFile, setQueryData, moduleEdit }) => {
  const [uploadSecret] = useQuery(getSignature, undefined)
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
      ) : (
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
              // secureSignature={uploadSecret.signature}
              // secureExpire={uploadSecret.expire}
              ref={widgetApi}
              previewStep
              clearable
              onChange={async (info) => {
                try {
                  // TODO: Only store upon save
                  const updatedModule = await addMainMutation({
                    id: moduleEdit?.id,
                    json: info,
                  })
                  setQueryData(updatedModule)
                } catch (err) {
                  alert(err)
                }
              }}
            />
          </button>
        </>
      )}
    </>
  )
}

export default EditMainFile
