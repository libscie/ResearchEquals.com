import {
  BlitzPage,
  GetStaticProps,
  InferGetStaticPropsType,
  Link,
  useMutation,
  validateZodSchema,
} from "blitz"
import Layout from "app/core/layouts/Layout"
import {
  CurrencyEuro32,
  Checkmark24,
  CheckmarkFilled24,
  Favorite32,
  CircleStrokeGlyph,
  TableSplit32,
  Terminal32,
  Language32,
  Alarm32,
  Events32,
  TextAlignLeft32,
  Video32,
  CircleFillGlyph,
} from "@carbon/icons-react"
import { ChevronRightIcon } from "@heroicons/react/solid"
import Xarrows from "react-xarrows"
import { useMediaPredicate } from "react-media-hook"
import { useFormik } from "formik"
import ReactTooltip from "react-tooltip"

import Navbar from "../core/components/Navbar"
import db from "db"
import { z } from "zod"
import releaselist from "../users/mutations/releaselist"
import Footer from "../core/components/Footer"

export const getStaticProps: GetStaticProps = async (context) => {
  const licenses = await db.license.findMany({
    where: {
      source: "ResearchEquals",
    },
    orderBy: [
      {
        price: "asc",
      },
      {
        name: "asc",
      },
    ],
  })

  return {
    props: {
      licenses,
    },
  }
}

