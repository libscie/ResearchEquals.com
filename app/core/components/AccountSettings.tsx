import { useMutation } from "@blitzjs/rpc"
import Link from "next/link"
import changePassword from "app/auth/mutations/changePassword"
import changeEmail from "app/users/mutations/changeEmail"
import { useFormik } from "formik"
import toast from "react-hot-toast"
import { z } from "zod"
import { Checkmark, Close, Sprout, Wheat } from "@carbon/icons-react"

import DeleteModal from "../modals/delete"
import { validateZodSchema } from "blitz"
import SupportingMemberSignupModal from "../modals/SupportingMemberSignupModal"

const WorkspaceSettings = ({ user, setIsOpen }) => {
  const [changePasswordMutation] = useMutation(changePassword)
  const [changeEmailMutation] = useMutation(changeEmail)

  const formik = useFormik({
    initialValues: {
      email: user!.email!,
      currentPassword: "",
      newPassword: "",
      newRepeat: "",
    },
    validate: validateZodSchema(
      z.object({
        email: z.string().email(),
        currentPassword: z.string(),
        newPassword: z.string(),
        newRepeat: z.string(),
      })
    ),
    onSubmit: async (values) => {
      if (user!.email! !== values.email) {
        await toast.promise(changeEmailMutation(values), {
          loading: "Saving...",
          success: "Updated email",
          error: "Hmm that didn't work...",
        })
      }

      if (values.newPassword !== values.newRepeat && values.newPassword !== "") {
        alert("Please check the new password for typo's")
      } else if (values.newPassword !== "") {
        await toast.promise(changePasswordMutation(values), {
          loading: "Saving...",
          success: "Updated password",
          error: "Password needs to be at least 10 characters",
        })
        setIsOpen(false)
      }
    },
  })

  return (
    <>
      <div className="my-4 px-2">
        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-200">
          Supporting membership
        </h3>
        <div className="flex w-11/12">
          <div className="">
            <div className="my-2 text-xs text-gray-900 dark:text-gray-200">
              <p>
                Co-govern ResearchEquals, prevent buy-outs, and help decide what our profits get
                spent on.
              </p>
            </div>
          </div>
          <div className="my-0">
            {user.supportingMember ? (
              // TODO: Add conditional link and the production URL
              <Link href="https://billing.stripe.com/p/login/test_14keVF1Qp06l5he5kk">
                <button
                  type="button"
                  className="mx-1 flex rounded-md bg-sky-50 py-2 px-4 text-sm font-medium text-sky-700 hover:bg-sky-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-0 dark:border dark:border-gray-600 dark:bg-gray-800 dark:text-sky-500 dark:hover:border-gray-400 dark:hover:bg-gray-700"
                  // onClick={openModal}
                >
                  <Wheat
                    size={32}
                    className="h-5 w-5 fill-current text-sky-500"
                    aria-hidden="true"
                  />
                  Manage
                </button>
              </Link>
            ) : (
              <SupportingMemberSignupModal
                button={
                  <button
                    type="button"
                    className="mx-1 flex rounded-md bg-green-50 py-2 px-4 text-sm font-medium text-green-700 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-0 dark:border dark:border-gray-600 dark:bg-gray-800 dark:text-green-500 dark:hover:border-gray-400 dark:hover:bg-gray-700"
                    // onClick={openModal}
                  >
                    <Sprout
                      size={32}
                      className="h-5 w-5 fill-current text-green-500"
                      aria-hidden="true"
                    />
                    Support
                  </button>
                }
              />
            )}
          </div>
        </div>
      </div>
      <form onSubmit={formik.handleSubmit}>
        <div className="my-4 px-2">
          <label
            htmlFor="email"
            className="my-1 block text-sm font-medium  text-gray-900 dark:text-gray-200"
          >
            Email address{" "}
            {formik.touched.email && formik.errors.email ? " - " + formik.errors.email : null}
          </label>
          <div className="max-w-11/12 mt-1">
            <input
              id="email"
              className="placeholder-font-normal block w-11/12 appearance-none rounded-md border border-gray-300 bg-transparent  px-3 py-2 text-sm font-normal text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500  dark:border-gray-600 dark:text-gray-200 "
              {...formik.getFieldProps("email")}
            />
            <p className="my-1 text-xs text-gray-900 dark:text-gray-200">
              Upon changing your email address, you will need to verify it before being able to
              publish again.
            </p>
          </div>
        </div>
        <div className="my-4 px-2">
          <label
            htmlFor="currentPassword"
            className=" my-1 block text-sm font-medium  text-gray-900 dark:text-gray-200"
          >
            Current password{" "}
            {formik.touched.currentPassword && formik.errors.currentPassword
              ? " - " + formik.errors.currentPassword
              : null}
          </label>
          <div className="mt-1">
            <input
              id="currentPassword"
              type="password"
              autoComplete="password"
              className="placeholder-font-normal block w-11/12 appearance-none rounded-md border border-gray-300 bg-transparent  px-3 py-2 text-sm font-normal text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500  dark:border-gray-600 dark:text-gray-200 "
              {...formik.getFieldProps("currentPassword")}
            />
          </div>
        </div>
        <div className="my-4 px-2">
          <label
            htmlFor="newPassword"
            className=" my-1 block text-sm font-medium  text-gray-900 dark:text-gray-200"
          >
            New password{" "}
            {formik.touched.newPassword && formik.errors.newPassword
              ? " - " + formik.errors.newPassword
              : null}
          </label>
          <p className="text-xs text-gray-900 dark:text-gray-200">
            Password needs to be at least 10 characters.
          </p>
          <div className="mt-1">
            <input
              id="newPassword"
              type="password"
              className="placeholder-font-normal block w-11/12 appearance-none rounded-md border border-gray-300 bg-transparent  px-2 py-2  text-sm font-normal text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500  dark:border-gray-600 dark:text-gray-200 "
              {...formik.getFieldProps("newPassword")}
            />
          </div>
        </div>
        <div className="my-4 px-2">
          <label
            htmlFor="newRepeat"
            className=" my-1 block text-sm font-medium  text-gray-900 dark:text-gray-200"
          >
            Repeat password{" "}
            {formik.touched.newRepeat && formik.errors.newRepeat
              ? " - " + formik.errors.newRepeat
              : null}
          </label>
          <div className="mt-1">
            <input
              id="newRepeat"
              type="password"
              className="placeholder-font-normal block w-11/12 appearance-none rounded-md border border-gray-300 bg-transparent  px-3 py-2 text-sm font-normal text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500  dark:border-gray-600 dark:text-gray-200 "
              {...formik.getFieldProps("newRepeat")}
            />
          </div>
        </div>
        <div className="my-2 px-2">
          <DeleteModal />
        </div>

        <div className="absolute right-0 bottom-0 flex w-full border-t border-gray-300 bg-white py-2 text-right dark:border-gray-600 dark:bg-gray-900 sm:sticky">
          <span className="flex-grow"></span>
          <div className="">
            <button
              type="reset"
              className="mx-4 flex rounded-md bg-red-50 py-2 px-4 text-sm font-medium text-red-700 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-0 dark:border dark:border-gray-600 dark:bg-gray-800 dark:text-red-500 dark:hover:border-gray-400 dark:hover:bg-gray-700"
              onClick={() => {
                setIsOpen(false)
              }}
            >
              <Close
                size={32}
                className="h-4 w-4 fill-current pt-1 text-red-500"
                aria-hidden="true"
              />
              Cancel
            </button>
          </div>
          <button
            type="submit"
            className="mr-4 flex rounded-md bg-emerald-50 py-2 px-4 text-sm font-medium text-emerald-700 hover:bg-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-0 dark:border dark:border-gray-600 dark:bg-gray-800 dark:text-emerald-500 dark:hover:border-gray-400 dark:hover:bg-gray-700"
          >
            <Checkmark
              size={32}
              className="h-4 w-4 fill-current pt-1 text-emerald-500"
              aria-hidden="true"
            />
            Save
          </button>
        </div>
      </form>
    </>
  )
}

export default WorkspaceSettings
