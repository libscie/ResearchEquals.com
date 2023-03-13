import Image, { StaticImageData } from "next/image"
import React from "react"
import cx from "classnames"
import Container, { ContainerProps } from "./Container"

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
      src: "https://ucarecdn.com/61349a84-e75d-438c-83f5-60d33ff699e8/nounassembly468455.png",
      width: 1200,
      height: 1200,
    },
  },
  {
    title: "Request information",
    description:
      "Need more information than we gave? Ask us and we will give it. Like a freedom of information request.",
    image: {
      src: "https://ucarecdn.com/86decd35-3714-4808-9623-6781030a822d/nounopinion4320285.png",
      width: 1200,
      height: 1200,
    },
  },
  {
    title: "Petition us into action",
    description:
      "You have a direct line to us. Petitions force awareness when we inevitably will lack it.",
    image: {
      src: "https://ucarecdn.com/e45a6ab6-a559-4579-bb64-516d868a4d3d/nounpetition2367599.png",
      width: 1200,
      height: 1200,
    },
  },
  {
    title: "Business Development",
    description:
      "We are a for-profit business. We share how we are going to get to profit and you get a say where to invest it.",
    image: {
      src: "https://ucarecdn.com/c418ef6d-59b3-45d2-8ab3-109156c8d030/nouneuro4116683.png",
      width: 1200,
      height: 1200,
    },
  },
  {
    title: "Poison Pill Agreement",
    description:
      "We will pay you if we are acquired by a third-party without your consent. Literally.",
    image: {
      src: "https://ucarecdn.com/b3b0dabc-0d78-4a49-b1a1-db17cf7abae9/nounmedicine48376.png",
      width: 1200,
      height: 1200,
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
        <Image src={src} alt={title} width={width} height={height} />
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
