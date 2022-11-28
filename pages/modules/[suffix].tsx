import { gSSP } from "app/blitz-server"
import Link from "next/link"
import { useSession } from "@blitzjs/auth"
import { useRouter } from "next/router"
import { useMutation, useQuery } from "@blitzjs/rpc"
import { Routes } from "@blitzjs/next"
import { Prisma } from "prisma"
import { AddAlt, NextFilled, PreviousFilled } from "@carbon/icons-react"
import Xarrows from "react-xarrows"
import { useEffect, useState } from "react"
import Helmet from "react-helmet"
import FilePreviewer from "app/core/components/FilePreviewer"

import Layout from "app/core/layouts/Layout"
import db from "db"
import Navbar from "app/core/components/Navbar"
import ViewFiles from "app/modules/components/ViewFiles"
import MetadataImmutable from "app/modules/components/MetadataImmutable"
import LayoutLoader from "app/core/components/LayoutLoader"
import getInvitedModules from "app/workspaces/queries/getInvitedModules"
import getDrafts from "app/core/queries/getDrafts"
import { useCurrentWorkspace } from "app/core/hooks/useCurrentWorkspace"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import { useMediaPredicate } from "react-media-hook"
import ChildPanel from "app/modules/components/ChildPanel"
import ParentPanel from "app/modules/components/ParentPanel"
import toast from "react-hot-toast"
import createNextModule from "app/modules/mutations/createNextModule"
import { NotFoundError } from "blitz"