const Home: BlitzPage = ({ licenses }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const prefersDarkMode = useMediaPredicate("(prefers-color-scheme: dark)")
  const biggerWindow = useMediaPredicate("(min-width: 640px)")

  const [releaseMutation, { isSuccess }] = useMutation(releaselist)
  const freeLicenses = licenses.filter((license) => license.price === 0)
  const payToClose = licenses.filter((license) => license.price > 0)

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validate: validateZodSchema(
      z.object({
        email: z.string().email(),
      })
    ),
    onSubmit: async (values) => {
      try {
        await releaseMutation({ email: values.email })
      } catch (error) {
        if (error.code === "P2002" && error.meta?.target?.includes("email")) {
          alert("This email is already being used")
        } else {
          alert(error.toString())
        }
      }
    },
  })

  return (
    <>
      <Navbar />
      <main className="lg:relative bg-white dark:bg-gray-900">
        <div className="" id="hero">
          <div className="pt-8 overflow-hidden sm:pt-12 lg:relative lg:py-32">
            <div className="mx-auto max-w-md px-4 sm:max-w-3xl sm:px-6 lg:px-8 lg:max-w-7xl lg:grid lg:grid-cols-2 lg:gap-24">
              <div>
                <div className="mt-20">
                  <div>
                    <a href="#" className="inline-flex space-x-4">
                      <span className="rounded bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-600 tracking-wide uppercase">
                        Coming up
                      </span>
                      <span className="inline-flex items-center text-sm font-medium text-indigo-600 space-x-1">
                        <span>Launching February 1st, 2022</span>
                        <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    </a>
                  </div>
                  <div className="mt-6 sm:max-w-xl leading-5">
                    <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight sm:text-5xl">
                      Step by step publishing of{" "}
                      <span className="text-indigo-600 my-2">your research</span>
                    </h1>
                    <p className="my-4 text-xl text-gray-800 dark:text-gray-50">
                      A new publishing format: Research modules.
                    </p>
                  </div>
                  <form
                    onSubmit={formik.handleSubmit}
                    className="mt-12 sm:max-w-lg sm:w-full sm:flex"
                  >
                    <div className="min-w-0 flex-1">
                      <label htmlFor="email" className="sr-only">
                        Email address
                      </label>
                      <input
                        id="email"
                        type="email"
                        required
                        className="block w-full border border-gray-300 bg-transparent rounded-md px-5 py-3 text-base text-gray-900 dark:text-white placeholder-gray-500 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        placeholder="Enter your email"
                        {...formik.getFieldProps("email")}
                      />
                      {formik.touched.email && formik.errors.email ? (
                        <div className="font-normal text-sm">{formik.errors.email}</div>
                      ) : null}
                    </div>
                    <div className="my-8 sm:mt-0 sm:ml-3">
                      {isSuccess ? (
                        <button
                          type="submit"
                          disabled
                          className="block w-full rounded-md border border-transparent px-5 py-3 bg-green-600 text-base font-medium text-white shadow focus:outline-none focus:ring-2 focus:ring-offset-2 sm:px-10 text-center"
                        >
                          <CheckmarkFilled24 className="text-center" />
                        </button>
                      ) : (
                        <button
                          type="submit"
                          data-splitbee-event="Release list"
                          className="block w-full rounded-md border border-transparent px-5 py-3 bg-indigo-600 text-base font-medium text-white shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:px-10"
                        >
                          Keep me updated
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="sm:mx-auto sm:max-w-3xl sm:px-6">
              <div className="py-12 sm:relative sm:mt-12 sm:py-16 lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
                <div className="hidden sm:block"></div>
                <div className="relative pl-4 max-w-full sm:max-w-full sm:mx-auto sm:px-0 lg:max-w-none lg:h-full lg:pl-12">
                  <div className="grid grid-cols-4 sm:grid-cols-4 grid-flow-row gap-16 z-50">
                    <div></div>
                    <div
                      id="step-1"
                      className="module text-white bg-pink-600 w-28 h-28 md:w-28 md:h-28  text-center"
                    >
                      <span className="inline-block h-full align-middle"></span>
                      <CircleStrokeGlyph
                        id="step-1-button"
                        className="inline-block align-middle stroke-current stroke-2 fill-current text-white justify-middle w-6 h-6"
                      />
                    </div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div
                      id="step-2"
                      className="module text-white bg-indigo-600 w-28 h-28 md:w-28 md:h-28  text-center"
                    >
                      <span className="inline-block h-full align-middle"></span>
                      <CircleFillGlyph
                        id="step-2-button"
                        className="inline-block align-middle stroke-current stroke-2 fill-current text-white justify-middle w-6 h-6"
                      />
                    </div>
                    <div></div>
                    <div
                      id="step-3"
                      className="module text-white bg-green-600 w-28 h-28 md:w-28 md:h-28  text-center"
                    >
                      <span className="inline-block h-full align-middle"></span>
                      <CircleFillGlyph
                        id="step-3-button"
                        className="inline-block align-middle stroke-current stroke-2 fill-current text-white justify-middle w-6 h-6"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Arrows */}
        <Xarrows
          start="step-1-button"
          end="step-2"
          showHead={false}
          curveness={3}
          dashness
          color={prefersDarkMode ? "white" : "#0f172a"}
          startAnchor="right"
          endAnchor="top"
        />
        <Xarrows
          start="step-2-button"
          end="step-3"
          showHead={false}
          dashness
          curveness={3}
          color={prefersDarkMode ? "white" : "#0f172a"}
          startAnchor="bottom"
          endAnchor="top"
        />
        <Xarrows
          start="step-3-button"
          end="step-module"
          showHead={false}
          dashness
          color={prefersDarkMode ? "white" : "#0f172a"}
          startAnchor="auto"
          endAnchor="top"
        />

        <Xarrows
          start="step-module"
          end="document-steps"
          showHead={false}
          dashness
          color={prefersDarkMode ? "white" : "#0f172a"}
          startAnchor="bottom"
          endAnchor="top"
        />
        {biggerWindow ? (
          <>
            <Xarrows
              start="step-module"
              end="data-module"
              showHead={false}
              dashness
              color={prefersDarkMode ? "rgba(255, 255, 255, 0.4)" : "rgba(0, 0, 0, 0.4)"}
              startAnchor="left"
              endAnchor="auto"
            />
            <Xarrows
              start="step-module"
              end="video-module"
              showHead={false}
              dashness
              color={prefersDarkMode ? "rgba(255, 255, 255, 0.4)" : "rgba(0, 0, 0, 0.4)"}
              startAnchor="left"
              endAnchor="auto"
            />
            <Xarrows
              start="step-module"
              end="code-module"
              showHead={false}
              dashness
              color={prefersDarkMode ? "rgba(255, 255, 255, 0.4)" : "rgba(0, 0, 0, 0.4)"}
              startAnchor="left"
              endAnchor="auto"
            />
            <Xarrows
              start="step-module"
              end="text-module"
              showHead={false}
              dashness
              color={prefersDarkMode ? "rgba(255, 255, 255, 0.4)" : "rgba(0, 0, 0, 0.4)"}
              startAnchor="left"
              endAnchor="auto"
            />
          </>
        ) : (
          ""
        )}

        <Xarrows
          start="document-steps"
          end="publish-free"
          showHead={false}
          dashness
          color={prefersDarkMode ? "white" : "#0f172a"}
          startAnchor="bottom"
          endAnchor="top"
        />
        <Xarrows
          start="document-steps"
          end="pay-to-close"
          showHead={false}
          dashness
          curveness={1.5}
          color={prefersDarkMode ? "white" : "#0f172a"}
          startAnchor="bottom"
          endAnchor="top"
        />
        <Xarrows
          start="publish-free"
          end="final-call"
          showHead={false}
          dashness
          color={prefersDarkMode ? "white" : "#0f172a"}
          startAnchor="bottom"
          endAnchor="top"
        />
        {/* Modular explanations */}
        <div className="xl:mx-auto sm:max-w-7xl max-w-full pt-16 mx-6 lg:text-left text-white">
          <div className="flex">
            <div className="hidden sm:inline relative text-center">
              <div className="grid grid-cols-3 gap-8 w-full h-full fill-current  text-gray-900 dark:text-white text-center">
                <Terminal32
                  data-tip
                  data-for="codeTip"
                  id="code-module"
                  className="opacity-40 w-16 h-16"
                />
                <ReactTooltip id="codeTip" place="top" effect="solid">
                  Code
                </ReactTooltip>
                <div></div>
                <div></div>
                <div></div>
                <TextAlignLeft32
                  data-tip
                  data-for="textTip"
                  id="text-module"
                  className="opacity-40 w-12 h-12"
                />
                <ReactTooltip id="textTip" place="top" effect="solid">
                  Text
                </ReactTooltip>
                <div></div>
                <Video32 data-tip data-for="videoTip" id="video-module" className="opacity-40" />
                <ReactTooltip id="videoTip" place="top" effect="solid">
                  Video
                </ReactTooltip>
                <div></div>
                <div></div>
                <div></div>
                <TableSplit32
                  data-tip
                  data-for="tableTip"
                  id="data-module"
                  className="opacity-40 w-24 h-24"
                />
                <ReactTooltip id="tableTip" place="top" effect="solid">
                  Data
                </ReactTooltip>
              </div>
            </div>
            <div className="hidden sm:inline w-4/6"></div>
            <div id="step-module" className="module bg-indigo-600 dark:bg-indigo-600 p-4">
              <h2 className="text-2xl font-extrabold text-white dark:text-gray-50 sm:text-5xl sm:tracking-tight lg:text-6xl my-4">
                Publish each step
              </h2>
              <p className="my-2 text-lg">
                You produce outputs at every research step. Why let vital parts go unpublished?
              </p>
              <p className="my-2 text-lg">
                Publish your text, data, code, or anything else you struggle to publish in articles.
              </p>
            </div>
          </div>
          <div className="mx-auto max-w-7xl w-full pt-16 pb-20 lg:py-48 lg:text-left text-white">
            <div className="flex">
              <div id="document-steps" className="module bg-indigo-600 p-4">
                <h2 className="text-2xl font-extrabold text-white dark:text-gray-50 sm:text-5xl sm:tracking-tight lg:text-6xl my-4">
                  Wherever your research takes you
                </h2>
                <p className="my-2 text-lg">
                  Forking paths, failed experiments, it is all part of our research journeys.
                </p>
                <p className="my-2 text-lg">Document it, learn from it - no matter the output.</p>
              </div>
              <div className="hidden sm:inline w-4/6"></div>
            </div>
          </div>
          <div className="sm:flex">
            <div
              id="publish-free"
              className="module bg-green-600 p-4 mx-2 xs:mr-28 sm:mr-28 lg:mr-96 h-full"
            >
              {freeLicenses.length > 0 ? (
                <>
                  <h2 className="text-2xl font-extrabold text-white dark:text-gray-50 sm:text-5xl sm:tracking-tight lg:text-6xl my-4">
                    Zero cost
                  </h2>
                  <p className="flex my-2 text-lg">
                    We{" "}
                    <Favorite32 className="fill-current stroke-current stroke-2 text-white mx-2 w-6 h-6" />{" "}
                    open access, so we made it free.
                  </p>
                  <ul role="list" className="my-4 space-y-4">
                    {freeLicenses.map((license) => (
                      <li key={license.id} className="flex space-x-3 text-lg">
                        <Checkmark24
                          className="stroke-current stroke-2 fill-current flex-shrink-0 h-6 w-6 text-white"
                          aria-hidden="true"
                        />
                        <Link href={license.url}>
                          <a target="_blank" className="">
                            {license.name}
                          </a>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                ""
              )}
            </div>
            <div></div>
            <div id="pay-to-close" className="module bg-pink-600 p-4 mx-2 my-16">
              {payToClose.length > 0 ? (
                <>
                  <h2 className="text-2xl text-white font-extrabold sm:text-5xl sm:tracking-tight lg:text-6xl my-4">
                    Pay to close
                  </h2>
                  <p className="my-2 text-lg">Need more restrictive licenses?</p>
                  <ul role="list" className="my-4 space-y-4">
                    {payToClose.map((license) => (
                      <li className="flex space-x-3 text-lg" key={license.id}>
                        <CurrencyEuro32
                          className="stroke-current stroke-2 fill-current flex-shrink-0 h-6 w-6 text-white"
                          aria-hidden="true"
                        />
                        <Link href={license.url}>
                          <a target="_blank" className="">
                            {license.price / 100} - {license.name}
                          </a>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                ""
              )}
            </div>
          </div>
          <div className="mx-auto lg:w-4/6 pt-16 pb-20 text-center lg:py-48 lg:text-center text-white">
            <div id="final-call" className=" module bg-indigo-600 p-4">
              <h2 className="text-2xl font-extrabold text-white dark:text-gray-50 sm:text-5xl sm:tracking-tight lg:text-6xl my-4 mr-4">
                Publish on your terms
              </h2>
              {/* TODO: Calls to action */}
              {/* <button>Sign up</button> */}
              {/* <button>Book a demo</button> */}
              <div className="flex">
                <div className="flex-grow"></div>
                <div className="">
                  <div className="flex space-x-3 text-lg mr-4">
                    <Language32
                      className=" fill-current flex-shrink-0 h-6 w-6 text-white mr-2"
                      aria-hidden="true"
                    />
                    Your language
                  </div>
                  <div className="flex space-x-3 text-lg mr-4">
                    <Alarm32
                      className=" fill-current flex-shrink-0 h-6 w-6 text-white mr-2"
                      aria-hidden="true"
                    />
                    Your timeline
                  </div>
                  <div className="flex space-x-3 text-lg mr-4">
                    <Events32
                      className=" fill-current flex-shrink-0 h-6 w-6 text-white mr-2"
                      aria-hidden="true"
                    />
                    Your co-authors
                  </div>
                  <div className="flex space-x-3 text-lg mr-4">
                    <div
                      className="module-small fill-current bg-white flex-shrink-0 h-6 w-6 text-white mr-2"
                      aria-hidden="true"
                    />
                    Your outputs
                  </div>
                </div>
                <div className="flex-grow"></div>
              </div>
              <div className="flex">
                <div className="flex-grow"></div>
                <form onSubmit={formik.handleSubmit} className="mt-6 sm:max-w-lg sm:w-full sm:flex">
                  <div className="min-w-0 flex-1">
                    <label htmlFor="email" className="sr-only">
                      Email address
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      className="block w-full border border-gray-300 bg-white dark:bg-gray-900 rounded-md px-5 py-3 text-base text-gray-900 dark:text-white placeholder-gray-500 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      placeholder="Enter your email"
                      {...formik.getFieldProps("email")}
                    />
                    {formik.touched.email && formik.errors.email ? (
                      <div className="font-normal text-sm">{formik.errors.email}</div>
                    ) : null}
                  </div>
                  <div className="my-8 sm:mt-0 sm:ml-3">
                    {isSuccess ? (
                      <button
                        type="submit"
                        disabled
                        className="block w-full rounded-md border border-transparent px-5 py-3 bg-green-600 text-base font-medium text-white shadow focus:outline-none focus:ring-2 focus:ring-offset-2 sm:px-10 text-center"
                      >
                        <CheckmarkFilled24 className="text-center" />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        data-splitbee-event="Release list"
                        className="block w-full rounded-md border border-transparent px-5 py-3 bg-white text-base font-medium text-indigo-600 shadow hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:px-10"
                      >
                        Keep me updated
                      </button>
                    )}
                  </div>
                </form>
                <div className="flex-grow"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

Home.suppressFirstRenderFlicker = true
Home.getLayout = (page) => (
  <Layout
    title="Home"
    headChildren={
      <>
        <meta property="og:title" content="ResearchEquals.com" />
        <meta
          property="og:description"
          content="Step by step publishing of your research, with a new publishing format: Research modules."
        />
        <meta property="og:image" content="https://og-images.herokuapp.com/api/researchequals" />
        <meta
          property="og:image:alt"
          content="Screenshot of the homepage of ResearchEquals.com, including the description and a sign up button for release updates."
        />
      </>
    }
  >
    {page}
  </Layout>
)

export default Home
