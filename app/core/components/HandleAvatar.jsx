import { Widget } from "@uploadcare/react-widget"
import { useRef } from "react"
import { useMutation } from "blitz"
import changeAvatar from "../../workspaces/mutations/changeAvatar"
import toast from "react-hot-toast"

const HandleAvatar = ({ params, workspace, ownWorkspace, expire, signature, refetch }) => {
  const widgetApi = useRef()
  const [changeAvatarMutation] = useMutation(changeAvatar)

  return (
    <>
      {ownWorkspace ? (
        ownWorkspace.handle === params.handle ? (
          <>
            <img
              src={workspace.avatar}
              className="rounded-full h-28 w-28 max-h-28 max-w-28 border border-2 border-gray-900 dark:border-white hover:border-4 hover:border-indigo-600 hover:cursor-pointer"
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
              src={workspace.avatar}
              className="rounded-full h-28 w-28 max-h-28 max-w-28 border border-2 border-gray-900 dark:border-white "
              alt={`Avatar of ${workspace.handle}`}
            />
          </>
        )
      ) : (
        <>
          <img
            src={workspace.avatar}
            className="rounded-full h-28 w-28 max-h-28 max-w-28 border border-2 border-gray-900 dark:border-white "
            alt={`Avatar of ${workspace.handle}`}
          />
        </>
      )}
    </>
  )
}

export default HandleAvatar
