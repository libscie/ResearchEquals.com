import { Link, Routes } from "blitz"
import { Suspense } from "react"
import { ProgressBarRound32 } from "@carbon/icons-react"

import Autocomplete from "./Autocomplete"
import NavbarFullwidthMenu from "./NavbarFullwidthMenu"
import NavbarDropdown from "./NavbarDropdown"

const Navbar = () => {
  return (
    <div className="w-full bg-gray-700 mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative flex justify-between xl:grid xl:grid-cols-12 lg:gap-8">
        <div className="flex md:absolute md:left-0 md:inset-y-0 lg:static xl:col-span-2">
          <div className="flex-shrink-0 flex items-center">
            {/* TODO: Replace w logo */}
            <Link href={Routes.Home()}>
              <a>
                <img
                  className="block h-8 w-auto"
                  src="https://tailwindui.com/img/logos/workflow-mark.svg?color=indigo&shade=600"
                  alt="Workflow"
                />
              </a>
            </Link>
          </div>
        </div>
        <div className="min-w-0 flex-1 md:px-8 lg:px-0 xl:col-span-6">
          <div className="flex items-center px-6 py-4 md:max-w-3xl md:mx-auto lg:max-w-none lg:mx-0 xl:px-0">
            <div className="w-full">
              <label htmlFor="search" className="sr-only">
                Search
              </label>
              {/* TODO: Add algolia search in here */}
              <Autocomplete className="h-full" />
            </div>
          </div>
        </div>
        <div className="flex items-center md:absolute md:right-0 md:inset-y-0 lg:hidden">
          <NavbarDropdown />
        </div>
        <Suspense
          fallback={
            <div className="hidden lg:flex lg:items-center lg:justify-end xl:col-span-4">
              <ProgressBarRound32 className="animate-spin text-white dark:text-white" />
            </div>
          }
        >
          <NavbarFullwidthMenu />
        </Suspense>
      </div>
    </div>
  )
}

export default Navbar
