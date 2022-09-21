import { useMutation } from "blitz"
import { Field, Form, Formik } from "formik"
import toast from "react-hot-toast"
import changeTitle from "../mutations/changeTitle"

const AdminTitle = ({ collection, refetchFn }) => {
  const [changeTitleMutation] = useMutation(changeTitle)

  return (
    <>
      {collection.title === null || !collection.public || collection.upgraded ? (
        <>
          <Formik
            initialValues={{
              title: "",
            }}
            onSubmit={() => {}}
          >
            <Form
              className="my-4 w-full"
              onBlur={(values) => {
                if (collection.title != values.target.defaultValue) {
                  toast.promise(
                    changeTitleMutation({
                      id: collection.id,
                      title: values.target.defaultValue,
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
                }
              }}
            >
              <label htmlFor="title" className="sr-only">
                title
              </label>
              <Field
                id="title"
                name="title"
                placeholder={collection.title}
                type="text"
                className="w-full select-none overflow-auto border-0 bg-white text-center text-3xl focus:ring-0 dark:bg-gray-900 md:text-5xl lg:text-6xl "
              />
            </Form>
          </Formik>
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
