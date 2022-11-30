import Link from "next/link"
import { useSession } from "@blitzjs/auth"
import { Routes } from "@blitzjs/next"
import React from "react"
import { ChevronUp, ChevronDown, Checkmark, Subtract } from "@carbon/icons-react"

// https://www.npmjs.com/package/array-move
function arrayMoveMutable(array, fromIndex, toIndex) {
  const startIndex = fromIndex < 0 ? array.length + fromIndex : fromIndex

  if (startIndex >= 0 && startIndex < array.length) {
    const endIndex = toIndex < 0 ? array.length + toIndex : toIndex

    const [item] = array.splice(fromIndex, 1)
    array.splice(endIndex, 0, item)
  }
}

function arrayMoveImmutable(array, fromIndex, toIndex) {
  array = [...array]
  arrayMoveMutable(array, fromIndex, toIndex)
  return array
}

function AuthorList({
  authors,
  setAuthorState,
}: {
  authors: Array<any>
  setAuthorState: Function
  suffix: string
}) {
  const session = useSession()

  return (
    <>
      {authors.map((author, index) => (
        <li className="flex py-2 px-2" key={`author-${author.workspace.handle}`}>
          <div className="mr-2 flex">
            <div className="mr-2 flex flex-col">
              <button
                onClick={() => {
                  setAuthorState(arrayMoveImmutable(authors, index, index - 1))
                }}
                disabled={index === 0}
                className="disabled:opacity-0"
              >
                <ChevronUp size={32} className="h-5 w-5 text-gray-400" />
              </button>
              <button
                onClick={() => {
                  setAuthorState(arrayMoveImmutable(authors, index, index + 1))
                }}
                disabled={index === authors.length - 1}
                className="disabled:opacity-0"
              >
                <ChevronDown size={32} className="h-5 w-5 text-gray-400" />
              </button>
            </div>
            <Link href={Routes.HandlePage({ handle: author.workspace.handle })} target="_blank">
              <img
                src={author!.workspace!.avatar}
                alt={`Avatar of ${author!.workspace!.handle}`}
                className="inline-block h-10 h-full w-10 rounded-full align-middle transition ease-in-out hover:scale-110"
              />
            </Link>
          </div>
          <div className="flex-grow">
            <span className="inline-block h-full align-middle"></span>
            <p className="my-auto inline-block align-middle text-sm font-normal leading-4 text-gray-700 dark:text-gray-200">
              {author!.workspace!.firstName} {author!.workspace!.lastName}
              <span className="block text-xs font-normal leading-4 text-gray-500 dark:text-gray-400">
                @{author!.workspace!.handle}
              </span>
            </p>
          </div>
          <div>
            {author.readyToPublish ? (
              <span
                className={`mx-2 my-auto flex h-1 py-2 align-middle text-xs font-medium leading-4 ${
                  author.readyToPublish ? "text-emerald-500" : "text-gray-500 dark:text-gray-400"
                }`}
              >
                <Checkmark size={32} className="h-4 w-4 fill-current" aria-hidden="true" />
                Approved
              </span>
            ) : (
              <span
                className={`mx-2 my-auto flex h-1 py-2 align-middle text-xs font-medium leading-4 ${
                  author.readyToPublish ? "text-emerald-500" : "text-gray-500 dark:text-gray-400"
                }`}
              >
                <Subtract
                  size={32}
                  className="h-4 w-4 fill-current text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                />
                Pending
              </span>
            )}
          </div>
        </li>
      ))}
    </>
  )
}

export default AuthorList
