import Link from "next/link"
import { useRouter } from "next/router"
import React, { useEffect } from "react"
// import { useTranslation } from "react-i18next"
import Button from "./Button"
// import "app/core/i18n"

export const Hero = () => {
  // const { t, i18n } = useTranslation()
  const router = useRouter()

  // useEffect(() => {
  //   i18n.changeLanguage(router.locale).catch((error) => {
  //     console.log(error)
  //   })
  // }, [])

  return (
    <section id="hero" className="bg-indigo-50 py-10 dark:bg-transparent md:py-28 md:text-center">
      <div className="flex flex-col items-center gap-4 px-7">
        <h1 className="max-w-5xl text-4xl font-bold text-slate-800 dark:text-white md:text-7xl md:font-extrabold">
          {/* {t("hero")} */}
          Testing Flightcontrol Preview
        </h1>
        <p className="max-w-[800px] text-base text-slate-600 dark:text-slate-300 md:text-xl">
          {/* {t("hero_subtitle")} */}
          Join a community of researchers building a new research movement: open access,
          collaborative, and process driven.
        </p>
        <Link href="/signup">
          <Button color="primary" className="mt-4 w-auto">
            {/* {t("primary_cta")} */}
            Publish Openly with ResearchEquals
          </Button>
        </Link>
      </div>
    </section>
  )
}
