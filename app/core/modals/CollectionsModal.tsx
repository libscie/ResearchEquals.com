import { Dialog, Transition, Tab, RadioGroup } from "@headlessui/react"
import { Fragment, useState } from "react"
import { CheckmarkFilled, Close, CloseFilled } from "@carbon/icons-react"
import { useRecoilState } from "recoil"
import { useMutation } from "blitz"

import createIndividualCollection from "../../collections/mutations/createIndividualCollection"
import { toast } from "react-hot-toast"
import PayCreateCollectionModal from "./PayCreateCollectionModal"

const plans = [
  {
    name: "Individual collection",
    tag: "INDIVIDUAL",
    price: 0,
    note: "Limited to 1 active collection per workspace",
    features: [
      { title: "Unique collection DOI", available: true },
      { title: "RSS Feed", available: false },
      { title: "Extra editors", available: false },
      { title: "Custom title", available: false },
      { title: "Custom icon", available: false },
      { title: "Custom banner image", available: false },
      { title: "External submissions", available: false },
    ],
  },
  {
    name: "Collaborative collection",
    tag: "COLLABORATIVE",
    price: 1499,
    note: "",
    features: [
      { title: "Unique collection DOI", available: true },
      { title: "RSS Feed", available: true },
      { title: "Five editors", available: true },
      { title: "Custom title", available: true },
      { title: "Custom icon", available: true },
      { title: "Custom banner image", available: false },
      { title: "External submissions", available: false },
    ],
  },
  {
    name: "Community collection",
    tag: "COMMUNITY",
    price: 14999,
    note: "",
    features: [
      { title: "Unique collection DOI", available: true },
      { title: "RSS Feed", available: true },
      { title: "Unlimited editors", available: true },
      { title: "Custom title", available: true },
      { title: "Custom icon", available: true },
      { title: "Custom banner image", available: true },
      { title: "External submissions", available: true },
    ],
  },
]

export default function CollectionsModal({ button, styling, user, workspace }) {
  let [isOpen, setIsOpen] = useState(false)
  const [selected, setSelected] = useState(plans[0])

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
              <Dialog.Overlay className="fixed inset-0 bg-gray-900 bg-opacity-95 transition-opacity" />
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
              <div className="sm:min-w-120 sm:max-w-120 inline-block min-h-screen w-full transform rounded bg-transparent text-left align-middle text-gray-900 transition-all dark:border-gray-600 dark:bg-gray-900 sm:min-h-full sm:w-auto">
                <button className="absolute top-0 right-0 float-right inline-flex items-center justify-center  rounded-md bg-transparent p-2 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 dark:text-gray-500 dark:hover:text-gray-300">
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
                <section className="mx-auto grid grid-cols-1 overflow-hidden py-32 2xl:grid-cols-3">
                  <div className="container col-span-1 mx-auto px-4">
                    <div className=" flex flex-wrap items-center">
                      <div className="max-w-lg pb-5 lg:p-5">
                        <p className="flex">
                          <h2 className="font-heading my-4 text-6xl font-bold text-white sm:text-7xl">
                            Start collecting
                          </h2>
                        </p>
                        <p className="my-2 text-gray-200">
                          Collect anything with a DOI in one place for easy reference and
                          safekeeping.
                        </p>
                        <p className="my-2 text-gray-200">
                          A literature review, portfolio, grant outputs, project deliverables, team
                          outputs, or to keep up with a topic.
                        </p>
                        <p className="my-2 text-gray-200">
                          Once you create a collection, you own it. You can upgrade to a higher tier
                          at any time with a one time payment.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="container col-span-2 mx-auto px-4 md:py-10">
                    <div className="">
                      <RadioGroup value={selected} onChange={setSelected}>
                        <RadioGroup.Label className="sr-only">Collection type</RadioGroup.Label>
                        <div className="grid grid-cols-1 gap-y-2 gap-x-2 md:grid-cols-3 md:gap-y-0">
                          {plans.map((plan) => (
                            <RadioGroup.Option
                              key={plan.name}
                              value={plan}
                              className={({ active, checked }) =>
                                `${
                                  active || checked
                                    ? "border border-transparent ring-2 ring-indigo-600 ring-opacity-60 ring-offset-2 ring-offset-indigo-300"
                                    : "border border-dashed border-gray-400 ring-2 ring-transparent ring-offset-2 ring-offset-transparent"
                                }
                          ${
                            active || checked
                              ? "bg-transparent bg-opacity-75 text-white"
                              : "bg-transparent"
                          }
                     cursor-pointer rounded-lg px-5 py-4 focus:outline-none`
                              }
                            >
                              {({ active, checked }) => (
                                <>
                                  <div className="flex w-full items-center justify-between">
                                    <div className="flex-grow items-center">
                                      <div className="flex-grow">
                                        <RadioGroup.Label
                                          as="h3"
                                          className={`text-center text-2xl font-medium ${
                                            checked ? "text-indigo-300" : "text-white"
                                          }`}
                                        >
                                          {plan.name}
                                        </RadioGroup.Label>
                                      </div>
                                      <div className="mt-2 mr-2 text-center ">
                                        <span className=" text-4xl font-bold tracking-tight text-white">
                                          {plan.price === 0 ? "Free" : `€${plan.price / 100}`}
                                        </span>
                                        {plan.price > 0 ? (
                                          <span className="text-base font-medium text-gray-500">
                                            {" "}
                                            incl. VAT
                                          </span>
                                        ) : (
                                          ""
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  <RadioGroup.Description
                                    as="div"
                                    className={`${checked ? "text-sky-100" : "text-gray-300"}`}
                                  >
                                    <ul>
                                      {plan.features.map((feature) => (
                                        <li className="my-2 flex" key={feature.title}>
                                          {feature.available ? (
                                            <CheckmarkFilled
                                              className="mr-2.5 fill-current text-green-500"
                                              size={24}
                                            />
                                          ) : (
                                            <CloseFilled
                                              className="mr-2.5 fill-current text-red-500"
                                              size={24}
                                            />
                                          )}
                                          {feature.title}
                                        </li>
                                      ))}
                                    </ul>
                                    {/* <span aria-hidden="true">&middot;</span>{" "} */}
                                    <p className="text-xs text-gray-400">{plan.note}</p>
                                  </RadioGroup.Description>
                                </>
                              )}
                            </RadioGroup.Option>
                          ))}
                        </div>
                      </RadioGroup>
                      <div className="group relative my-4 rounded bg-indigo-600 text-white">
                        <PayCreateCollectionModal
                          user={user}
                          type={selected?.tag}
                          price={selected?.price}
                          workspace={workspace}
                        />
                        {/* </>
                        )} */}
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
