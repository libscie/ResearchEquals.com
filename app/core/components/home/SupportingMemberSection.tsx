import Link from "next/link"
import Image from "next/image"
import { Routes } from "@blitzjs/next"
import React from "react"
import { ArrowRight } from "@carbon/icons-react"
import Container from "./Container"
import NotchedCard from "./NotchedCard"

export const SupportingMemberSection = ({ currentUser, currentWorkspace }) => {
  return (
    <section className="bg-indigo-300 lg:bg-transparent">
      <Container className="md:px-10 md:pt-16 md:pb-24">
        <NotchedCard className="flex flex-col items-center justify-between gap-12 py-10 px-4 md:gap-20 md:py-12 md:px-20 lg:flex-row lg:bg-indigo-300">
          <div className="flex max-w-[500px] flex-col items-start gap-4 text-slate-800">
            <div className="inline-flex rounded-lg bg-indigo-700 px-4 py-2 text-white">✨ New!</div>
            <h2 className="text-3xl font-bold md:text-5xl">Supporting membership</h2>
            <p className="text-base text-slate-600 md:text-lg">
              You are one of few who read this far! It seems you like this community.
            </p>
            <p className="text-base text-slate-600 md:text-lg">
              Supporters shape how ResearchEquals evolves. Together, we organize for more impact on
              improving research.
            </p>
            <Link href="/supporting-member" target="_blank" className="cursor-pointer">
              <span className="flex items-center text-lg font-bold">
                Learn more
                <ArrowRight />
              </span>
            </Link>
          </div>
          <div className="mr-[min(calc(25%-100px),20px)]">
            <Link href="/supporting-member" target="_blank" className="cursor-pointer">
              <Image
                src="https://ucarecdn.com/b781ec44-644f-4937-8198-ce484b95892b/97F733A17E50432D83A2724740A040AA.png"
                alt="Collections"
                width={1031 / 2}
                height={1145 / 2}
              />
            </Link>
          </div>
        </NotchedCard>
      </Container>
    </section>
  )
}
