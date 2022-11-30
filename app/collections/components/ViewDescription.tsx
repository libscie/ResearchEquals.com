const ViewDescription = ({ collection }) => {
  return (
    <div className="mx-4 my-8 xl:mx-0">
      <h2 className="text-xl">A message from your editor{collection.editors.length > 1 && "s"}</h2>
      <div
        dangerouslySetInnerHTML={{ __html: collection.description }}
        className="quilljs my-2 p-4"
      />
    </div>
  )
}

export default ViewDescription
