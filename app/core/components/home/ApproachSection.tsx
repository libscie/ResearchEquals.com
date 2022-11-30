import Link from "next/link"
import Image, { StaticImageData } from "next/image"
import cx from "classnames"
import type { HTMLAttributes, ReactChild, ReactNode } from "react"
import { Close, Checkmark } from "@carbon/icons-react"
import Button from "./Button"
import OldWay from "public/images/home/old-way.svg"
import OldWayDark from "public/images/home/old-way-dark.svg"
import NewWay from "public/images/home/new-way.svg"
import NewWayDark from "public/images/home/new-way-dark.svg"
import React from "react"

const APPROACH_DATA: {
  icon: string | ReactChild
  color: "red" | "indigo"
  caption: string
  title: string
  image: string | StaticImageData
  imageDark?: string | StaticImageData
}[] = [
  {
    icon: <Close size={"1.5rem"} />,
    color: "red",
    caption: "THE OLD WAY OF DOING RESEARCH",
    title: "The hard work you put in remains invisible and undocumented",
    image: OldWay,
    imageDark: OldWayDark,
  },
  {
    icon: <Checkmark size={"1.5rem"} />,
    color: "indigo",
    caption: "THE RESEARCHEQUALS PROCESS",
    title: "Get a clear picture of your research journey from start to finish",
    image: NewWay,
    imageDark: NewWayDark,
  },
]

export type ApproachBoxProps = {
  data: {
    icon: string | ReactNode
    color: "red" | "indigo"
    caption: string
    title: string
    image: string | StaticImageData
    imageDark?: string | StaticImageData
  }
} & HTMLAttributes<HTMLDivElement>

const ApproachBox = ({
  data: { icon, color, caption, title, image, imageDark },
  ...props
}: ApproachBoxProps) => {
  return (
    <div
      {...props}
      className={cx(
        "flex flex-col items-center rounded-2xl bg-indigo-50 px-4 dark:bg-gray-800 dark:text-white md:scale-[0.967] md:transition-transform md:hover:scale-100",
        props?.className
      )}
    >
      <div
        className={cx("flex flex-col items-center gap-2 pt-10 md:pt-14", {
          "text-rose-800": color === "red",
          "text-white": color === "indigo",
        })}
      >
        <span
          className={cx("flex h-[54px] w-[54px] items-center justify-center rounded-full", {
            "bg-red-300": color === "red",
            "bg-indigo-600": color === "indigo",
          })}
        >
          {icon}
        </span>
        <span
          className={cx("rounded-3xl px-6 py-[10px] text-sm font-bold uppercase", {
            "bg-red-300": color === "red",
            "bg-indigo-600": color === "indigo",
          })}
        >
          {caption}
        </span>
      </div>
      <h3 className="my-2 max-w-md text-2xl font-bold md:mt-6 md:mb-10">{title}</h3>
      <div className={cx({ "dark:hidden": imageDark })}>
        <Image src={image} alt="title" width={500} height={390} layout="intrinsic" />
      </div>
      {imageDark && (
        <div className="hidden dark:block">
          <Image src={imageDark} alt="title" width={500} height={390} layout="intrinsic" />
        </div>
      )}
    </div>
  )
}

export const ApproachSection = () => {
  return (
    <section className="py-10 text-center md:py-28">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-10 px-4 md:gap-20 xl:px-0">
        <h2 className="max-w-[800px] text-3xl font-bold text-slate-800 dark:text-white md:text-6xl">
          A transparent approach to your research process
        </h2>
        <div className="flex w-full flex-col items-center justify-center gap-10 md:gap-16 lg:flex-row">
          {APPROACH_DATA.map((data, idx) => (
            <ApproachBox key={idx} data={data} className="w-full" />
          ))}
        </div>
        <Link href="/signup" passHref legacyBehavior>
          <Button color="primary">Publish Openly with ResearchEquals</Button>
        </Link>
      </div>
    </section>
  )
}
