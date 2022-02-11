import { ChevronLeft32, ChevronRight32 } from "@carbon/icons-react"

const FeedPagination = ({
  ITEMS_PER_PAGE,
  page,
  count,
  goToPreviousPage,
  goToPage,
  goToNextPage,
  hasMore,
}) => {
  return (
    <>
      <div className="max-w-screen my-1  flex">
        <div className="hidden flex-1 items-center justify-between sm:flex"></div>
        <nav
          className="relative z-0 mx-auto mb-8 inline-flex -space-x-px divide-x divide-gray-300 rounded-md border border-gray-300 dark:divide-gray-600 dark:border-gray-600"
          aria-label="Pagination"
        >
          <button
            className="relative inline-flex items-center rounded-l-md px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700"
            disabled={page === 0}
            onClick={goToPreviousPage}
          >
            <span className="sr-only">Previous</span>
            <ChevronLeft32 className="h-5 w-5" aria-hidden="true" />
          </button>
          {/* TODO: Drop middle buttons that don't fit screen */}
          {Array.from({ length: Math.ceil(count / ITEMS_PER_PAGE) }, (x, i) => i).map((pageNr) => (
            <button
              key={`page-nav-feed-${pageNr}`}
              className={
                page == pageNr
                  ? "relative z-10 inline-flex items-center bg-indigo-50 px-2 py-2 text-sm font-medium text-indigo-600 ring-1 ring-indigo-600 dark:bg-gray-700 dark:text-gray-200 dark:ring-0"
                  : "relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700"
              }
              disabled={page === pageNr}
              onClick={() => {
                goToPage(pageNr)
              }}
            >
              <span className="sr-only">Navigate to page {pageNr}</span>
              <span className="h-5 w-5 " aria-hidden="true">
                {pageNr + 1}
              </span>
            </button>
          ))}
          <button
            className="relative inline-flex items-center rounded-r-md px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700"
            disabled={!hasMore}
            onClick={goToNextPage}
          >
            <span className="sr-only">Previous</span>
            <ChevronRight32 className="h-5 w-5" aria-hidden="true" />
          </button>
        </nav>
      </div>
    </>
  )
}

export default FeedPagination
