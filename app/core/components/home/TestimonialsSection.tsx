import React from "react"
import cx from "classnames"
import Container from "./Container"
import TestimonialCard from "./TestimonialCard"

const TESTIMONIALS_DATA: {
  name: string
  message: string
  image?: string | StaticImageData
  position?: string
  className?: string
  link?: string
}[] = [
  {
    name: "Dr. Esther Plomp",
    message:
      "I like the look and feeling of R=! It was very easy to link two related modules and add a reference list, and the contributor list is very transparent.",
    position: "Data Steward",
    image: "https://ucarecdn.com/d9058948-add7-45e4-be39-ec939c89c2bf/-/preview/200x200/",
    className: "md:hover:bg-indigo-700",
    link: "https://doi.org/10.53962/knm3-bnvx",
  },
  {
    name: "Dan Rudmann, PhD",
    message:
      "Scholarly publishing is at its best when it enables both a diversity of forms and open dialogue. ResearchEquals is designed in a way that embraces these practices.",
    position: "Digital Scholarship Librarian, Leiden University",
    image: "https://ucarecdn.com/370f0b00-140d-4bac-a007-16cbb5cbe0f4/-/preview/200x200/",
    className: "md:hover:bg-pink-700",
    link: "http://danrudmann.com/",
  },
  // {
  //   name: "TBD",
  //   message:
  //     "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Volutpat, interdum amet velit ipsum feugiat nulla mattis ut.",
  //   position: "Researcher",
  //   image: AvatarImage,
  //   className: "md:hover:bg-cyan-600",
  // },
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
            From students, researchers, to published authors, librarians: ResearchEquals helps you
            publish your research on your own terms.
          </p>
        </div>
        <div className="flex flex-col gap-6 lg:flex-row">
          {TESTIMONIALS_DATA.map(({ className, ...data }, idx) => (
            <TestimonialCard
              key={idx}
              data={data}
              className={cx("md:hover:text-white", className)}
            />
          ))}
        </div>
      </Container>
    </section>
  )
}
