import { useMutation } from "@blitzjs/rpc"
import { Field, Form, Formik } from "formik"
import toast from "react-hot-toast"
import changeSubtitle from "../mutations/changeSubtitle"
import { useFormik } from "formik"
import { z } from "zod"
import { validateZodSchema } from "blitz"

const Subtitle = ({ collection, refetchFn, isAdmin }) => {
  const [changeSubtitleMutation, { isSuccess: isSubtitleSuccess }] = useMutation(changeSubtitle)

  const formik = useFormik({
    initialValues: {
      subtitle: collection.subtitle,
    },
    validate: validateZodSchema(
      z.object({
        subtitle: z.string().min(1).max(300),
      })
    ),
    onSubmit: async (values) => {
      toast
        .promise(
          changeSubtitleMutation({
            id: collection.id,
            subtitle: values.subtitle,
          }),
          {
            loading: "Updating subtitle...",
            success: () => {
              refetchFn()
              return "Updated subtitle"
            },
            error: "Failed to update subtitle",
          }
        )
        .catch(() => {})
    },
  })

  return (
    <>
      {(collection.subtitle === null || !collection.public || collection.upgraded) && isAdmin ? (
        <>
          <form
            className="module my-2 bg-white pb-2 dark:border-gray-600 dark:bg-gray-900"
            onSubmit={formik.handleSubmit}
          >
            <label htmlFor="subtitle" className="sr-only">
              subtitle
            </label>
            <textarea
              rows={1}
              id="subtitle"
              className="w-full border-0 text-center text-sm font-medium leading-5 focus:ring-0 dark:bg-gray-900 md:text-base "
              {...formik.getFieldProps("subtitle")}
            />
            {formik.touched.subtitle && formik.errors.subtitle ? (
              <span className="text-red-500">{` - ${formik.errors.subtitle}`}</span>
            ) : null}
            <button
              type="submit"
              className="mx-auto my-1 flex rounded-md bg-emerald-50 py-2 px-4 text-sm font-medium text-emerald-700 hover:bg-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-0 dark:border dark:border-gray-600 dark:bg-gray-800 dark:text-emerald-500 dark:hover:border-gray-400 dark:hover:bg-gray-700"
            >
              Save Subtitle
            </button>
          </form>
        </>
      ) : (
        <h2 className="mx-auto text-center text-sm font-medium leading-5 md:text-base">
          {collection.subtitle}
        </h2>
      )}
    </>
  )
}

export default Subtitle
