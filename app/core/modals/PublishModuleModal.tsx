import { Link, useMutation, useRouter } from "blitz"
import { Fragment, useState } from "react"
import { Dialog, Switch, Transition } from "@headlessui/react"
import { CheckmarkOutline } from "@carbon/icons-react"
import { Close, Checkmark } from "@carbon/icons-react"

import publishModule from "../../modules/mutations/publishModule"
import toast from "react-hot-toast"

function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}

export default function PublishModule({ module, user, workspace }) {
  let [isOpen, setIsOpen] = useState(false)
  const [waiver, setWaiver] = useState(false)
  const [payWhat, setPayWhat] = useState(0)

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
      <div className="my-4 flex w-full rounded-md bg-emerald-50 p-2 dark:bg-emerald-800">
        <div className="inline-block shrink-0 align-middle">
          <CheckmarkOutline
            size={32}
            className="inline-block h-5 w-5 stroke-current align-middle text-emerald-500 dark:text-emerald-200"
            aria-hidden="true"
          />
        </div>
        <div className="ml-3 flex-grow text-emerald-800 dark:text-emerald-100">
          <h3 className="inline-block align-middle text-sm font-normal leading-4 text-emerald-800 dark:text-emerald-100">
            This module is ready for publication. Would you like to{" "}
            {module.license.price > 0 ? "pay and" : ""} publish it now?
          </h3>
        </div>
        <div className="">
          <button
            type="button"
            className="rounded border border-emerald-500 px-2 py-1.5 text-sm font-medium leading-4 text-emerald-500 hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 focus:ring-offset-emerald-50 dark:border-emerald-200 dark:text-emerald-200 dark:hover:bg-emerald-900"
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
              <div className="my-8 inline-block w-full max-w-md transform overflow-hidden rounded border-gray-300 bg-white p-6 text-left align-middle text-gray-900 shadow-xl transition-all dark:border dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6">
                  Confirm publication
                </Dialog.Title>
                {module.license.price === 0 ? (
                  <>
                    <div className="mt-2">
                      <p className="text-base text-gray-500 dark:text-gray-300">
                        Once you publish this module, you cannot delete it.
                      </p>
                      <p className="text-base text-gray-500 dark:text-gray-300">
                        You can publish this module for free or support us with an amount of your
                        choice (incl. VAT).
                      </p>
                      <span className="my-2 flex w-full flex-col">
                        <input
                          id="pay-what-you-want"
                          type="range"
                          className="pwyw"
                          value={payWhat}
                          max={100}
                          onChange={(value) => {
                            setPayWhat(parseInt(value.target.value))
                          }}
                        ></input>
                        <label className="sr-only" htmlFor="pay-what-you-want">
                          Pay what you want price
                        </label>
                        <span className="my-2 flex text-sm text-gray-500 dark:text-gray-200">
                          I want to support Researchequals with
                          <p className="flex">
                            <span className="inline-block h-full align-middle"></span>
                            <p className="my-auto mx-1 inline-block align-middle text-base">
                              &euro;
                            </p>
                            <input
                              type="text"
                              id="name"
                              name="name"
                              required
                              value={payWhat}
                              className="placeholder-font-normal block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-sm font-normal placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500  dark:border-gray-500 dark:bg-gray-800"
                              onChange={(value) => {
                                setPayWhat(parseInt(value.target.value) || 0)
                              }}
                            />
                            <div className="w-full">
                              <span className="inline-block h-full align-middle"></span>
                              <p className="my-auto mx-1 inline-block align-middle text-sm">
                                (incl. VAT)
                              </p>
                            </div>
                          </p>
                        </span>
                      </span>
                    </div>
                    <div className="mt-4">
                      <div
                        className={`my-4 flex ${
                          payWhat === 0 ? "cursor-not-allowed opacity-50" : ""
                        }`}
                      >
                        <Switch
                          checked={waiver}
                          onChange={setWaiver}
                          disabled={payWhat === 0 ? true : false}
                          className={classNames(
                            waiver ? "bg-emerald-600" : "bg-gray-200 dark:bg-gray-700",
                            "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-0 disabled:opacity-30"
                          )}
                        >
                          <span className="sr-only">Waive right to withdrawal</span>
                          <span
                            className={classNames(
                              waiver ? "translate-x-5" : "translate-x-0",
                              "pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                            )}
                          >
                            <span
                              className={classNames(
                                waiver
                                  ? "opacity-0 duration-100 ease-out"
                                  : "opacity-100 duration-200 ease-in",
                                "absolute inset-0 flex h-full w-full items-center justify-center transition-opacity"
                              )}
                              aria-hidden="true"
                            >
                              <Close
                                size={32}
                                className="h-3 w-3 stroke-current stroke-2 text-gray-400"
                              />
                            </span>
                            <span
                              className={classNames(
                                waiver
                                  ? "opacity-100 duration-200 ease-in"
                                  : "opacity-0 duration-100 ease-out",
                                "absolute inset-0 flex h-full w-full items-center justify-center transition-opacity"
                              )}
                              aria-hidden="true"
                            >
                              <Checkmark
                                size={32}
                                className="h-3 w-3 stroke-current stroke-2 text-emerald-600"
                              />
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
                      {payWhat > 0 ? (
                        <form
                          action={`/api/checkout_sessions?email=${encodeURIComponent(
                            user.email
                          )}&prod_id=${module.license.prod_id}&price_data=${payWhat}&suffix=${
                            module.suffix
                          }&module_id=${module.id}`}
                          method="POST"
                        >
                          <div className="mt-4">
                            <button
                              type="submit"
                              role="link"
                              data-splitbee-event={`Publish module`}
                              className="mr-2 inline-flex justify-center rounded-md bg-emerald-50 py-2 px-4 text-sm font-medium text-emerald-700 hover:bg-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 dark:border dark:border-gray-600 dark:bg-gray-800 dark:text-emerald-500 dark:hover:border-gray-400 dark:hover:bg-gray-700"
                              disabled={!waiver}
                            >
                              Pay and Publish
                            </button>
                            <button
                              type="button"
                              className="mr-2 inline-flex justify-center rounded-md bg-red-50 py-2 px-4 text-sm font-medium text-red-700 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-0 dark:border dark:border-gray-600 dark:bg-gray-800 dark:text-red-500 dark:hover:border-gray-400 dark:hover:bg-gray-700"
                              onClick={closeModal}
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      ) : (
                        <>
                          <button
                            type="button"
                            data-splitbee-event={`Publish module`}
                            className="mr-2 inline-flex justify-center rounded-md bg-emerald-50 py-2 px-4 text-sm font-medium text-emerald-700 hover:bg-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-0 dark:border dark:border-gray-600 dark:bg-gray-800 dark:text-emerald-500 dark:hover:border-gray-400 dark:hover:bg-gray-700"
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
                            className="mr-2 inline-flex justify-center rounded-md bg-red-50 py-2 px-4 text-sm font-medium text-red-700 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-0 dark:border dark:border-gray-600 dark:bg-gray-800 dark:text-red-500 dark:hover:border-gray-400 dark:hover:bg-gray-700"
                            onClick={closeModal}
                          >
                            Cancel
                          </button>
                        </>
                      )}
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
                      <div className="my-4 flex">
                        <Switch
                          checked={waiver}
                          onChange={setWaiver}
                          className={classNames(
                            waiver ? "bg-emerald-600" : "bg-gray-200 dark:bg-gray-700",
                            "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-0"
                          )}
                        >
                          <span className="sr-only">Waive right to withdrawal</span>
                          <span
                            className={classNames(
                              waiver ? "translate-x-5" : "translate-x-0",
                              "pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                            )}
                          >
                            <span
                              className={classNames(
                                waiver
                                  ? "opacity-0 duration-100 ease-out"
                                  : "opacity-100 duration-200 ease-in",
                                "absolute inset-0 flex h-full w-full items-center justify-center transition-opacity"
                              )}
                              aria-hidden="true"
                            >
                              <Close
                                size={32}
                                className="h-3 w-3 stroke-current stroke-2 text-gray-400"
                              />
                            </span>
                            <span
                              className={classNames(
                                waiver
                                  ? "opacity-100 duration-200 ease-in"
                                  : "opacity-0 duration-100 ease-out",
                                "absolute inset-0 flex h-full w-full items-center justify-center transition-opacity"
                              )}
                              aria-hidden="true"
                            >
                              <Checkmark
                                size={32}
                                className="h-3 w-3 stroke-current stroke-2 text-emerald-600"
                              />
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
                          data-splitbee-event={`Publish module`}
                          className="mr-2 inline-flex justify-center rounded-md bg-emerald-50 py-2 px-4 text-sm font-medium text-emerald-700 hover:bg-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 dark:border dark:border-gray-600 dark:bg-gray-800 dark:text-emerald-500 dark:hover:border-gray-400 dark:hover:bg-gray-700"
                          disabled={!waiver}
                        >
                          Pay and Publish
                        </button>
                        <button
                          type="button"
                          className="mr-2 inline-flex justify-center rounded-md bg-red-50 py-2 px-4 text-sm font-medium text-red-700 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-0 dark:border dark:border-gray-600 dark:bg-gray-800 dark:text-red-500 dark:hover:border-gray-400 dark:hover:bg-gray-700"
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
