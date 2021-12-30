import { Prisma } from "prisma"
import { NotFoundError } from "blitz"

import Layout from "../../core/layouts/Layout"
import db from "db"
import NavbarApp from "../../core/components/Navbar"
import ViewFiles from "../../modules/components/ViewFiles"
import MetadataImmutable from "../../modules/components/MetadataImmutable"

export async function getServerSideProps(context) {
  const module = await db.module.findFirst({
    where: {
      suffix: context.params.suffix.toLowerCase(),
      published: true,
    },
    include: {
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
      license: true,
      type: true,
      authors: {
        include: {
          workspace: true,
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
    <Layout title={`R=${module.title}`}>
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
        {/* Supporting files */}
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
        {/* PLACEHOLDER References */}
      </main>
    </Layout>
  )
}

export default ModulePage
