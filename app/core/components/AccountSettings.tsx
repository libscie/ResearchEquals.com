import changePassword from "app/auth/mutations/changePassword"
import changeEmail from "app/users/mutations/changeEmail"
import changeBio from "app/workspaces/mutations/changeBio"
import changePronouns from "app/workspaces/mutations/changePronouns"
import changeUrl from "app/workspaces/mutations/changeUrl"
import { Link, useMutation, validateZodSchema } from "blitz"
import { useFormik } from "formik"
import toast from "react-hot-toast"
import { z } from "zod"
import DeleteModal from "../modals/delete"
import { CheckIcon, XIcon } from "@heroicons/react/solid"

const WorkspaceSettings = ({ user, setIsOpen }) => {
  const [changePasswordMutation, { isSuccess: passwordChanged }] = useMutation(changePassword)
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
      try {
        try {
          if (user!.email! !== values.email) {
            toast.promise(changeEmailMutation(values), {
              loading: "Saving...",
              success: "Updated email",
              error: "Hmm that didn't work...",
            })
          }
        } catch (error) {
          toast.error("You cannot use this email")
        }

        if (values.newPassword !== values.newRepeat && values.newPassword !== "") {
          alert("Please check the new password for typo's")
        } else if (values.newPassword !== "") {
          try {
            toast.promise(changePasswordMutation(values), {
              loading: "Saving...",
              success: "Updated password",
              error: "Hmm that didn't work...",
            })
            setIsOpen(false)
          } catch (error) {
            toast.error("Password needs to be at least 10 characters")
          }
        }
      } catch (error) {
        alert(error.toString())
      }
    },
  })

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <div className="my-4 px-2">
          <label
            htmlFor="email"
            className="my-1 block text-sm font-medium  text-gray-900 dark:text-gray-200"
          >
            Email address
          </label>
          <div className="mt-1 max-w-11/12">
            <input
              id="email"
              className="bg-transparent appearance-none block w-11/12 px-3 py-2 border border-gray-300  text-gray-900 dark:text-gray-200 dark:border-gray-600 rounded-md placeholder-gray-400 placeholder-font-normal focus:outline-none focus:ring-indigo-500 focus:border-indigo-500  font-normal text-sm "
              {...formik.getFieldProps("email")}
            />
            {formik.touched.email && formik.errors.email ? (
              <div className="font-normal text-sm text-gray-900 dark:text-gray-200">
                {formik.errors.email}
              </div>
            ) : null}
            <p className="text-xs text-gray-900 dark:text-gray-200 my-1">
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
            Current password
          </label>
          <div className="mt-1">
            <input
              id="currentPassword"
              type="password"
              autoComplete="password"
              className="bg-transparent appearance-none block w-11/12 px-3 py-2 border border-gray-300  text-gray-900 dark:text-gray-200 dark:border-gray-600 rounded-md placeholder-gray-400 placeholder-font-normal focus:outline-none focus:ring-indigo-500 focus:border-indigo-500  font-normal text-sm "
              {...formik.getFieldProps("currentPassword")}
            />
            {formik.touched.currentPassword && formik.errors.currentPassword ? (
              <div className="font-normal text-sm text-gray-900 dark:text-gray-200">
                {formik.errors.currentPassword}
              </div>
            ) : null}
          </div>
        </div>
        <div className="my-4 px-2">
          <label
            htmlFor="newPassword"
            className=" my-1 block text-sm font-medium  text-gray-900 dark:text-gray-200"
          >
            New password
          </label>
          <p className="text-xs text-gray-900 dark:text-gray-200">
            Password needs to be at least 10 characters.
          </p>
          <div className="mt-1">
            <input
              id="newPassword"
              type="password"
              className="bg-transparent appearance-none block w-11/12 px-2 py-2 border border-gray-300  text-gray-900 dark:text-gray-200  dark:border-gray-600 rounded-md placeholder-gray-400 placeholder-font-normal focus:outline-none focus:ring-indigo-500 focus:border-indigo-500  font-normal text-sm "
              {...formik.getFieldProps("newPassword")}
            />
            {formik.touched.newPassword && formik.errors.newPassword ? (
              <div className="font-normal text-sm text-gray-900 dark:text-gray-200">
                {formik.errors.newPassword}
              </div>
            ) : null}
          </div>
        </div>
        <div className="my-4 px-2">
          <label
            htmlFor="newRepeat"
            className=" my-1 block text-sm font-medium  text-gray-900 dark:text-gray-200"
          >
            Repeat password
          </label>
          <div className="mt-1">
            <input
              id="newRepeat"
              type="password"
              className="bg-transparent appearance-none block w-11/12 px-3 py-2 border border-gray-300  text-gray-900 dark:text-gray-200 dark:border-gray-600 rounded-md placeholder-gray-400 placeholder-font-normal focus:outline-none focus:ring-indigo-500 focus:border-indigo-500  font-normal text-sm "
              {...formik.getFieldProps("newRepeat")}
            />
            {formik.touched.newRepeat && formik.errors.newRepeat ? (
              <div className="font-normal text-sm text-gray-900 dark:text-gray-200">
                {formik.errors.newRepeat}
              </div>
            ) : null}
          </div>
        </div>
        <div className="px-2 my-2">
          <DeleteModal />
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
              <XIcon className="w-4 h-4 fill-current text-red-500 pt-1" aria-hidden="true" />
              Cancel
            </button>
          </div>
          <button
            type="submit"
            className="flex mr-4 py-2 px-4 bg-green-50 dark:bg-gray-800 text-green-700 dark:text-green-500 hover:bg-green-200 dark:hover:bg-gray-700 dark:border dark:border-gray-600 dark:hover:border-gray-400 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-green-500"
          >
            <CheckIcon className="w-4 h-4 fill-current text-green-500 pt-1" aria-hidden="true" />
            Save
          </button>
        </div>
      </form>
    </>
  )
}

export default WorkspaceSettings
