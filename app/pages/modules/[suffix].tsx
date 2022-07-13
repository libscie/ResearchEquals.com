import { Prisma } from "prisma"
import { Link, NotFoundError, Routes, useMutation, useQuery, useRouter, useSession } from "blitz"
import { AddAlt, NextFilled, PreviousFilled } from "@carbon/icons-react"
import Xarrows from "react-xarrows"
import { useEffect, useState } from "react"
import Helmet from "react-helmet"
import { Viewer, Worker } from "@react-pdf-viewer/core"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { a11yLight, a11yDark } from "react-syntax-highlighter/dist/cjs/styles/prism"
import { useRecoilState } from "recoil"
import {
  currentUserAtom,
  currentWorkspaceAtom,
  draftsAtom,
  invitationsAtom,
} from "../../core/utils/Atoms"

import "@react-pdf-viewer/core/lib/styles/index.css"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import "katex/dist/katex.min.css" // `rehype-katex` does not import the CSS for you

import Layout from "../../core/layouts/Layout"
import db from "db"
import Navbar from "../../core/components/Navbar"
import ViewFiles from "../../modules/components/ViewFiles"
import MetadataImmutable from "../../modules/components/MetadataImmutable"
import LayoutLoader from "app/core/components/LayoutLoader"
import getInvitedModules from "app/workspaces/queries/getInvitedModules"
import getDrafts from "app/core/queries/getDrafts"
import { useCurrentWorkspace } from "app/core/hooks/useCurrentWorkspace"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import { useMediaPredicate } from "react-media-hook"
import ChildPanel from "../../modules/components/ChildPanel"
import ParentPanel from "app/modules/components/ParentPanel"
import toast from "react-hot-toast"
import createNextModule from "../../modules/mutations/createNextModule"

export async function getServerSideProps(context) {
  const module = await db.module.findFirst({
    where: {
      suffix: context.params.suffix.toLowerCase(),
      published: true,
      prefix: "10.53962",
    },
    include: {
      references: {
        include: {
          authors: {
            include: {
              workspace: true,
            },
          },
        },
        orderBy: {
          title: "asc",
        },
      },
      authors: {
        orderBy: {
          authorshipRank: "asc",
        },
        include: {
          workspace: true,
        },
      },
      license: true,
      type: true,
      parents: {
        where: {
          published: true,
        },
        include: {
          type: true,
          authors: {
            include: {
              workspace: true,
            },
            orderBy: {
              authorshipRank: "asc",
            },
          },
        },
      },
      children: {
        where: {
          published: true,
        },
        include: {
          type: true,
          authors: {
            include: {
              workspace: true,
            },
            orderBy: {
              authorshipRank: "asc",
            },
          },
        },
      },
    },
  })

  if (!module) throw new NotFoundError()
  return {
    props: {
      module,
    },
  }
}

