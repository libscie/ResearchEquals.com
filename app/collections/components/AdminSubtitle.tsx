import { useMutation } from "blitz"
import { Field, Form, Formik } from "formik"
import toast from "react-hot-toast"
import changeSubtitle from "../mutations/changeSubtitle"

const Subtitle = ({ collection, refetchFn }) => {
  const [changeSubtitleMutation, { isSuccess: isSubtitleSuccess }] = useMutation(changeSubtitle)

  return (
    <>
      {collection.subtitle === null || !collection.public || collection.upgraded ? (
        <>
          <Formik
            initialValues={{
              subtitle: "",
            }}
            onSubmit={() => {}}
          >
            <Form
              className="my-4"
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
                placeholder={collection.subtitle}
                type="text"
                className="w-full border-0 text-center text-sm font-medium leading-5 focus:ring-0 dark:bg-gray-900 md:text-base "
              />
            </Form>
          </Formik>
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
