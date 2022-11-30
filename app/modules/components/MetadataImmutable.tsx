import Link from "next/link"
import moment from "moment"
import ISO6391 from "iso-639-1"

import AuthorAvatarsNew from "./AuthorAvatarsNew"
import ViewAuthors from "./ViewAuthors"
import { Suspense } from "react"

const MetadataImmutable = ({ currentModule }) => {
  return (
    <>
      <div className="text-center text-sm font-normal leading-4 lg:flex">
        <div className="flex-grow py-2">
          {currentModule.published ? (
            <>{currentModule.publishedAt.substring(0, 10)}</>
          ) : (
            <>Updated: {moment(currentModule.updatedAt).fromNow()}</>
          )}
        </div>
        <div className="flex-grow py-2">
          {currentModule.published ? (
            <>
              <Link
                href={`https://doi.org/${currentModule.prefix}/${currentModule.suffix}`}
                className="underline"
              >
                {`${currentModule.prefix}/${currentModule.suffix}`}
              </Link>
            </>
          ) : (
            <>
              DOI: <span className="">{`${currentModule.prefix}/${currentModule.suffix}`}</span>
            </>
          )}
        </div>
        <div className="flex-grow py-2">
          <Link href={currentModule.license!.url!} target="_blank">
            {currentModule.license!.name}
          </Link>
        </div>
        {ISO6391.getName(currentModule.language) && (
          <div className="flex-grow py-2">{ISO6391.getName(currentModule.language)}</div>
        )}
      </div>
      <div
        className="module my-4 py-2 px-4 text-white"
        id="moduleCurrent"
        style={{ backgroundColor: currentModule.displayColor }}
      >
        <div className="min-h-32 py-4 px-2">
          <p className="text-sm font-normal leading-4 ">{currentModule.type.name}</p>
          <h1 className="text-xl font-medium leading-6 ">{currentModule.title}</h1>
        </div>
        {/* Authors section */}
        <div className="sm:place-items-left place-items-center px-1 py-1 sm:flex">
          <div className="flex sm:inline">
            <span className="flex-grow"></span>
            <AuthorAvatarsNew
              authors={currentModule.authors}
              size="h-12 w-12"
              toDisplay={currentModule.authors.length}
            />
            <span className="flex-grow"></span>
          </div>
          <span className="sm:flex-grow"></span>
          <div className="mt-2 flex sm:mt-0 sm:contents">
            <span className="flex-grow sm:hidden"></span>
            <Suspense fallback="">
              <ViewAuthors currentModule={currentModule} button={<>test</>} />
            </Suspense>
            <span className="flex-grow sm:hidden"></span>
          </div>
        </div>
        {/* Description section */}
        <div className="pt-4 pl-2 pr-4 pb-2 text-base font-normal leading-6">
          <h2 className="italic">Summary</h2>
          {currentModule.description}
        </div>
        {/* </div> */}
      </div>
    </>
  )
}

export default MetadataImmutable
