import { Link } from "blitz"

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index
}

const ContributorsBadge = ({ collection, nrContributors }) => {
  let submissionId
  if (JSON.stringify(collection) != "{}") {
    submissionId = collection.submissions.map((x) => {
      return x.editorshipId
    })
  }

  return (
    <>
      {JSON.stringify(collection) != "{}" ? (
        <span
          className={`m-1 inline-flex items-center rounded-full bg-cyan-100 px-3 py-0.5 text-sm font-medium text-cyan-800`}
        >
          {submissionId.filter(onlyUnique).length} contributor
          {submissionId.filter(onlyUnique).length != 1 && "s"}
        </span>
      ) : (
        <span
          className={`m-1 inline-flex items-center rounded-full bg-cyan-100 px-3 py-0.5 text-sm font-medium text-cyan-800`}
        >
          {nrContributors} contributor
          {nrContributors != 1 && "s"}
        </span>
      )}
    </>
  )
}

export default ContributorsBadge
