import { Link, LinkProps } from "@blitzjs/core"

type BannerProps = {
  message?: string
  action?: string
  url?: LinkProps
}

const Banner = ({ message, action, url }: BannerProps) => {
  return (
    <div className="absolute top-0 w-screen bg-yellow-400 inset-x-0 pb-2 sm:pb-5 z-100">
      <p>{message}</p>
      <Link href={url}>
        <a>{action}</a>
      </Link>
    </div>
  )
}

export default Banner
