import { Link, Routes } from "blitz"
import { Fragment } from "react"

const AuthorAvatarsNew = ({ authors, size, toDisplay }) => {
  return (
    <>
      <div className="relative z-0 flex -space-x-1 overflow-hidden p-1">
        {authors.map((author, index) => (
          <Fragment key={author.id}>
            {index < toDisplay ? (
              <Link href={Routes.HandlePage({ handle: author.workspace.handle })}>
                <img
                  className={`relative inline-block ${size} rounded-full ring-1 ring-white transition ease-in-out hover:scale-110 dark:ring-gray-800`}
                  src={author.workspace.avatar}
                  alt={`Avatar of ${author.workspace.handle}`}
                  style={{ zIndex: 100 - index }}
                />
              </Link>
            ) : (
              ""
            )}
          </Fragment>
        ))}
        {authors.length >= toDisplay && !(authors.length === toDisplay) ? (
          <>
            <div>
              <span className="inline-block h-full align-middle"> </span>
              <span className="inline-flex max-h-8 items-center rounded-full bg-white px-3 py-0.5 align-middle text-xs font-medium leading-4 text-gray-700 shadow-sm ring-1 ring-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:shadow-none dark:ring-gray-600">
                + {authors.length - toDisplay}
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