const Module = ({ module, mainFile, supportingRaw }) => {
  const router = useRouter()
  const session = useSession()
  const [tmpDrafts, { refetch }] = useQuery(getDrafts, { session })
  const [drafts, setDrafts] = useRecoilState(draftsAtom)
  const prefersDarkMode = useMediaPredicate("(prefers-color-scheme: dark)")
  const biggerWindow = useMediaPredicate("(min-width: 916px)")
  const [previousOpen, setPreviousOpen] = useState(false)
  const [leadsToOpen, setLeadsToOpen] = useState(false)
  const [createNextModuleMutation] = useMutation(createNextModule)
  const [mainFileMarkdown, setMarkdown] = useState("")
  const [currentUser, setCurrentUser] = useRecoilState(currentUserAtom)
  setCurrentUser(useCurrentUser())
  const [currentWorkspace, setCurrentWorkspace] = useRecoilState(currentWorkspaceAtom)
  setCurrentWorkspace(useCurrentWorkspace())
  const [invitations, setInvitations] = useRecoilState(invitationsAtom)
  const [tmpInvitations] = useQuery(getInvitedModules, { session })

  let arrowColor
  if (biggerWindow) {
    arrowColor = prefersDarkMode ? "white" : "#0f172a"
  } else {
    arrowColor = "transparent"
  }
  console.log(process.env.APP_ORIGIN)
  useEffect(() => {
    if (mainFile.mimeType === "text/markdown") {
      fetch(mainFile.cdnUrl)
        .then((response) => response.text())
        .then((body) => setMarkdown(body))
        .then((res) => console.log(mainFileMarkdown))
    }

    setDrafts(tmpDrafts)
    setInvitations(tmpInvitations)
  }, [])

  return (
    <>
      <Navbar />
      {module.parents.length > 0 ? (
        <div className="bottom-2 hidden modscreen:absolute modscreen:top-1/3 modscreen:left-2 modscreen:inline">
          <button
            onClick={() => {
              setPreviousOpen(true)
            }}
          >
            <PreviousFilled
              size={32}
              className="h-10 w-10 rounded-full bg-white dark:bg-gray-900 "
              id="modulePrevious"
            />
          </button>
          <Xarrows
            start="moduleCurrent"
            end="modulePrevious"
            showHead={false}
            dashness
            color={arrowColor}
            startAnchor="auto"
            endAnchor="right"
          />
        </div>
      ) : (
        ""
      )}
      <div className="fixed bottom-2 right-2 z-10 rounded-full modscreen:absolute modscreen:top-1/3 modscreen:z-0">
        {module.parents.length > 0 ? (
          <button
            className={`${previousOpen || leadsToOpen ? "hidden" : "inline"} modscreen:hidden`}
            onClick={() => {
              setPreviousOpen(true)
            }}
          >
            <PreviousFilled
              size={32}
              className="h-10 w-10 rounded-full bg-white dark:bg-gray-900 "
            />
          </button>
        ) : (
          ""
        )}
        {module.children.length > 0 ? (
          <>
            <button
              // className="block mb-2"
              className={`${
                (previousOpen || leadsToOpen) && !biggerWindow ? "hidden" : "block"
              } mb-2`}
              onClick={() => {
                setLeadsToOpen(true)
              }}
            >
              <NextFilled
                size={32}
                className="h-10 w-10 rounded-full bg-white dark:bg-gray-900"
                id="moduleNext"
              />
            </button>
            <Xarrows
              start="moduleCurrent"
              end="moduleNext"
              showHead={false}
              dashness
              color={arrowColor}
              startAnchor="auto"
              endAnchor="left"
            />
          </>
        ) : (
          ""
        )}
        <button
          onClick={async () => {
            toast.promise(
              createNextModuleMutation({
                title: module.title,
                description: module.description,
                parentId: module.id,
                typeId: module.type.id,
                licenseId: module.license.id,
              }),
              {
                loading: "Creating draft...",
                success: (data) => {
                  refetch().then(() => {
                    router.push(`/drafts?suffix=${data}`)
                  })

                  return (
                    <>
                      Next step created.
                      <Link href={`/drafts?suffix=${data}`}>
                        <a className="ml-1 underline">View draft.</a>
                      </Link>
                    </>
                  )
                },
                error: "Sign up to do this",
              },
              { duration: 10000 }
            )
          }}
          className={`${(previousOpen || leadsToOpen) && !biggerWindow ? "hidden" : "inline"}`}
        >
          <AddAlt
            size={32}
            className="h-10 w-10 rounded-full bg-white dark:bg-gray-900 "
            id="moduleAdd"
          />
        </button>

        <Xarrows
          start="moduleCurrent"
          end="moduleAdd"
          showHead={false}
          dashness
          color={arrowColor}
          startAnchor="auto"
          endAnchor="left"
        />
      </div>
      <article className="my-4 mx-4 max-w-3xl md:mx-auto">
        <MetadataImmutable module={module} />
        {mainFile.name ? (
          <div className="my-8">
            <h2 className="text-lg">Main file</h2>
            <ViewFiles
              name={mainFile.name}
              size={mainFile.size}
              url={`/api/modules/main/${module.suffix}`}
            />
            {/* Preview image */}
            {mainFile.isImage ? (
              <img src={mainFile.cdnUrl} className="mx-auto my-2 h-auto w-full" />
            ) : (
              ""
            )}
            {/* Preview PDF */}
            {mainFile.mimeType === "application/pdf" ? (
              <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.14.305/build/pdf.worker.min.js">
                <div style={{ height: "750px" }} className="max-w-screen text-gray-900">
                  <Viewer fileUrl={mainFile.cdnUrl} />
                </div>
              </Worker>
            ) : (
              ""
            )}
            {/* Preview Markdown */}
            {mainFile.mimeType === "text/markdown" ? (
              <div className="coc">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm, remarkMath]}
                  rehypePlugins={[rehypeKatex]}
                  linkTarget="_blank"
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || "")
                      return !inline && match ? (
                        <SyntaxHighlighter
                          style={prefersDarkMode ? a11yDark : a11yLight}
                          language={match[1]}
                          PreTag="div"
                          class="coc"
                          customStyle={{
                            backgroundColor: prefersDarkMode ? "#374151" : "#f3f4f6",
                            padding: "0",
                            margin: "0",
                          }}
                          {...props}
                        >
                          {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      )
                    },
                  }}
                >
                  {mainFileMarkdown}
                </ReactMarkdown>
              </div>
            ) : (
              ""
            )}
            {/* Preview Office files */}
            {mainFile.mimeType === "application/vnd.ms-excel" ||
            mainFile.mimeType ===
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
            mainFile.mimeType ===
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ? (
              <iframe
                src={`https://view.officeapps.live.com/op/embed.aspx?src=${mainFile.cdnUrl}`}
                width="100%"
                height="800px"
                frameBorder="0"
              ></iframe>
            ) : (
              ""
            )}
          </div>
        ) : (
          ""
        )}
        <div className="mb-28 grid-cols-2 gap-x-4 md:grid">
          {supportingRaw.files.length > 0 ? (
            <div className="">
              <h2 className="text-lg">Supporting file(s)</h2>
              {supportingRaw.files.map((file) => (
                <>
                  <ViewFiles
                    name={file.original_filename}
                    size={file.size}
                    url={`/api/modules/supporting/${module.suffix}/${encodeURI(
                      file.original_filename
                    )}`}
                  />
                </>
              ))}
            </div>
          ) : (
            ""
          )}
          {module.references.length > 0 ? (
            <div className="">
              <h2 className="text-lg">Reference list</h2>
              <ol className="text-normal my-4 list-outside list-decimal pl-6">
                {module.references.map((reference) => (
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
                                  {index === reference!.authorsRaw!["object"].length - 1 ||
                                  index > 2
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
                      <Link
                        href={
                          reference.publishedWhere === "ResearchEquals"
                            ? Routes.ModulePage({ suffix: reference.suffix })
                            : reference.url!
                        }
                      >
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
        <ParentPanel openObject={previousOpen} openFunction={setPreviousOpen} module={module} />
        <ChildPanel openObject={leadsToOpen} openFunction={setLeadsToOpen} module={module} />
      </article>
      <Helmet>
        <script className="structured-data-list" type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            identifier: `${module.prefix}/${module.suffix}`,
            "@type": "CreativeWork",
            name: `${module.title}`,
            description: `${module.description}`,
            url: `https://doi.org/${module.prefix}/${module.suffix}`,
          })}
        </script>
      </Helmet>
    </>
  )
}

const ModulePage = ({ module }) => {
  const mainFile = module!.main as Prisma.JsonObject
  const supportingRaw = module!.supporting as Prisma.JsonObject

  const authorsOG = module.authors.map((author) => author.workspace.avatar)

  return (
    <Layout
      title={`R= ${module.title}`}
      headChildren={
        <>
          <meta property="og:title" content={module.title} />
          <meta property="og:url" content={`https://doi.org/${module.prefix}/${module.suffix}`} />
          {module.description ? (
            <meta property="og:description" content={module.description} />
          ) : (
            ""
          )}
          {module.license.name == "All rights reserved" ? (
            <meta name="robots" content="max-snippet:120" />
          ) : (
            <meta name="robots" content="max-snippet:-1" />
          )}
          {module.license.name == "All rights reserved" ? (
            <meta name="tdm-reservation" content="1" />
          ) : (
            <meta name="tdm-reservation" content="0" />
          )}
          <meta
            property="og:image"
            content={`https://ucarecdn.com/f65e7eca-bd38-48ab-ad79-ddcafa184431/`}
          />
          <meta
            property="og:image:secure_url"
            content={`https://ucarecdn.com/f65e7eca-bd38-48ab-ad79-ddcafa184431/`}
          />
          <meta
            property="og:image:alt"
            content={`Social media sharing image of the research module titled ${module.title}. It includes the type of module, ${module.type.name}, the DOI, ${module.prefix}/${module.suffix}, the license, ${module.license.name}, and a set of avatars for the ${module.authors.length} authors.`}
          />
          <meta name="twitter:card" content="summary_large_image" />
          <meta property="twitter:domain" content="researchequals.com" />
          <meta
            property="twitter:url"
            content={`https://doi.org/${module.prefix}/${module.suffix}`}
          />
          <meta name="twitter:title" content={module.title} />
          <meta name="twitter:description" content={module.description} />
          <meta
            name="twitter:image"
            content={`https://ucarecdn.com/f65e7eca-bd38-48ab-ad79-ddcafa184431/`}
          />
        </>
      }
    >
      <LayoutLoader>
        <Module module={module} mainFile={mainFile} supportingRaw={supportingRaw} />
      </LayoutLoader>
    </Layout>
  )
}

export default ModulePage
