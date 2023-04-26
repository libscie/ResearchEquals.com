import Tiu from "../icons/tiu"

const InstitutionalSupportingMembers = () => {
  return (
    <div className="bg-white py-24 dark:bg-gray-900 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <h3 className="my-8 text-center text-lg font-bold text-slate-800 dark:text-white md:text-2xl">
          Institutional supporting members
        </h3>
        <div className="mx-auto grid max-w-lg grid-cols-3 items-center gap-x-8 gap-y-12 py-8 sm:max-w-xl sm:grid-cols-4 sm:gap-x-10 sm:gap-y-14 lg:mx-0 lg:max-w-none">
          <Tiu />
          <img
            className="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
            src="https://tailwindui.com/img/logos/158x48/transistor-logo-gray-900.svg"
            alt="Transistor"
            width={158}
            height={48}
          />
          <img
            className="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
            src="https://tailwindui.com/img/logos/158x48/reform-logo-gray-900.svg"
            alt="Reform"
            width={158}
            height={48}
          />
          <img
            className="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
            src="https://tailwindui.com/img/logos/158x48/tuple-logo-gray-900.svg"
            alt="Tuple"
            width={158}
            height={48}
          />
          <img
            className="col-span-2 max-h-12 w-full object-contain sm:col-start-2 lg:col-span-1"
            src="https://tailwindui.com/img/logos/158x48/savvycal-logo-gray-900.svg"
            alt="SavvyCal"
            width={158}
            height={48}
          />
          <img
            className="col-span-2 col-start-2 max-h-12 w-full object-contain sm:col-start-auto lg:col-span-1"
            src="https://tailwindui.com/img/logos/158x48/statamic-logo-gray-900.svg"
            alt="Statamic"
            width={158}
            height={48}
          />
        </div>
        <div className="mt-16 flex justify-center">
          <p className="relative rounded-full bg-gray-50 px-4 py-1.5 text-sm leading-6 text-gray-600 ring-1 ring-inset ring-gray-900/5">
            <span className="hidden md:inline">
              Institutional supporting memberships are a minimum of €2,500 per year.
            </span>
            <a
              href={`mailto:ceo@libscie.org?subject=${encodeURIComponent(
                "Interested in an institutional supporting membership"
              )}&body=${encodeURIComponent(
                "Hi!\n\nI am writing you from <institution> and would be interested to become a supporting member.\n\nWe have €_____ budget and <name> is the person to talk to. \n\nWould you be available for a brief conversation sometime soon?\n\nRegards,\n<name>"
              )}`}
              className="font-semibold text-indigo-600"
            >
              <span className="absolute inset-0" aria-hidden="true" /> Talk to us{" "}
              <span aria-hidden="true">&rarr;</span>
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default InstitutionalSupportingMembers
