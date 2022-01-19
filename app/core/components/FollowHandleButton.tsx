import SettingsModal from "../modals/settings"
import FollowButton from "../../workspaces/components/FollowButton"
import UnfollowButton from "../../workspaces/components/UnfollowButton"

const FollowHandleButton = ({ params, currentUser, workspace, ownWorkspace, refetch }) => {
  return (
    <>
      {ownWorkspace ? (
        ownWorkspace!.handle === params.handle ? (
          <>
            <span className="inline-block h-full align-middle"></span>
            <SettingsModal
              button="Edit Profile"
              styling="py-2 px-4 shadow-sm text-sm leading-4 font-medium bg-indigo-100 dark:bg-gray-800 hover:bg-indigo-200 dark:hover:bg-gray-700 text-indigo-700 dark:text-gray-200 rounded dark:border dark:border-gray-600 inline-block align-middle focus:outline-none focus:ring-2 focus:ring-offset-0   focus:ring-indigo-500"
              user={currentUser}
              workspace={ownWorkspace}
            />
          </>
        ) : ownWorkspace?.following.filter((follows) => follows.handle === params.handle).length ===
          0 ? (
          <FollowButton author={workspace} refetchFn={refetch} />
        ) : (
          <UnfollowButton author={workspace} refetchFn={refetch} />
        )
      ) : (
        ""
      )}
    </>
  )
}

export default FollowHandleButton
