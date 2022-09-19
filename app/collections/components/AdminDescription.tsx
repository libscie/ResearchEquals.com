import { useMutation, validateZodSchema } from "blitz"
import { useFormik } from "formik"
import "quill/dist/quill.snow.css"
import { useEffect } from "react"
import toast from "react-hot-toast"
import { useQuill } from "react-quilljs"
import { z } from "zod"
import changeDescription from "../mutations/changeDescription"

const Description = ({ collection, refetchFn }) => {
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

  // console.log(quill.root.innerHTML)
  const formik = useFormik({
    initialValues: {
      description: "",
    },
    validate: validateZodSchema(
      z.object({
        description: z.string(),
      })
    ),
    onSubmit: async (values) => {},
  })

  return (
    <div className="">
      <h2 className="text-xl">A message from your editors</h2>
      <form
        onSubmit={formik.handleSubmit}
        onBlur={() => {
          if (quill.root.innerHTML != collection.description) {
            toast.promise(
              changeDescriptionMutation({
                id: collection.id,
                description: quill.root.innerHTML,
              }),
              {
                loading: "Saving updates",
                success: () => {
                  refetchFn()
                  return "Updated description"
                },
                error: "Update failed",
              }
            )
          }
        }}
      >
        <div className="mt-4 mb-16 h-auto w-full">
          <div ref={quillRef} className="" />
        </div>
      </form>
      {/* <div dangerouslySetInnerHTML={{ __html: collection.description }} className="quilljs" /> */}
    </div>
  )
}

export default Description
