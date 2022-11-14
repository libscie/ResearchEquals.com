import { withBlitz } from "app/blitz-client"
import { useRouter } from "next/router"
import { useQueryErrorResetBoundary } from "@blitzjs/rpc"
import { AuthenticationError, AuthorizationError } from "blitz"

import {
  AppProps,
  ErrorBoundary,
  ErrorComponent as DefaultErrorComponent,
  ErrorFallbackProps,
} from "@blitzjs/next"

import LoginForm from "app/auth/components/LoginForm"

import "app/core/styles/index.css"
import "app/core/styles/algolia.css"

export default withBlitz(function App({ Component, pageProps }: AppProps) {
  const getLayout = Component.getLayout || ((page) => page)

  return (
    <ErrorBoundary
      FallbackComponent={RootErrorFallback}
      onReset={useQueryErrorResetBoundary().reset}
    >
      {getLayout(<Component {...pageProps} />)}
    </ErrorBoundary>
  )
})

function RootErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  const router = useRouter()

  if (error instanceof AuthenticationError) {
    router.push("/login").finally(null)
    resetErrorBoundary()

    return null
  } else if (error instanceof AuthorizationError) {
    return (
      <DefaultErrorComponent
        statusCode={error.statusCode}
        title="Sorry, you are not authorized to access this"
      />
    )
  } else {
    return (
      <DefaultErrorComponent
        statusCode={error.statusCode || 400}
        title={error.message || error.name}
      />
    )
  }
}
