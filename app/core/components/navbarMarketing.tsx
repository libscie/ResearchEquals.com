/* This example requires Tailwind CSS v2.0+ */
import { Fragment } from "react"
import { Menu, Popover, Transition } from "@headlessui/react"
import {
  BookmarkAltIcon,
  CalendarIcon,
  ChartBarIcon,
  CursorClickIcon,
  MenuIcon,
  PhoneIcon,
  PlayIcon,
  RefreshIcon,
  ShieldCheckIcon,
  SupportIcon,
  ViewGridIcon,
  XIcon,
} from "@heroicons/react/outline"
import { ChevronDownIcon } from "@heroicons/react/solid"
import { Link, Routes, useMutation, Image } from "blitz"
import { Suspense } from "react"
import { Notification32, LocationPersonFilled32 } from "@carbon/icons-react"

import { useCurrentUser } from "../hooks/useCurrentUser"
import logout from "../../auth/mutations/logout"
import { useCurrentWorkspace } from "../hooks/useCurrentWorkspace"
import Autocomplete from "./Autocomplete"

export default function Example() {
  // 1. container box
  // 2. logo container
  // 3. search container
  // 4. hamburger menu

  return (
    <div className="w-full bg-gray-700 h-24">
      <div className="flex items-center justify-between h-full">
        {/* logo placeholder */}
        <div className="bg-gray-400 w-16 h-16 ml-4"></div>
        {/* searchbar */}
        <div className="bg-gray-400 w-full max-w-3xl h-16 ml-4">
          <Autocomplete className="h-full" />
        </div>
        {/* user information */}
        <div className="hidden lg:inline mr-4">
          <Suspense fallback="Loading...">
            <UserInfo />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

const userNavigation = [
  { name: "Your Profile", href: "#" },
  { name: "Settings", href: "#" },
  { name: "Sign out", href: "#" },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}

const UserInfo = () => {
  const currentUser = useCurrentUser()
  const currentWorkspace = useCurrentWorkspace()
  const [logoutMutation] = useMutation(logout)

  if (currentUser && currentWorkspace) {
    return (
      <div className="flex">
        <div className="">
          <Notification32 className="text-white w-6 inline-block align-middle h-full" />
        </div>
        <div className="ml-4 inline-block align-middle h-full">
          <Menu as="div" className="inline-block align-middle h-full">
            <div>
              <Menu.Button className="focus:outline-none ">
                <span className="sr-only">Open user menu</span>
                <Image
                  src={`https://eu.ui-avatars.com/api/?background=0D8ABC&color=fff&name=${currentWorkspace.handle}`}
                  alt="Avatar"
                  width={32}
                  height={32}
                  className="rounded-full ml-4"
                />
              </Menu.Button>
            </div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="origin-top-right absolute z-10 right-0 mt-2 mr-4 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 py-1 focus:outline-none">
                {userNavigation.map((item) => (
                  <Menu.Item key={item.name}>
                    {({ active }) => (
                      <a
                        href={item.href}
                        className={classNames(
                          active ? "bg-gray-100" : "",
                          "block py-2 px-4 text-sm text-gray-700"
                        )}
                      >
                        {item.name}
                      </a>
                    )}
                  </Menu.Item>
                ))}
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
        <Link href={Routes.Dashboard()}>
          <a className="ml-4 px-4 py-2 bg-black text-white rounded hover:bg-gray-800">New draft</a>
        </Link>
      </div>
    )
  } else {
    return (
      <div className="flex">
        <Link href={Routes.LoginPage()}>
          <a className="whitespace-nowrap text-base hover:text-gray-300 border-2 border-indigo-600 px-4 py-2 text-white rounded">
            Sign in
          </a>
        </Link>
        <Link href={Routes.SignupPage()}>
          <a className="ml-4 2xl:ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base text-white bg-indigo-600 hover:bg-indigo-700">
            Sign up
          </a>
        </Link>
      </div>
    )
  }
}
