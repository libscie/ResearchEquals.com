import { ReactNode } from "react"
import { Head, Link } from "blitz"
import CookieConsent from "react-cookie-consent"
import { Toaster } from "react-hot-toast"

type LayoutProps = {
  title?: string
  children: ReactNode
  headChildren?: ReactNode
}

const Layout = ({ title, children, headChildren }: LayoutProps) => {
  return (
    <>
      <Toaster position="bottom-center" reverseOrder={false} />
      <Head>
        <title>{title || "ResearchEquals"}</title>
        <link rel="icon" href="/favicon-32.png" />
        <script data-respect-dnt data-no-cookie async src="https://cdn.splitbee.io/sb.js"></script>
        {headChildren}
      </Head>
      <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        <div className="flex-grow">{children}</div>
      </div>
      <CookieConsent
        location="bottom"
        style={{
          background: "#574cfa",
          fontSize: "1rem",
          left: "50",
          maxWidth: "100%",
        }}
        buttonText="Got it"
        cookieName="web-app-tbd-website-cookie"
        buttonStyle={{
          backgroundColor: "#2c2683",
          color: "#fff",
          fontSize: "1rem",
        }}
        expires={150}
        onAccept={() => {
          console.log("Cookies acknowledged")
        }}
      >
        We use essential cookies to provide a secure webpage. See also our{" "}
        {/* TODO - Update link */}
        <Link href="https://www.notion.so/libscie/Terms-researchequals-com-c6a3f7eac4ce4bb2a748c23076acf6e4#8cb6d40e1f8443e0a62ec326e2f819a3">
          <a className="hover:no-underline hover:text-white underline" target="_blank">
            Data policy
          </a>
        </Link>
        .
      </CookieConsent>
    </>
  )
}

export default Layout
