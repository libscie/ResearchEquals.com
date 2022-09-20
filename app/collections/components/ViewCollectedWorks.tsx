import ViewWorkCard from "./ViewWorkCard"

const ViewCollectedWorks = ({ collection }) => {
  return (
    <div className="mx-4 my-8 xl:mx-0">
      <h2 className="my-4 text-xl">Collected works</h2>
      <div>
        {collection?.submissions.map((submission, index) => {
          return (
            <>{submission.accepted && <ViewWorkCard submission={submission} index={index} />}</>
          )
        })}
      </div>
    </div>
  )
}

export default ViewCollectedWorks
