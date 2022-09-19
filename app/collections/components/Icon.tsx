import { Widget, WidgetAPI } from "@uploadcare/react-widget"
import { useMutation } from "blitz"
import { Ref, useRef } from "react"
import toast from "react-hot-toast"
import { JsonObject } from "prisma"
import changeIcon from "../mutations/changeIcon"

const Icon = ({ collection, refetchFn, signature, expire }) => {
  const widgetApiIcon = useRef() as Ref<WidgetAPI>
  const [changeIconMutation] = useMutation(changeIcon)

  return (
    <>
      {collection.type.type != "INDVIDUAL" ? (
        <>
          <img
            src={collection?.icon!["originalUrl"]}
            className="mx-auto my-2 max-w-[75%] hover:cursor-pointer hover:opacity-75 dark:invert"
            alt={`Icon of ${collection.title}`}
            onClick={() => {
              widgetApiIcon!["current"].openDialog()
            }}
          />
          <Widget
            publicKey={process.env.UPLOADCARE_PUBLIC_KEY ?? ""}
            secureSignature={signature}
            secureExpire={expire}
            ref={widgetApiIcon}
            imagesOnly
            previewStep
            clearable
            onChange={async (info) => {
              try {
                toast.promise(
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
              } catch (err) {
                alert(err)
              }
            }}
          />
        </>
      ) : (
        <img
          src={collection?.icon!["originalUrl"]}
          className="max-w-28 mx-auto h-28 max-h-28 w-28 rounded-full border border-2 border-gray-900 hover:cursor-pointer hover:border-4 hover:border-indigo-600 dark:border-white"
          alt={`Icon of ${collection.title}`}
        />
      )}
    </>
  )
}

export default Icon
