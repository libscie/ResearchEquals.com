const ActivityBadge = ({ collection }) => {
  return (
    <>
      {collection.active ? (
        <span
          className={`m-1 inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-sm font-medium text-green-800`}
        >
          Active
        </span>
      ) : (
        <span
          className={`m-1 inline-flex items-center rounded-full bg-red-100 px-3 py-0.5 text-sm font-medium text-red-800`}
        >
          Inactive
        </span>
      )}
    </>
  )
}

export default ActivityBadge
