import {
  BlitzPage,
  GetStaticProps,
  InferGetStaticPropsType,
  Link,
  Routes,
  useQuery,
  useRouter,
  useSession,
} from "blitz"
import Layout from "app/core/layouts/Layout"
import {
  CurrencyEuro32,
  Save32,
  Checkmark24,
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
import Xarrows from "react-xarrows"
import { useMediaPredicate } from "react-media-hook"
import ReactTooltip from "react-tooltip"

import Navbar from "../core/components/Navbar"
import db from "db"
import LayoutLoader from "../core/components/LayoutLoader"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import { useCurrentWorkspace } from "app/core/hooks/useCurrentWorkspace"
import getDrafts from "app/core/queries/getDrafts"
import getInvitedModules from "app/workspaces/queries/getInvitedModules"
import { useRef } from "react"

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
  const currentUser = useCurrentUser()
  const session = useSession()
  const currentWorkspace = useCurrentWorkspace()
  const router = useRouter()
  const [drafts, { refetch }] = useQuery(getDrafts, { session })
  const [invitations] = useQuery(getInvitedModules, { session })

  const freeLicenses = licenses.filter((license) => license.price === 0)
  const payToClose = licenses.filter((license) => license.price > 0)

  return (
    <>
      <Navbar
        currentUser={currentUser}
        session={session}
        currentWorkspace={currentWorkspace}
        router={router}
        drafts={drafts}
        invitations={invitations}
        refetchFn={refetch}
      />
      <main className="bg-white dark:bg-gray-900 lg:relative">
        <div className="" id="hero">
          <div className="overflow-hidden pt-8 sm:pt-12 lg:relative lg:py-32">
            <div className="mx-auto max-w-md px-4 sm:max-w-3xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-24 lg:px-8">
              <div>
                <div className="mt-20">
                  <div className="mt-6 leading-5 sm:max-w-xl">
                    <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
                      Step by step publishing of{" "}
                      <span className="my-2 text-indigo-600">your research</span>
                    </h1>
                    <p className="my-4 text-xl text-gray-800 dark:text-gray-50">
                      A new publishing format: Research modules.
                    </p>
                    <button
                      className="inline-flex items-center justify-center scroll-smooth whitespace-nowrap rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-normal leading-5 text-white shadow-sm hover:bg-indigo-700"
                      onClick={() => {
                        document!.getElementById("step-module")!.scrollIntoView()
                      }}
                    >
                      Learn more
                    </button>
                    <Link href="/browse">
                      <a className="mx-4 whitespace-nowrap rounded-md border-0 bg-indigo-100 px-4 py-2 font-normal leading-5 text-indigo-700 hover:bg-indigo-200 dark:border dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700">
                        Browse modules
                      </a>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="min-h-full py-12 sm:mx-auto sm:max-w-3xl sm:px-6 sm:py-16">
              <div className="py-12 sm:relative sm:mt-12 sm:py-16 lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
                <div className="hidden sm:block"></div>
                <div className="relative max-w-full pl-4 sm:mx-auto sm:max-w-full sm:px-0 lg:max-w-none lg:pl-12">
                  <div className="z-50 grid grid-flow-row grid-cols-4 gap-16 sm:grid-cols-4">
                    <div></div>
                    <div
                      id="step-1"
                      className="module h-28 w-28 bg-pink-600 text-center text-white md:h-28  md:w-28"
                    >
                      <span className="inline-block h-full align-middle"></span>
                      <CircleStrokeGlyph
                        id="step-1-button"
                        className="justify-middle inline-block h-6 w-6 fill-current stroke-current stroke-2 align-middle text-white"
                      />
                    </div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div
                      id="step-2"
                      className="module h-28 w-28 bg-indigo-600 text-center text-white md:h-28  md:w-28"
                    >
                      <span className="inline-block h-full align-middle"></span>
                      <CircleFillGlyph
                        id="step-2-button"
                        className="justify-middle inline-block h-6 w-6 fill-current stroke-current stroke-2 align-middle text-white"
                      />
                    </div>
                    <div></div>
                    <div
                      id="step-3"
                      className="module h-28 w-28 bg-emerald-600 text-center text-white md:h-28  md:w-28"
                    >
                      <span className="inline-block h-full align-middle"></span>
                      <CircleFillGlyph
                        id="step-3-button"
                        className="justify-middle inline-block h-6 w-6 fill-current stroke-current stroke-2 align-middle text-white"
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
        <div className="mx-6 max-w-full pt-16 text-white sm:max-w-7xl lg:text-left xl:mx-auto">
          <div className="flex">
            <div className="relative hidden text-center sm:inline">
              <div className="grid h-full w-full grid-cols-3 gap-8 fill-current  text-center text-gray-900 dark:text-white">
                <Terminal32
                  data-tip
                  data-for="codeTip"
                  id="code-module"
                  className="h-16 w-16 opacity-40"
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
                  className="h-12 w-12 opacity-40"
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
                  className="h-24 w-24 opacity-40"
                />
                <ReactTooltip id="tableTip" place="top" effect="solid">
                  Data
                </ReactTooltip>
              </div>
            </div>
            <div className="hidden w-4/6 sm:inline"></div>
            <div id="step-module" className="module bg-indigo-600 p-4 dark:bg-indigo-600">
              <h2 className="my-4 text-2xl font-extrabold text-white dark:text-gray-50 sm:text-5xl sm:tracking-tight lg:text-6xl">
                Publish each step
              </h2>
              <p className="my-2 text-lg">
                You produce vital outputs at every research step. Why let them go unpublished?
              </p>
              <p className="my-2 text-lg">
                Publish your text, data, code, or anything else you struggle to publish in articles.
              </p>
              <p className="my-2 text-lg">
                Each step gets a DOI. Link them all together to document a journey.
              </p>
            </div>
          </div>
          <div className="mx-auto w-full max-w-7xl pt-16 pb-20 text-white lg:py-48 lg:text-left">
            <div className="flex">
              <div id="document-steps" className="module bg-indigo-600 p-4">
                <h2 className="my-4 text-2xl font-extrabold text-white dark:text-gray-50 sm:text-5xl sm:tracking-tight lg:text-6xl">
                  Wherever your research takes you
                </h2>
                <p className="my-2 text-lg">
                  Forking paths, inconclusive experiments, it is all part of our research journeys.
                </p>
                <p className="my-2 text-lg">Document it, learn from it - no matter the output.</p>
              </div>
              <div className="hidden w-4/6 sm:inline"></div>
            </div>
          </div>
          <div className="sm:flex">
            <div
              id="publish-free"
              className="module mx-2 h-full bg-emerald-600 p-4 sm:mr-28 lg:mr-96"
            >
              {freeLicenses.length > 0 ? (
                <>
                  <h2 className="my-4 text-2xl font-extrabold text-white dark:text-gray-50 sm:text-5xl sm:tracking-tight lg:text-6xl">
                    Zero cost
                  </h2>
                  <p className="my-2 flex text-lg">
                    We{" "}
                    <Favorite32 className="mx-2 h-6 w-6 fill-current stroke-current stroke-2 text-white" />{" "}
                    open access, so we made it free.
                  </p>
                  <ul role="list" className="my-4 space-y-4">
                    {freeLicenses.map((license) => (
                      <li key={license.id} className="flex space-x-3 text-lg">
                        <Checkmark24
                          className="h-6 w-6 shrink-0 fill-current stroke-current stroke-2 text-white"
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
            <div id="pay-to-close" className="module mx-2 my-16 bg-pink-600 p-4">
              {payToClose.length > 0 ? (
                <>
                  <h2 className="my-4 text-2xl font-extrabold text-white sm:text-5xl sm:tracking-tight lg:text-6xl">
                    Pay to close
                  </h2>
                  <p className="my-2 text-lg">Need more restrictive licenses?</p>
                  <ul role="list" className="my-4 space-y-4">
                    {payToClose.map((license) => (
                      <li className="flex space-x-3 text-lg" key={license.id}>
                        <CurrencyEuro32
                          className="h-6 w-6 shrink-0 fill-current stroke-current stroke-2 text-white"
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
          <div className="mx-auto pt-16 pb-20 text-center text-white lg:w-4/6 lg:py-48 lg:text-center">
            <div id="final-call" className=" module bg-indigo-600 p-4">
              <h2 className="my-4 mr-4 text-2xl font-extrabold text-white dark:text-gray-50 sm:text-5xl sm:tracking-tight lg:text-6xl">
                Publish on your terms
              </h2>
              <div className="flex">
                <div className="flex-grow"></div>
                <div className="">
                  <div className="mr-4 flex space-x-3 text-lg">
                    <Language32
                      className=" mr-2 h-6 w-6 shrink-0 fill-current text-white"
                      aria-hidden="true"
                    />
                    Your language
                  </div>
                  <div className="mr-4 flex space-x-3 text-lg">
                    <Alarm32
                      className=" mr-2 h-6 w-6 shrink-0 fill-current text-white"
                      aria-hidden="true"
                    />
                    Your timeline
                  </div>
                  <div className="mr-4 flex space-x-3 text-lg">
                    <Events32
                      className=" mr-2 h-6 w-6 shrink-0 fill-current text-white"
                      aria-hidden="true"
                    />
                    Your co-authors
                  </div>
                  <div className="mr-4 flex space-x-3 text-lg">
                    <Save32
                      className=" mr-2 h-6 w-6 shrink-0 fill-current text-white"
                      aria-hidden="true"
                    />
                    Your outputs
                  </div>
                </div>

                <div className="flex-grow"></div>
              </div>
              <div className="my-4 flex">
                <div className="flex-grow"></div>
                <Link href={Routes.SignupPage()}>
                  <a className="inline-flex items-center justify-center whitespace-nowrap rounded-md border border-transparent bg-emerald-600 px-4 py-2 text-base font-normal leading-5 text-white shadow-sm hover:bg-emerald-800">
                    Sign up
                  </a>
                </Link>
                <Link href="/browse">
                  <a className="mx-4 whitespace-nowrap rounded-md border-0 bg-indigo-100 px-4 py-2 font-normal leading-5 text-indigo-700 hover:bg-indigo-200 dark:border dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700">
                    Browse modules
                  </a>
                </Link>
                <div className="flex-grow"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

Home.suppressFirstRenderFlicker = true
Home.getLayout = (page) => (
  <Layout
    title="ResearchEquals.com"
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
    <LayoutLoader>{page}</LayoutLoader>
  </Layout>
)

export default Home
