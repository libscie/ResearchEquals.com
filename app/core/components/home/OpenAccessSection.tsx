import React from "react"
import cx from "classnames"
import Container from "./Container"
import { CheckmarkFilled } from "@carbon/icons-react"

const FREE_ACCESS_DATA: { label: string; href?: string }[] = [
  {
    label: "Publish research modules",
  },
  {
    label: "Create & share collections",
  },
  {
    label: "Collaborate with others",
  },
  {
    label: "CC0 Public Domain Dedication",
    href: "https://creativecommons.org/publicdomain/zero/1.0/legalcode",
  },
  {
    label: "CC BY 4.0",
    href: "https://creativecommons.org/licenses/by/4.0/legalcode",
  },
]

const COPYRIGHT_DATA: { price: number; label: string; href?: string }[] = [
  {
    price: 149.99,
    label: "CC BY-SA 4.0",
    href: "https://creativecommons.org/licenses/by-sa/4.0/legalcode",
  },
  {
    price: 194.99,
    label: "CC BY-NC 4.0",
    href: "https://creativecommons.org/licenses/by-nc/4.0/legalcode",
  },
  {
    price: 249.99,
    label: "CC BY-ND 4.0",
    href: "https://creativecommons.org/licenses/by-nd/4.0/legalcode",
  },
  {
    price: 329.99,
    label: "CC BY-NC-SA 4.0",
    href: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
  },
  {
    price: 429.99,
    label: "CC BY-NC-ND 4.0",
    href: "https://creativecommons.org/licenses/by-nc-nd/4.0/legalcode",
  },
  {
    price: 549.99,
    label: "All rights reserved",
    href: "https://en.wikipedia.org/wiki/All_rights_reserved",
  },
]

export const OpenAccessSection = () => {
  return (
    <section>
      <Container className="pt-10">
        <div className="flex flex-col items-center gap-4 text-center md:gap-6">
          <h2 className="max-w-[800px] text-3xl font-bold text-slate-800 dark:text-white md:text-6xl">
            Open access by default
          </h2>
          <p className="max-w-[640px] text-base text-slate-600 dark:text-slate-300 md:text-lg">
            Publish for free when you choose open access. If you need a more restrictive license,
            you can pay to close.
          </p>
        </div>
        <div className="flex flex-col items-center gap-10 py-10 px-8 lg:flex-row lg:items-end lg:justify-center lg:py-20 lg:px-16">
          <div className="w-full max-w-[500px] space-y-10 rounded-2xl bg-indigo-700 px-6 py-10 text-white md:px-12 md:pt-16 md:pb-28 lg:px-16">
            <span className="lg:-ml-18 -ml-14 rounded-lg bg-amber-200 py-[10px] px-3 text-sm font-bold text-black md:-ml-32 md:text-lg lg:px-12">
              Free &amp; Open Access
            </span>
            <div className="flex items-center gap-4 md:pt-10">
              <svg
                width="48"
                height="48"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
              >
                <path
                  d="M25.6443 16.2393C25.1429 16.0753 24.593 16 24 16C21.062 16 19 18.2494 19 24C19 25.7934 19.2005 27.2462 19.5656 28.3966L25.6443 16.2393ZM28.4704 19.5313L22.3722 31.7276C22.8746 31.9124 23.4203 32 24 32C27.0825 32 29 29.9663 29 24C29 22.1519 28.816 20.6811 28.4704 19.5313ZM24 2C36.1503 2 46 11.8497 46 24C46 36.1503 36.1503 46 24 46C11.8497 46 2 36.1503 2 24C2 11.8497 11.8497 2 24 2ZM24 6C14.0589 6 6 14.0589 6 24C6 33.9411 14.0589 42 24 42C33.9411 42 42 33.9411 42 24C42 14.0589 33.9411 6 24 6ZM24 12C29.346 12 33 15.8754 33 24C33 32.1246 29.346 36 24 36C18.7714 36 15 31.8858 15 24C15 16.1142 18.7714 12 24 12Z"
                  fill="currentColor"
                />
              </svg>
              <h3 className="text-3xl font-bold lg:text-4xl">Zero Cost</h3>
            </div>
            <ul className="list-none space-y-6">
              {FREE_ACCESS_DATA.map((data, idx) => (
                <li key={idx} className="flex items-center gap-4 text-base lg:text-lg">
                  <CheckmarkFilled size={"1.5rem"} />
                  {data.href ? (
                    <a href={data.href} rel="nofollow noreferrer">
                      {data.label}
                    </a>
                  ) : (
                    <span>{data.label}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <div className="w-full max-w-[500px] space-y-6 rounded-2xl bg-slate-800 px-6 pt-10 pb-6 text-white md:px-12 md:pt-14 md:pb-4 lg:px-16">
            <div className="flex items-center gap-4">
              <svg
                width="48"
                height="48"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M23.76 18.28C26.32 18.4 26.98 20.58 27.02 21.6H30.6C30.44 17.64 27.62 15.22 23.7 15.22C19.28 15.22 16 18 16 24.28C16 28.16 17.86 32.76 23.68 32.76C28.12 32.76 30.5 29.46 30.56 26.86H26.98C26.92 28.04 26.08 29.62 23.72 29.74C21.1 29.66 20 27.62 20 24.28C20 18.5 22.56 18.32 23.76 18.28ZM24 4C12.96 4 4 12.96 4 24C4 35.04 12.96 44 24 44C35.04 44 44 35.04 44 24C44 12.96 35.04 4 24 4ZM24 40C15.18 40 8 32.82 8 24C8 15.18 15.18 8 24 8C32.82 8 40 15.18 40 24C40 32.82 32.82 40 24 40Z"
                  fill="white"
                />
              </svg>
              <h3 className="text-3xl font-bold lg:text-4xl">Pay to close</h3>
            </div>
            <table className="w-full table-auto">
              <tbody>
                {COPYRIGHT_DATA.map((data, idx) => (
                  <tr key={idx}>
                    <td
                      className={cx("py-4 pr-4 text-base font-semibold lg:text-xl", {
                        "border-t border-slate-700": idx > 0,
                      })}
                    >
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "EUR",
                      }).format(data.price)}
                    </td>
                    <td
                      className={cx("w-full py-4 pl-4 text-base lg:text-lg", {
                        "border-t border-slate-700": idx > 0,
                      })}
                    >
                      {data.href ? (
                        <a href={data.href} rel="nofollow noreferrer">
                          {data.label}
                        </a>
                      ) : (
                        data.label
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Container>
    </section>
  )
}
