const AuthorAvatarsNew = ({ authors }) => {
  return (
    <>
      <div className="flex -space-x-1 relative z-0 overflow-hidden p-1">
        {authors.map((author, index) => (
          <>
            {index < 4 ? (
              <img
                className="relative inline-block h-6 w-6 rounded-full ring-1 ring-white dark:ring-gray-800"
                src={author.workspace.avatar}
                alt={`Avatar of ${author.workspace.handle}`}
                style={{ zIndex: 100 - index }}
              />
            ) : (
              ""
            )}
          </>
        ))}
        {/* </div> */}
        {authors.length >= 4 ? (
          <>
            <span className="inline-block h-full align-middle"> </span>
            <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs leading-4 font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 ring-1 ring-gray-300 dark:ring-gray-600 max-h-6 shadow-sm dark:shadow-none">
              + {authors.length}
            </span>
          </>
        ) : (
          ""
        )}
      </div>
    </>
  )
}

export default AuthorAvatarsNew
