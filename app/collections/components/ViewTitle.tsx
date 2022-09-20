const ViewTitle = ({ collection }) => {
  return (
    <>
      <h2 className="my-4 w-full border-0 bg-white text-center text-3xl focus:ring-0 dark:bg-gray-900 md:text-5xl lg:text-6xl">
        {collection.title}
      </h2>
    </>
  )
}

export default ViewTitle
