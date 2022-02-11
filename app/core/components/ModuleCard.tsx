import AuthorAvatarsNew from "../../modules/components/AuthorAvatarsNew"

const ModuleCard = ({ type, title, status, time, timeText, authors }) => {
  return (
    <div className="flex h-32 w-full flex-col px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800">
      <div className="flex-grow">
        <p className="text-sm font-normal leading-4 text-gray-500 dark:text-gray-400">{type}</p>
        <h2 className="text-base font-medium leading-5 text-gray-900 line-clamp-2 dark:text-gray-200">
          {title}
        </h2>
      </div>
      <div className="flex">
        <div className="flex-grow text-sm font-normal leading-4 text-gray-500 dark:text-gray-400">
          {/* <p>{status}</p>
          <p>
            {timeText}: {time}
          </p> */}
        </div>
        <AuthorAvatarsNew authors={authors} size="h-12 w-12" toDisplay={4} />
      </div>
    </div>
  )
}

export default ModuleCard
