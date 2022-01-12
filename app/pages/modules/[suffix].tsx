import { Prisma } from "prisma"
import { Link, NotFoundError, Routes } from "blitz"

import Layout from "../../core/layouts/Layout"
import db from "db"
import NavbarApp from "../../core/components/Navbar"
import ViewFiles from "../../modules/components/ViewFiles"
import MetadataImmutable from "../../modules/components/MetadataImmutable"
import LayoutLoader from "app/core/components/LayoutLoader"

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
        include: {
          type: true,
          authors: {
            include: {
              workspace: true,
            },
          },
        },
      },
      children: {
        include: {
          type: true,
          authors: {
            include: {
              workspace: true,
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

const ModulePage = ({ module }) => {
  const mainFile = module!.main as Prisma.JsonObject
  const supportingRaw = module!.supporting as Prisma.JsonObject

  return (
    <Layout
      title={`R=${module.title}`}
      headChildren={
        <>
          <meta property="og:title" content={module.title} />
          <meta property="og:url" content={`https://doi.org/${module.prefix}/${module.suffix}`} />
          {module.description ? (
            <meta property="og:description" content={module.description} />
          ) : (
            ""
          )}
        </>
      }
    >
      <LayoutLoader>
        <NavbarApp />
        <main className="max-w-7xl sm:mx-auto my-4 mx-4">
          <div className="w-full flex">
            {/* Push all menu bars to the right */}
            <div className="flex-grow"></div>
            <div>
              {/* TODO: Add actions */}
              {/* <AddAlt24 className="h-6 w-6 fill-current text-gray-300 dark:text-gray-600" /> */}
            </div>
          </div>
          <MetadataImmutable module={module} />
          {mainFile.name ? (
            <div className="my-8">
              <h2 className="">Main file</h2>
              <ViewFiles name={mainFile.name} size={mainFile.size} url={mainFile.cdnUrl} />
            </div>
          ) : (
            ""
          )}
          {supportingRaw.files.length > 0 ? (
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
          <div className="my-3">
            <h2>Reference list</h2>
            <ol className="list-decimal list-inside my-4 text-normal">
              {module.references.map((reference) => (
                <>
                  <li>
                    {reference.publishedWhere === "ResearchEquals" ? (
                      <>
                        {reference.authors.map((author, index) => (
                          <>
                            <Link href={Routes.HandlePage({ handle: author!.workspace!.handle })}>
                              <a target="_blank">
                                {author!.workspace!.firstName} {author!.workspace!.lastName}
                              </a>
                            </Link>
                            {index === reference.authors.length - 1 ? "" : ", "}
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
                                  ? `${author.given} ${author.family}`
                                  : `${author.name}`}
                                {index === reference!.authorsRaw!["object"].length - 1 || index > 2
                                  ? ""
                                  : ", "}
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
                    ({reference.publishedAt?.toISOString().substr(0, 10)}). {reference.title}.{" "}
                    <Link href={reference.url!}>
                      <a target="_blank underline">{reference.url}</a>
                    </Link>
                    . <span className="italic">{reference.publishedWhere}</span>
                  </li>
                </>
              ))}
            </ol>
          </div>
        </main>
      </LayoutLoader>
    </Layout>
  )
}

export default ModulePage
