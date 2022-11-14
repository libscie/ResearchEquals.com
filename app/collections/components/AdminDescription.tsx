import { useMutation } from "@blitzjs/rpc"
import { validateZodSchema } from "blitz"
import { useFormik } from "formik"
import "quill/dist/quill.snow.css"
import { useEffect } from "react"
import toast from "react-hot-toast"
import { useQuill } from "react-quilljs"
import { z } from "zod"
import changeDescription from "../mutations/changeDescription"

const Description = ({ collection, refetchFn, isAdmin }) => {
  const [changeDescriptionMutation, { isSuccess: isDescriptionSuccess }] =
    useMutation(changeDescription)
  const { quill, quillRef } = useQuill({
    modules: {
      toolbar: [["bold", "italic", "underline", "strike", "link"]],
    },
  })

  useEffect(() => {
    if (quill) {
      quill.clipboard.dangerouslyPasteHTML(collection.description)
    }
  }, [quill])

  const formik = useFormik({
    initialValues: {
      description: collection.description,
    },
    validate: validateZodSchema(
      z.object({
        description: z.string(),
      })
    ),
    onSubmit: async (values) => {
      if (quill.root.innerHTML != collection.description) {
        toast.promise(
          changeDescriptionMutation({
            id: collection.id,
            description: quill.root.innerHTML,
          }),
          {
            loading: "Saving description",
            success: () => {
              refetchFn()
              return "Updated description"
            },
            error: "Update failed",
          }
        )
      }
    },
  })

  return (
    <div className="mx-4 my-8 xl:mx-0">
      <h2 className="text-xl">A message from your editor{collection.editors.length > 1 && "s"}</h2>
      {isAdmin ? (
        <form onSubmit={formik.handleSubmit}>
          <div className="my-4 h-auto w-full">
            <div ref={quillRef} className="" />
          </div>
          <button
            type="submit"
            className="mx-auto my-1 flex rounded-md bg-emerald-50 py-2 px-4 text-sm font-medium text-emerald-700 hover:bg-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-0 dark:border dark:border-gray-600 dark:bg-gray-800 dark:text-emerald-500 dark:hover:border-gray-400 dark:hover:bg-gray-700"
          >
            Save Description
          </button>
        </form>
      ) : (
        <div dangerouslySetInnerHTML={{ __html: collection.description }} className="quilljs" />
      )}
    </div>
  )
}

export default Description
