import { BlitzPage, Link } from "blitz"
import Layout from "app/core/layouts/Layout"
import Navbar from "../core/components/Navbar"
import LayoutLoader from "app/core/components/LayoutLoader"

const Imprint: BlitzPage = () => {
  const page = "Imprint"
  const title = "Who runs this website?"

  return (
    <>
      <Navbar />
      <main className="bg-white dark:bg-gray-900 lg:relative">
        <div className="mx-4">
          <div className="mx-auto max-w-7xl pt-10 text-black dark:text-white md:p-0 md:pt-10">
            <p className="font-bold">{page.toUpperCase()}</p>
            <hr className="mt-4 mb-4 h-0.5 w-32 border-t-0 bg-amber-400 bg-gradient-to-r from-indigo-400 to-indigo-600 " />
            <article>
              <h1 className="text-5xl font-black sm:text-6xl">{title}</h1>
              <div role="doc-subtitle" className="mt-2 max-w-2xl text-2xl">
                <>
                  <p>
                    <Link href="https://libscie.org">
                      <a target="_blank">Liberate Science GmbH</a>
                    </Link>
                  </p>
                  <p>Ebertystraße 44</p>
                  <p>10249 Berlin (Germany)</p>
                </>
              </div>
            </article>
          </div>
          <div className="max-w-7xl pt-4 pb-8 text-black dark:text-white sm:mx-auto">
            <h2 className="mt-4 text-xl font-bold">CEO</h2>
            <p>Chris Hartgerink, PhD</p>
            <p>
              <a
                className="border-b-2 border-indigo-600 hover:bg-indigo-600 hover:text-white"
                href="tel:+491626818225"
              >
                +49 30 23 88 29 71
              </a>
            </p>
            <p>
              <a
                className="border-b-2 border-indigo-600 hover:bg-indigo-600 hover:text-white"
                href="mailto:info@libscie.org"
              >
                info@libscie.org
              </a>
            </p>
            <h2 className="mt-4 text-xl font-bold">Registration</h2>
            <p>Amtsgericht Charlottenburg (Berlin)</p>
            <p>HRB 211 450</p>
            <p>VAT ID DE326772207</p>
            <p>EORI DE804962659955787</p>
          </div>
        </div>
      </main>
    </>
  )
}

Imprint.suppressFirstRenderFlicker = true
Imprint.getLayout = (page) => (
  <Layout title="Imprint">
    <LayoutLoader>{page}</LayoutLoader>
  </Layout>
)

export default Imprint
