import Link from "next/link"
import Image from "next/image"
import { Routes } from "@blitzjs/next"
import React from "react"
import { ArrowRight } from "@carbon/icons-react"
import Container from "./Container"
import NotchedCard from "./NotchedCard"
import Collections from "public/images/home/collections.svg"
import CollectionsModal from "app/core/modals/CollectionsModal"

export const CollectionsSection = ({ currentUser, currentWorkspace }) => {
  return (
    <section className="bg-amber-300 lg:bg-transparent">
      <Container className="md:px-10 md:pt-16 md:pb-24">
        <NotchedCard className="flex flex-col items-center justify-between gap-12 py-10 px-4 md:gap-20 md:py-12 md:px-20 lg:flex-row lg:bg-amber-300">
          <div className="flex max-w-[500px] flex-col items-start gap-4 text-slate-800">
            <div className="inline-flex rounded-lg bg-indigo-700 px-4 py-2 text-white">
              ✨ New feature!
            </div>
            <h2 className="text-3xl font-bold md:text-5xl">Collections</h2>
            <p className="text-base text-slate-600 md:text-lg">
              If it has a DOI, you can collect it.
            </p>
            <p className="text-base text-slate-600 md:text-lg">
              Curate, share, and keep track of research on your own, with others, or with your
              entire community.
            </p>
            <CollectionsModal
              button={
                <span className="flex items-center text-lg font-bold">
                  Learn more
                  <ArrowRight />
                </span>
              }
              styling={undefined}
              user={currentUser}
              workspace={currentWorkspace}
            />
          </div>
          <div className="mr-[min(calc(25%-100px),20px)]">
            <Link
              href="https://www.researchequals.com/collections/jf14-3a"
              target="_blank"
              className="cursor-pointer"
            >
              <Image
                src={Collections}
                alt="Collections"
                width={1148}
                height={1021}
                layout="intrinsic"
              />
            </Link>
          </div>
        </NotchedCard>
      </Container>
    </section>
  )
}
