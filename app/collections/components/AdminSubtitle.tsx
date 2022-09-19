import { useMutation } from "blitz"
import { Field, Form, Formik } from "formik"
import toast from "react-hot-toast"
import changeSubtitle from "../mutations/changeSubtitle"

const Subtitle = ({ collection, refetchFn }) => {
  const [changeSubtitleMutation, { isSuccess: isSubtitleSuccess }] = useMutation(changeSubtitle)

  return (
    <>
      {collection.subtitle === null || !collection.public ? (
        <>
          <Formik
            initialValues={{
              subtitle: "",
            }}
            onSubmit={() => {}}
          >
            <Form
              onBlur={(values) => {
                if (collection.subtitle != values.target.defaultValue) {
                  toast.promise(
                    changeSubtitleMutation({
                      id: collection.id,
                      subtitle: values.target.defaultValue,
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
                }
              }}
            >
              <label htmlFor="subtitle" className="sr-only">
                subtitle
              </label>
              <Field
                id="subtitle"
                name="subtitle"
                placeholder={collection.subtitle || "Your subtitle here"}
                type="text"
                className="w-full select-none border-0 text-center text-2xl focus:ring-0 dark:bg-gray-900 "
              />
            </Form>
          </Formik>
        </>
      ) : (
        <h2 className="mx-auto text-center text-base font-medium leading-5">
          {collection.subtitle}
        </h2>
      )}
    </>
  )
}

export default Subtitle
