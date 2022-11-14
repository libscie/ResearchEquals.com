import Link from "next/link";
import { Routes } from "@blitzjs/next";
import FollowButton from "app/workspaces/components/FollowButton"
import UnfollowButton from "app/workspaces/components/UnfollowButton"

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
      <div className="my-4 text-center">
        <Link href="/browse">
          <button className="whitespace-nowrap rounded border-0 bg-indigo-100 px-4 py-2 text-sm font-normal leading-5 text-indigo-700 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0 dark:border dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700">
            Find more authors
          </button>
        </Link>
      </div>{" "}
    </>
  )
}

export default WhoToFollow
