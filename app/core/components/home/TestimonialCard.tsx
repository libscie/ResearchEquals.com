import React, { HTMLAttributes } from "react"
import cx from "classnames"
import NotchedCard from "./NotchedCard"
import { Image } from "blitz"

export type TestimonialProp = {
  data: {
    name: string
    message: string
    position?: string
    image?: string | StaticImageData
  }
} & HTMLAttributes<HTMLDivElement>

const TestimonialCard = ({
  data: { name, message, position, image },
  ...props
}: TestimonialProp) => {
  return (
    <NotchedCard
      {...props}
      className={cx(
        "flex flex-col items-start gap-6 px-10 pt-8 pb-20 dark:text-white",
        props?.className
      )}
    >
      {image && (
        <div className="h-20 w-20 overflow-hidden rounded-full border-2 border-slate-100">
          <Image src={image} alt={name} width={80} height={80} layout="fixed" />
        </div>
      )}
      <p className="text-base md:text-lg">“{message}”</p>
      <div>
        <div className="font-bold">{name}</div>
        {position && <div>{position}</div>}
      </div>
    </NotchedCard>
  )
}

export default TestimonialCard
