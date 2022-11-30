import Link from "next/link"

const Doi = ({ submission }) => {
  return (
    <>
      <Link
        href={`https://doi.org/${submission.module.prefix}/${submission.module.suffix}`}
        className={`my-1 inline-flex items-center rounded-full bg-amber-100 px-3 py-0.5 text-sm font-medium text-amber-800 `}
      >
        {`${submission.module.prefix}/${submission.module.suffix}`}
      </Link>
    </>
  )
}

export default Doi
