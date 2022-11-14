import Link from "next/link"
import moment from "moment"

import AuthorAvatarsNew from "./AuthorAvatarsNew"
import ViewAuthors from "./ViewAuthors"
import { Suspense } from "react"
import ISO6391 from "iso-639-1"

const MetadataInvite = ({ module }) => {
  return (
    <>
      <div
        className="module my-4 bg-gray-100 dark:bg-gray-600"
        style={{ padding: "1px" }}
        id="moduleCurrent"
      >
        <div className="module divide-y divide-gray-100 border-0 border-gray-100 bg-white dark:divide-gray-600 dark:border-gray-600 dark:bg-gray-900">
          <div className="divide-y divide-gray-100 text-center text-sm font-normal leading-4 text-gray-500 dark:divide-gray-600 dark:bg-gray-800 dark:text-gray-200 lg:flex lg:divide-y-0 lg:divide-x">
            <div className="flex-grow py-2">Updated: {moment(module.updatedAt).fromNow()}</div>
            <div className="flex-grow py-2">
              DOI:{" "}
              <span className="text-gray-300 dark:text-gray-600">{`${module.prefix}/${module.suffix}`}</span>
            </div>
            <div className="flex-grow py-2">
              License:{" "}
              <Link href={module.license!.url!}>
                <a target="_blank">{module.license!.name}</a>
              </Link>
            </div>
            {ISO6391.getName(module.language) && (
              <div className="flex-grow py-2">{ISO6391.getName(module.language)}</div>
            )}
          </div>
          <div className="min-h-32 py-4 px-2">
            <p className="text-sm font-normal leading-4 text-gray-500 dark:text-white">
              {module.type.name}
            </p>
            <p className="text-xl font-medium leading-6  text-gray-900 dark:text-white">
              {module.title}
            </p>
          </div>
          {/* Authors section */}
          <div className="sm:place-items-left place-items-center px-1 py-1 sm:flex">
            <div className="flex sm:inline">
              <span className="flex-grow"></span>

              <AuthorAvatarsNew authors={module.authors} size="h-12 w-12" toDisplay={4} />
              <span className="flex-grow"></span>
            </div>
            <span className="sm:flex-grow"></span>
            <div className="flex sm:contents">
              <ViewAuthors module={module} button={<>test</>} />
            </div>
          </div>
          {/* Description section */}
          <div className="pt-4 pl-2 pr-4 pb-2 text-base font-normal leading-6">
            {module.description}
          </div>
        </div>
      </div>
    </>
  )
}

export default MetadataInvite
