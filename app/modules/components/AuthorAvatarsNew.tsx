import { Link, Routes } from "blitz"

const AuthorAvatarsNew = ({ authors, size, toDisplay }) => {
  return (
    <>
      <div className="flex -space-x-1 relative z-0 overflow-hidden p-1">
        {authors.map((author, index) => (
          <>
            {index < toDisplay ? (
              <Link href={Routes.HandlePage({ handle: author.workspace.handle })}>
                <a target="_blank">
                  <img
                    className={`relative inline-block ${size} rounded-full ring-1 ring-white dark:ring-gray-800 transition ease-in-out hover:scale-110`}
                    src={author.workspace.avatar}
                    alt={`Avatar of ${author.workspace.handle}`}
                    style={{ zIndex: 100 - index }}
                  />
                </a>
              </Link>
            ) : (
              ""
            )}
          </>
        ))}
        {authors.length >= toDisplay && !(authors.length === toDisplay) ? (
          <>
            <div>
              <span className="inline-block h-full align-middle"> </span>
              <span className="inline-flex align-middle items-center px-3 py-0.5 rounded-full text-xs leading-4 font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 ring-1 ring-gray-300 dark:ring-gray-600 max-h-8 shadow-sm dark:shadow-none">
                + {authors.length}
              </span>
            </div>
          </>
        ) : (
          ""
        )}
      </div>
    </>
  )
}

export default AuthorAvatarsNew
