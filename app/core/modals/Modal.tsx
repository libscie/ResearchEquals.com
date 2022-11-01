import { Dialog, Transition } from "@headlessui/react"
import React, { Fragment } from "react"
import PropTypes from "prop-types"

export const Modal = ({
  isOpen,
  setIsOpen,
  title,
  body,
  onSubmit,
  onCancel,
  primaryAction = "Ok",
  primaryButtonClass,
  secondaryAction = "Cancel",
  secondaryButtonClass,
}) => {
  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={() => setIsOpen(false)}
        >
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
                  {title}
                </Dialog.Title>
                <div className="mt-2">{body}</div>
                <div className="mt-4">
                  <button
                    type="button"
                    className={`mr-2 inline-flex rounded-md border py-2 px-4 text-sm font-medium ${
                      primaryButtonClass
                        ? primaryButtonClass
                        : // Style the primary button (default is success)
                          `bg-emerald-50 py-2 px-4 text-sm font-medium text-emerald-700 hover:bg-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-0 dark:border dark:border-gray-600 dark:bg-gray-800 dark:text-emerald-500 dark:hover:border-gray-400 dark:hover:bg-gray-700`
                    }`}
                    onClick={async () => {
                      onSubmit()
                      setIsOpen(false)
                    }}
                  >
                    {primaryAction}
                  </button>
                  <button
                    type="button"
                    className={`rounded-md py-2 px-4 text-sm font-medium ${
                      secondaryButtonClass
                        ? secondaryButtonClass
                        : // Style the secondary button (default is cancel)
                          `bg-indigo-100 text-indigo-700 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0 dark:border dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:border-gray-400 dark:hover:bg-gray-700`
                    }`}
                    onClick={() => {
                      onCancel()
                      setIsOpen(false)
                    }}
                  >
                    {secondaryAction}
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

Modal.propTypes = {
  isOpen: PropTypes.bool,
  setIsOpen: PropTypes.func,
  title: PropTypes.string,
  body: PropTypes.element,
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
  primaryAction: PropTypes.string,
  primaryButtonClass: PropTypes.string,
  secondaryAction: PropTypes.string,
  secondaryButtonClass: PropTypes.string,
}
