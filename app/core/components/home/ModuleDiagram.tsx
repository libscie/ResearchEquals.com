import Image from "next/image"
import React from "react"
import HeroImage from "public/images/home/hero.svg"

export const ModuleDiagram = () => {
  return (
    <section id="module-diagram" className="bg-indigo-50 py-10 px-6 dark:bg-transparent xl:py-20">
      <div className="group relative mx-auto max-w-7xl px-4 xl:px-0">
        <div className="absolute inset-10 animate-tilt rounded-lg bg-gradient-to-r  from-pink-600 to-indigo-600  opacity-50 blur-xl transition duration-1000 group-hover:opacity-100 group-hover:duration-500 sm:inset-20 lg:inset-40"></div>
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
