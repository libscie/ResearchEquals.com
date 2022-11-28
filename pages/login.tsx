import { BlitzPage } from "@blitzjs/next"
import { useRouter } from "next/router"
import Layout from "app/core/layouts/Layout"
import { LoginForm } from "app/auth/components/LoginForm"

const LoginPage: BlitzPage = () => {
  const router = useRouter()

  return (
    <LoginForm
      onSuccess={async () => {
        const next = router.query.next
          ? decodeURIComponent(router.query.next as string)
          : "/dashboard"
        await router.push(next)
      }}
    />
  )
}

LoginPage.redirectAuthenticatedTo = "/dashboard"
LoginPage.getLayout = (page) => <Layout title="Log In">{page}</Layout>

export default LoginPage
