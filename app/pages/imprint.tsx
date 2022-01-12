import { BlitzPage, Link, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import Navbar from "../core/components/Navbar"
import Footer from "../core/components/Footer"
import LayoutLoader from "app/core/components/LayoutLoader"

const Imprint: BlitzPage = () => {
  const page = "Imprint"
  const title = "Who runs this website?"

  return (
    <>
      <Navbar />
      <main className="lg:relative bg-white dark:bg-gray-900">
        <div className="mx-2">
          <div className="max-w-7xl mx-auto pt-10 text-black dark:text-white md:p-0 md:pt-10">
            <p className="font-bold">{page.toUpperCase()}</p>
            <hr className="w-32 mt-4 mb-4 border-t-0 bg-gradient-to-r from-indigo-400 to-indigo-600 bg-yellow-400 h-0.5 " />
            <article>
              <h1 className="font-black text-5xl sm:text-6xl">{title}</h1>
              <div role="doc-subtitle" className="max-w-2xl text-2xl mt-2">
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
          <div className="text-black dark:text-white max-w-7xl sm:mx-auto pt-4 pb-8">
            <h2 className="font-bold text-xl mt-4">CEO</h2>
            <p>Chris Hartgerink, PhD</p>
            <p>
              <a
                className="border-b-2 border-indigo-600 hover:bg-indigo-600 hover:text-white"
                href="tel:+491626818225"
              >
                +49 162 68 18 225
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
            <h2 className="font-bold text-xl mt-4">Registration</h2>
            <p>Amtsgericht Charlottenburg (Berlin)</p>
            <p>HRB 211 450</p>
            <p>VAT ID DE326772207</p>
            <p>EORI DE804962659955787</p>
          </div>
        </div>
      </main>
      <Footer />
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
