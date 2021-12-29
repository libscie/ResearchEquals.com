import changeBio from "app/workspaces/mutations/changeBio"
import changePronouns from "app/workspaces/mutations/changePronouns"
import changeUrl from "app/workspaces/mutations/changeUrl"
import { Link, useMutation, validateZodSchema } from "blitz"
import { useFormik } from "formik"
import { z } from "zod"
import { Renew32 } from "@carbon/icons-react"
import toast from "react-hot-toast"
import { CheckIcon, XIcon } from "@heroicons/react/solid"

const WorkspaceSettings = ({ workspace, setIsOpen }) => {
  const [changeBioMutation, { isSuccess: bioChanged }] = useMutation(changeBio)
  const [changePronounsMutation, { isSuccess: pronounsChanged }] = useMutation(changePronouns)
  const [changeUrlMutation, { isSuccess: urlChanged }] = useMutation(changeUrl)

  const formik = useFormik({
    initialValues: {
      bio: workspace.bio,
      pronouns: workspace.pronouns,
      profileUrl: workspace.url,
    },
    validate: validateZodSchema(
      z.object({
        bio: z.any(),
        pronouns: z.any(),
        profileUrl: z.any(),
      })
    ),
    onSubmit: async (values) => {
      try {
        if (values.bio !== workspace.bio) {
          try {
            z.string().parse(values.bio)
            await changeBioMutation({
              bio: values.bio,
            })
            toast.success("Updated bio")
          } catch (error) {
            toast.error("Bio needs to be a string")
          }
        }

        if (values.pronouns !== workspace.pronouns) {
          try {
            z.string().max(20).parse(values.pronouns)
            await changePronounsMutation({
              pronouns: values.pronouns,
            })
            toast.success("Updated pronouns")
          } catch (error) {
            toast.error("Pronouns can be 20 characters")
          }
        }

        if (values.profileUrl !== workspace.url && values.profileUrl !== "") {
          try {
            z.string().url().parse(values.profileUrl)
            await changeUrlMutation({
              url: values.profileUrl,
            })
            toast.success("Updated URL")
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
              <Link href="api/auth/orcid">
                <button className="flex py-2 px-4 bg-green-50 dark:bg-gray-800 text-green-700 dark:text-green-500 hover:bg-green-200 dark:hover:bg-gray-700 dark:border dark:border-gray-600 dark:hover:border-gray-400 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-green-500 mb-1">
                  Connect your ORCID
                </button>
              </Link>
            ) : (
              <>
                <p className="">{workspace!.name}</p>
                <p className="flex">
                  {workspace!.orcid}
                  <span className="inline-block h-full align-middle"> </span>
                  <p className="inline-block align-middle">
                    <Link href="api/auth/orcid">
                      <button className="inline-block align-middle">
                        <Renew32 className="cursor-pointer w-5 h-5 " />{" "}
                      </button>
                    </Link>
                  </p>
                </p>
              </>
            )}
            <p className="text-xs leading-4 font-normal">@{workspace.handle}</p>
          </p>
        </div>
      </div>
      <form onSubmit={formik.handleSubmit}>
        <div className="my-4 text-gray-900 dark:text-gray-200 px-2">
          <label htmlFor="bio" className="my-1 block text-sm font-medium">
            Bio
          </label>
          <div className="mt-1">
            <textarea
              rows={4}
              id="bio"
              className="bg-transparent focus:ring-indigo-500 focus:border-indigo-500 block w-11/12 sm:text-sm border border-gray-300 dark:border-gray-600  text-gray-900 dark:text-gray-200 rounded"
              {...formik.getFieldProps("bio")}
              defaultValue={workspace.bio}
            />
            {formik.touched.bio && formik.errors.bio ? (
              <div className="font-normal text-sm">{formik.errors.bio}</div>
            ) : null}
          </div>
        </div>
        <div className="my-4 text-gray-900 dark:text-gray-200 px-2">
          <label htmlFor="pronouns" className="my-1 block text-sm font-medium">
            Pronouns
          </label>
          <div className="mt-1 text-gray-900 dark:text-gray-200">
            <input
              id="pronouns"
              type="pronouns"
              autoComplete="pronouns"
              className="bg-transparent appearance-none block w-11/12 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded placeholder-gray-400 placeholder-font-normal focus:outline-none focus:ring-indigo-500 focus:border-indigo-500  font-normal text-sm "
              {...formik.getFieldProps("pronouns")}
            />
            {formik.touched.pronouns && formik.errors.pronouns ? (
              <div className="font-normal text-sm">{formik.errors.pronouns}</div>
            ) : null}
          </div>
        </div>
        <div className="my-4 text-gray-900 dark:text-gray-200 px-2">
          <label htmlFor="profileUrl" className="my-1 block text-sm font-medium">
            Profile URL
          </label>

          <div className="mt-1">
            <input
              id="profileUrl"
              type="url"
              autoComplete="profileUrl"
              className=" bg-transparent appearance-none block w-11/12 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded  placeholder-gray-400 placeholder-font-normal focus:outline-none focus:ring-indigo-500 focus:border-indigo-500  font-normal text-sm "
              {...formik.getFieldProps("profileUrl")}
            />
            {formik.touched.profileUrl && formik.errors.profileUrl ? (
              <div className="font-normal text-sm">{formik.errors.profileUrl}</div>
            ) : null}
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
              <XIcon className="w-4 h-4 fill-current text-red-500 pt-1" />
              Cancel
            </button>
          </div>
          <button
            type="submit"
            className="flex mr-4 py-2 px-4 bg-green-50 dark:bg-gray-800 text-green-700 dark:text-green-500 hover:bg-green-200 dark:hover:bg-gray-700 dark:border dark:border-gray-600 dark:hover:border-gray-400 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-green-500"
          >
            <CheckIcon className="w-4 h-4 fill-current text-green-500 pt-1" />
            Save
          </button>
        </div>
      </form>
    </>
  )
}

export default WorkspaceSettings
