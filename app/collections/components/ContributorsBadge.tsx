import { Link } from "blitz"

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index
}

const ContributorsBadge = ({ collection }) => {
  const submissionId = collection.submissions.map((x) => {
    return x.editorshipId
  })

  return (
    <>
      <span
        className={`mx-1 inline-flex items-center rounded-full bg-cyan-100 px-3 py-0.5 text-sm font-medium text-cyan-800`}
      >
        {submissionId.filter(onlyUnique).length} contributor
        {submissionId.filter(onlyUnique).length != 1 && "s"}
      </span>
    </>
  )
}

export default ContributorsBadge
