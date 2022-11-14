import { useMutation } from "@blitzjs/rpc"
import { Field, Form, Formik } from "formik"
import toast from "react-hot-toast"
import { useFormik } from "formik"
import { z } from "zod"
import { validateZodSchema } from "blitz"
import changeCollectionTitle from "../mutations/changeCollectionTitle"

const AdminTitle = ({ collection, refetchFn, isAdmin }) => {
  const [changeTitleMutation] = useMutation(changeTitle)

  const formik = useFormik({
    initialValues: {
      title: collection.title,
    },
    validate: validateZodSchema(
      z.object({
        title: z.string().min(1).max(300),
      })
    ),
    onSubmit: async (values) => {
      toast
        .promise(
          changeTitleMutation({
            id: collection.id,
            title: values.title,
          }),
          {
            loading: "Updating title...",
            success: () => {
              refetchFn()
              return "Updated title"
            },
            error: "Failed to update title",
          }
        )
        .catch(() => {})
    },
  })

  return (
    <>
      {(collection.title === null || !collection.public || collection.upgraded) && isAdmin ? (
        <>
          <form
            className="module divide-y divide-gray-100 border-0 border-gray-100 bg-white pb-2 dark:divide-gray-600 dark:border-gray-600 dark:bg-gray-900"
            onSubmit={formik.handleSubmit}
          >
            <label htmlFor="title" className="sr-only">
              title
            </label>
            <textarea
              rows={1}
              id="title"
              className="w-full select-none overflow-auto border-0 bg-white text-center text-3xl focus:ring-0 dark:bg-gray-900 md:text-5xl lg:text-6xl "
              {...formik.getFieldProps("title")}
            />
            {formik.touched.title && formik.errors.title ? (
              <span className="text-red-500">{` - ${formik.errors.title}`}</span>
            ) : null}

            <button
              type="submit"
              className="mx-auto my-1 flex rounded-md bg-emerald-50 py-2 px-4 text-sm font-medium text-emerald-700 hover:bg-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-0 dark:border dark:border-gray-600 dark:bg-gray-800 dark:text-emerald-500 dark:hover:border-gray-400 dark:hover:bg-gray-700"
            >
              Save Title
            </button>
          </form>
        </>
      ) : (
        <h2 className="my-4 w-full border-0 bg-white text-center text-3xl focus:ring-0 dark:bg-gray-900 md:text-5xl lg:text-6xl">
          {collection.title}
        </h2>
      )}
    </>
  )
}

export default AdminTitle
