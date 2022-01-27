import { Suspense } from "react"
import Ripple from "./Ripple"

const LayoutLoader = ({ children }) => {
  return (
    <Suspense
      fallback={
        <>
          <div className="h-screen bg-white dark:bg-gray-900 align-middle">
            <div className="w-full h-full inline-block align-middle ">
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
