import { gSSP } from "app/blitz-server"
import { useRouter } from "next/router"
import { useMutation } from "@blitzjs/rpc"
import Layout from "app/core/layouts/Layout"
import React, { Suspense, useEffect, useState } from "react"
import toast from "react-hot-toast"
import useWindowSize from "react-use/lib/useWindowSize"
import Confetti from "react-confetti"
import Image from "next/image"

import Navbar from "app/core/components/Navbar"
import OnboardingQuests from "app/core/components/OnboardingQuests"
import generateSignature from "app/signature"
import LayoutLoader from "app/core/components/LayoutLoader"
import ModuleBoxFeed from "app/core/components/ModuleBoxFeed"

import { Modal } from "../app/core/modals/Modal"
import upgradeSupporting from "../app/auth/mutations/upgradeSupporting"
import {useCurrentWorkspace} from "../app/core/hooks/useCurrentWorkspace"

export const getServerSideProps = gSSP(async function getServerSideProps(context) {
  // Expires in 30 minutes
  const expire = Math.round(Date.now() / 1000) + 60 * 30
  const signature = generateSignature(process.env.UPLOADCARE_SECRET_KEY, expire.toString())

  return {
    props: {
      expire,
      signature,
    },
  }
})

const DashboardContent = ({
  expire,
  signature,
  query,
  router,
}) => {
  const currentWorkspace = useCurrentWorkspace()

  const { width, height } = useWindowSize()
  const [celebrate, setCelebrate] = useState(false)
  const [upgradeSupportingMutation] = useMutation(upgradeSupporting)

  useEffect(() => {
    if (query.supporting) {
      upgradeSupportingMutation()
        .then(() => {
          setCelebrate(true)
        })
        .catch((e) => {
          console.log(e)
        })
    }
  }, [upgradeSupportingMutation, query.supporting])

  return (
    <>
      <Modal
        isOpen={celebrate}
        setIsOpen={setCelebrate}
        title="We appreciate your support! 🥰"
        body={
          <>
            <Confetti width={width} height={height} numberOfPieces={200} />
            <div>
              <Image
                src="https://ucarecdn.com/8c487c87-19f2-42c6-ba15-049c452f735d/supportingmember.gif"
                alt="A cute pink dinosaur coming out of a door waving and a heart appearing. It is a GIF on a continuous loop."
                width="480"
                height="480"
              />
              <p>Thank you so much!</p>
              <p>If you have issues accessing the Membership Area, please log out and back in.</p>
              <p>We look forward to seeing you at our next General Assembly.</p>
            </div>
          </>
        }
        primaryAction="See you there!"
        primaryButtonClass="bg-indigo-50 text-indigo-700 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0 dark:border dark:border-gray-600 dark:bg-gray-800 dark:text-indigo-500 dark:hover:border-gray-400 dark:hover:bg-gray-700"
        secondaryAction="Go to Membership Area"
        secondaryButtonClass="bg-green-50 text-green-700 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-0 dark:border dark:border-gray-600 dark:bg-gray-800 dark:text-green-500 dark:hover:border-gray-400 dark:hover:bg-gray-700"
        onSubmit={() => {}}
        onCancel={() => {
          router.push("/membership-area")
        }}
      />
      <div className="text-gray-900 dark:text-gray-200">
        <div className="p-4">
          <div className="my-0">
            <h1 className="text-center text-4xl font-medium">
              Welcome,{" "}
              {currentWorkspace?.firstName && currentWorkspace?.lastName
                ? `${currentWorkspace.firstName} ${currentWorkspace.lastName}`
                : `@${currentWorkspace?.handle}`}
              !
            </h1>
          </div>
          <div className="mt-4 w-full gap-2 lg:flex">
            <Suspense fallback="Loading...">
              <OnboardingQuests expire={expire} signature={signature} />
            </Suspense>
          </div>
        </div>
        <div className="flex w-full flex-col px-4">
          <div className="my-2">
            <Suspense fallback="Loading...">
              <ModuleBoxFeed />
            </Suspense>
          </div>
        </div>
      </div>
    </>
  )
}

const Dashboard = ({ expire, signature }) => {
  const query = useRouter().query
  const router = useRouter()

  useEffect(() => {
    if (query.authError) {
      toast.error("ORCID connection failed.")
    }
  }, [query.authError])

  useEffect(() => {
    if (query.authError) {
      toast.error("ORCID connection failed.")
    }
  }, [query.authError])

  return (
    <>
    <Suspense fallback="Loading...">

      <Navbar
      />
      </Suspense>
      <main className="mx-auto w-full max-w-7xl">
        <Suspense fallback="Loading...">
          <DashboardContent
            expire={expire}
            signature={signature}
            query={query}
            router={router}
            />
        </Suspense>
      </main>
    </>
  )
}

Dashboard.authenticate = true
Dashboard.suppressFirstRenderFlicker = true
Dashboard.getLayout = (page) => (
  <Layout title="Dashboard">
    <LayoutLoader>{page}</LayoutLoader>
  </Layout>
)

export default Dashboard
