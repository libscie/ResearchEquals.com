import Link from "next/link"
import { useRouter } from "next/router"
import { Fragment, useState } from "react"
import { Dialog, Switch, Transition } from "@headlessui/react"
import toast from "react-hot-toast"
import { Close, Checkmark } from "@carbon/icons-react"
import { getAntiCSRFToken } from "@blitzjs/auth"
import handlePayment from "../utils/handlePayment"

function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}

export default function SignupModal({ button }) {
  let [isOpen, setIsOpen] = useState(false)
  const [waiver, setWaiver] = useState(false)
  // Set price to yearly by default
  const [price, setPrice] = useState(
    // Hardcodes price_id for production and test
    // TODO: Add Production price
    process.env.ALGOLIA_PREFIX === "production" ? "" : "price_1MWHibLmgtJbKHNGLs3AcfQ1"
  )

  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
  }

  const router = useRouter()
  const antiCSRFToken = getAntiCSRFToken()

  return (
    <>
      <button onClick={openModal}>{button}</button>
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
                  Become a supporting member
                </Dialog.Title>
                <form>
                  <div className="mt-2">
                    <p className="text-sm">
                      As an individual supporting member, you will get personal invitations to our
                      quarterly General Assemblies, the governance body for ResearchEquals.
                    </p>
                    <select
                      onChange={(data) => {
                        setPrice(data.target.value)
                      }}
                      className="mt-2 w-full rounded-md text-sm dark:bg-gray-900"
                    >
                      <option
                        value={
                          // Hardcodes price_id for production and test
                          // TODO: Add Production price
                          process.env.ALGOLIA_PREFIX === "production"
                            ? ""
                            : "price_1MWHibLmgtJbKHNGLs3AcfQ1"
                        }
                      >
                        Yearly - €79.99 (recurring)
                      </option>
                      <option
                        value={
                          // Hardcodes price_id for production and test
                          // TODO: Add Production price
                          process.env.ALGOLIA_PREFIX === "production"
                            ? ""
                            : "price_1MWHibLmgtJbKHNGBMUtwKEL"
                        }
                      >
                        Monthly - €9.99 (recurring){" "}
                      </option>
                    </select>
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
                      Yes, I agree that Liberate Science GmbH upgrades the collection immediately
                      and irrevocably. I knowingly consent to waive my{" "}
                      <Link href="/right-of-withdrawal" className="underline" target="_blank">
                        right of withdrawal
                      </Link>{" "}
                      by completing my purchase.
                    </p>
                  </div>
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={() =>
                        handlePayment(
                          `/api/checkout_sessions_supporting?email=${encodeURIComponent(
                            "chris@libscie.org"
                          )}&price_id=${price}`,
                          router,
                          toast,
                          antiCSRFToken
                        )
                      }
                      role="link"
                      className="mr-2 inline-flex justify-center rounded-md bg-emerald-50 py-2 px-4 text-sm font-medium text-emerald-700 hover:bg-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 dark:border dark:border-gray-600 dark:bg-gray-800 dark:text-emerald-500 dark:hover:border-gray-400 dark:hover:bg-gray-700"
                      disabled={!waiver}
                    >
                      Pay and Subscribe
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
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
