import {
  BlitzPage,
  GetStaticProps,
  InferGetStaticPropsType,
  Link,
  Routes,
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
  Replicate32,
  CircleFillGlyph,
  LogoTwitter32,
  LogoGithub32,
  LogoLinkedin32,
} from "@carbon/icons-react"
import { ChevronRightIcon, StarIcon } from "@heroicons/react/solid"
import Xarrows from "react-xarrows"
import { useMediaPredicate } from "react-media-hook"
import { useFormik } from "formik"
import ReactTooltip from "react-tooltip"

import Navbar from "../core/components/Navbar"
import db from "db"
import { z } from "zod"
import releaselist from "../users/mutations/releaselist"

export const getStaticProps: GetStaticProps = async (context) => {
  const licenses = await db.license.findMany({
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
  const date = new Date()
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
        <div className="">
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
                    {/* <p className="mt-6 text-xl text-gray-800 dark:text-gray-50">
                      For your entire research journey, no matter the output.
                    </p> */}
                    <p className="my-4 text-xl text-gray-800 dark:text-gray-50">
                      A new publishing format: Research modules. Only on ResearchEquals.com
                    </p>
                  </div>
                  {/* TODO: Replace with formik form */}
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
                      <>
                        <li key="feature-01" className="flex space-x-3 text-lg">
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
                      </>
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
                      <>
                        <li className="flex space-x-3 text-lg">
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
                      </>
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
      {/* Footer */}
      <footer className="w-full bg-white dark:bg-gray-900 sm:p-0 py-4">
        <div className="sm:flex sm:max-w-7xl mx-2 xl:mx-auto text-black dark:text-white ">
          <div className="w-10/12 sm:w-full mb-0 sm:mb-28 mt-0 text-sm">
            <h3 className="font-bold text-base">ResearchEquals</h3>
            <p className="flex align-middle">
              {date.getFullYear()}
              <svg
                className="fill-current text-black dark:text-white max-h-4 w-auto m-1"
                height="100px"
                width="100px"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                x="0px"
                y="0px"
              >
                <path d="M12.8221414,8.11964931 C12.571438,8.03762988 12.2964982,8 12,8 C10.5309801,8 9.5,9.12470553 9.5,12 C9.5,12.8966894 9.60026969,13.6231223 9.78282493,14.1982822 L12.8221414,8.11964931 Z M14.2352182,9.7656316 L11.1861235,15.863821 C11.4373238,15.9562098 11.7101344,16 12,16 C13.5412741,16 14.5,14.9831695 14.5,12 C14.5,11.0759518 14.4080127,10.3405689 14.2352182,9.7656316 Z M12,1 C18.0751322,1 23,5.92486775 23,12 C23,18.0751322 18.0751322,23 12,23 C5.92486775,23 1,18.0751322 1,12 C1,5.92486775 5.92486775,1 12,1 Z M12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 C16.9705627,21 21,16.9705627 21,12 C21,7.02943725 16.9705627,3 12,3 Z M12,6 C14.6730116,6 16.5,7.93771499 16.5,12 C16.5,16.062285 14.6730116,18 12,18 C9.3856866,18 7.5,15.9428873 7.5,12 C7.5,8.05711266 9.3856866,6 12,6 Z"></path>
              </svg>
              <Link href="https://creativecommons.org/publicdomain/zero/1.0/legalcode">
                <a target="_blank">CCO</a>
              </Link>
            </p>
            <hr className="w-20 mt-4 mb-4 border-t-0 bg-gradient-to-r from-indigo-300 to-indigo-600 bg-yellow-400 h-0.5 " />
            <p>
              <Link href="https://www.notion.so/libscie/Terms-libscie-org-6f22bba7d3314ee2915ae4419e55317c">
                <a className="hover:bg-indigo-600 hover:text-white" target="_blank">
                  Terms
                </a>
              </Link>
            </p>
            <p>
              <Link href="https://www.notion.so/libscie/Terms-libscie-org-6f22bba7d3314ee2915ae4419e55317c#6021cfc8513f44b89aac6d57eea95d11">
                <a className="hover:bg-indigo-600 hover:text-white" target="_blank">
                  Data policy
                </a>
              </Link>
            </p>

            <p>
              <Link href={Routes.Home()}>
                <a className="hover:bg-indigo-600 hover:text-white">Imprint</a>
              </Link>
            </p>
          </div>
          <div className="w-10/12 sm:w-full mt-4 sm:mt-0">
            <h3 className="mb-4 font-bold text-sm">Funders</h3>
            <p className="mt-4 mb-4">
              <Link href="https://shuttleworthfoundation.org">
                <a target="_blank">
                  <svg
                    className="fill-current text-black dark:text-white"
                    width="176"
                    height="51"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M114.605 35.287v3.62c0 .393.112.627.334.709.124.046.3.07.527.07v.374h-2.102v-.374h.049c.227 0 .387-.04.485-.119.118-.089.177-.252.177-.485v-4.399c-.183-.14-.414-.211-.696-.211v-.373h1.791l3.545 4.084v-2.897c0-.434-.101-.685-.297-.753-.116-.04-.292-.061-.53-.061h-.085v-.373h2.238v.373h-.085c-.226 0-.386.023-.484.065-.152.073-.228.213-.228.423v5.129h-.479l-4.16-4.802zm-8.087 1.427c0 .905.193 1.645.576 2.218.376.567.872.851 1.489.851.763 0 1.288-.41 1.577-1.23.129-.379.194-.792.194-1.246 0-.822-.173-1.517-.521-2.081-.367-.599-.865-.899-1.492-.899-.752 0-1.283.378-1.595 1.132a3.247 3.247 0 00-.228 1.255zm-1.297.463c0-.944.311-1.725.935-2.339.622-.615 1.419-.923 2.392-.923.913 0 1.659.285 2.235.85.577.567.865 1.298.865 2.197 0 .682-.173 1.292-.521 1.829-.34.524-.8.908-1.382 1.147a3.486 3.486 0 01-1.361.257c-.58 0-1.108-.118-1.582-.356a2.772 2.772 0 01-1.205-1.155 3.076 3.076 0 01-.376-1.507zm-4.476-2.705V34.1h2.76v.373h-.144c-.44 0-.661.24-.661.72v3.796c0 .259.054.44.162.543.106.103.279.156.516.156h.127v.373h-2.76v-.373h.124c.421 0 .631-.221.631-.66v-3.834c0-.258-.047-.443-.143-.554-.098-.11-.262-.167-.497-.167h-.115zm-3.822.126v4.37c0 .284.063.478.186.582.107.09.297.136.568.136h.208v.374h-3.124v-.374h.293c.445 0 .669-.24.669-.718v-4.37h-1.026c-.207 0-.356.017-.446.047a.503.503 0 00-.313.32c-.06.145-.12.4-.179.762h-.356l.156-1.792h.28a.573.573 0 00.165.136.845.845 0 00.252.028h4.133c.17 0 .308-.056.415-.164h.28l.157 1.792h-.356a5.818 5.818 0 00-.114-.59c-.074-.246-.177-.401-.31-.463-.11-.049-.282-.075-.517-.075h-1.02zm-7.596 2.72l-.797-2.241-.73 2.24h1.527zm.199.528h-1.899l-.364 1.123c-.089.264-.093.452-.013.557.076.105.309.16.699.16h.11v.373h-2.302v-.373h.132a.693.693 0 00.563-.258c.1-.126.195-.332.288-.623l1.485-4.57-.095-.281h1.285l1.734 4.87c.103.286.205.488.306.604a.81.81 0 00.564.258v.373h-2.823v-.373h.305c.253 0 .414-.062.478-.184.064-.118.048-.3-.043-.546l-.41-1.11zm-9.859-3.374v4.475c0 .32.043.522.133.605.09.084.296.124.62.124.886 0 1.536-.286 1.951-.856.338-.471.508-1.057.508-1.76 0-.823-.214-1.473-.644-1.948-.415-.458-1.046-.686-1.891-.686-.241 0-.469.015-.677.046zm-2.006 0V34.1c.207-.013.41-.024.615-.034l.42-.019c.03 0 .151-.006.364-.022.464-.032.86-.048 1.187-.048 1.13 0 1.953.13 2.463.385.609.305 1.035.792 1.278 1.46.124.347.186.718.186 1.114 0 .838-.27 1.555-.806 2.148-.59.651-1.573.977-2.947.977h-2.76v-.373c.276 0 .47-.037.58-.109.151-.095.226-.282.226-.56v-3.703c0-.435-.1-.694-.296-.776a1.515 1.515 0 00-.51-.067zm-6.846.815v3.62c0 .393.112.627.334.709.124.046.3.07.527.07v.374h-2.103v-.374h.05c.226 0 .387-.04.483-.119.12-.089.179-.252.179-.485v-4.399c-.184-.14-.415-.211-.697-.211v-.373h1.79l3.546 4.084v-2.897c0-.434-.1-.685-.297-.753-.116-.04-.292-.061-.53-.061h-.085v-.373h2.239v.373h-.086c-.225 0-.387.023-.484.065-.151.073-.228.213-.228.423v5.129h-.48l-4.158-4.802zm-4.798-.815V34.1h2.252v.373h-.064c-.28 0-.48.055-.602.165-.13.121-.195.332-.195.631v2.386c0 .848-.216 1.489-.649 1.918-.414.416-1.013.623-1.79.623-.737 0-1.328-.163-1.772-.487-.523-.38-.784-.955-.784-1.726v-2.859c0-.252-.043-.424-.132-.515-.088-.09-.246-.136-.474-.136h-.149V34.1h2.717v.373h-.147c-.41 0-.615.218-.615.65v2.86c0 .712.264 1.183.793 1.413.235.103.494.155.78.155.522 0 .934-.147 1.232-.441.313-.309.468-.747.468-1.32v-2.33c0-.455-.097-.75-.29-.885a.767.767 0 00-.424-.102h-.155zM54.98 36.714c0 .905.192 1.645.576 2.218.376.567.873.851 1.489.851.763 0 1.288-.41 1.577-1.23.13-.379.194-.792.194-1.246 0-.822-.173-1.517-.52-2.081-.369-.599-.867-.899-1.494-.899-.752 0-1.283.378-1.594 1.132a3.253 3.253 0 00-.228 1.255zm-1.298.463c0-.944.311-1.725.936-2.339.622-.615 1.42-.923 2.392-.923.913 0 1.658.285 2.234.85.579.567.866 1.298.866 2.197 0 .682-.174 1.292-.521 1.829-.34.524-.8.908-1.382 1.147a3.493 3.493 0 01-1.362.257c-.579 0-1.107-.118-1.582-.356a2.762 2.762 0 01-1.204-1.155 3.076 3.076 0 01-.377-1.507zm-4.483-2.55v2.157h1.208c.383 0 .616-.091.691-.276a1.11 1.11 0 00.064-.425h.349v1.91h-.35c0-.457-.198-.685-.597-.685h-1.365v1.544c0 .432.073.688.216.769.08.043.202.066.365.066h.164v.373H47.35v-.373h.139c.187 0 .319-.042.396-.122.074-.081.114-.224.114-.426v-3.88c0-.265-.03-.453-.09-.565-.08-.153-.231-.23-.448-.23h-.11V34.1h4.383v1.35h-.314c-.014-.279-.048-.474-.1-.579-.08-.163-.23-.243-.447-.243h-1.675zM167.452 24.318c-.047 0-.093-.015-.093-.092v-.276c0-1.974 0-2.449.03-2.862.032-.46.139-.643.511-.704a1.97 1.97 0 01.387-.046c.17 0 .247-.046.247-.139 0-.091-.093-.122-.279-.122-.541 0-1.484.03-1.808.03-.371 0-1.268-.03-1.994-.03-.186 0-.295.03-.295.122 0 .093.093.139.232.139.201 0 .433.014.542.046.433.122.557.26.587.704.016.413.016.78.016 2.755v2.296c0 1.194 0 2.22-.063 2.77-.046.383-.123.629-.402.69a1.972 1.972 0 01-.479.046c-.17 0-.216.076-.216.137 0 .092.092.14.263.14.541 0 1.437-.045 1.746-.045.387 0 1.329.046 2.211.046.171 0 .278-.049.278-.14 0-.062-.061-.138-.216-.138a4.99 4.99 0 01-.696-.047c-.402-.061-.479-.306-.525-.673-.062-.567-.077-1.562-.077-2.756v-.994c0-.062.046-.077.092-.077h5.133c.031 0 .077.03.077.077v.994c0 1.194 0 2.19-.062 2.74-.047.383-.124.629-.402.69a2.034 2.034 0 01-.494.046c-.155 0-.217.076-.217.137 0 .092.108.14.294.14.525 0 1.484-.045 1.793-.045.371 0 1.268.046 2.149.046.17 0 .278-.049.278-.14 0-.062-.078-.138-.216-.138-.217 0-.51-.015-.696-.047-.417-.061-.495-.306-.541-.673-.062-.567-.062-1.592-.062-2.786v-2.296c0-1.974 0-2.342.03-2.755.031-.46.14-.643.495-.704.17-.031.294-.046.402-.046.155 0 .247-.046.247-.139 0-.091-.092-.122-.293-.122-.526 0-1.423.03-1.748.03-.354 0-1.313-.03-2.04-.03-.201 0-.294.03-.294.122 0 .093.077.139.232.139.186 0 .418.014.525.046.433.122.557.26.588.704.015.413.03.888.03 2.862v.276c0 .077-.046.092-.077.092h-5.13zm-9.895 1.821c0 1.194 0 2.22-.061 2.77-.047.383-.124.629-.403.69a1.894 1.894 0 01-.479.046c-.17 0-.217.076-.217.137 0 .092.094.14.263.14.542 0 1.469-.045 1.778-.045.387 0 1.299.046 2.196.046.154 0 .262-.049.262-.14 0-.062-.061-.138-.216-.138-.201 0-.51-.015-.695-.047-.402-.061-.48-.306-.526-.673-.062-.567-.078-1.592-.078-2.786v-5.265l1.716.03c1.222.015 1.578.414 1.608.75l.016.138c.015.198.046.26.154.26.078 0 .108-.076.124-.214 0-.337.03-1.302.03-1.576 0-.2-.015-.276-.108-.276-.046 0-.154.03-.371.061-.2.03-.494.061-.927.061h-5.519c-.448 0-.958-.015-1.361-.061-.339-.046-.479-.153-.587-.153-.077 0-.123.076-.154.245-.031.107-.294 1.362-.294 1.576 0 .138.03.215.124.215.091 0 .123-.062.154-.168.031-.092.093-.26.232-.444.2-.292.525-.383 1.314-.398l2.025-.046v5.265zm-10.095-5.158c0-.107.031-.153.124-.184.139-.03.464-.046.804-.046.804 0 2.071.475 2.071 2.311 0 1.072-.463 1.638-.881 1.929-.232.168-.417.214-.958.214-.341 0-.742-.03-1.037-.122-.092-.046-.123-.092-.123-.23v-3.872zm-1.731 5.158c0 1.194 0 2.22-.062 2.77-.047.383-.124.629-.403.69a1.972 1.972 0 01-.479.046c-.17 0-.216.076-.216.137 0 .092.092.14.262.14.542 0 1.407-.045 1.67-.045.201 0 1.33.046 2.118.046.17 0 .278-.049.278-.14 0-.062-.062-.138-.17-.138-.17 0-.464-.015-.665-.047-.417-.061-.479-.306-.525-.688-.062-.552-.077-1.561-.077-2.771v-.184c0-.076.046-.106.107-.106l1.222.03c.093 0 .17.015.247.092.171.198.743 1.071 1.283 1.776.758 1.01 1.268 1.622 1.856 1.913.355.183.726.262 1.484.262h1.299c.17 0 .262-.03.262-.14 0-.061-.062-.137-.17-.137-.108 0-.185 0-.325-.032-.216-.046-.695-.107-1.453-.857-.819-.811-1.777-1.99-2.984-3.458 1.33-1.057 1.887-1.914 1.887-2.878 0-.872-.572-1.53-.959-1.791-.727-.474-1.716-.55-2.582-.55-.417 0-1.654.03-2.118.03-.278 0-1.144-.03-1.855-.03-.201 0-.31.03-.31.121 0 .093.093.139.233.139.2 0 .432.014.541.046.433.122.556.26.587.704.016.413.016.78.016 2.755v2.295h.001zm-7.684 3.245c-2.566 0-4.112-2.112-4.112-4.791 0-3.214 1.777-4.01 3.293-4.01 2.195 0 3.942 1.776 3.942 4.653 0 3.704-2.165 4.148-3.123 4.148zm-.556.706c3.509 0 5.704-2.343 5.704-5.329 0-2.985-2.134-4.867-5.566-4.867-4.128 0-5.704 2.877-5.704 5.097 0 2.311 1.607 5.1 5.566 5.1zm-17.223-.477c.124.34.201.477.371.477.201 0 .279-.153.526-.69.556-1.195 2.38-5.802 2.612-6.353h.031l2.768 6.414c.201.477.294.63.479.63.201 0 .278-.153.433-.615.665-1.943 2.056-6.076 2.69-7.714.278-.75.433-1.24.757-1.362a1.75 1.75 0 01.479-.062c.124 0 .186-.061.186-.154 0-.076-.093-.106-.247-.106-.448 0-1.036.03-1.129.03-.124 0-.742-.03-1.453-.03-.217 0-.325.03-.325.122 0 .077.108.139.232.139.541 0 .665.152.665.367 0 .183-.047.443-.14.75-.479 1.515-1.514 4.943-1.777 5.694h-.048l-2.72-6.429c-.17-.413-.294-.613-.448-.613-.124 0-.263.108-.402.476l-2.598 6.652h-.046c-.201-.596-1.437-4.538-1.67-5.395-.169-.597-.294-1.028-.294-1.196 0-.139.016-.215.14-.26.108-.031.232-.046.34-.046.139 0 .247-.046.247-.139 0-.091-.093-.122-.294-.122-.788 0-1.453.03-1.577.03-.123 0-.881-.03-1.576-.03-.204 0-.312.03-.312.122 0 .093.077.139.217.139.125 0 .389.014.527.106.201.123.31.429.48.903l2.876 8.265zM109.74 26.14c0 1.194 0 2.22-.062 2.77-.047.383-.123.629-.402.69a1.986 1.986 0 01-.48.046c-.169 0-.216.076-.216.137 0 .092.092.14.263.14.278 0 .618-.015.943-.03.324 0 .618-.018.773-.018.401 0 .911.019 1.576.033.665.03 1.484.047 2.505.047.51 0 .633 0 .726-.34.077-.26.186-1.148.186-1.438 0-.139-.016-.307-.124-.307-.092 0-.124.061-.155.199-.093.536-.247.811-.587.964-.355.153-.928.169-1.283.169-1.392 0-1.809-.2-1.84-1.087-.015-.383 0-1.485 0-1.929v-1.04c0-.077.015-.139.077-.139.341 0 1.886.031 2.134.062.51.046.68.245.757.505.031.168.031.336.047.475 0 .06.031.106.124.106.124 0 .139-.183.139-.29 0-.092.031-.613.062-.873.078-.658.108-.873.108-.95 0-.076-.046-.137-.108-.137s-.108.076-.217.168c-.123.138-.324.168-.649.198-.309.032-2.072.032-2.381.032-.077 0-.092-.062-.092-.139V20.95c0-.077.031-.123.092-.123.278 0 1.902.03 2.133.061.681.061.789.245.897.474.078.153.093.383.093.475 0 .107.016.168.108.168.109 0 .14-.153.155-.214.031-.153.062-.719.077-.857.031-.597.108-.75.108-.842 0-.062-.015-.123-.092-.123-.062 0-.139.046-.217.062-.108.015-.324.061-.571.076-.263.016-3.279 0-3.711 0-.387 0-1.252-.03-1.964-.03-.201 0-.309.03-.309.122 0 .093.093.139.232.139.201 0 .433.014.541.046.433.122.557.26.588.704.015.413.015.78.015 2.755v2.296h.001zm-6.709-2.296c0-1.975 0-2.342.03-2.756.031-.459.14-.642.51-.704.155-.03.371-.046.526-.046.169 0 .247-.046.247-.138 0-.092-.093-.122-.294-.122-.525 0-1.639.03-1.963.03-.371 0-1.237-.03-1.871-.03-.201 0-.294.03-.294.122s.078.138.232.138c.17 0 .34.015.448.046.433.123.557.26.587.704.016.414.016.781.016 2.756v2.296c0 1.194 0 2.219-.062 2.77-.047.383-.124.628-.402.689a1.983 1.983 0 01-.479.047c-.171 0-.217.076-.217.137 0 .091.093.14.263.14.278 0 .618-.015.942-.03.325 0 .619-.018.774-.018.556 0 1.128.018 1.808.033.681.03 1.468.046 2.443.046.712 0 .773-.06.865-.354.109-.383.202-1.348.202-1.5 0-.153-.032-.291-.124-.291-.108 0-.139.076-.155.199-.03.244-.17.612-.339.78-.341.353-.866.368-1.593.368-1.051 0-1.577-.077-1.809-.276-.294-.245-.294-1.071-.294-2.74v-2.296h.003zm-9.802 2.296c0 1.194 0 2.22-.062 2.77-.047.383-.124.629-.401.69a1.905 1.905 0 01-.48.046c-.17 0-.217.076-.217.137 0 .092.092.14.263.14.54 0 1.468-.045 1.778-.045.387 0 1.298.046 2.195.046.155 0 .263-.049.263-.14 0-.062-.062-.138-.216-.138-.202 0-.511-.015-.696-.047-.402-.061-.48-.306-.526-.673-.061-.567-.076-1.592-.076-2.786v-5.265l1.715.03c1.222.015 1.577.414 1.608.75l.016.138c.015.198.046.26.154.26.078 0 .109-.076.124-.214 0-.337.03-1.302.03-1.576 0-.2-.014-.276-.107-.276-.047 0-.155.03-.371.061-.2.03-.495.061-.927.061h-5.52c-.448 0-.958-.015-1.36-.061-.34-.046-.48-.153-.588-.153-.078 0-.124.076-.155.245-.03.107-.294 1.362-.294 1.576 0 .138.032.215.124.215.093 0 .124-.062.154-.168.03-.092.093-.26.233-.444.2-.292.525-.383 1.314-.398l2.026-.046v5.265zm-9.787 0c0 1.194 0 2.22-.061 2.77-.047.383-.124.629-.401.69-.11.03-.28.046-.48.046-.17 0-.217.076-.217.137 0 .092.092.14.263.14.541 0 1.468-.045 1.777-.045.387 0 1.3.046 2.196.046.155 0 .263-.049.263-.14 0-.062-.061-.138-.217-.138-.2 0-.51-.015-.695-.047-.402-.061-.48-.306-.526-.673-.061-.567-.076-1.592-.076-2.786v-5.265l1.715.03c1.222.015 1.577.414 1.608.75l.015.138c.016.198.047.26.155.26.077 0 .108-.076.124-.214 0-.337.03-1.302.03-1.576 0-.2-.015-.276-.107-.276-.047 0-.156.03-.371.061-.201.03-.495.061-.928.061h-5.52c-.447 0-.957-.015-1.36-.061-.34-.046-.479-.153-.587-.153-.077 0-.124.076-.155.245-.03.107-.293 1.362-.293 1.576 0 .138.03.215.123.215s.124-.062.155-.168c.03-.092.093-.26.232-.444.2-.292.525-.383 1.314-.398l2.025-.046v5.265zm-14.145-.383c0 1.883.541 2.847 1.237 3.444.99.86 2.397.89 3.108.89.881 0 1.916-.137 2.875-.935 1.144-.934 1.3-2.464 1.3-3.919v-1.393c0-1.974.015-2.342.03-2.755.03-.46.123-.643.495-.704.17-.031.247-.046.401-.046.155 0 .232-.046.232-.139 0-.091-.092-.122-.277-.122-.526 0-1.439.03-1.593.03-.015 0-.928-.03-1.623-.03-.186 0-.279.03-.279.122 0 .093.078.139.232.139.155 0 .387.014.495.046.433.122.541.26.572.704.015.413.031.78.031 2.755v1.638c0 1.332-.03 2.464-.788 3.169-.542.52-1.238.688-1.825.688-.464 0-1.113-.046-1.716-.52-.664-.52-1.036-1.255-1.036-3.153v-1.822c0-1.974 0-2.342.031-2.755.03-.46.139-.643.495-.704.17-.031.247-.046.401-.046.14 0 .217-.046.217-.139 0-.091-.093-.122-.294-.122-.494 0-1.407.03-1.746.03-.403 0-1.315-.03-2.041-.03-.201 0-.295.03-.295.122 0 .093.078.139.233.139.185 0 .417.014.526.046.431.122.556.244.587.704.03.413.015.78.015 2.755v1.913zm-10.899-1.438c-.047 0-.093-.015-.093-.092v-.276c0-1.974 0-2.449.03-2.862.032-.46.14-.643.51-.704a1.97 1.97 0 01.388-.046c.17 0 .247-.046.247-.139 0-.091-.092-.122-.278-.122-.542 0-1.484.03-1.809.03-.37 0-1.268-.03-1.994-.03-.186 0-.294.03-.294.122 0 .093.092.139.232.139.2 0 .432.014.541.046.433.122.556.26.587.704.016.413.016.78.016 2.755v2.296c0 1.194 0 2.22-.062 2.77-.047.383-.124.629-.402.69a1.985 1.985 0 01-.48.046c-.17 0-.215.076-.215.137 0 .092.091.14.262.14.54 0 1.437-.045 1.746-.045.387 0 1.33.046 2.211.046.17 0 .279-.049.279-.14 0-.062-.062-.138-.217-.138-.2 0-.51-.015-.696-.047-.402-.061-.479-.306-.525-.673-.062-.567-.078-1.562-.078-2.756v-.994c0-.062.047-.077.094-.077h5.132c.03 0 .077.03.077.077v.994c0 1.194 0 2.19-.062 2.74-.046.383-.123.629-.402.69a2.035 2.035 0 01-.494.046c-.155 0-.217.076-.217.137 0 .092.108.14.294.14.526 0 1.484-.045 1.793-.045.371 0 1.268.046 2.15.046.17 0 .277-.049.277-.14 0-.062-.076-.138-.217-.138-.216 0-.509-.015-.695-.047-.417-.061-.494-.306-.541-.673-.063-.567-.063-1.592-.063-2.786v-2.296c0-1.974 0-2.342.031-2.755.032-.46.14-.643.496-.704.169-.031.293-.046.401-.046.155 0 .248-.046.248-.139 0-.091-.093-.122-.294-.122-.526 0-1.422.03-1.747.03-.355 0-1.314-.03-2.04-.03-.201 0-.295.03-.295.122 0 .093.078.139.232.139.186 0 .418.014.526.046.432.122.556.26.587.704.015.413.03.888.03 2.862v.276c0 .077-.046.092-.076.092h-5.13zm-8.487 5.772c.727 0 1.623-.076 2.273-.537.989-.69 1.36-1.47 1.36-2.435 0-1.177-.556-2.173-2.35-3.152l-.556-.307c-1.222-.673-1.438-1.132-1.438-1.714 0-.888.88-1.393 1.855-1.393.882 0 1.314.367 1.515.612.293.337.356.735.356.858 0 .152.046.23.139.23.107 0 .17-.139.17-.414 0-1.026.047-1.393.047-1.561 0-.093-.063-.138-.186-.169a8.158 8.158 0 00-1.933-.214c-1.885 0-3.432 1.026-3.432 2.617 0 1.148.526 2.02 2.134 2.955l.788.459c1.206.704 1.345 1.27 1.345 1.836 0 .918-.71 1.653-1.886 1.653-.85 0-1.871-.322-2.164-1.286a2.409 2.409 0 01-.124-.673c0-.092-.015-.214-.14-.214-.107 0-.169.137-.169.336-.016.215-.077 1.026-.077 1.73 0 .29.046.352.263.443.587.264 1.422.34 2.21.34zM14.924 10.287C6.916 14.077 1.947 21.266 2.222 27.815c.222 5.25 4.339 11.76 11.146 15.769C5.043 43.835.091 33.792.296 28.925c-1.187 5.661.886 16.343 11.86 20.202 3.615 1.27 10.372 1.468 13.39-.685 5.217-3.72 3.117-8.843-1.178-12.333-4.973-4.042-9.336-6.717-11.844-12.203-1.703-3.723-2.316-8.368 2.4-13.619z" />
                    <path d="M19.204 27.782c-7.046-7.15-5.574-11.984-1.069-18.179 2.099-2.885 4.17-5.767 3.822-9.528 10.725 11.336.694 15.038 5.961 20.84.745-3.2 3.02-6.545 6.195-8.953-.88 9.006 2.12 9.289 4.757 14.835 4.07 8.557-1.56 18.053-9.963 22.007 3.568-3.468 3.938-8.233-.263-12.921-2.137-2.387-6.013-4.623-9.44-8.1z" />
                  </svg>
                </a>
              </Link>
            </p>
            <p className="mt-4">
              <Link href="https://foundation.mozilla.org/en/">
                <a target="_blank">
                  <svg
                    className="fill-current text-black dark:text-white"
                    width="176"
                    height="50"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M65.643 22.244c-3.223 0-5.224 2.377-5.224 6.5 0 3.783 1.757 6.694 5.175 6.694 3.27 0 5.418-2.62 5.418-6.792 0-4.413-2.392-6.402-5.37-6.402zM151.993 33.236c0 1.406.683 2.522 2.587 2.522 2.246 0 4.638-1.6 4.784-5.239-1.025-.145-2.148-.29-3.173-.29-2.246 0-4.198.63-4.198 3.007z" />
                    <path d="M164.196 40.212c-2.929 0-4.54-1.698-4.833-4.366-1.269 2.232-3.515 4.366-7.079 4.366-3.172 0-6.785-1.698-6.785-6.258 0-5.383 5.223-6.644 10.251-6.644 1.221 0 2.491.048 3.613.194v-.728c0-2.231-.049-4.899-3.613-4.899-1.317 0-2.342.098-3.368.63l-.711 2.462-5.029-.533.858-5.032c3.857-1.552 5.809-1.989 9.422-1.989 4.736 0 8.739 2.425 8.739 7.421v9.507c0 1.261.488 1.697 1.513 1.697.294 0 .586-.048.928-.145l.048 3.298c-1.171.631-2.587 1.02-3.954 1.02zm-33.791-.485l9.519-33.37h6.2l-9.519 33.37h-6.2zm-12.79 0l9.519-33.37h6.199l-9.519 33.37h-6.199zm-4.123-14.018h-6.59v-7.858h6.59v7.858zm0 14.018h-6.59v-7.858h6.59v7.858zm-12.568 0H81.689l-.634-3.298L93.16 22.605h-6.883L85.302 26l-4.54-.485.78-7.664h19.333l.489 3.299-12.206 13.824h7.128l1.025-3.396 4.98.485-1.367 7.664zm-35.506.485c-6.786 0-11.472-4.123-11.472-11.108 0-6.402 3.906-11.689 11.814-11.689 7.908 0 11.765 5.287 11.765 11.398 0 6.985-5.077 11.399-12.107 11.399zm-14.212-.485h-9.227v-12.32c0-3.784-1.27-5.238-3.759-5.238-3.027 0-4.247 2.133-4.247 5.19v7.615h2.929v4.753h-9.227v-12.32c0-3.784-1.269-5.238-3.759-5.238-3.027 0-4.247 2.133-4.247 5.19v7.615h4.199v4.753H10.442v-4.753h2.93v-12.37h-2.93v-4.753h9.227v3.299c1.318-2.328 3.613-3.735 6.688-3.735 3.173 0 6.102 1.504 7.176 4.705 1.22-2.91 3.71-4.705 7.177-4.705 3.954 0 7.567 2.377 7.567 7.567v9.992h2.929v4.753zM0 0v50h176V0H0z" />
                  </svg>
                </a>
              </Link>
            </p>
          </div>
          <div className="w-10/12 sm:w-full text-sm">
            {/* <h3 className="mb-4 font-bold">Navigation</h3> */}
          </div>
          <div className="w-10/12 sm:w-full text-sm  mt-4 sm:mt-0">
            <h3 className="mb-4 font-bold text-sm">Follow</h3>
            <p>
              <Link href="https://github.com/libscie/ResearchEquals.com">
                <a className="flex align-middle" target="_blank">
                  <LogoGithub32 className="max-h-4 w-auto m-1" />
                  <span className="hover:bg-indigo-600 text-black dark:text-white hover:text-white">
                    GitHub
                  </span>
                </a>
              </Link>
            </p>
            <p>
              <Link href="https://twitter.com/ResearchEquals">
                <a className="flex align-middle" target="_blank">
                  <LogoTwitter32 className="max-h-4 w-auto m-1" />
                  <span className="hover:bg-indigo-600 text-black dark:text-white hover:text-white">
                    Twitter
                  </span>
                </a>
              </Link>
            </p>
          </div>
        </div>
      </footer>
    </>
  )
}

Home.suppressFirstRenderFlicker = true
Home.getLayout = (page) => <Layout title="Home">{page}</Layout>

export default Home
