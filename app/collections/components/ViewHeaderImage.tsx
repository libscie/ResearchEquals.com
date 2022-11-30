import { Widget, WidgetAPI } from "@uploadcare/react-widget"
const ViewHeaderImage = ({ collection }) => {
  return (
    <>
      {collection.type.type === "COMMUNITY" && (
        <>
          <img
            src={collection?.header!["cdnUrl"]}
            className="h-56 max-h-56 w-full object-cover"
            alt={`Header image of ${collection.title}`}
          />
        </>
      )}
    </>
  )
}

export default ViewHeaderImage
