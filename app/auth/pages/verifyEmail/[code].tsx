import verifyEmailMutation from "app/auth/mutations/verify-email"
import { BlitzPage, Router, useMutation, useParam, useRouterQuery } from "blitz"
import { useEffect, useState } from "react"
import Layout from "app/core/layouts/Layout"

const VerifyMail: BlitzPage = () => {
  const code = useParam("code", "string")
  const [verifyEmail] = useMutation(verifyEmailMutation)
  const [error, setError] = useState(false)
  const userId = useRouterQuery().userId

  console.log(userId)

  useEffect(() => {
    if (!code) {
      return
    }

    Router.prefetch("/dashboard")

    verifyEmail({ code, userId }).then((success) => {
      if (success) {
        Router.replace("/dashboard")
      } else {
        setError(true)
      }
    })
  }, [code, setError, verifyEmail])

  return (
    <div className="flex justify-center items-center mt-8">
      {error ? (
        "An Error ocurred"
      ) : (
        <svg
          className="animate-spin -ml-1 mr-3 h-10 w-10 text-orange-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
    </div>
  )
}

VerifyMail.getLayout = (page) => <Layout title="Verifying Email ...">{page}</Layout>

export default VerifyMail
