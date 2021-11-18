const ModuleCard = ({ type, title, status, time, authors }) => {
  return (
    <div className="flex flex-col h-32 w-full bg-gray-300 hover:bg-gray-100 text-base text-black p-2 border-b border-gray-600">
      <div className="flex-grow">
        <p className="text-xs text-gray-500">{type}</p>
        <h2 className="text-base line-clamp-2">{title}</h2>
      </div>
      <div className="flex">
        <div className="flex-grow text-xs text-gray-500">
          <p>{status}</p>
          <p>{time}</p>
        </div>
        <div className="flex -space-x-1 relative z-0 overflow-hidden">
          <div className="inline-block h-full align-middle">
            <span className="inline-block h-full align-middle"> </span>

            {authors.map((author) => (
              <>
                <img
                  className="relative z-30 inline-block h-6 w-6 rounded-full"
                  src={author.workspace.avatar}
                  alt={`Avatar of ${author.workspace.handle}`}
                />
              </>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ModuleCard
