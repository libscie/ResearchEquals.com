import { useQuery, useMutation, Link, validateZodSchema } from "blitz"
import { useState, useEffect } from "react"
import moment from "moment"
import algoliasearch from "algoliasearch"
import { Edit32, EditOff32, Save32 } from "@carbon/icons-react"
import { Prisma } from "prisma"
import useCurrentModule from "../queries/useCurrentModule"
import MetadataView from "./MetadataView"
import AuthorAvatars from "./AuthorAvatars"
import ViewAuthors from "./ViewAuthors"
import ViewFiles from "./ViewFiles"
import FollowsFromView from "./FollowsFromView"

const ModuleEdit = ({ user, module, isAuthor }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [manageAuthorsOpen, setManageAuthorsOpen] = useState(false)
  const [moduleEdit, { refetch, setQueryData }] = useQuery(
    useCurrentModule,
    { suffix: module.suffix },
    { refetchOnWindowFocus: true }
  )

  const mainFile = moduleEdit!.main as Prisma.JsonObject
  const supportingRaw = moduleEdit!.supporting as Prisma.JsonObject

  return (
    <div className="max-w-4xl mx-auto overflow-y-auto text-base">
      {/* Menu bar */}
      <div className="w-full flex">
        {/* Push all menu bars to the right */}
        <div className="flex-grow"></div>
        <div>
          <span className="inline-block h-full align-middle"> </span>
        </div>
      </div>
      {/* Last updated */}
      <div className="text-center ">
        Last updated: {moment(moduleEdit?.updatedAt).fromNow()} (
        {moduleEdit?.updatedAt.toISOString()})
      </div>
      {/* Parents */}
      {moduleEdit?.parents!.length! > 0 ? (
        <div className="flex w-full max-h-8 my-2">
          <FollowsFromView module={moduleEdit} />
        </div>
      ) : (
        ""
      )}
      <MetadataView module={moduleEdit} />
      {/* Authors */}
      <div className="flex border-t border-b border-gray-800 mt-2 py-2">
        <div className="flex-grow flex -space-x-2 relative z-0 overflow-hidden">
          <AuthorAvatars module={module} />
        </div>
        {/* TODO: View Authors */}
        <ViewAuthors button="button" module={module} />
      </div>

      {mainFile ? (
        <div className="my-8">
          <h2 className="">Main file</h2>
          <ViewFiles name={mainFile.name} size={mainFile.size} url={mainFile.cdnUrl} />
        </div>
      ) : (
        ""
      )}
      {/* Supporting files */}
      {supportingRaw.length > 0 ? (
        <div className="my-8">
          <h2>Supporting file(s)</h2>
          {supportingRaw.files.map((file) => (
            <>
              <ViewFiles
                name={file.original_filename}
                size={file.size}
                url={file.original_file_url}
              />
            </>
          ))}
        </div>
      ) : (
        ""
      )}
      {/* PLACEHOLDER References */}
    </div>
  )
}

export default ModuleEdit
