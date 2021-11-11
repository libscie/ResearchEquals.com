import { Download32, TrashCan32 } from "@carbon/icons-react"
import { useQuery, useMutation } from "blitz"
import { Widget } from "@uploadcare/react-widget"
import { useRef } from "react"

import getSignature from "../../auth/queries/getSignature"
import addSupporting from "../mutations/addSupporting"

const EditSupportingFiles = ({ mainFile, setQueryData, moduleEdit }) => {
  const [uploadSecret] = useQuery(getSignature, undefined)
  const widgetApi = useRef()
  const [addSupportingMutation] = useMutation(addSupporting)
  const updateSupporting = async (info) => {
    console.log("Upload completed:", info)
    try {
      // TODO: Only store upon save
      const updatedModule = await addSupportingMutation({
        suffix: moduleEdit.suffix,
        json: info,
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
        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        onClick={() => {
          widgetApi.current.openDialog()
        }}
      >
        Add +
        {moduleEdit.supporting ? (
          <Widget
            publicKey={process.env.UPLOADCARE_PUBLIC_KEY ?? ""}
            secureSignature={uploadSecret.signature}
            secureExpire={uploadSecret.expire}
            ref={widgetApi}
            value={moduleEdit.supporting.uuid}
            previewStep
            multiple
            multipleMax={10}
            clearable
            onChange={updateSupporting}
          />
        ) : (
          <Widget
            publicKey={process.env.UPLOADCARE_PUBLIC_KEY ?? ""}
            secureSignature={uploadSecret.signature}
            secureExpire={uploadSecret.expire}
            ref={widgetApi}
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
