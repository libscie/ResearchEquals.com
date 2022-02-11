import { useQuery, useMutation, Link, Routes } from "blitz"
import { useState } from "react"
import { Prisma } from "prisma"
import toast from "react-hot-toast"
import Xarrows from "react-xarrows"

import useCurrentModule from "../queries/useCurrentModule"
import ViewFiles from "./ViewFiles"
import { ArrowLeft32, Maximize24, UserFollow32 } from "@carbon/icons-react"
import acceptInvitation from "app/authorship/mutations/acceptInvitation"
import removeInvitation from "app/authorship/mutations/removeInvitation"
import MetadataInvite from "./MetadataInvite"
import ParentPanel from "./ParentPanel"
import { useMediaPredicate } from "react-media-hook"

const ModuleInvitation = ({
  user,
  module,
  setModule,
  workspace,
  isAuthor,
  inboxOpen,
  setInboxOpen,
}) => {
  const [moduleEdit, { refetch, setQueryData }] = useQuery(
    useCurrentModule,
    { suffix: module.suffix },
    { refetchOnWindowFocus: true }
  )
  const [acceptMutation] = useMutation(acceptInvitation)
  const [declineMutation] = useMutation(removeInvitation)
  const [previousOpen, setPreviousOpen] = useState(false)
  const prefersDarkMode = useMediaPredicate("(prefers-color-scheme: dark)")

  const arrowColor = prefersDarkMode ? "white" : "#0f172a"
  const mainFile = moduleEdit!.main as Prisma.JsonObject
  const supportingRaw = moduleEdit!.supporting as Prisma.JsonObject

  return (
    <div className="mx-auto max-w-7xl overflow-y-auto p-5 text-base">
      {/* Invitation handling */}
      <div className="my-4 w-full rounded-md bg-blue-50 p-2 dark:bg-blue-800 lg:flex">
        <div className="my-2 flex flex-grow lg:my-0">
          <div className="inline-block flex-shrink-0 align-middle">
            <UserFollow32
              className="inline-block h-5 w-5 stroke-current align-middle text-blue-500 dark:text-blue-200"
              aria-hidden="true"
            />
          </div>
          <div className="ml-3 flex-grow text-blue-800 dark:text-blue-100">
            <h3 className="inline-block align-middle text-sm font-normal leading-4 text-blue-800 dark:text-blue-100">
              You got invited to co-author this research module! Would you like to accept or decline
              this invitation?
            </h3>
          </div>
        </div>
        <div className="inline-block pl-8 lg:pl-0">
          <button
            type="button"
            className="rounded border border-blue-500 px-2 py-1.5 text-sm font-medium leading-4 text-blue-500 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-blue-50 dark:border-blue-200 dark:text-blue-200 dark:hover:bg-blue-900"
            onClick={async () => {
              await toast.promise(
                acceptMutation({
                  id: module.authors.filter((author) => author.workspaceId === workspace.id)[0].id,
                  suffix: module.suffix,
                }),
                {
                  loading: "Saving...",
                  success: "Accepted invitation",
                  error: "Hmm that didn't work...",
                }
              )
              refetch()
              setModule(undefined)
            }}
          >
            Accept
          </button>
          <button
            className="mx-2 text-sm font-normal leading-4 text-blue-500 dark:text-blue-200"
            onClick={async () => {
              await toast.promise(
                declineMutation({
                  workspaceId: workspace.id,
                  moduleId: module.id,
                }),
                {
                  loading: "Declining...",
                  success: "Declined invitation",
                  error: "Hmm that didn't work...",
                }
              )
              refetch()
              setModule(undefined)
            }}
          >
            Decline
          </button>
        </div>
      </div>
      {/* Menu bar */}
      <div className="mb-12 flex w-full">
        {inboxOpen ? (
          <button
            onClick={() => {
              setInboxOpen(false)
            }}
          >
            <label className="sr-only">Go full screen</label>
            <Maximize24 className="h-6 w-6 fill-current text-gray-300 dark:text-gray-600" />
          </button>
        ) : (
          <button
            onClick={() => {
              setInboxOpen(true)
            }}
          >
            <label className="sr-only">Go full screen</label>
            <ArrowLeft32
              className="h-6 w-6 fill-current text-gray-300 dark:text-gray-600"
              aria-hidden="true"
            />
          </button>
        )}
        {/* Push all menu bars to the right */}
        <div className="mx-4 flex-grow">
          <button
            className="mx-auto my-2 flex rounded border border-gray-300 px-2 py-2 text-sm font-normal leading-4 text-gray-700 shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:border-gray-400 dark:hover:bg-gray-700"
            onClick={() => {
              setPreviousOpen(true)
            }}
            disabled={moduleEdit?.parents.length === 0}
            id="modulePrevious"
          >
            Links to {moduleEdit?.parents.length} previous steps
          </button>
        </div>
      </div>
      <MetadataInvite module={moduleEdit} />
      <Xarrows
        start="moduleCurrent"
        end="modulePrevious"
        showHead={false}
        dashness
        color={arrowColor}
        startAnchor="auto"
        endAnchor="auto"
      />
      {mainFile.name ? (
        <div className="my-8">
          <h2 className="text-lg">Main file</h2>
          <ViewFiles name={mainFile.name} size={mainFile.size} url={mainFile.cdnUrl} />
        </div>
      ) : (
        ""
      )}
      <div className="mb-28 grid-cols-2 gap-x-4 md:grid">
        {/* Supporting files */}
        {supportingRaw.files.length > 0 ? (
          <div className="">
            <h2 className="text-lg">Supporting file(s)</h2>
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
        {/* TODO: References */}
        {moduleEdit!.references.length > 0 ? (
          <div className="">
            <h2 className="text-lg">Reference list</h2>
            <ol className="text-normal my-4 list-outside list-decimal pl-6">
              {moduleEdit!.references.map((reference) => (
                <>
                  <li className="my-2">
                    {reference.publishedWhere === "ResearchEquals" ? (
                      <>
                        {reference.authors.map((author, index) => (
                          <>
                            <Link href={Routes.HandlePage({ handle: author!.workspace!.handle })}>
                              <a target="_blank">
                                {author!.workspace!.lastName}, {author!.workspace!.firstName}
                              </a>
                            </Link>
                            {index === reference.authors.length - 1 ? "" : "; "}
                          </>
                        ))}
                      </>
                    ) : (
                      <>
                        {reference!.authorsRaw!["object"] ? (
                          <>
                            {reference!.authorsRaw!["object"].map((author, index) => (
                              <>
                                {index === 3
                                  ? "[...]"
                                  : index > 3
                                  ? ""
                                  : author.given && author.family
                                  ? `${author.family}, ${author.given}`
                                  : `${author.name}`}
                                {index === reference!.authorsRaw!["object"].length - 1 || index > 2
                                  ? ""
                                  : "; "}
                              </>
                            ))}
                          </>
                        ) : (
                          <>
                            <p className="italic">{reference.publishedWhere}</p>
                          </>
                        )}
                      </>
                    )}{" "}
                    ({reference.publishedAt?.toISOString().substr(0, 4)}).{" "}
                    <span className="font-semibold">{reference.title}</span>
                    {reference.title.endsWith("." ? "" : ".")}{" "}
                    <Link href={reference.url!}>
                      <a target="_blank">
                        <span className="underline">{reference.url}</span>
                      </a>
                    </Link>
                    . <span className="italic">{reference.publishedWhere}</span>.
                  </li>
                </>
              ))}
            </ol>
          </div>
        ) : (
          ""
        )}
      </div>
      <ParentPanel openObject={previousOpen} openFunction={setPreviousOpen} module={moduleEdit} />
    </div>
  )
}

export default ModuleInvitation
