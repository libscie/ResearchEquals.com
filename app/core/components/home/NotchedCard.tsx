import cx from "classnames"
import type { HTMLAttributes } from "react"

// up to the parent component to set bg color
export type NotchedCardProps = HTMLAttributes<HTMLDivElement>

import React from "react"

const NotchedCard = (props: NotchedCardProps) => {
  return (
    <div
      {...props}
      className={cx("transition-colors duration-300 ease-out", props?.className)}
      style={{
        ...props?.style,
        clipPath:
          "polygon(0% 0%, 100% 0%, 100% calc(100% - min(25%, 100px)), calc(100% - min(25%, 100px)) 100%, 0 100%)",
      }}
    />
  )
}

export default NotchedCard
