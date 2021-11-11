import { Download32, TrashCan32 } from "@carbon/icons-react"
import { useQuery, useMutation } from "blitz"
import { Widget } from "@uploadcare/react-widget"
import { useRef } from "react"

import getSignature from "../../auth/queries/getSignature"
import addMain from "../mutations/addMain"

const EditMainFile = ({ mainFile, setQueryData, moduleEdit }) => {
  const [uploadSecret] = useQuery(getSignature, undefined)
  const widgetApiMain = useRef()
  const [addMainMutation] = useMutation(addMain)

  return (
    <>
      {mainFile ? (
        <div className="flex">
          <p className="flex-grow flex border-2 border-gray-700">
            <span className="flex-grow">{mainFile.name}</span>
            <span>{mainFile.size / 1000}KB</span>
          </p>
          <p className="flex">
            <a href={mainFile.cdnUrl} download>
              <Download32 />
            </a>
            {/* TODO: Add action */}
            <TrashCan32 />
          </p>
        </div>
      ) : (
        <>
          <button
            type="button"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={() => {
              widgetApiMain.current.openDialog()
            }}
          >
            Upload file
            <Widget
              publicKey={process.env.UPLOADCARE_PUBLIC_KEY ?? ""}
              secureSignature={uploadSecret.signature}
              secureExpire={uploadSecret.expire}
              ref={widgetApiMain}
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
                  //  TODO: add action
                } catch (err) {
                  alert(err)
                }
                console.log("Upload completed:", info)
              }}
            />
          </button>
        </>
      )}
    </>
  )
}

export default EditMainFile
