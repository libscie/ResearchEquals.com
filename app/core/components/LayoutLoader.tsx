import { Suspense } from "react"

const LayoutLoader = ({ page }) => {
  return (
    <Suspense
      fallback={
        <>
          <div className="w-screen h-screen bg-white dark:bg-gray-900 align-middle">
            {/* <!-- By Sam Herbert (@sherb), for everyone. More @ http://goo.gl/7AJzbL --> */}
            <div className="w-full h-full inline-block align-middle ">
              <svg
                width="45"
                height="45"
                viewBox="0 0 45 45"
                xmlns="http://www.w3.org/2000/svg"
                className="w-1/3 h-1/3 stroke-current text-gray-900 dark:text-gray-200 mx-auto"
              >
                <g fill="none" fillRule="evenodd" transform="translate(1 1)" strokeWidth="2">
                  <circle cx="22" cy="22" r="6" strokeOpacity="0">
                    <animate
                      attributeName="r"
                      begin="1.5s"
                      dur="3s"
                      values="6;22"
                      calcMode="linear"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="stroke-opacity"
                      begin="1.5s"
                      dur="3s"
                      values="1;0"
                      calcMode="linear"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="stroke-width"
                      begin="1.5s"
                      dur="3s"
                      values="2;0"
                      calcMode="linear"
                      repeatCount="indefinite"
                    />
                  </circle>
                  <circle cx="22" cy="22" r="6" strokeOpacity="0">
                    <animate
                      attributeName="r"
                      begin="3s"
                      dur="3s"
                      values="6;22"
                      calcMode="linear"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="stroke-opacity"
                      begin="3s"
                      dur="3s"
                      values="1;0"
                      calcMode="linear"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="stroke-width"
                      begin="3s"
                      dur="3s"
                      values="2;0"
                      calcMode="linear"
                      repeatCount="indefinite"
                    />
                  </circle>
                  <circle cx="22" cy="22" r="8">
                    <animate
                      attributeName="r"
                      begin="0s"
                      dur="1.5s"
                      values="6;1;2;3;4;5;6"
                      calcMode="linear"
                      repeatCount="indefinite"
                    />
                  </circle>
                </g>
              </svg>
            </div>
          </div>
        </>
      }
    >
      {page}
    </Suspense>
  )
}

export default LayoutLoader
