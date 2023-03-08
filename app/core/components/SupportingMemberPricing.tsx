import { Checkmark } from "@carbon/icons-react"

const tiers = [
  {
    name: "Yearly",
    id: "tier-yearly",
    priceMonthly: "€79.99",
    description:
      "Join us for the long haul. We need you and only over time will we have an impact together. ",
    featured: true,
  },
  {
    name: "Monthly",
    id: "tier-monthly",
    priceMonthly: "€9.99",
    description: "",
  },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}

export default function SupportingMemberPricing() {
  return (
    <div className="relative isolate bg-white py-24 px-6 dark:bg-gray-900 sm:py-24 lg:px-8">
      <div
        className="absolute inset-x-0 -top-3 -z-10 transform-gpu overflow-hidden px-36 blur-3xl"
        aria-hidden="true"
      >
        <svg className="mx-auto w-[72.1875rem]" viewBox="0 0 1155 678">
          <path
            fill="url(#083c110e-60c8-42bb-a9db-29bba74cc569)"
            fillOpacity=".3"
            d="M317.219 518.975L203.852 678 0 438.341l317.219 80.634 204.172-286.402c1.307 132.337 45.083 346.658 209.733 145.248C936.936 126.058 882.053-94.234 1031.02 41.331c119.18 108.451 130.68 295.337 121.53 375.223L855 299l21.173 362.054-558.954-142.079z"
          />
          <defs>
            <linearGradient
              id="083c110e-60c8-42bb-a9db-29bba74cc569"
              x1="1155.49"
              x2="-78.208"
              y1=".177"
              y2="474.645"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#9089FC" />
              <stop offset={1} stopColor="#FF80B5" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="mx-auto max-w-2xl text-center lg:max-w-4xl">
        {/* <h2 className="text-base font-semibold leading-7 text-indigo-600">Pricing</h2> */}
        <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
          Supporters make this a community effort.
        </p>
      </div>
      <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-20 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-2">
        {tiers.map((tier, tierIdx) => (
          <div
            key={tier.id}
            className={classNames(
              tier.featured ? "relative bg-white shadow-2xl" : "bg-white/60 sm:mx-8 lg:mx-0",
              tier.featured
                ? ""
                : tierIdx === 0
                ? "rounded-t-3xl sm:rounded-b-none lg:rounded-tr-none lg:rounded-bl-3xl"
                : "sm:rounded-t-none lg:rounded-tr-3xl lg:rounded-bl-none",
              "rounded-3xl p-8 ring-1 ring-gray-900/10 sm:p-10"
            )}
          >
            <h3 id={tier.id} className="text-base font-semibold leading-7 text-indigo-600">
              {tier.name}
            </h3>
            <p className="mt-4 flex items-baseline gap-x-2">
              <span className="text-5xl font-bold tracking-tight text-gray-900">
                {tier.priceMonthly}
              </span>
              {/* <span className="text-base text-gray-500">/yearly</span> */}
            </p>
            <p className="mt-6 text-base leading-7 text-gray-600">{tier.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
