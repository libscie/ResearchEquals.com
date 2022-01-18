import { Link } from "blitz"
import moment from "moment"

import AuthorAvatarsNew from "./AuthorAvatarsNew"
import ViewAuthors from "./ViewAuthors"
import { Suspense } from "react"

const MetadataImmutable = ({ module }) => {
  return (
    <>
      <div className="lg:flex text-center text-sm leading-4 font-normal">
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
      <div className="module bg-indigo-600 text-white my-4 py-2 px-4" id="moduleCurrent">
        <div className="py-4 px-2 min-h-32">
          <p className="text-sm leading-4 font-normal ">{module.type.name}</p>
          <h1 className="text-xl leading-6 font-medium ">{module.title}</h1>
        </div>
        {/* Authors section */}
        <div className="px-1 py-1 sm:flex place-items-center sm:place-items-left">
          <div className="flex sm:inline">
            <span className="flex-grow"></span>
            <AuthorAvatarsNew authors={module.authors} />
            <span className="flex-grow"></span>
          </div>
          <span className="sm:flex-grow"></span>
          <div className="flex sm:contents mt-2 sm:mt-0">
            <span className="flex-grow sm:hidden"></span>
            <Suspense fallback="">
              <ViewAuthors module={module} button={<>test</>} />
            </Suspense>
            <span className="flex-grow sm:hidden"></span>
          </div>
        </div>
        {/* Description section */}
        <div className="text-base leading-6 font-normal pt-4 pl-2 pr-4 pb-2">
          {module.description}
        </div>
        {/* </div> */}
      </div>
    </>
  )
}

export default MetadataImmutable
