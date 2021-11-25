import changeBio from "app/workspaces/mutations/changeBio"
import changePronouns from "app/workspaces/mutations/changePronouns"
import changeUrl from "app/workspaces/mutations/changeUrl"
import { Link, useMutation, validateZodSchema } from "blitz"
import { useFormik } from "formik"
import { z } from "zod"
import { Renew32 } from "@carbon/icons-react"

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
        bio: z.string(),
        pronouns: z.string().max(20),
        profileUrl: z.string().url(),
      })
    ),
    onSubmit: async (values) => {
      try {
        if (values.bio !== workspace.bio) {
          await changeBioMutation({
            handle: workspace!.handle,
            bio: values.bio,
          })
        }

        if (values.pronouns !== workspace.pronouns) {
          await changePronounsMutation({
            handle: workspace!.handle,
            pronouns: values.pronouns,
          })
        }

        if (values.profileUrl !== workspace.url) {
          await changeUrlMutation({
            handle: workspace!.handle,
            url: values.profileUrl,
          })
        }

        setIsOpen(false)
      } catch (error) {
        alert(error.toString())
      }
    },
  })

  return (
    <>
      <div className="flex my-4">
        <div>
          <img src={workspace!.avatar} width={120} height={120} className="rounded-full" />
        </div>
        <div className="flex-grow ml-2">
          <span className="inline-block h-full align-middle"> </span>
          <p className="inline-block align-middle">
            {!workspace!.orcid ? (
              <Link href="api/auth/orcid">
                <button className="py-2 px-4 bg-green-500 rounded text-white">
                  Connect your ORCID
                </button>
              </Link>
            ) : (
              <>
                <p className="text-gray-900">{workspace!.name}</p>
                <p className="text-gray-500 flex">
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
            <p className="text-gray-500">@{workspace.handle}</p>
          </p>
        </div>
      </div>
      <form onSubmit={formik.handleSubmit}>
        <div className="my-4">
          <label
            htmlFor="bio"
            className="my-1 block text-sm font-medium text-gray-700 dark:text-gray-100"
          >
            Bio
          </label>
          <div className="mt-1">
            <textarea
              rows={4}
              id="bio"
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-11/12 sm:text-sm border border-gray-500 bg-gray-300 dark:bg-gray-800 rounded-md"
              {...formik.getFieldProps("bio")}
              defaultValue={workspace.bio}
            />
            {formik.touched.bio && formik.errors.bio ? (
              <div className="font-normal text-sm">{formik.errors.bio}</div>
            ) : null}
          </div>
        </div>
        <div className="my-4">
          <label
            htmlFor="pronouns"
            className=" my-1 block text-sm font-medium text-gray-700 dark:text-gray-100"
          >
            Pronouns
          </label>
          <div className="mt-1">
            <input
              id="pronouns"
              type="pronouns"
              autoComplete="pronouns"
              className="appearance-none block w-11/12 px-3 py-2 border border-gray-500 bg-gray-300 dark:bg-gray-800  dark:border-gray-500 rounded-md shadow-sm placeholder-gray-400 placeholder-font-normal focus:outline-none focus:ring-indigo-500 focus:border-indigo-500  font-normal text-sm "
              {...formik.getFieldProps("pronouns")}
            />
            {formik.touched.pronouns && formik.errors.pronouns ? (
              <div className="font-normal text-sm">{formik.errors.pronouns}</div>
            ) : null}
          </div>
        </div>
        <div className="my-4">
          <label
            htmlFor="profileUrl"
            className=" my-1 block text-sm font-medium text-gray-700 dark:text-gray-100"
          >
            Profile URL
          </label>

          <div className="mt-1">
            <input
              id="profileUrl"
              type="url"
              autoComplete="profileUrl"
              className="appearance-none block w-11/12 px-3 py-2 border border-gray-500 bg-gray-300 dark:bg-gray-800  dark:border-gray-500 rounded-md shadow-sm placeholder-gray-400 placeholder-font-normal focus:outline-none focus:ring-indigo-500 focus:border-indigo-500  font-normal text-sm "
              {...formik.getFieldProps("profileUrl")}
            />
            {formik.touched.profileUrl && formik.errors.profileUrl ? (
              <div className="font-normal text-sm">{formik.errors.profileUrl}</div>
            ) : null}
          </div>
        </div>

        <div className="sticky bottom-0 py-2 bg-gray-300">
          <button
            type="submit"
            className="px-4 py-2 border text-medium border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Save
          </button>
          <button
            type="submit"
            className="mx-2 px-4 py-2 border text-medium border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            onClick={() => {
              setIsOpen(false)
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </>
  )
}

export default WorkspaceSettings
