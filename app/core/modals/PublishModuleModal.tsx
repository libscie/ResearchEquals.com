import { Link, useMutation, useRouter } from "blitz"
import { Fragment, useState } from "react"
import { Dialog, Switch, Transition } from "@headlessui/react"
import { CheckmarkOutline32 } from "@carbon/icons-react"
import { Close32, Checkmark32 } from "@carbon/icons-react"

import publishModule from "../../modules/mutations/publishModule"
import toast from "react-hot-toast"

function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}

export default function PublishModule({ module, user, workspace }) {
  let [isOpen, setIsOpen] = useState(false)
  const [waiver, setWaiver] = useState(false)

  const [publishModuleMutation] = useMutation(publishModule)
  const router = useRouter()
  const publishCount =
    workspace.authorships.filter((authorship) => authorship.module.published).length + 1

  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
  }

  return (
    <>
      <div className="rounded-md bg-green-50 dark:bg-green-800 w-full p-2 flex my-4">
        <div className="flex-shrink-0 inline-block align-middle">
          <CheckmarkOutline32
            className="stroke-current h-5 w-5 text-green-500 dark:text-green-200 inline-block align-middle"
            aria-hidden="true"
          />
        </div>
        <div className="ml-3 flex-grow text-green-800 dark:text-green-100">
          <h3 className="text-sm leading-4 font-normal text-green-800 dark:text-green-100 inline-block align-middle">
            This module is ready for publication. Would you like to{" "}
            {module.license.price > 0 ? "pay and" : ""} publish it now?
          </h3>
        </div>
        <div className="">
          <button
            type="button"
            className="border rounded border-green-500 text-green-500 dark:border-green-200 dark:text-green-200 px-2 py-1.5 text-sm leading-4 font-medium hover:bg-green-100 dark:hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-50 focus:ring-green-600"
            onClick={openModal}
          >
            Publish module
          </button>
        </div>
      </div>
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
              <Dialog.Overlay className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" />
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
              <div className="inline-block rounded w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform shadow-xl text-gray-900 dark:text-gray-200 bg-white dark:bg-gray-900 dark:border border-gray-300 dark:border-gray-600">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6">
                  Confirm publication
                </Dialog.Title>
                {module.license.price === 0 ? (
                  <>
                    <div className="mt-2">
                      <p className="text-base text-gray-500 dark:text-gray-300">
                        Once you publish this module, you cannot delete it. You can publish this
                        module for free.
                      </p>
                    </div>
                    <div className="mt-4">
                      <button
                        type="button"
                        data-splitbee-event={`Publish module ${publishCount}`}
                        className="inline-flex justify-center mr-2 py-2 px-4 bg-green-50 dark:bg-gray-800 text-green-700 dark:text-green-500 hover:bg-green-200 dark:hover:bg-gray-700 dark:border dark:border-gray-600 dark:hover:border-gray-400 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-green-500"
                        onClick={async () => {
                          await toast.promise(publishModuleMutation({ id: module.id }), {
                            loading: "Publishing...",
                            success: "Published!",
                            error: "Uh-oh something went wrong.",
                          })
                          router.push(`/modules/${module.suffix}`)
                        }}
                      >
                        Publish
                      </button>
                      <button
                        type="button"
                        className="inline-flex justify-center mr-2 py-2 px-4 bg-red-50 dark:bg-gray-800 text-red-700 dark:text-red-500 hover:bg-red-200 dark:hover:bg-gray-700 dark:border dark:border-gray-600 dark:hover:border-gray-400 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-red-500"
                        onClick={closeModal}
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <form
                      action={`/api/checkout_sessions?email=${encodeURIComponent(
                        user.email
                      )}&price_id=${module.license.price_id}&suffix=${module.suffix}&module_id=${
                        module.id
                      }`}
                      method="POST"
                    >
                      <div className="mt-2">
                        <p className="text-base text-gray-500 dark:text-gray-300">
                          Once you publish this module, you cannot delete it. Because you chose a{" "}
                          {module.license.name} license, publishing costs{" "}
                          {module.license.price / 100} euro (incl. VAT).
                        </p>
                      </div>
                      <div className="flex my-4">
                        <Switch
                          checked={waiver}
                          onChange={setWaiver}
                          className={classNames(
                            waiver ? "bg-green-600" : "bg-gray-200 dark:bg-gray-700",
                            "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-green-500"
                          )}
                        >
                          <span className="sr-only">Waive right to withdrawal</span>
                          <span
                            className={classNames(
                              waiver ? "translate-x-5" : "translate-x-0",
                              "pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
                            )}
                          >
                            <span
                              className={classNames(
                                waiver
                                  ? "opacity-0 ease-out duration-100"
                                  : "opacity-100 ease-in duration-200",
                                "absolute inset-0 h-full w-full flex items-center justify-center transition-opacity"
                              )}
                              aria-hidden="true"
                            >
                              <Close32 className="h-3 w-3 text-gray-400 stroke-2 stroke-current" />
                            </span>
                            <span
                              className={classNames(
                                waiver
                                  ? "opacity-100 ease-in duration-200"
                                  : "opacity-0 ease-out duration-100",
                                "absolute inset-0 h-full w-full flex items-center justify-center transition-opacity"
                              )}
                              aria-hidden="true"
                            >
                              <Checkmark32 className="h-3 w-3 text-green-600 stroke-2 stroke-current" />
                            </span>
                          </span>
                        </Switch>
                        <p className=" mx-2 text-sm text-gray-500 dark:text-gray-300">
                          Yes, I agree that Liberate Science GmbH publishes the content immediately
                          and irrevocably. I knowingly consent to waive my{" "}
                          <Link href="/right-of-withdrawal">
                            <a className="underline" target="_blank">
                              right of withdrawal
                            </a>
                          </Link>{" "}
                          by completing my purchase.
                        </p>
                      </div>
                      <div className="mt-4">
                        <button
                          type="submit"
                          role="link"
                          data-splitbee-event={`Publish module ${publishCount}`}
                          className="inline-flex justify-center mr-2 py-2 px-4 bg-green-50 dark:bg-gray-800 text-green-700 dark:text-green-500 hover:bg-green-200 dark:hover:bg-gray-700 dark:border dark:border-gray-600 dark:hover:border-gray-400 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={!waiver}
                        >
                          Pay and Publish
                        </button>
                        <button
                          type="button"
                          className="inline-flex justify-center mr-2 py-2 px-4 bg-red-50 dark:bg-gray-800 text-red-700 dark:text-red-500 hover:bg-red-200 dark:hover:bg-gray-700 dark:border dark:border-gray-600 dark:hover:border-gray-400 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-red-500"
                          onClick={closeModal}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </>
                )}
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
