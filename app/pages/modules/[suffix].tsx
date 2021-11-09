import moment from "moment"
import {
  Share32,
  DocumentPdf32,
  AddAlt32,
  Flow32,
  Download32,
  TrashCan32,
} from "@carbon/icons-react"

import Layout from "../../core/layouts/Layout"
import db from "db"
import NavbarApp from "../../core/components/Navbar"

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
      parents: true,
      children: true,
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
  return (
    <Layout title={`R= ${module.title}`}>
      <NavbarApp />
      <div className="max-w-7xl mx-auto">
        <div className="w-full bg-gray-300 flex">
          <div className="flex-grow"></div>
          <Share32 />
          <DocumentPdf32 />
          <AddAlt32 />
        </div>
        <div className="text-center">
          Published {moment(module.publishedAt).fromNow()} ({module.publishedAt.toUTCString()})
        </div>
        <div className="w-full bg-gray-500 flex">
          <div className="flex-grow flex">
            Follows from:
            {module.parents.map((parent) => (
              <div key={parent.title + "object"} className="bg-gray-200 w-full">
                [{parent.type}] {parent.title}
              </div>
            ))}
          </div>
          <Flow32 className="transform rotate-180" />
          <div className="flex-grow flex">
            Leads to:
            {module.children.map((children) => (
              <div key={children.title + "object"} className="bg-gray-200 w-full">
                [{children.type}] {children.title}
              </div>
            ))}
          </div>
        </div>
        {/* parent/child bar */}
        {/* metadata */}
        {/* main file */}
        <div className="w-full">
          <p>{module.type}</p>
          <h1>{module.title}</h1>
        </div>
        <div className="border-t-2 border-gray-400 flex">
          <span className="flex-grow">
            {module.authors.map((author) => (
              <>
                <img
                  className="relative z-30 inline-block h-6 w-6 rounded-full ring-2 ring-white"
                  key={author.name}
                  src={author.workspace.avatar}
                />
                <img
                  className="relative z-30 inline-block h-6 w-6 rounded-full ring-2 ring-white"
                  key={author.name}
                  src={author.workspace.avatar}
                />
                <img
                  className="relative z-30 inline-block h-6 w-6 rounded-full ring-2 ring-white"
                  key={author.name}
                  src={author.workspace.avatar}
                />
                <img
                  className="relative z-30 inline-block h-6 w-6 rounded-full ring-2 ring-white"
                  key={author.name}
                  src={author.workspace.avatar}
                />
              </>
            ))}
          </span>
          <button className="px-4 py-2 text-white bg-indigo-600">View authors</button>
        </div>
        <div>
          <p>{module.description}</p>
        </div>
        <div>
          <div>
            <h2>Main file</h2>
            <div className="flex">
              <p className="flex-grow border-2 border-gray-800 flex">
                <span className="flex-grow">Filename</span>
                <span>4KB</span>
              </p>
              <Download32 className="w-6 h-6" />
              <TrashCan32 className="w-6 h-6" />
            </div>
          </div>
          <div>
            <h2>Supporting files</h2>
            <div className="flex">
              <p className="flex-grow border-2 border-gray-800 flex">
                <span className="flex-grow">Filename</span>
                <span>4KB</span>
              </p>
              <Download32 className="w-6 h-6" />
              <TrashCan32 className="w-6 h-6" />
            </div>
            <div className="flex">
              <p className="flex-grow border-2 border-gray-800 flex">
                <span className="flex-grow">Filename</span>
                <span>4KB</span>
              </p>
              <Download32 className="w-6 h-6" />
              <TrashCan32 className="w-6 h-6" />
            </div>
            <div className="flex">
              <p className="flex-grow border-2 border-gray-800 flex">
                <span className="flex-grow">Filename</span>
                <span>4KB</span>
              </p>
              <Download32 className="w-6 h-6" />
              <TrashCan32 className="w-6 h-6" />
            </div>
            <div className="flex">
              <p className="flex-grow border-2 border-gray-800 flex">
                <span className="flex-grow">Filename</span>
                <span>4KB</span>
              </p>
              <Download32 className="w-6 h-6" />
              <TrashCan32 className="w-6 h-6" />
            </div>
          </div>
        </div>
        {/* supplemental files */}
        {/* references */}
        {/* footer */}
        {/* doi */}
        {/* license */}
        <footer>
          <div>DOI: 10.53962/{module.suffix}</div>
          <div>{module.license}</div>
        </footer>
      </div>
      {/* <div>{JSON.stringify(module)}</div> */}
    </Layout>
  )
}

export default ModulePage
