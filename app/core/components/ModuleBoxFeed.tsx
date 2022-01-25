import AuthorAvatarsNew from "app/modules/components/AuthorAvatarsNew"
import { Link, Routes } from "blitz"
import { Fragment } from "react"

const ModuleBoxFeed = ({ modules, fetchNextPage, hasNextPage, isFetchingNextPage }) => {
  console.log(modules[0].count)

  return (
    <>
      {modules[0].count === 0 ? (
        <div className="flex flex-col flex-grow relative w-full border-2 border-gray-1000 border-dashed rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500  my-4 h-auto">
          <div className="table flex-grow w-full">
            <div className="sm:table-cell w-1/4 h-28"></div>
            <span className="mx-auto table-cell align-middle text-sm leading-4 font-medium">
              Following people will help fill your feed
            </span>
            <div className="hidden sm:table-cell w-1/4"></div>
          </div>
        </div>
      ) : (
        modules.map((page, i) => (
          <>
            <Fragment key={i}>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 my-4">
                {page.modules.map((module) => (
                  <>
                    <>
                      <Link href={Routes.ModulePage({ suffix: module.suffix })}>
                        <a
                          className={`flex flex-col module ${
                            i % 2 === 0
                              ? "bg-indigo-600 dark:bg-indigo-600"
                              : "bg-purple-600 dark:bg-indigo-50"
                          } cursor-pointer p-4 text-white`}
                        >
                          <h2 className="text-base font-normal leading-5 flex-grow mb-2">
                            {module.title}
                          </h2>
                          <span className="w-full flex">
                            <span className="flex-grow align-text-bottom text-gray-300"></span>
                            <AuthorAvatarsNew
                              authors={module.authors}
                              size="h-6 w-6"
                              toDisplay={4}
                            />
                          </span>
                        </a>
                      </Link>
                    </>
                  </>
                ))}
              </div>
            </Fragment>
          </>
        ))
      )}
      <div className="text-center my-4">
        <button
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || !!isFetchingNextPage}
          className="whitespace-nowrap text-sm leading-5 font-normal text-indigo-700 dark:text-gray-200 bg-indigo-100 hover:bg-indigo-200 dark:bg-gray-800 dark:hover:bg-gray-700 border-0 dark:border dark:border-gray-600 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-indigo-500"
        >
          {isFetchingNextPage
            ? "Loading more..."
            : hasNextPage
            ? "Load more"
            : "Nothing more to load"}
        </button>
      </div>
    </>
  )
}

export default ModuleBoxFeed
