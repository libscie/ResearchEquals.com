import he from "he"
import { Building } from "@carbon/icons-react"

const SearchResultAffiliation = ({ item }) => {
  return (
    <>
      <div className="mx-1 my-2 flex">
        <div className="mr-2">
          <Building className="inline-block h-full align-middle " size={24} />
        </div>
        <div className="text-sm font-normal leading-4 text-gray-900 dark:text-gray-200">
          {he.decode(item.names[0].value)}
        </div>
      </div>
    </>
  )
}

export default SearchResultAffiliation
