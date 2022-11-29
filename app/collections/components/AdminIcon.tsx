import { useMutation } from "@blitzjs/rpc"
import { Widget, WidgetAPI } from "@uploadcare/react-widget"
import { Ref, useRef } from "react"
import toast from "react-hot-toast"
import { JsonObject } from "prisma"

import changeIcon from "../mutations/changeIcon"

const Icon = ({ collection, refetchFn, signature, expire }) => {
  const widgetApiIcon = useRef() as Ref<WidgetAPI>
  const [changeIconMutation] = useMutation(changeIcon)

  return (
    <>
      {collection.type.type === "INDIVIDUAL" ? (
        <img
          src={collection?.icon!["cdnUrl"]}
          className="z-0 mx-auto mb-2 max-w-[75%] rounded-full"
          alt={`Icon of ${collection.title}`}
        />
      ) : (
        <>
          <img
            src={collection?.icon!["cdnUrl"]}
            className="z-0 mx-auto my-2 max-h-56 max-w-[75%] hover:cursor-pointer hover:opacity-75 dark:invert"
            alt={`Icon of ${collection.title}`}
            onClick={() => {
              widgetApiIcon!["current"].openDialog()
            }}
          />
          <p className="text-xs">*We recommend uploading an icon in the color black.</p>
          <Widget
            publicKey={process.env.UPLOADCARE_PUBLIC_KEY ?? ""}
            secureSignature={signature}
            secureExpire={expire}
            ref={widgetApiIcon}
            imagesOnly
            previewStep
            clearable
            onChange={async (info) => {
              toast
                .promise(
                  changeIconMutation({
                    id: collection.id,
                    iconInfo: info as JsonObject,
                  }),
                  {
                    loading: "Updating icon...",
                    success: () => {
                      refetchFn()
                      return "Success!"
                    },
                    error: "That did not work",
                  }
                )
                .catch((err) => {
                  alert(err)
                })
            }}
          />
        </>
      )}
    </>
  )
}

export default Icon
