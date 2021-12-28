import { Fragment, useState } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { XIcon } from "@heroicons/react/outline"
import { Link, Routes } from "blitz"
import moment from "moment"

import ModuleCard from "../../core/components/ModuleCard"

const FollowsFromView = ({ module }) => {
  const [followsFromOpen, setFollowsFromOpen] = useState(false)

  return (
    <>
      <Transition.Root show={followsFromOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 overflow-hidden"
          onClose={() => {
            setFollowsFromOpen(false)
          }}
        >
          <div className="absolute inset-0 overflow-hidden">
            <Dialog.Overlay className="absolute inset-0" />

            <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <div className="w-screen max-w-md">
                  <div className="h-full flex flex-col py-6 bg-gray-300 shadow-xl overflow-y-scroll">
                    <div className="px-4 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-lg font-medium text-gray-900">
                          Parent modules
                        </Dialog.Title>
                        <div className="ml-3 h-7 flex items-center">
                          <button
                            type="button"
                            className=" rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            onClick={() => setFollowsFromOpen(false)}
                          >
                            <span className="sr-only">Close panel</span>
                            <XIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 relative flex-1 px-4 sm:px-6">
                      {/* Replace with your content */}
                      {module.parents.map((parent) => (
                        <>
                          <Link href={Routes.ModulePage({ suffix: parent.suffix })}>
                            <a target="_blank">
                              <ModuleCard
                                type={parent.type.name}
                                title={parent.title}
                                status={`10.53962/${parent.suffix}`}
                                time={moment(parent.publishedAt).fromNow()}
                                timeText="Published"
                                authors={parent.authors}
                              />
                            </a>
                          </Link>
                        </>
                      ))}
                      {/* /End replace */}
                    </div>
                  </div>
                </div>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
      <div className="flex-grow flex">
        <div className="flex w-full">
          Follows from:
          {module.parents.length > 0 ? (
            <span
              className="flex-grow cursor-pointer bg-gray-100 hover:bg-gray-50 ml-2 pl-2 border border-gray-500 rounded"
              onClick={() => {
                setFollowsFromOpen(true)
              }}
            >
              <div
                key={module.parents[0].title + "object"}
                className="inline-block align-middle w-full"
              >
                <div className="flex">
                  <span className="flex-grow">
                    [{module.parents[0].type.name}] {module.parents[0].title}
                  </span>
                  <span className="mx-2">[...]</span>
                </div>
              </div>
            </span>
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  )
}

export default FollowsFromView
