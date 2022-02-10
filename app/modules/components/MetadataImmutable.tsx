import { Link } from "blitz"
import moment from "moment"

import AuthorAvatarsNew from "./AuthorAvatarsNew"
import ViewAuthors from "./ViewAuthors"
import { Suspense } from "react"

const MetadataImmutable = ({ module }) => {
  return (
    <>
      <div className="text-center text-sm font-normal leading-4 lg:flex">
        <div className="flex-grow py-2">
          {module.published ? (
            <>Published: {module.publishedAt.toISOString().substring(0, 10)}</>
          ) : (
            <>Last updated: {moment(module.updatedAt).fromNow()}</>
          )}
        </div>
        <div className="flex-grow py-2">
          {module.published ? (
            <>
              <Link href={`https://doi.org/${module.prefix}/${module.suffix}`}>
                <a className="underline">DOI: {`${module.prefix}/${module.suffix}`}</a>
              </Link>
            </>
          ) : (
            <>
              DOI upon publish: <span className="">{`${module.prefix}/${module.suffix}`}</span>
            </>
          )}
        </div>
        <div className="flex-grow py-2">
          License:{" "}
          <Link href={module.license!.url!}>
            <a target="_blank">{module.license!.name}</a>
          </Link>
        </div>
      </div>
      <div
        className="module my-4 py-2 px-4 text-white"
        id="moduleCurrent"
        style={{ backgroundColor: module.displayColor }}
      >
        <div className="min-h-32 py-4 px-2">
          <p className="text-sm font-normal leading-4 ">{module.type.name}</p>
          <h1 className="text-xl font-medium leading-6 ">{module.title}</h1>
        </div>
        {/* Authors section */}
        <div className="sm:place-items-left place-items-center px-1 py-1 sm:flex">
          <div className="flex sm:inline">
            <span className="flex-grow"></span>
            <AuthorAvatarsNew
              authors={module.authors}
              size="h-12 w-12"
              toDisplay={module.authors.length}
            />
            <span className="flex-grow"></span>
          </div>
          <span className="sm:flex-grow"></span>
          <div className="mt-2 flex sm:mt-0 sm:contents">
            <span className="flex-grow sm:hidden"></span>
            <Suspense fallback="">
              <ViewAuthors module={module} button={<>test</>} />
            </Suspense>
            <span className="flex-grow sm:hidden"></span>
          </div>
        </div>
        {/* Description section */}
        <div className="pt-4 pl-2 pr-4 pb-2 text-base font-normal leading-6">
          <h2 className="italic">Summary</h2>
          {module.description}
        </div>
        {/* </div> */}
      </div>
    </>
  )
}

export default MetadataImmutable
