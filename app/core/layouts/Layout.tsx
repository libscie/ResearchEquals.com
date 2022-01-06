import { ReactNode, useEffect } from "react"
import { Head, Link } from "blitz"
import CookieConsent, { Cookies, getCookieConsentValue } from "react-cookie-consent"
import { Toaster } from "react-hot-toast"
import Chatra from "@chatra/chatra"

let config = {
  setup: {
    colors: {
      buttonText: "#fff",
      buttonBg: "#574cfa",
    },
  },
  ID: "vZo7KBf3WqmQPPasZ",
}

type LayoutProps = {
  title?: string
  children: ReactNode
}

const Layout = ({ title, children }: LayoutProps) => {
  useEffect(() => {
    if (getCookieConsentValue("researchequals-website-cookie") === "true") {
      Chatra("init", config)
    }
  }, [])

  return (
    <>
      <Toaster position="bottom-center" reverseOrder={false} />
      <Head>
        <title>{title || "ResearchEquals"}</title>
        <link rel="icon" href="/favicon-32.png" />
        <script data-respect-dnt data-no-cookie async src="https://cdn.splitbee.io/sb.js"></script>
      </Head>
      <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        <div className="flex-grow">{children}</div>
      </div>
      <CookieConsent
        location="bottom"
        style={{
          background: "#4f46e5",
          fontSize: "1rem",
          left: "50",
          maxWidth: "100%",
        }}
        buttonText="Accept"
        declineButtonText="Decline"
        cookieName="researchequals-website-cookie"
        buttonStyle={{
          backgroundColor: "#059669",
          color: "#fff",
          fontSize: "1rem",
        }}
        declineButtonStyle={{
          backgroundColor: "#db2777",
          color: "#fff",
          fontSize: "1rem",
        }}
        expires={150}
        onAccept={() => {
          Chatra("init", config)
        }}
        enableDeclineButton
      >
        Essential cookies are required for security purposes. Optional cookies for live chat can be
        declined or accepted. See also our{" "}
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
