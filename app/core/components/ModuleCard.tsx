import AuthorAvatarsNew from "../../modules/components/AuthorAvatarsNew"

const ModuleCard = ({ type, title, status, time, authors }) => {
  return (
    <div className="flex flex-col h-32 w-full hover:bg-gray-50 dark:hover:bg-gray-800 px-4 py-2">
      <div className="flex-grow">
        <p className="text-xs leading-4 font-normal text-gray-500 dark:text-gray-400">{type}</p>
        <h2 className="text-sm leading-5 font-medium text-gray-900 dark:text-gray-200 line-clamp-2">
          {title}
        </h2>
      </div>
      <div className="flex">
        <div className="flex-grow text-xs leading-4 font-normal text-gray-500 dark:text-gray-400">
          <p>{status}</p>
          <p>Published: {time}</p>
        </div>
        <AuthorAvatarsNew authors={authors} />
      </div>
    </div>
  )
}

export default ModuleCard
