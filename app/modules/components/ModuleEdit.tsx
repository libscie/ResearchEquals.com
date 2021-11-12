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
    <div className="max-w-4xl mx-auto">
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
        <DeleteModuleModal module={module} />
      </div>
      {/* Last updated */}
      <div className="text-center">
        Last updated: {moment(moduleEdit?.updatedAt).fromNow()} (
        {moduleEdit?.updatedAt.toISOString()})
      </div>
      {/* Parents */}
      <div className="flex w-full">
        {/* TODO: Add action */}
        Follows from: <Autocomplete />
      </div>
      {/* Metadata */}
      <div className="w-full">
        {/* TODO: Add edit */}
        <p>{moduleEdit!.type.name}</p>
        <h1 className="min-h-16">{moduleEdit!.title}</h1>
      </div>
      {/* Authors */}
      <div className="flex border-t-2 border-b-2 border-gray-800">
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
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={() => {
            setManageAuthorsOpen(true)
          }}
        >
          Manage authors
        </button>
      </div>
      {/* Description */}
      <div>{moduleEdit!.description}</div>
      {/* Main file */}
      <div>
        <h2>Main file</h2>
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
        <div>
          License:{" "}
          <Link href={moduleEdit!.license!.url}>
            <a target="_blank">{moduleEdit!.license!.name}</a>
          </Link>
        </div>
      ) : (
        <></>
      )}
    </div>
  )
}

export default ModuleEdit
