import { useMutation } from "next/data-client"
import { Formik, Form } from "formik"

import resendVerification from "../../auth/mutations/resendVerification"

const Banner = ({ message }) => {
  const [resendVerificationMutation, { isSuccess }] = useMutation(resendVerification)
  return (
    <div className="absolute flex bottom-0 w-screen bg-yellow-400 inset-x-0 p-2 sm:p-5 z-100">
      <p className="w-11/12">{message}</p>
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
            <button className="bg-indigo-300 p-1 rounded" type="submit">
              Send verification
            </button>
          </Form>
        </Formik>
      )}
    </div>
  )
}

export default Banner
