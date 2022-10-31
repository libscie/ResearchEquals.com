import React from "react"
import cx from "classnames"
import Container from "./Container"
import TestimonialCard from "./TestimonialCard"
import AvatarImage from "public/images/home/avatar.png"

const DUMMY_TESTIMONIAL = {
  name: "Dan Rudmann",
  message:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Volutpat, interdum amet velit ipsum feugiat nulla mattis ut.",
  position: "Researcher",
  image: AvatarImage,
}

const TESTIMONIALS_DATA: {
  name: string
  message: string
  image?: string | StaticImageData
  position?: string
  className?: string
}[] = [
  {
    name: "TBD",
    message:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Volutpat, interdum amet velit ipsum feugiat nulla mattis ut.",
    position: "Researcher",
    image: AvatarImage,
    className: "md:hover:bg-indigo-700",
  },
  {
    name: "TBD",
    message:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Volutpat, interdum amet velit ipsum feugiat nulla mattis ut.",
    position: "Researcher",
    image: AvatarImage,
    className: "md:hover:bg-pink-700",
  },
  {
    name: "TBD",
    message:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Volutpat, interdum amet velit ipsum feugiat nulla mattis ut.",
    position: "Researcher",
    image: AvatarImage,
    className: "md:hover:bg-cyan-600",
  },
]

export const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="lg:bg-indigo-50 dark:lg:bg-transparent">
      <Container className="flex flex-col gap-10 py-10 lg:gap-20 lg:py-20">
        <div className="flex flex-col items-center gap-4 text-center md:gap-6">
          <h2 className="max-w-[800px] text-3xl font-bold text-slate-800 dark:text-white md:text-6xl">
            Freedom to publish your unique research process
          </h2>
          <p className="max-w-[640px] text-base text-slate-600 dark:text-slate-300 md:text-lg">
            From students, researchers, to published authors, ResearchEquals helps you publish your
            research on your own terms.
          </p>
        </div>
        <div className="flex flex-col gap-6 lg:flex-row">
          {TESTIMONIALS_DATA.map(({ className, ...data }, idx) => (
            <TestimonialCard
              key={idx}
              data={data}
              className={cx("cursor-pointer md:hover:text-white", className)}
            />
          ))}
        </div>
      </Container>
    </section>
  )
}
