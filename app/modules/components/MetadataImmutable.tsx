import Autocomplete from "app/core/components/Autocomplete"
import { Link, useMutation } from "blitz"
import moment from "moment"
import toast from "react-hot-toast"
import algoliasearch from "algoliasearch"
import { getAlgoliaResults } from "@algolia/autocomplete-js"

import addAuthor from "../mutations/addAuthor"
import AuthorAvatarsNew from "./AuthorAvatarsNew"
import SearchResultWorkspace from "../../core/components/SearchResultWorkspace"
import { PlusSmIcon } from "@heroicons/react/solid"
import { useState } from "react"
import ManageAuthors from "./ManageAuthors"
import ViewAuthors from "./ViewAuthors"
import FollowsFromView from "./ParentView"
import LeadsToView from "./ChildView"
import ParentChildView from "./ParentChildView"

const searchClient = algoliasearch(process.env.ALGOLIA_APP_ID!, process.env.ALGOLIA_API_SEARCH_KEY!)

const MetadataImmutable = ({ module, addAuthors, setQueryData, setAddAuthors }) => {
  return (
    <div className="module bg-gray-100 dark:bg-gray-600 my-4" style={{ padding: "1px" }}>
      <div className="module bg-white dark:bg-gray-900 border-0 border-gray-100 dark:border-gray-600 divide-y divide-gray-100 dark:divide-gray-600">
        <div className="lg:flex text-center divide-y lg:divide-y-0 lg:divide-x divide-gray-100 dark:divide-gray-600 text-gray-500 dark:text-gray-200 dark:bg-gray-800 text-xs leading-4 font-normal">
          <div className="flex-grow py-2">Last updated: {moment(module.updatedAt).fromNow()}</div>
          <div className="flex-grow py-2">
            DOI upon publish:{" "}
            <span className="text-gray-300 dark:text-gray-600">{`${module.prefix}/${module.suffix}`}</span>
          </div>
          <div className="flex-grow py-2">
            License:{" "}
            <Link href={module.license!.url!}>
              <a target="_blank">{module.license!.name}</a>
            </Link>
          </div>
        </div>
        {/* Parents */}
        {module.parents!.length! > 0 ? (
          <div className="flex w-full">
            <FollowsFromView module={module} />
          </div>
        ) : (
          ""
        )}
        {/* Children */}
        {module.children!.length > 0 ? (
          <div className="flex w-full">
            <LeadsToView module={module} />
          </div>
        ) : (
          ""
        )}
        {module.children!.length > 0 && module.parents!.length > 0 ? (
          <ParentChildView module={module} />
        ) : (
          ""
        )}
        <div className="py-4 px-2 min-h-32">
          <p className="text-xs leading-4 font-normal text-gray-500 dark:text-white">
            {module.type.name}
          </p>
          <p className="text-base leading-6 font-medium text-gray-900 dark:text-white">
            {module.title}
          </p>
        </div>
        {/* Authors section */}
        <div className="px-1 py-1 sm:flex place-items-center sm:place-items-left">
          <div className="flex sm:inline">
            <span className="flex-grow"></span>

            <AuthorAvatarsNew authors={module.authors} />
            <span className="flex-grow"></span>
          </div>
          <span className="sm:flex-grow"></span>
          <div className="flex sm:contents">
            <span className="flex-grow sm:hidden"></span>
            <ViewAuthors module={module} button={<>test</>} />

            {/* <ManageAuthors
              open={manageAuthorsOpen}
              setOpen={setManageAuthorsOpen}
              moduleEdit={module}
              setQueryData={setQueryData}
            /> */}
            <span className="flex-grow sm:hidden"></span>
          </div>
        </div>
        {/* Description section */}
        <div className="text-xs leading-4 font-normal pt-4 pl-2 pr-4 pb-2">
          {module.description}
        </div>
      </div>
    </div>
  )
}

export default MetadataImmutable
