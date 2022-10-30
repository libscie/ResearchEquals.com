import { Image } from "blitz"
import React from "react"
import HeroImage from "public/images/home/hero.png"

export const ModuleDiagram = () => {
  return (
    <section id="module-diagram" className="bg-indigo-50 py-10 px-6 dark:bg-transparent xl:py-20">
      <div className="mx-auto max-w-7xl px-4 xl:px-0">
        <Image
          src={HeroImage}
          alt="A diagram showing connections among research modules"
          layout="responsive"
          width={2560}
          height={1880}
        />
      </div>
    </section>
  )
}
