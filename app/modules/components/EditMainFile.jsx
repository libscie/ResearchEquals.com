import { useQuery, useMutation } from "blitz"
import { Widget } from "@uploadcare/react-widget"
import { useRef } from "react"

import getSignature from "../../auth/queries/getSignature"
import addMain from "../mutations/addMain"
import EditMainFileDisplay from "../../core/components/EditMainFileDisplay"

const EditMainFile = ({ mainFile, setQueryData, moduleEdit }) => {
  const [uploadSecret] = useQuery(getSignature, undefined)
  const widgetApi = useRef()
  const [addMainMutation] = useMutation(addMain)

  return (
    <>
      {mainFile ? (
        <EditMainFileDisplay
          name={mainFile.name}
          size={mainFile.size}
          url={mainFile.cdnUrl}
          uuid={mainFile.uuid}
          suffix={moduleEdit.suffix}
          setQueryData={setQueryData}
        />
      ) : (
        <>
          <button
            type="button"
            className="inline-flex items-center px-6 py-3 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={() => {
              widgetApi.current.openDialog()
            }}
          >
            Upload file
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
                    suffix: moduleEdit?.suffix,
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
