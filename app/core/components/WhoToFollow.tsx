import FollowButton from "app/workspaces/components/FollowButton"
import UnfollowButton from "app/workspaces/components/UnfollowButton"
import { Link, Routes } from "blitz"

const WhoToFollow = ({ data, workspace, refetch, refetchFeed }) => {
  const refetchFn = () => {
    refetchFeed()
  }

  return (
    <>
      <h2 className="my-2 text-2xl font-medium">Who to follow</h2>
      {data.followableWorkspaces.map((author) => (
        <>
          <li className="flex py-2">
            <div className="mr-2">
              <img
                src={author.avatar}
                alt={`Avatar of ${author.handle}`}
                className="inline-block h-10 h-full w-10 rounded-full align-middle"
              />
            </div>
            <Link href={Routes.HandlePage({ handle: author.handle })}>
              <a className="flex-grow">
                <span className="inline-block h-full align-middle"></span>
                <p className="my-auto inline-block align-middle text-sm font-normal leading-4 text-gray-700 dark:text-gray-200">
                  {author.firstName} {author.lastName}
                  <p className="text-xs font-normal leading-4 text-gray-500 dark:text-gray-400">
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
