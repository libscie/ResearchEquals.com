import Link from "next/link";

const ContributorsBadge = ({ collection }) => {
  return (
    <>
      <span
        className={`m-1 inline-flex items-center rounded-full bg-pink-100 px-3 py-0.5 text-sm font-medium text-pink-800`}
      >
        {collection.editors.length} editors
      </span>
    </>
  )
}

export default ContributorsBadge
