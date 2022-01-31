import changeBio from "app/workspaces/mutations/changeBio"
import changePronouns from "app/workspaces/mutations/changePronouns"
import changeUrl from "app/workspaces/mutations/changeUrl"
import { Link, useMutation, validateZodSchema } from "blitz"
import { useFormik } from "formik"
import { z } from "zod"
import { Checkmark32, Close32, Renew32 } from "@carbon/icons-react"
import toast from "react-hot-toast"
import ReactTooltip from "react-tooltip"
import changeLastName from "../../workspaces/mutations/changeLastName"
import changeFirstName from "../../workspaces/mutations/changeFirstName"

const WorkspaceSettings = ({ workspace, setIsOpen }) => {
  const [changeFirstNameMutation] = useMutation(changeFirstName)
  const [changeLastNameMutation] = useMutation(changeLastName)
  const [changeBioMutation] = useMutation(changeBio)
  const [changePronounsMutation] = useMutation(changePronouns)
  const [changeUrlMutation] = useMutation(changeUrl)

  const formik = useFormik({
    initialValues: {
      firstName: workspace.firstName,
      lastName: workspace.lastName,
      bio: workspace.bio,
      pronouns: workspace.pronouns,
      profileUrl: workspace.url,
    },
    validate: validateZodSchema(
      z.object({
        firstName: z.any(),
        lastName: z.any(),
        bio: z.any(),
        pronouns: z.any(),
        profileUrl: z.any(),
      })
    ),
    onSubmit: async (values) => {
      try {
        if (values.firstName !== workspace.firstName) {
          try {
            z.string().parse(values.firstName)
            toast.promise(
              changeFirstNameMutation({
                firstName: values.firstName,
              }),
              {
                loading: "Saving...",
                success: "Updated first name",
                error: "Hmm that didn't work first name...",
              }
            )
          } catch (error) {
            toast.error("First name needs to be a string")
          }
        }

        if (values.lastName !== workspace.lastName) {
          try {
            z.string().parse(values.lastName)
            toast.promise(
              changeLastNameMutation({
                lastName: values.lastName,
              }),
              {
                loading: "Saving...",
                success: "Updated last name",
                error: "Hmm that didn't work...",
              }
            )
          } catch (error) {
            toast.error("Last name needs to be a string")
          }
        }

        if (values.bio !== workspace.bio) {
          try {
            z.string().parse(values.bio)
            toast.promise(
              changeBioMutation({
                bio: values.bio,
              }),
              {
                loading: "Saving...",
                success: "Updated bio",
                error: "Hmm that didn't work...",
              }
            )
          } catch (error) {
            toast.error("Bio needs to be a string")
          }
        }

        if (values.pronouns !== workspace.pronouns) {
          try {
            z.string().max(20).parse(values.pronouns)
            toast.promise(
              changePronounsMutation({
                pronouns: values.pronouns,
              }),
              {
                loading: "Saving...",
                success: "Updated pronouns",
                error: "Hmm that didn't work...",
              }
            )
          } catch (error) {
            toast.error("Pronouns can be 20 characters")
          }
        }

        if (values.profileUrl !== workspace.url && values.profileUrl !== "") {
          try {
            z.string().url().parse(values.profileUrl)
            toast.promise(
              changeUrlMutation({
                url: values.profileUrl,
              }),
              {
                loading: "Saving...",
                success: "Updated URL",
                error: (e) => {
                  return `Error: ${e}`
                },
              }
            )
          } catch (error) {
            toast.error("Enter a valid URL")
          }
        }

        setIsOpen(false)
        // TODO: Add remove Url mutation when empty
      } catch (error) {
        alert(error.toString())
      }
    },
  })

  return (
    <>
      <div className="flex my-4 p-2">
        <div>
          <img
            src={workspace!.avatar}
            width={120}
            height={120}
            className="rounded-full h-14 w-14 max-h-14 max-w-14"
          />
        </div>
        <div className="flex-grow ml-2 text-gray-900 dark:text-gray-200">
          <span className="inline-block h-full align-middle"> </span>
          <p className="inline-block align-middle">
            {!workspace!.orcid ? (
              <Link href="/api/auth/orcid">
                <button className="flex py-2 px-4 bg-green-50 dark:bg-gray-800 text-green-700 dark:text-green-500 hover:bg-green-200 dark:hover:bg-gray-700 dark:border dark:border-gray-600 dark:hover:border-gray-400 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-green-500 mb-1">
                  Connect your ORCID
                </button>
              </Link>
            ) : (
              <>
                <p className="text-sm font-medium">{workspace!.name}</p>
                <p className="flex text-sm font-medium">{workspace!.orcid}</p>
              </>
            )}
            <p className="text-sm leading-4 font-normal">@{workspace.handle}</p>
          </p>
        </div>
      </div>
      <form onSubmit={formik.handleSubmit}>
        <div className="my-4 text-gray-900 dark:text-gray-200 px-2">
          <label htmlFor="firstName" className="my-1 block text-sm font-medium">
            First Name{" "}
            {formik.touched.firstName && formik.errors.firstName
              ? " - " + formik.errors.firstName
              : null}
          </label>
          <div className="mt-1 text-gray-900 dark:text-gray-200">
            <input
              id="firstName"
              type="firstName"
              autoComplete="firstName"
              className="bg-transparent appearance-none block w-11/12 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded placeholder-gray-400 placeholder-font-normal focus:outline-none focus:ring-indigo-500 focus:border-indigo-500  font-normal text-sm "
              {...formik.getFieldProps("firstName")}
            />
          </div>
        </div>
        <div className="my-4 text-gray-900 dark:text-gray-200 px-2">
          <label htmlFor="lastName" className="my-1 block text-sm font-medium">
            Last Name{" "}
            {formik.touched.lastName && formik.errors.lastName
              ? " - " + formik.errors.lastName
              : null}
          </label>
          <div className="mt-1 text-gray-900 dark:text-gray-200">
            <input
              id="lastName"
              type="lastName"
              autoComplete="lastName"
              className="bg-transparent appearance-none block w-11/12 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded placeholder-gray-400 placeholder-font-normal focus:outline-none focus:ring-indigo-500 focus:border-indigo-500  font-normal text-sm "
              {...formik.getFieldProps("lastName")}
            />
          </div>
        </div>
        <div className="my-4 text-gray-900 dark:text-gray-200 px-2">
          <label htmlFor="bio" className="my-1 block text-sm font-medium">
            Bio {formik.touched.bio && formik.errors.bio ? " - " + formik.errors.bio : null}
          </label>
          <div className="mt-1">
            <textarea
              rows={4}
              id="bio"
              className="bg-transparent focus:ring-indigo-500 focus:border-indigo-500 block w-11/12 sm:text-sm border border-gray-300 dark:border-gray-600  text-gray-900 dark:text-gray-200 rounded"
              {...formik.getFieldProps("bio")}
              defaultValue={workspace.bio}
            />
          </div>
        </div>
        <div className="my-4 text-gray-900 dark:text-gray-200 px-2">
          <label htmlFor="pronouns" className="my-1 block text-sm font-medium">
            Pronouns{" "}
            {formik.touched.pronouns && formik.errors.pronouns
              ? " - " + formik.errors.pronouns
              : null}
          </label>
          <div className="mt-1 text-gray-900 dark:text-gray-200">
            <input
              id="pronouns"
              type="pronouns"
              autoComplete="pronouns"
              placeholder="they/them"
              className="bg-transparent appearance-none block w-11/12 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded placeholder-gray-400 placeholder-font-normal focus:outline-none focus:ring-indigo-500 focus:border-indigo-500  font-normal text-sm "
              {...formik.getFieldProps("pronouns")}
            />
          </div>
        </div>
        <div className="my-4 text-gray-900 dark:text-gray-200 px-2">
          <label htmlFor="profileUrl" className="my-1 block text-sm font-medium">
            Profile URL{" "}
            {formik.touched.profileUrl && formik.errors.profileUrl
              ? " - " + formik.errors.profileUrl
              : null}
          </label>
          <div className="mt-1">
            <input
              id="profileUrl"
              type="url"
              autoComplete="profileUrl"
              placeholder="https://twitter.com/you"
              className=" bg-transparent appearance-none block w-11/12 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded  placeholder-gray-400 placeholder-font-normal focus:outline-none focus:ring-indigo-500 focus:border-indigo-500  font-normal text-sm "
              {...formik.getFieldProps("profileUrl")}
            />
          </div>
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
          >
            <Checkmark32 className="w-4 h-4 fill-current text-green-500 pt-1" aria-hidden="true" />
            Save
          </button>
        </div>
      </form>
    </>
  )
}

export default WorkspaceSettings
