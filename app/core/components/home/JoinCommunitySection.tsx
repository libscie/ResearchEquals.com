import Link from "next/link"
import React from "react"
import Container from "./Container"
import Button from "./Button"

export const JoinCommunitySection = () => {
  return (
    <section className="bg-indigo-700 text-white ">
      <Container className="flex flex-col items-center gap-10 py-20 md:py-24 lg:flex-row lg:justify-between lg:gap-6">
        <p className="text-center text-3xl font-bold leading-10 md:text-5xl lg:text-left">
          Join a community of people making their research journey visible
        </p>
        <Link href="/signup" passHref legacyBehavior>
          <Button variant="outlined" color="inherit" className="lg:min-w-[340px]">
            Sign up for ResearchEquals
          </Button>
        </Link>
      </Container>
    </section>
  )
}
