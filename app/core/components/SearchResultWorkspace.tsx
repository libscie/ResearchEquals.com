const SearchResultWorkspace = ({ item }) => {
  return (
    <>
      <div className="flex my-2">
        <div className="mr-4">
          <img className="w-8 h-8 rounded-full" src={item.avatar} />
        </div>
        <div>
          <p>{item.name}</p>
          <p className="text-gray-500 text-xs">@{item.handle}</p>
        </div>
      </div>
    </>
  )
}

export default SearchResultWorkspace
