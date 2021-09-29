import { getSession, useMutation, useRouter } from "blitz"
import { Dialog, Transition } from "@headlessui/react"
import { Fragment, useState } from "react"
import Layout from "../../core/layouts/Layout"
import db from "db"
import publishModule from "app/modules/mutations/publishModule"
import NavbarApp from "../../core/components/navbarApp"

export const getServerSideProps = async ({ params, req, res }) => {
  const session = await getSession(req, res)

  const suffix = params!.suffix
  const module = await db.module.findFirst({
    where: { suffix },
    include: {
      authors: true,
    },
  })

  // Throw 404 if
  // 1. Module does not exist
  // 2. Module exists but is unpublished and not authored by current workspace
  if (
    !module ||
    (module.published === false &&
      !(module.authors.filter((e) => e.workspaceId === session.$publicData.workspaceId).length > 0))
  ) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      module,
      isAuthor: module.authors.filter((e) => e.workspaceId === session.$publicData.workspaceId)
        .length,
    },
  }
}

const ModulePage = ({ module, isAuthor }) => {
  const [publishMutation] = useMutation(publishModule)
  const router = useRouter()
  let [isOpen, setIsOpen] = useState(false)

  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
  }

  return (
    <Layout title={`R= ${module.title}`}>
      <NavbarApp />
      <div className="flex justify-center items-center">
        <h1>{module.title}</h1>
        <p>{module.description}</p>
      </div>
      {isAuthor && !module.published ? (
        <>
          <button
            className="px-4 py-2 bg-indigo-500 text-white hover:bg-indigo-300"
            onClick={openModal}
            // async () => {
            //   await publishMutation({ id: module.id })
            //   router.reload()
            // }}
          >
            Publish
          </button>
          <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={closeModal}>
              <div className="min-h-screen px-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                {/* This element is to trick the browser into centering the modal contents. */}
                <span className="inline-block h-screen align-middle" aria-hidden="true">
                  &#8203;
                </span>
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                    <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                      Confirm
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        When all authors approve the current version, the research module will be
                        automatically published.
                      </p>
                      <p className="text-sm text-gray-500">
                        If any of your co-authors makes a change, you will have to re-approve for
                        publication.
                      </p>
                    </div>

                    <div className="mt-4">
                      <button
                        type="button"
                        className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 mr-4"
                        onClick={async () => {
                          await publishMutation({ id: module.id })
                          router.reload()
                          // closeModal()
                        }}
                      >
                        Approve for publishing
                      </button>
                      <button
                        type="button"
                        className="inline-flex justify-center px-4 py-2 text-sm font-medium text-red-900 bg-red-100 border border-transparent rounded-md hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500"
                        onClick={closeModal}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </Transition.Child>
              </div>
            </Dialog>
          </Transition>
        </>
      ) : (
        ""
      )}
      <div>{JSON.stringify(module)}</div>
    </Layout>
  )
}

export default ModulePage
