import { useMutation } from "blitz"
import toast from "react-hot-toast"
import unfollowWorkspace from "../mutations/unfollowWorkspace"
import { currentWorkspaceAtom } from "../../core/utils/Atoms"
import { useRecoilState } from "recoil"

const UnfollowButton = ({ author, refetchFn }) => {
  const [unfollowWorkspaceMutation] = useMutation(unfollowWorkspace)
  const [currentWorkspace, setCurrentWorkspace] = useRecoilState(currentWorkspaceAtom)

  let newWorkspace = Object.assign({}, currentWorkspace)
  newWorkspace.following = [newWorkspace.following.filter((follow) => follow.id !== author.id)]

  return (
    <>
      <span className="inline-block h-full align-middle"></span>

      <button
        className="inline-block rounded bg-indigo-100 py-2 px-4 align-middle text-sm font-medium leading-4 text-indigo-700 shadow-sm hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0 dark:border dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200   dark:hover:bg-gray-700"
        onClick={async () => {
          await unfollowWorkspaceMutation({
            followedId: author.id,
          })
          await setCurrentWorkspace(newWorkspace)

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
