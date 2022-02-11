const SearchResultModule = ({ item }) => {
  return (
    <>
      <div className="mx-1 my-1 flex">
        <div className="mr-2">
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            className="inline-block h-full align-middle"
            xmlns="http://www.w3.org/2000/svg"
            style={{ fill: item.displayColor || "#574cfa" }}
          >
            <path d="M23.852 31.5H0.5V0.500011L31.5 0.500695V23.8532L23.852 31.5Z" />
          </svg>
        </div>
        <div>
          <p className="text-xs font-normal leading-4 text-gray-500 dark:text-gray-400">
            {item.type}
          </p>
          <p className="text-sm font-normal leading-4 text-gray-900 dark:text-gray-200">
            {item.name}
          </p>
        </div>
      </div>
    </>
  )
}

export default SearchResultModule
