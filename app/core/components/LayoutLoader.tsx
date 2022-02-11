import { Suspense } from "react"
import Ripple from "./Ripple"

const LayoutLoader = ({ children }) => {
  return (
    <Suspense
      fallback={
        <>
          <div className="h-screen bg-white align-middle dark:bg-gray-900">
            <div className="inline-block h-full w-full align-middle ">
              <Ripple />
            </div>
          </div>
        </>
      }
    >
      {children}
    </Suspense>
  )
}

export default LayoutLoader
