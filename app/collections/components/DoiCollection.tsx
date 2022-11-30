import Link from "next/link"

const Doi = ({ collection }) => {
  return (
    <>
      {collection.public ? (
        <Link
          href={`https://doi.org/${process.env.DOI_PREFIX}/${collection!.suffix}`}
          className={`m-1 inline-flex items-center rounded-full bg-purple-100 px-3 py-0.5 text-sm font-medium text-purple-800 ${
            !collection.public && "opacity-75"
          }`}
        >
          {`${process.env.DOI_PREFIX}/${collection!.suffix}`}
        </Link>
      ) : (
        <a
          className={`inline-flex items-center rounded-full bg-purple-100 px-3 py-0.5 text-sm font-medium text-purple-800 ${
            !collection.public && "opacity-75"
          }`}
        >
          {`${process.env.DOI_PREFIX}/${collection!.suffix}`}
        </a>
      )}
    </>
  )
}

export default Doi
