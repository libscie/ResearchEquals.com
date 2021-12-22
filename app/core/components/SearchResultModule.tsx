import { Blog32 } from "@carbon/icons-react"

const SearchResultModule = ({ item }) => {
  return (
    <>
      <div className="flex">
        <div className="mr-2">
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            className="stroke-current fill-current stroke-2 text-gray-300 dark:text-gray-400 inline-block h-full align-middle"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M23.852 31.5H0.5V0.500011L31.5 0.500695V23.8532L23.852 31.5Z" />
          </svg>
        </div>
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-xs leading-4 font-normal">
            {item.type}
          </p>
          <p className="text-gray-900 dark:text-gray-200 text-sm leading-4 font-normal">
            {item.name}
          </p>
        </div>
      </div>
    </>
  )
}

export default SearchResultModule
