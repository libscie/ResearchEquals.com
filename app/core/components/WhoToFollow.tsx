import FollowButton from "app/workspaces/components/FollowButton"
import UnfollowButton from "app/workspaces/components/UnfollowButton"
import { Link, Routes } from "blitz"

const WhoToFollow = ({ data, workspace, refetch, refetchFeed }) => {
  const refetchFn = () => {
    refetchFeed()
  }

  return (
    <>
      <h2 className="text-2xl font-medium my-2">Who to follow</h2>
      {data.followableWorkspaces.map((author) => (
        <>
          <li className="py-2 flex">
            <div className="mr-2">
              <img
                src={author.avatar}
                alt={`Avatar of ${author.handle}`}
                className="w-10 h-10 rounded-full inline-block h-full align-middle"
              />
            </div>
            <Link href={Routes.HandlePage({ handle: author.handle })}>
              <a className="flex-grow">
                <span className="inline-block h-full align-middle"></span>
                <p className="text-gray-700 dark:text-gray-200 text-sm leading-4 font-normal my-auto inline-block align-middle">
                  {author.firstName} {author.lastName}
                  <p className="text-gray-500 dark:text-gray-400 text-xs leading-4 font-normal">
                    @{author.handle}
                  </p>
                </p>
              </a>
            </Link>
            {workspace!.following.filter((follow) => follow.handle === author.handle).length > 0 ? (
              <UnfollowButton author={author} refetchFn={refetchFn} />
            ) : (
              <FollowButton author={author} refetchFn={refetchFn} />
            )}
          </li>
        </>
      ))}
    </>
  )
}

export default WhoToFollow
