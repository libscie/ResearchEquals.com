import Footer from "app/core/components/Footer"
import Navbar from "app/core/components/Navbar"
import Layout from "app/core/layouts/Layout"
import { BlitzPage, Link, Routes, useInfiniteQuery } from "blitz"
import React from "react"
import { Suspense } from "react"
import getBrowseData from "../core/queries/getBrowseData"
import AuthorAvatarsNew from "../modules/components/AuthorAvatarsNew"

const BrowseContent = () => {
  const [modulePages, { isFetching, isFetchingNextPage, fetchNextPage, hasNextPage }] =
    useInfiniteQuery(getBrowseData, (page = { take: 20, skip: 0 }) => page, {
      getNextPageParam: (lastPage) => lastPage.nextPage,
    })
  return (
    <div className="max-w-7xl text-gray-900 dark:text-gray-200 py-16 mx-4 xl:mx-auto">
      <h1 className="text-3xl text-center font-extrabold ">Browse content</h1>
      {modulePages!.map((page, i) => (
        <React.Fragment key={i}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 my-4">
            {page.modules.map((module) => (
              <>
                <>
                  <Link href={Routes.ModulePage({ suffix: module.suffix! })}>
                    <a
                      className={`flex flex-col module ${
                        i % 2 === 0
                          ? "bg-indigo-600 dark:bg-indigo-600"
                          : "bg-purple-600 dark:bg-purple-600"
                      } cursor-pointer p-4 text-white`}
                    >
                      <h2 className="text-base font-normal leading-5 flex-grow mb-2">
                        {module.title}
                      </h2>
                      <span className="w-full flex">
                        <span className="flex-grow align-text-bottom text-gray-300"></span>
                        <AuthorAvatarsNew authors={module.authors} />
                      </span>
                    </a>
                  </Link>
                </>
              </>
            ))}
          </div>
        </React.Fragment>
      ))}
      <div className="text-center my-4">
        <button
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || !!isFetchingNextPage}
          className="whitespace-nowrap text-sm leading-5 font-normal text-indigo-700 dark:text-gray-200 bg-indigo-100 hover:bg-indigo-200 dark:bg-gray-800 dark:hover:bg-gray-700 border-0 dark:border dark:border-gray-600 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-indigo-500"
        >
          {isFetchingNextPage
            ? "Loading more..."
            : hasNextPage
            ? "Load More"
            : "Nothing more to load"}
        </button>
        {/* <div>{isFetching && !isFetchingNextPage ? "Fetching..." : null}</div> */}
      </div>
    </div>
  )
}

const Browse: BlitzPage = () => {
  return (
    <>
      <Navbar />
      <Suspense fallback="Loading...">
        <BrowseContent />
      </Suspense>
      <Footer />
    </>
  )
}

Browse.suppressFirstRenderFlicker = true
Browse.getLayout = (page) => (
  <Layout
    title="R= Browse"
    headChildren={
      <>
        <meta property="og:title" content="ResearchEquals.com" />
        <meta
          property="og:description"
          content="Step by step publishing of your research, with a new publishing format: Research modules."
        />
        <meta property="og:image" content="https://og-images.herokuapp.com/api/researchequals" />
        <meta
          property="og:image:alt"
          content="Screenshot of the homepage of ResearchEquals.com, including the description and a sign up button for release updates."
        />
      </>
    }
  >
    {page}
  </Layout>
)

export default Browse
