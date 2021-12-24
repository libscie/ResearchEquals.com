import { useMutation } from "blitz"
import toast from "react-hot-toast"
import unfollowWorkspace from "../mutations/unfollowWorkspace"

const UnfollowButton = ({ author, refetchFn }) => {
  const [unfollowWorkspaceMutation] = useMutation(unfollowWorkspace)

  return (
    <>
      <span className="inline-block h-full align-middle"></span>

      <button
        className="py-2 px-4 shadow-sm text-sm leading-4 font-medium bg-indigo-100 dark:bg-gray-800 hover:bg-indigo-200 dark:hover:bg-gray-700 text-indigo-700 dark:text-gray-200 rounded dark:border dark:border-gray-600 inline-block align-middle focus:outline-none focus:ring-2 focus:ring-offset-0   focus:ring-indigo-500"
        onClick={async () => {
          await unfollowWorkspaceMutation({
            followedId: author.id,
          })
          refetchFn()
          toast("Unfollowed", { icon: "👋" })
        }}
      >
        Unfollow
      </button>
    </>
  )
}

export default UnfollowButton
