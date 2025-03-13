import Link from "next/link"
import { Routes } from "@blitzjs/next"
import AuthorAvatarsNew from "app/modules/components/AuthorAvatarsNew"
import getFeed from "app/modules/queries/getBrowseModuleFeed"
import { useInfiniteQuery } from "@blitzjs/rpc"

const ModuleBoxFeed = () => {
  const [modules, { isFetching, isFetchingNextPage, fetchNextPage, hasNextPage }] =
    useInfiniteQuery(getFeed, (page = { take: 20, skip: 0 }) => page, {
      getNextPageParam: (lastPage) => lastPage.nextPage,
    })

  return (
    <>
      {modules[0]!.count === 0 ? (
        <div className="border-gray-1000 relative my-4 flex h-auto w-full flex-grow flex-col rounded-lg border-2 border-dashed text-center focus:outline-none focus:ring-2  focus:ring-indigo-500 focus:ring-offset-2">
          <div className="table w-full flex-grow">
            <div className="h-28 w-1/4 sm:table-cell"></div>
            <span className="mx-auto table-cell align-middle text-sm font-medium leading-4">
              Following people will help fill your feed
            </span>
            <div className="hidden w-1/4 sm:table-cell"></div>
          </div>
        </div>
      ) : (
        <>
          {modules.map((page, i) => (
            <div
              key={i}
              className="my-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
            >
              {page.modules.map((module) => (
                <Link
                  key={module.suffix}
                  href={Routes.ModulePage({ suffix: module.suffix as string })}
                  className="module flex cursor-pointer flex-col p-4 text-white"
                  style={{ backgroundColor: module.displayColor }}
                >
                  <h2 className="mb-2 flex-grow text-base font-normal leading-5">{module.title}</h2>
                  <span className="flex w-full">
                    <span className="flex-grow align-text-bottom text-gray-300"></span>
                    <AuthorAvatarsNew authors={module.authors} size="h-6 w-6" toDisplay={4} />
                  </span>
                </Link>
              ))}
            </div>
          ))}
          <div className="my-4 text-center">
            <button
              onClick={() => fetchNextPage()}
              disabled={!hasNextPage || !!isFetchingNextPage}
              className="whitespace-nowrap rounded border-0 bg-indigo-100 px-4 py-2 text-sm font-normal leading-5 text-indigo-700 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0 dark:border dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              {isFetchingNextPage
                ? "Loading more..."
                : hasNextPage
                  ? "Load more"
                  : "Nothing more to load"}
            </button>
          </div>
        </>
      )}
    </>
  )
}

export default ModuleBoxFeed
