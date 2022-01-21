import changePassword from "app/auth/mutations/changePassword"
import changeEmail from "app/users/mutations/changeEmail"
import { Link, Routes, useMutation, validateZodSchema } from "blitz"
import { useFormik } from "formik"
import toast from "react-hot-toast"
import { z } from "zod"
import {
  LogoDiscord32,
  LogoGithub32,
  LogoTwitter32,
  Checkmark32,
  Close32,
} from "@carbon/icons-react"

import LibscieLogo from "./LibscieLogo"

const InfoSettings = ({ setIsOpen }) => {
  return (
    <>
      <div className="my-4 px-2 text-center text-gray-900 dark:text-gray-200">
        <h2 className="my-1 block text-sm font-medium  text-gray-900 dark:text-gray-200">
          Powered by
        </h2>
        <Link href="https://libscie.org">
          <a target="_blank">
            <LibscieLogo styling="mx-auto" />
          </a>
        </Link>
        <hr className="w-20 border-t-0 bg-gradient-to-r from-indigo-300 to-indigo-600 bg-yellow-400 h-0.5 mx-auto my-4" />
        <h2 className="my-1 block text-sm font-medium  text-gray-900 dark:text-gray-200">About</h2>
        <p>An open access publishing platform for all your research outputs. </p>
        <p>You can shape this platform by getting involved in our discussions</p>
        <p className="flex text-sm text-center mx-auto my-2 text-indigo-600 dark:text-indigo-500  gap-x-2">
          <div className="flex-grow"></div>
          <div className="mx-2 hover:bg-indigo-600 text-black dark:text-white hover:text-white">
            <Link href="https://discord.gg/ZweVw5pBGQ">
              <a className="flex align-middle" target="_blank">
                <LogoDiscord32
                  className="text-gray-900 dark:text-white max-h-4 w-auto mt-1 mr-1"
                  aria-hidden="true"
                />
                Discord
              </a>
            </Link>
          </div>
          <div className="mx-2 hover:bg-indigo-600 text-black dark:text-white hover:text-white">
            <Link href="https://github.com/libscie/ResearchEquals.com">
              <a className="flex align-middle" target="_blank">
                <LogoGithub32
                  className="text-gray-900 dark:text-white max-h-4 w-auto mt-1 mr-1"
                  aria-hidden="true"
                />
                GitHub
              </a>
            </Link>
          </div>
          <div className="mx-2 hover:bg-indigo-600 text-black dark:text-white hover:text-white">
            <Link href="https://twitter.com/ResearchEquals">
              <a className="flex align-middle" target="_blank">
                <LogoTwitter32
                  className="text-gray-900 dark:text-white max-h-4 w-auto mt-1 mr-1"
                  aria-hidden="true"
                />
                Twitter
              </a>
            </Link>
          </div>
          <div className="flex-grow"></div>
        </p>
        <hr className="w-20 border-t-0 bg-gradient-to-r from-indigo-300 to-indigo-600 bg-yellow-400 h-0.5 mx-auto my-4" />

        <h2 className="my-1 block text-sm font-medium  text-gray-900 dark:text-gray-200">Legal</h2>
        <p className="flex text-sm text-center mx-auto my-2 text-indigo-600 dark:text-indigo-500  gap-x-2">
          <div className="flex-grow"></div>
          <div className="mx-2">
            <Link href="/terms">
              <a className="hover:bg-indigo-600 hover:text-white" target="_blank">
                Terms of use
              </a>
            </Link>{" "}
          </div>
          <div className="mx-2">
            <Link href="/privacy">
              <a className="hover:bg-indigo-600 hover:text-white" target="_blank">
                Privacy policy
              </a>
            </Link>
          </div>
          <div className="mx-2">
            <Link href="/coc">
              <a className="hover:bg-indigo-600 hover:text-white" target="_blank">
                Code of conduct
              </a>
            </Link>
          </div>
          <div className="flex-grow"></div>
        </p>
        <hr className="w-20 border-t-0 bg-gradient-to-r from-indigo-300 to-indigo-600 bg-yellow-400 h-0.5 mx-auto my-4" />
        <h2 className="my-1 block text-sm font-medium  text-gray-900 dark:text-gray-200">
          Funded by
        </h2>
        <p className="text-sm my-2">
          Made possible with the support of the{" "}
          <span className="text-indigo-600 dark:text-indigo-500">
            <Link href="https://shuttleworthfoundation.org/">
              <a className="hover:bg-indigo-600 hover:text-white" target="_blank">
                Shuttleworth Foundation
              </a>
            </Link>
          </span>{" "}
          and{" "}
          <span className="text-indigo-600 dark:text-indigo-500">
            <Link href="https://foundation.mozilla.org/en/">
              <a className="hover:bg-indigo-600 hover:text-white" target="_blank">
                Mozilla
              </a>
            </Link>{" "}
          </span>
        </p>
      </div>

      <div className="absolute right-0 w-full sm:sticky flex bottom-0 py-2 bg-white dark:bg-gray-900 border-t border-gray-300 dark:border-gray-600 text-right">
        <span className="flex-grow"></span>
        <div className="">
          <button
            type="reset"
            className="flex mx-4 py-2 px-4 bg-red-50 dark:bg-gray-800 text-red-700 dark:text-red-500 hover:bg-red-200 dark:hover:bg-gray-700 dark:border dark:border-gray-600 dark:hover:border-gray-400 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-red-500"
            onClick={() => {
              setIsOpen(false)
            }}
          >
            <Close32 className="w-4 h-4 fill-current text-red-500 pt-1" aria-hidden="true" />
            Cancel
          </button>
        </div>
        <button
          type="submit"
          className="flex mr-4 py-2 px-4 bg-green-50 dark:bg-gray-800 text-green-700 dark:text-green-500 hover:bg-green-200 dark:hover:bg-gray-700 dark:border dark:border-gray-600 dark:hover:border-gray-400 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-green-500"
          onClick={() => {
            setIsOpen(false)
          }}
        >
          <Checkmark32 className="w-4 h-4 fill-current text-green-500 pt-1" aria-hidden="true" />
          Save
        </button>
      </div>
    </>
  )
}

export default InfoSettings
