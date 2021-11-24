import { Blog32 } from "@carbon/icons-react"

const SearchResultModule = ({ item }) => {
  return (
    <>
      <div className="flex my-2">
        <div className="mr-4">
          <Blog32 />
        </div>
        <div>
          <p className="text-gray-500 text-xs">{item.type}</p>
          <p>{item.name}</p>
        </div>
      </div>
    </>
  )
}

export default SearchResultModule
