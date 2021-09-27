import { useRouter, BlitzPage } from "blitz"
import Layout from "app/core/layouts/Layout"
import { LoginForm } from "app/auth/components/LoginForm"

const LoginPage: BlitzPage = () => {
  const router = useRouter()

  return (
    <div>
      <LoginForm
        onSuccess={() => {
          const next = router.query.next
            ? decodeURIComponent(router.query.next as string)
            : "/dashboard"
          router.push(next)
        }}
      />
    </div>
  )
}

LoginPage.redirectAuthenticatedTo = "/dashboard"
LoginPage.getLayout = (page) => <Layout title="Log In">{page}</Layout>

export default LoginPage
