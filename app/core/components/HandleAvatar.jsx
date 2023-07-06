import { useMutation } from "@blitzjs/rpc"
import { Widget } from "@uploadcare/react-widget"
import { useRef } from "react"
import changeAvatar from "../../workspaces/mutations/changeAvatar"
import toast from "react-hot-toast"
import { smallFile } from "../utils/fileTypeLimit"

const validators = [smallFile]

const HandleAvatar = ({ params, workspace, ownWorkspace, expire, signature, refetch }) => {
  const widgetApi = useRef()
  const [changeAvatarMutation] = useMutation(changeAvatar)

  return (
    <>
      {ownWorkspace ? (
        ownWorkspace.handle === params.handle ? (
          <>
            <img
              src={`/api/avatars/${workspace.handle}`}
              className="max-w-28 h-28 max-h-28 w-28 rounded-full border border-2 border-gray-900 hover:cursor-pointer hover:border-4 hover:border-indigo-600 dark:border-white"
              alt={`Avatar of ${workspace.handle}`}
              onClick={() => {
                widgetApi.current.openDialog()
              }}
            />
            <Widget
              publicKey={process.env.UPLOADCARE_PUBLIC_KEY ?? ""}
              secureSignature={signature}
              secureExpire={expire}
              crop="1:1"
              ref={widgetApi}
              imageShrink="480x480"
              imagesOnly
              previewStep
              validators={validators}
              clearable
              onChange={async (info) => {
                try {
                  toast.promise(
                    changeAvatarMutation({
                      avatar: info.cdnUrl,
                    }),
                    {
                      loading: "Updating avatar...",
                      success: "Success!",
                      error: "That did not work",
                    }
                  )
                  refetch()
                } catch (err) {
                  alert(err)
                }
              }}
            />
          </>
        ) : (
          <>
            <img
              src={`/api/avatars/${workspace.handle}`}
              className="max-w-28 h-28 max-h-28 w-28 rounded-full border border-2 border-gray-900 dark:border-white "
              alt={`Avatar of ${workspace.handle}`}
            />
          </>
        )
      ) : (
        <>
          <img
            src={`/api/avatars/${workspace.handle}`}
            className="max-w-28 h-28 max-h-28 w-28 rounded-full border border-2 border-gray-900 dark:border-white "
            alt={`Avatar of ${workspace.handle}`}
          />
        </>
      )}
    </>
  )
}

export default HandleAvatar
