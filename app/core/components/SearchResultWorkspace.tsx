const SearchResultWorkspace = ({ item }) => {
  return (
    <>
      <div className="flex my-1 mx-1">
        <div className="mr-2">
          <img
            className="w-8 h-8 rounded-full inline-block h-full align-middle"
            src={item.avatar}
          />
        </div>
        <div>
          <p className="text-gray-900 dark:text-gray-200 text-sm leading-4 font-normal">
            {item.name}
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-xs leading-4 font-normal">
            @{item.handle}
          </p>
        </div>
      </div>
    </>
  )
}

export default SearchResultWorkspace
