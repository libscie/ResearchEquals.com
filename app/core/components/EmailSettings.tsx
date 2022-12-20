import { useMutation } from "@blitzjs/rpc"
import { useFormik } from "formik"
import toast from "react-hot-toast"
import { z } from "zod"
import { Checkmark, Close } from "@carbon/icons-react"
import changeEmailConsent from "../../users/mutations/changeEmailConsent"
import changeMemberEmails from "../../memberships/mutations/changeMemberEmails"
import { emailNotificationsAtom } from "../utils/Atoms"
import { useRecoilState } from "recoil"
import { validateZodSchema } from "blitz"

const EmailSettings = ({ user, setIsOpen }) => {
  const [emailNotifications, setEmailNotifications] = useRecoilState(emailNotificationsAtom)
  const [changeEmailMutation] = useMutation(changeEmailConsent)
  const [changeMemberEmailsMutation] = useMutation(changeMemberEmails)

  const formik = useFormik({
    initialValues: emailNotifications,
    validate: validateZodSchema(
      z.object({
        emailConsent: z.boolean(),
        marketingConsent: z.boolean(),
      })
    ),
    onSubmit: async (values) => {
      try {
        setEmailNotifications(values)
        if (
          values.emailConsent != user.emailConsent ||
          values.marketingConsent != user.marketingConsent
        ) {
          await toast.promise(
            changeEmailMutation({
              emailConsent: values.emailConsent,
              marketingConsent: values.marketingConsent,
            }),
            {
              loading: "Updating email settings...",
              success: "Updated email settings!",
              error: "Please check your settings",
            }
          )
        }

        user.memberships.map(async (membership) => {
          if (
            values[`${membership.workspace.handle}-invitations`] !=
              emailNotifications[`${membership.workspace.handle}-invitations`] ||
            values[`${membership.workspace.handle}-approvals`] !=
              emailNotifications[`${membership.workspace.handle}-approvals`] ||
            values[`${membership.workspace.handle}-weeklyDigest`] !=
              emailNotifications[`${membership.workspace.handle}-weeklyDigest`] ||
            values[`${membership.workspace.handle}-collections`] !=
              emailNotifications[`${membership.workspace.handle}-collections`]
          )
            await toast.promise(
              changeMemberEmailsMutation({
                id: membership.id,
                invitations: values[`${membership.workspace.handle}-invitations`],
                approvals: values[`${membership.workspace.handle}-approvals`],
                weeklyDigest: values[`${membership.workspace.handle}-weeklyDigest`],
                collections: values[`${membership.workspace.handle}-collections`],
              }),
              {
                loading: `Updating emails for @${membership.workspace.handle}...`,
                success: `Updated emails for @${membership.workspace.handle}!`,
                error: "Please check your settings",
              }
            )
        })

        setIsOpen(false)
      } catch (error) {
        alert(error.toString())
      }
    },
  })

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <div className="my-4 flex w-full px-2">
          <label
            htmlFor="emailConsent"
            className="my-1 flex-grow text-sm font-medium  text-gray-900 dark:text-gray-200"
          >
            Consent to receiving emails{" "}
            <p className="my-1 text-xs text-gray-900 dark:text-gray-200">
              Critical service emails are sent regardless (e.g., changes to the terms).
            </p>
          </label>
          <span className="float-right m-1">
            <input
              type="checkbox"
              id="emailConsent"
              defaultChecked={formik.values.emailConsent}
              {...formik.getFieldProps("emailConsent")}
            />
          </span>
        </div>
        <div className="my-4 flex w-full px-2">
          <label
            htmlFor="marketingEmails"
            className="my-1 flex-grow text-sm font-medium  text-gray-900 dark:text-gray-200"
          >
            Marketing emails{" "}
            <p className="my-1 text-xs text-gray-900 dark:text-gray-200">
              Stay up-to-date with our developments, discounts, and more!
            </p>
          </label>
          <div className="max-w-11/12 float-right m-1">
            {formik.values.emailConsent ? (
              <input
                type="checkbox"
                id="marketingEmails"
                defaultChecked={formik.values.marketingConsent}
                {...formik.getFieldProps("marketingConsent")}
              />
            ) : (
              <input
                type="checkbox"
                id="marketingEmails"
                className="disabled:opacity-25"
                defaultChecked={formik.values.marketingConsent}
                disabled
              />
            )}
          </div>
        </div>
        <table className="m-2 w-full text-gray-900 dark:text-gray-200">
          <thead>
            <tr>
              <th className=""></th>
              <th className="text-sm font-medium underline">Invitations</th>
              <th className="text-sm font-medium underline">Approvals</th>
              <th className="text-sm font-medium underline">Weekly Digest</th>
              <th className="text-sm font-medium underline">Collections</th>
            </tr>
          </thead>
          <tbody>
            {user.memberships.map((membership) => (
              <tr key={membership.id}>
                <td className="flex">
                  <img
                    src={membership.workspace.avatar}
                    className="mx-1 inline-block h-6 h-full w-6 rounded-full align-middle"
                  />
                  <span className="inline-block h-full align-middle"> </span>
                  <p className="inline-block align-middle text-sm line-clamp-1">
                    @{membership.workspace.handle}
                  </p>
                </td>
                <td className="">
                  {formik.values.emailConsent ? (
                    <input
                      type="checkbox"
                      id={`${membership.workspace.handle}-invitations`}
                      defaultChecked={formik.values[`${membership.workspace.handle}-invitations`]}
                      {...formik.getFieldProps(`${membership.workspace.handle}-invitations`)}
                    />
                  ) : (
                    // <input type="checkbox" className="w-fullalign-middle" />
                    <input
                      type="checkbox"
                      disabled
                      className="disabled:opacity-25"
                      defaultChecked={formik.values[`${membership.workspace.handle}-invitations`]}
                      {...formik.getFieldProps(`${membership.workspace.handle}-invitations`)}
                    />
                  )}
                </td>
                <td className="">
                  {formik.values.emailConsent ? (
                    <input
                      type="checkbox"
                      id={`${membership.workspace.handle}-approvals`}
                      defaultChecked={formik.values[`${membership.workspace.handle}-approvals`]}
                      {...formik.getFieldProps(`${membership.workspace.handle}-approvals`)}
                    />
                  ) : (
                    <input
                      type="checkbox"
                      disabled
                      className="disabled:opacity-25"
                      defaultChecked={formik.values[`${membership.workspace.handle}-approvals`]}
                      {...formik.getFieldProps(`${membership.workspace.handle}-approvals`)}
                    />
                  )}
                </td>
                <td className="">
                  {formik.values.emailConsent ? (
                    <input
                      type="checkbox"
                      id={`${membership.workspace.handle}-weeklyDigest`}
                      defaultChecked={formik.values[`${membership.workspace.handle}-weeklyDigest`]}
                      {...formik.getFieldProps(`${membership.workspace.handle}-weeklyDigest`)}
                    />
                  ) : (
                    <input
                      type="checkbox"
                      disabled
                      className="disabled:opacity-25"
                      defaultChecked={formik.values[`${membership.workspace.handle}-weeklyDigest`]}
                      {...formik.getFieldProps(`${membership.workspace.handle}-weeklyDigest`)}
                    />
                  )}
                </td>
                <td className="">
                  {formik.values.emailConsent ? (
                    <input
                      type="checkbox"
                      id={`${membership.workspace.handle}-collections`}
                      defaultChecked={formik.values[`${membership.workspace.handle}-collections`]}
                      {...formik.getFieldProps(`${membership.workspace.handle}-collections`)}
                    />
                  ) : (
                    <input
                      type="checkbox"
                      disabled
                      className="disabled:opacity-25"
                      defaultChecked={formik.values[`${membership.workspace.handle}-collections`]}
                      {...formik.getFieldProps(`${membership.workspace.handle}-collections`)}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

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

export default EmailSettings
