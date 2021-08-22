import { ReactNode } from "react"
import { Head } from "blitz"

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
    </>
  )
}

export default Layout
