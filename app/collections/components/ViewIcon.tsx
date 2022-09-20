const ViewIcon = ({ collection }) => {
  return (
    <>
      <img
        src={collection?.icon!["cdnUrl"]}
        className="z-0 mx-auto my-2 max-h-56 max-w-[75%]  dark:invert"
        alt={`Icon of ${collection.title}`}
      />
    </>
  )
}

export default ViewIcon
