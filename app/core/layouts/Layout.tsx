import { ReactNode } from "react"
import { Head, Link } from "blitz"
import CookieConsent from "react-cookie-consent"

type LayoutProps = {
  title?: string
  children: ReactNode
}

const Layout = ({ title, children }: LayoutProps) => {
  return (
    <>
      <Head>
        <title>{title || "web-app-tbd"}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="w-screen h-screen bg-white dark:bg-gray-900 text-black dark:text-white">
        {children}
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
        <Link href="https://www.notion.so/libscie/Terms-libscie-org-6f22bba7d3314ee2915ae4419e55317c#6021cfc8513f44b89aac6d57eea95d11">
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
