import { useQuery, useMutation, Link } from "blitz"
import { Wax } from "wax-prosemirror-core"
import { Popover, Transition } from "@headlessui/react"
import { ChevronDoubleDownIcon } from "@heroicons/react/solid"
import { Fragment, useState, useRef } from "react"
import { DefaultSchema } from "wax-prosemirror-utilities"
import moment from "moment"
import algoliasearch from "algoliasearch"
import { Toaster, toast } from "react-hot-toast"
import { DocumentPdf32, Edit32, EditOff32, TrashCan32, Download32 } from "@carbon/icons-react"
import { Prisma } from "prisma"

import EditMainFile from "./EditMainFile"
import ManageAuthors from "./ManageAuthors"
import EditSupportingFiles from "./EditSupportingFiles"
import getSupportingFiles from "../queries/getSupportingFiles"

import ReadyToPublishModal from "../../core/modals/ReadyToPublishModal"
import DeleteModuleModal from "../../core/modals/DeleteModuleModal"
import useCurrentModule from "../queries/useCurrentModule"
import InstaLayout from "../../wax/InstaLayout"
import changeTitle from "../mutations/changeTitle"
import changeAbstract from "../mutations/changeAbstract"
import Autocomplete from "../../core/components/Autocomplete"
import EditFileDisplay from "../../core/components/EditFileDisplay"
import PublishModuleModal from "../../core/modals/PublishModuleModal"

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
  const [supportingFiles] = useQuery(getSupportingFiles, {
    groupUuid: supportingRaw.uuid,
  })

  const [changeTitleMutation] = useMutation(changeTitle)
  const [changeAbstractMutation] = useMutation(changeAbstract)

  return (
    <div className="max-w-4xl mx-auto overflow-y-auto">
      <Toaster />
      {/* Menu bar */}
      <div className="w-full bg-gray-300 flex">
        <div className="flex-grow"></div>
        <div>
          <span className="inline-block h-full align-middle"> </span>

          {isEditing ? (
            <EditOff32
              className="inline-block align-middle"
              onClick={() => {
                setIsEditing(false)
              }}
            />
          ) : (
            <Edit32
              className="inline-block align-middle"
              onClick={() => {
                setIsEditing(true)
              }}
            />
          )}
          <span className="inline-block h-full align-middle"> </span>

          <DocumentPdf32 className="inline-block align-middle" />
        </div>
      </div>
      {/* Last updated */}
      <div className="text-center text-xs">
        Last updated: {moment(moduleEdit?.updatedAt).fromNow()} (
        {moduleEdit?.updatedAt.toISOString()})
      </div>
      {/* Parents */}
      <div className="flex w-full max-h-8 text-xs my-2">
        {/* TODO: Add action */}
        Follows from: <Autocomplete />
      </div>
      {/* Metadata */}
      <div className="w-full my-4 pb-8">
        {/* TODO: Add edit */}
        {isEditing ? (
          <p className="text-gray-500 text-xs">{moduleEdit!.type.name}</p>
        ) : (
          <p className="text-gray-500 text-xs">{moduleEdit!.type.name}</p>
        )}
        {isEditing ? (
          <h1 className="min-h-16 text-base">{moduleEdit!.title}</h1>
        ) : (
          <h1 className="min-h-16 text-base">{moduleEdit!.title}</h1>
        )}
      </div>
      {/* Authors */}
      <div className="flex border-t-2 border-b-2 border-gray-800 my-4 py-2">
        <div className="flex-grow flex -space-x-2 relative z-0 overflow-hidden">
          <div className="inline-block h-full align-middle">
            {moduleEdit?.authors.map((author) => (
              <>
                {/* Tricks it into the middle */}
                <span className="inline-block h-full align-middle"></span>
                <img
                  key={author.id + author.workspace!.handle}
                  alt={`Avatar of ${author.workspace!.handle}`}
                  className="inline-block align-middle relative z-30 inline-block h-8 w-8 rounded-full"
                  src={author.workspace?.avatar!}
                />
              </>
            ))}
          </div>
        </div>
        <ManageAuthors
          open={manageAuthorsOpen}
          setOpen={setManageAuthorsOpen}
          moduleEdit={moduleEdit}
          setQueryData={setQueryData}
        />
        <button
          type="button"
          className="inline-flex items-center h-8  px-6 py-3 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={() => {
            setManageAuthorsOpen(true)
          }}
        >
          Manage authors
        </button>
      </div>
      {/* Description */}
      <div className="text-xs">{moduleEdit!.description}</div>
      {/* Main file */}
      <div>
        <h2 className="text-xs">Main file</h2>
        <EditMainFile mainFile={mainFile} setQueryData={setQueryData} moduleEdit={moduleEdit} />
      </div>

      {/* Supporting files */}
      <div>
        <h2>Supporting file(s)</h2>
        {/* TODO: Robustify conditions */}
        {supportingFiles ? (
          supportingFiles.files.map((file) => (
            <>
              <EditFileDisplay
                name={file.original_filename}
                size={file.size}
                url={file.original_file_url}
                uuid={file.uuid}
              />
            </>
          ))
        ) : (
          <></>
        )}
        <EditSupportingFiles
          mainFile={mainFile}
          setQueryData={setQueryData}
          moduleEdit={moduleEdit}
        />
      </div>
      {/* References */}
      {/* License */}
      {moduleEdit!.license ? (
        <div className="text-center">
          License:{" "}
          {isEditing ? (
            <Link href={moduleEdit!.license!.url}>
              <a target="_blank">{moduleEdit!.license!.name}</a>
            </Link>
          ) : (
            <Link href={moduleEdit!.license!.url}>
              <a target="_blank">{moduleEdit!.license!.name}</a>
            </Link>
          )}
        </div>
      ) : (
        <></>
      )}
      <div className="text-center">
        {/* Publish module */}
        {moduleEdit!.authors.filter((author) => author.readyToPublish !== true).length === 0 ? (
          <PublishModuleModal module={module} />
        ) : (
          <></>
        )}
        {/* Delete module */}
        <DeleteModuleModal module={module} />
      </div>
    </div>
  )
}

export default ModuleEdit
