import { Widget, WidgetAPI } from "@uploadcare/react-widget"
import { useMutation } from "blitz"
import { Ref, useRef } from "react"
import toast from "react-hot-toast"
import { JsonObject } from "prisma"

import changeHeader from "../mutations/changeHeader"

const HeaderImage = ({ collection, refetchFn, signature, expire }) => {
  const widgetApiHeader = useRef() as Ref<WidgetAPI>
  const [changeHeaderMutation] = useMutation(changeHeader)

  return (
    <>
      {collection.type.type === "COMMUNITY" && (
        <>
          <img
            src={collection?.header!["cdnUrl"]}
            className="h-56 max-h-56 w-full object-cover hover:cursor-pointer hover:opacity-75"
            alt={`Header image of ${collection.title}`}
            onClick={() => {
              widgetApiHeader!["current"].openDialog()
            }}
          />
          <Widget
            publicKey={process.env.UPLOADCARE_PUBLIC_KEY ?? ""}
            secureSignature={signature}
            secureExpire={expire}
            ref={widgetApiHeader}
            imagesOnly
            crop="5:1"
            previewStep
            clearable
            onChange={async (info) => {
              console.log(JSON.stringify(info))
              try {
                toast.promise(
                  changeHeaderMutation({
                    id: collection.id,
                    headerInfo: info as JsonObject,
                  }),
                  {
                    loading: "Updating header...",
                    success: () => {
                      refetchFn()
                      return "Success!"
                    },
                    error: "That did not work",
                  }
                )
              } catch (err) {
                alert(err)
              }
            }}
          />
        </>
      )}
    </>
  )
}

export default HeaderImage
