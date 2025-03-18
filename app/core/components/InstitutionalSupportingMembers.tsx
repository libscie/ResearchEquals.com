import Tiu from "../icons/tiu"
import KuLeuven from "public/images/kuleuven.png"
import Oscl from "public/images/oscl.png"
import Image from "next/image"
import Link from "next/link"
import Vua from "../icons/vua"

const InstitutionalSupportingMembers = () => {
  return (
    <div className="bg-white py-24 dark:bg-gray-900 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <h3 className="my-8 text-center text-lg font-bold text-slate-800 dark:text-white md:text-2xl">
          Institutional supporting members
        </h3>
        <div className="mx-auto grid max-w-lg grid-cols-1 gap-x-8 gap-y-12 py-8 sm:flex sm:max-w-xl sm:grid-cols-2 sm:gap-x-10 sm:gap-y-14 lg:mx-0 lg:max-w-none">
          <span className="mx-auto max-h-12">
            <Link href="https://libscie.org/p/07ea9ef1-2a67-4cb3-b034-2f19bc18eae2/">
              <Image
                src={KuLeuven}
                alt="The KU Leuven logo"
                // layout="responsive"
                width={136}
                height={100}
              />
            </Link>
          </span>
          <span className="mx-auto max-h-12">
            <Link href="https://libscie.org/p/bb218ba0-8e27-4c89-8c03-d7c073b2fa56/">
              <Tiu />
            </Link>
          </span>
          <span className="mx-auto max-h-12">
            <Link href="https://libscie.org/p/22f6a775-ecdd-4c21-88fc-454b3ab04582/">
              <Vua />
            </Link>
          </span>
          <span className="mx-auto max-h-12 dark:invert">
            <Link href="https://libscie.org/open-science-community-leiden/">
              <Image
                src={Oscl}
                alt="The Open Science Community Leiden logo"
                // layout="responsive"
                width={136}
                height={100}
              />
            </Link>
          </span>
        </div>
        <div className="mt-8 flex justify-center">
          <p className="relative rounded-full bg-gray-50 px-4 py-1.5 text-sm leading-6 text-gray-600 ring-1  ring-inset ring-gray-900/5 dark:bg-gray-800 dark:text-white">
            <span className="hidden md:inline">
              Institutional supporting memberships start at €2,500 per year.
            </span>
            <a
              href="mailto:info@libscie.org"
              className="mx-2 font-semibold text-indigo-600 dark:text-indigo-400"
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
