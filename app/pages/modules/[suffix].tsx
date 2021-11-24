import moment from "moment"
import {
  Share32,
  DocumentPdf32,
  AddAlt32,
  Flow32,
  Download32,
  TrashCan32,
} from "@carbon/icons-react"
import { Prisma } from "prisma"

import Layout from "../../core/layouts/Layout"
import db from "db"
import NavbarApp from "../../core/components/Navbar"
import { Link } from "blitz"
import MetadataView from "../../modules/components/MetadataView"
import ViewFiles from "../../modules/components/ViewFiles"
import ViewAuthors from "../../modules/components/ViewAuthors"
import FollowsFromView from "../../modules/components/FollowsFromView"
import LeadsToView from "../../modules/components/LeadsToView"
import AuthorAvatars from "../../modules/components/AuthorAvatars"

// TODO: Replace with getServerSideProps
export async function getStaticPaths() {
  const modules = await db.module.findMany({
    where: {
      published: {
        equals: true,
      },
    },
  })
  const pathObject = modules.map((module) => {
    return {
      params: {
        suffix: module.suffix,
      },
    }
  })
  console.log(pathObject)

  return {
    paths: pathObject,
    fallback: false,
  }
}

export async function getStaticProps(context) {
  const module = await db.module.findFirst({
    where: {
      suffix: context.params.suffix,
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

  return {
    props: {
      module,
    }, // will be passed to the page component as props
  }
}

const ModulePage = ({ module }) => {
  const mainFile = module!.main as Prisma.JsonObject
  const supportingRaw = module!.supporting as Prisma.JsonObject

  return (
    <Layout title={`R=${module.title}`}>
      <NavbarApp />
      <div className="max-w-7xl mx-auto my-4">
        <div className="w-full bg-gray-300 flex">
          <div className="flex-grow"></div>
          <Share32 />
          <DocumentPdf32 />
          <AddAlt32 />
        </div>
        <div className="text-center">
          Published {moment(module.publishedAt).fromNow()} ({module.publishedAt.toUTCString()})
        </div>
        <div className="w-full flex my-8">
          <FollowsFromView module={module} />
          <svg
            className="fill-current text-black w-8 h-8 mx-4 "
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M27 13L32 15.8868L27 18.7735V16.3868H26C21.5298 16.3868 17.7807 19.4742 16.7689 23.6331C16.6473 23.0488 16.4793 22.4815 16.2689 21.9352C17.83 18.0946 21.5988 15.3868 26 15.3868H27V13Z"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M6 16.3867H0V15.3867H6C11.799 15.3867 16.5 20.0877 16.5 25.8867V26.8867H18.8868L16 31.8867L13.1132 26.8867H15.5V25.8867C15.5 20.64 11.2467 16.3867 6 16.3867Z"
            />
          </svg>
          <LeadsToView module={module} />
        </div>
        {/* metadata */}
        <MetadataView module={module} />

        {/* main file */}
        <div className="flex border-t border-b border-gray-800 mt-2 py-2">
          <div className="flex-grow flex -space-x-2 relative z-0 overflow-hidden">
            <AuthorAvatars module={module} />
          </div>
          <ViewAuthors button="button" module={module} />
        </div>
        <div>
          <div>
            <h2>Main file</h2>
            <ViewFiles name={mainFile.name} size={mainFile.size} url={mainFile.cdnUrl} />
          </div>
          <div className="pb-16">
            <h2>Supporting files</h2>
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
        </div>
      </div>
    </Layout>
  )
}

export default ModulePage
