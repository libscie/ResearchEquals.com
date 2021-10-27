import { Formik, Form } from "formik"
import { useMutation } from "blitz"
import { ExclamationIcon } from "@heroicons/react/solid"

import resendVerification from "../../auth/mutations/resendVerification"

const Banner = ({ message }) => {
  const [resendVerificationMutation, { isSuccess }] = useMutation(resendVerification)
  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-2">
      <div className="flex">
        <div className="flex-shrink-0">
          <ExclamationIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
        </div>
        <div className="ml-3 flex-1 md:flex md:justify-between">
          <p className="text-sm text-yellow-700">{message}</p>
          <p className="mt-3 text-sm md:mt-0 md:ml-6">
            {isSuccess ? (
              <p>Email sent!</p>
            ) : (
              <Formik
                initialValues={{}}
                onSubmit={async () => {
                  try {
                    await resendVerificationMutation()
                  } catch (error) {
                    alert("Error saving product")
                  }
                }}
              >
                <Form>
                  <button
                    className="whitespace-nowrap font-medium text-yellow-700 hover:text-yellow-600"
                    type="submit"
                  >
                    Send verification
                  </button>
                </Form>
              </Formik>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}

export default Banner
