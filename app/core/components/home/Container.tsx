import cx from "classnames"
import type { HTMLAttributes } from "react"

export type ContainerProps = HTMLAttributes<HTMLDivElement>

const Container = (props: ContainerProps) => {
  return <div {...props} className={cx("mx-auto max-w-7xl px-4 xl:px-0", props?.className)} />
}

export default Container
