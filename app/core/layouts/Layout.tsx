import Head from "next/head"
import Link from "next/link"
import { Routes } from "@blitzjs/next"
import { ReactNode, useEffect, useState } from "react"
import CookieConsent, { Cookies, getCookieConsentValue } from "react-cookie-consent"
import { Toaster } from "react-hot-toast"
import { RecoilRoot } from "recoil"

import AnnouncementBanner from "../components/AnnouncementBanner"
import { FooterApollo } from "../components/FooterApollo"

type LayoutProps = {
  title?: string
  children: ReactNode
  headChildren?: ReactNode
}

const Layout = ({ title, children, headChildren }: LayoutProps) => {
  const [cookie, setCookie] = useState(() => <></>)
  const [cookieAccepted, setCookieAccepted] = useState(
    getCookieConsentValue("researchequals-website-cookie") === "true"
  )

  const [isAnnouncementBannerOpen, setAnnouncementBannerOpen] = useState(true)

  return (
    <>
      {/* UNCOMMENT IF announcemen banner needs to be used */}
      {/* <AnnouncementBanner
      open={isAnnouncementBannerOpen}
      onClose={() => setAnnouncementBannerOpen(false)}
    >
      Want to learn about research modules? <br className="md:hidden" />
      <Link href="/">
        <a className="underline"> 👉 Join a ResearchEquals Cohort</a>
      </Link>
    </AnnouncementBanner> */}
      <Toaster position="bottom-center" reverseOrder={false} />
      <Head>
        <title>{title || "ResearchEquals"}</title>
        <link rel="icon" href="/favicon-32.png" />
        {headChildren}
      </Head>
      <RecoilRoot>
        <div className="flex min-h-screen flex-col bg-white text-gray-900 dark:bg-gray-900 dark:text-white">
          {/* <div className="z-50 w-screen bg-red-700 py-4 text-center text-white">
        <Link href="https://status.crossref.org/">
        <a target="_blank" className="underline">
        CrossRef services are interrupted.
        </a>
        </Link>{" "}
        Publishing not possible until resolved.
      </div> */}
          <div className="flex flex-grow flex-col">{children}</div>
        </div>
      </RecoilRoot>
      <FooterApollo />

      <CookieConsent
        location="bottom"
        style={{
          background: "#4f46e5",
          fontSize: "1rem",
          left: "50",
          maxWidth: "100%",
          borderTop: "1px solid #fff",
        }}
        buttonText="Consent"
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
          setCookieAccepted(true)
        }}
        enableDeclineButton
      >
        We use cookies for essential website security purposes. You can withdraw your consent for
        optional chat cookies at any time. See also our{" "}
        <Link
          href={Routes.PrivacyPage()}
          className="underline hover:text-white hover:no-underline"
          target="_blank"
        >
          Privacy policy
        </Link>
        .
      </CookieConsent>
    </>
  )
}

export default Layout
