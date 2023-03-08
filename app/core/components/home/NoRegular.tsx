import Image, { StaticImageData } from "next/image"
import React from "react"
import cx from "classnames"
import Container, { ContainerProps } from "./Container"
import Assembly from "public/images/supporting-member/assembly.png"
import AssemblyDark from "public/images/supporting-member/assembly.png"
import Petition from "public/images/supporting-member/petition.png"
import PetitionDark from "public/images/supporting-member/petition.png"
import Request from "public/images/supporting-member/request.png"
import RequestDark from "public/images/supporting-member/request.png"
import BusinessDev from "public/images/supporting-member/business-dev.png"
import BusinessDevDark from "public/images/supporting-member/business-dev.png"
import PoisonPill from "public/images/supporting-member/poison-pill.png"
import PoisonPillDark from "public/images/supporting-member/poison-pill.png"
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
    title: "Join our General Assemblies",
    description:
      "Every quarter we gather to discuss changes, strategies, and ideas. We vote on what happens with ResearchEquals.",
    image: {
      src: Assembly,
      srcDark: AssemblyDark,
      width: 1200,
      height: 1200,
    },
  },
  {
    title: "Request information",
    description:
      "Need more information than we gave? Ask us and we will give it. Like a freedom of information request.",
    image: {
      src: Request,
      srcDark: RequestDark,
      width: 1200,
      height: 1200,
    },
  },
  {
    title: "Petition us into action",
    description:
      "You have a direct line to us. Petitions force awareness when we inevitably will lack it.",
    image: {
      src: Petition,
      srcDark: PetitionDark,
      width: 1200,
      height: 1200,
    },
  },
  {
    title: "Business Development",
    description:
      "We are a for-profit business. We share how we are going to get to profit and you get a say where to invest it.",
    image: {
      src: BusinessDev,
      srcDark: BusinessDevDark,
      width: 800,
      height: 447,
    },
  },
  {
    title: "Poison Pill Agreement",
    description:
      "We will pay you if we are acquired by a third-party without your consent. Literally.",
    image: {
      src: PoisonPill,
      srcDark: PoisonPillDark,
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
        "flex flex-col-reverse gap-10 md:flex-row md:items-center md:justify-between md:py-10",
        props?.className
      )}
    >
      <div className="flex flex-col gap-4 text-left md:max-w-[500px] md:gap-6">
        <h3 className="text-2xl font-bold text-slate-800 dark:text-white md:text-4xl">{title}</h3>
        <p className="text-slate-600 dark:text-slate-300 md:text-lg">{description}</p>
      </div>
      <div className={cx("w-[50%] md:w-[350px]")}>
        <Image src={src} alt={title} width={width} height={height} layout="responsive" />
      </div>
    </Container>
  )
}

export const NoRegular = () => {
  return (
    <section className="text-center">
      <Container className="flex flex-col items-center gap-10 py-10 md:gap-0 md:py-0">
        {STEPS_DATA.map((data, idx) => (
          <StepsContainer key={idx} data={data} className="w-full" />
        ))}
      </Container>
    </section>
  )
}
