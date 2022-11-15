import Image, { StaticImageData } from "next/image"
import React from "react"
import cx from "classnames"
import Container, { ContainerProps } from "./Container"
import CreateModule from "public/images/home/create-module.svg"
import CreateModuleDark from "public/images/home/create-module-dark.svg"
import AddLink from "public/images/home/add-link.svg"
import AddLinkDark from "public/images/home/add-link-dark.svg"
import Collaborate from "public/images/home/collaborate.svg"
import CollaborateDark from "public/images/home/collaborate-dark.svg"

type StepsType = {
  title: string
  description: string
  image: {
    src: string | StaticImageData
    srcDark?: string | StaticImageData
    width: number
    height: number
  }
}

const STEPS_DATA: StepsType[] = [
  {
    title: "Create a module for all types of research.",
    description:
      "Publish any outputs of your research. Text, data, code, media, and anything else that you like. Each step gets a DOI.",
    image: {
      src: CreateModule,
      srcDark: CreateModuleDark,
      width: 1200,
      height: 1200,
    },
  },
  {
    title: "Add & link modules as your journey progresses",
    description:
      "Connect modules as you go along. You can link and fork paths as you decide the next step of the process.",
    image: {
      src: AddLink,
      srcDark: AddLinkDark,
      width: 800,
      height: 447,
    },
  },
  {
    title: "Collaborate & keep everyone in the loop",
    description:
      "See all activity that is happening on your research. Get approvals from your co-authors before publishing.",
    image: {
      src: Collaborate,
      srcDark: CollaborateDark,
      width: 1248,
      height: 918,
    },
  },
]

type StepsContainerProps = { data: StepsType } & ContainerProps

const StepsContainer = ({
  data: {
    title,
    description,
    image: { src, srcDark, width, height },
  },
  ...props
}: StepsContainerProps) => {
  return (
    <Container
      {...props}
      className={cx(
        "flex flex-col-reverse gap-10 md:flex-row md:items-center md:justify-between md:py-20",
        props?.className
      )}
    >
      <div className="flex flex-col gap-4 text-left md:max-w-[500px] md:gap-6">
        <h3 className="text-2xl font-bold text-slate-800 dark:text-white md:text-4xl">{title}</h3>
        <p className="text-slate-600 dark:text-slate-300 md:text-lg">{description}</p>
      </div>
      <div className={cx("w-full md:w-[600px]", { "dark:hidden": srcDark })}>
        <Image src={src} alt={title} width={width} height={height} layout="responsive" />
      </div>
      {srcDark && (
        <div className="hidden w-full dark:block md:w-[600px]">
          <Image src={srcDark} alt={title} width={width} height={height} layout="responsive" />
        </div>
      )}
    </Container>
  )
}

export const PublishYourJourneySection = () => {
  return (
    <section className="text-center">
      <Container className="flex flex-col items-center gap-10 py-10 md:gap-0 md:py-0">
        <div className="flex flex-col items-center gap-6 md:py-20">
          <h2 className="max-w-[720px] text-3xl font-bold text-slate-800 dark:text-white md:text-6xl">
            Publish each step of your journey, wherever your research takes you
          </h2>
          <p className="max-w-[640px] text-slate-600 dark:text-slate-300 md:text-lg">
            See the whole picture from which your research findings arise. Be able to trace, link,
            and see the connections between each step of research.
          </p>
        </div>
        {STEPS_DATA.map((data, idx) => (
          <StepsContainer key={idx} data={data} className="w-full" />
        ))}
      </Container>
    </section>
  )
}