export const getServerSideProps = gSSP(async function getServerSideProps(context) {
  const currentModule = await db.module.findFirst({
    where: {
      suffix: context?.params?.suffix?.toString().toLowerCase(),
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

  if (!currentModule) throw new NotFoundError()
  return {
    props: {
      currentModule,
    },
  }
})

const Module = ({ currentModule, mainFile, supportingRaw }) => {
  const currentUser = useCurrentUser()
  const session = useSession()
  const currentWorkspace = useCurrentWorkspace()
  const router = useRouter()
  const [drafts, { refetch }] = useQuery(getDrafts, { session })
  const [invitations] = useQuery(getInvitedModules, { session })
  const prefersDarkMode = useMediaPredicate("(prefers-color-scheme: dark)")
  const biggerWindow = useMediaPredicate("(min-width: 916px)")
  const [previousOpen, setPreviousOpen] = useState(false)
  const [leadsToOpen, setLeadsToOpen] = useState(false)
  const [createNextModuleMutation] = useMutation(createNextModule)
  const [mainFileMarkdown, setMarkdown] = useState("")

  let arrowColor
  if (biggerWindow) {
    arrowColor = prefersDarkMode ? "white" : "#0f172a"
  } else {
    arrowColor = "transparent"
  }

  useEffect(() => {
    if (mainFile.mimeType === "text/markdown") {
      fetch(mainFile.cdnUrl)
        .then((response) => response.text())
        .then((body) => setMarkdown(body))
        .catch((error) => {
          console.log(error)
        })
    }
  }, [])

  return (
    <>
      <Navbar
        currentUser={currentUser}
        session={session}
        currentWorkspace={currentWorkspace}
        router={router}
        drafts={drafts}
        invitations={invitations}
        refetchFn={refetch}
      />
      {currentModule.parents.length > 0 ? (
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
        {currentModule.parents.length > 0 ? (
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
        {currentModule.children.length > 0 ? (
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
            await toast
              .promise(
                createNextModuleMutation({
                  title: currentModule.title,
                  description: currentModule.description,
                  parentId: currentModule.id,
                  typeId: currentModule.type.id,
                  licenseId: currentModule.license.id,
                }),
                {
                  loading: "Creating draft...",
                  success: (data) => (
                    <>
                      Next step created.
                      <Link href={`/drafts?suffix=${data}`}>
                        <a className="ml-1 underline">View draft.</a>
                      </Link>
                    </>
                  ),
                  error: "Sign up to do this",
                },
                { duration: 10000 }
              )
              .then(async (data) => {
                await refetch().then(async () => {
                  await router.push(`/drafts?suffix=${data}`)
                })
              })
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
        <MetadataImmutable currentModule={currentModule} />
        <div className="my-8">
          <h2 className="text-lg">Main file</h2>
          <ViewFiles
            name={mainFile.name}
            size={mainFile.size}
            url={`/api/modules/main/${currentModule.suffix}`}
          />
          <FilePreviewer module={currentModule} mainFile={mainFile} />
        </div>
        <div className="mb-28 grid-cols-2 gap-x-4 md:grid">
          {supportingRaw.files.length > 0 ? (
            <div className="">
              <h2 className="text-lg">Supporting file(s)</h2>
              {supportingRaw.files.map((file) => (
                <>
                  <ViewFiles
                    name={file.original_filename}
                    size={file.size}
                    url={`/api/modules/supporting/${currentModule.suffix}/${encodeURI(
                      file.original_filename
                    )}`}
                  />
                </>
              ))}
            </div>
          ) : (
            ""
          )}
          {currentModule.references.length > 0 ? (
            <div className="">
              <h2 className="text-lg">Reference list</h2>
              <ol className="text-normal my-4 list-outside list-decimal pl-6">
                {currentModule.references.map((reference) => (
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
                      ({reference.publishedAt?.substr(0, 4)}).{" "}
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
        <ParentPanel
          openObject={previousOpen}
          openFunction={setPreviousOpen}
          module={currentModule}
        />
        <ChildPanel openObject={leadsToOpen} openFunction={setLeadsToOpen} module={currentModule} />
      </article>
      <Helmet>
        <script className="structured-data-list" type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            identifier: `${currentModule.prefix}/${currentModule.suffix}`,
            "@type": "CreativeWork",
            name: `${currentModule.title}`,
            description: `${currentModule.description}`,
            url: `https://doi.org/${currentModule.prefix}/${currentModule.suffix}`,
          })}
        </script>
      </Helmet>
    </>
  )
}

const ModulePage = ({ currentModule }) => {
  const mainFile = currentModule!.main as Prisma.JsonObject
  const supportingRaw = currentModule!.supporting as Prisma.JsonObject

  const authorsOG = currentModule.authors.map((author) => author.workspace.avatar)

  return (
    <Layout
      title={`R= ${currentModule.title}`}
      headChildren={
        <>
          <meta property="og:title" content={currentModule.title} />
          <meta
            property="og:url"
            content={`https://doi.org/${currentModule.prefix}/${currentModule.suffix}`}
          />
          {currentModule.description ? (
            <meta property="og:description" content={currentModule.description} />
          ) : (
            ""
          )}
          {currentModule.license.name == "All rights reserved" ? (
            <meta name="robots" content="max-snippet:120" />
          ) : (
            <meta name="robots" content="max-snippet:-1" />
          )}
          {currentModule.license.name == "All rights reserved" ? (
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
            content={`Social media sharing image of the research module titled ${currentModule.title}. It includes the type of module, ${currentModule.type.name}, the DOI, ${currentModule.prefix}/${currentModule.suffix}, the license, ${currentModule.license.name}, and a set of avatars for the ${currentModule.authors.length} authors.`}
          />
          <meta name="twitter:card" content="summary_large_image" />
          <meta property="twitter:domain" content="researchequals.com" />
          <meta
            property="twitter:url"
            content={`https://doi.org/${currentModule.prefix}/${currentModule.suffix}`}
          />
          <meta name="twitter:title" content={currentModule.title} />
          <meta name="twitter:description" content={currentModule.description} />
          <meta
            name="twitter:image"
            content={`https://ucarecdn.com/f65e7eca-bd38-48ab-ad79-ddcafa184431/`}
          />
          {/* Zotero Metadata - TODO: Refactor these meta tags */}
          {/* https://www.zotero.org/support/dev/exposing_metadata */}
          <meta name="citation_title" content={currentModule.title} key="citation_title" />
          <meta name="citation_date" content={currentModule.publishedAt} key="citation_date" />
          <meta
            name="citation_journal_title"
            content="ResearchEquals"
            key="citation_journal_title"
          />
          <meta
            name="citation_publisher"
            content="Liberate Science GmbH"
            key="citation_publisher"
          />
          <meta
            name="citation_doi"
            content={`10.53962/${currentModule.suffix}`}
            key="citation_doi"
          />
          <meta
            name="citation_public_url"
            content={`https://doi.org/10.53962/${currentModule.suffix}`}
            key="citation_public_url"
          />
          <meta
            name="citation_abstract"
            content={currentModule.description}
            key="citation_abstract"
          />
          <meta name="citation_language" content={currentModule.language} key="citation_language" />
          {currentModule.authors.map((author) => (
            <meta
              key={author.id}
              name="citation_author"
              content={`${author.workspace.lastName}, ${author.workspace.firstName}`}
            />
          ))}
          {mainFile.mimeType.startsWith("application/pdf") && (
            <meta name="citation_pdf_url" content={mainFile.cdnUrl} key="citation_pdf_url" />
          )}
        </>
      }
    >
      <LayoutLoader>
        <Module currentModule={currentModule} mainFile={mainFile} supportingRaw={supportingRaw} />
      </LayoutLoader>
    </Layout>
  )
}

export default ModulePage
