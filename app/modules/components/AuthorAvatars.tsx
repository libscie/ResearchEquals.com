const AuthorAvatars = ({ module }) => {
  return (
    <div className="inline-block h-full align-middle">
      {module?.authors.map((author) => (
        <>
          {/* Tricks it into the middle */}
          <span className="inline-block h-full align-middle"></span>
          <img
            key={author.id + author.workspace!.handle}
            alt={`Avatar of ${
              author.workspace!.name ? author.workspace!.name : author.workspace!.handle
            }`}
            className="inline-block align-middle relative z-30 inline-block h-8 w-8 rounded-full"
            src={author.workspace?.avatar!}
          />
        </>
      ))}
    </div>
  )
}

export default AuthorAvatars
