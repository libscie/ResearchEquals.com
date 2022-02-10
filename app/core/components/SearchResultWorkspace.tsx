const SearchResultWorkspace = ({ item }) => {
  return (
    <>
      <div className="my-1 mx-1 flex">
        <div className="mr-2">
          <img
            className="inline-block h-8 h-full w-8 rounded-full align-middle"
            src={item.avatar}
          />
        </div>
        <div>
          <p className="text-sm font-normal leading-4 text-gray-900 dark:text-gray-200">
            {item.firstName} {item.lastName}
          </p>
          <p className="text-xs font-normal leading-4 text-gray-500 dark:text-gray-400">
            @{item.handle}
          </p>
        </div>
      </div>
    </>
  )
}

export default SearchResultWorkspace
