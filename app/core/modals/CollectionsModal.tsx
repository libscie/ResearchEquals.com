import { Dialog, Transition, Tab } from "@headlessui/react"
import { Fragment, useState } from "react"
import { CheckmarkFilled, Close } from "@carbon/icons-react"
import { useRecoilState } from "recoil"
import { collectionsModalAtom } from "../utils/Atoms"

export default function CollectionsModal({ button, styling, user, workspace }) {
  let [isOpen, setIsOpen] = useRecoilState(collectionsModalAtom)

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setIsOpen(true)
        }}
        className={styling}
      >
        {button}
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={() => {
            setIsOpen(false)
          }}
        >
          <div className="min-h-screen text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-900 bg-opacity-90 transition-opacity" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="hidden h-screen max-h-screen align-middle sm:inline-block"
              aria-hidden="true"
            >
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
              <div className="sm:min-w-120 sm:max-w-120 inline-block min-h-screen  w-full transform rounded bg-transparent text-left align-middle text-gray-900 transition-all dark:border-gray-600 dark:bg-gray-900 sm:min-h-full sm:w-auto">
                <button className="float-right inline-flex items-center  justify-center rounded-md p-2 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 dark:text-gray-500 dark:hover:text-gray-300">
                  <span className="sr-only">Close menu</span>
                  <Close
                    size={32}
                    className="h-6 w-6"
                    aria-hidden="true"
                    onClick={() => {
                      setIsOpen(false)
                    }}
                  />
                </button>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
