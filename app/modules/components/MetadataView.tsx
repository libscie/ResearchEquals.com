import { Link } from "blitz"

const MetadataView = ({ module }) => {
  return (
    <div className="w-full mt-8">
      <p className="text-gray-500">{module.type.name}</p>
      <h1 className="min-h-16 mb-2 font-bold text-xl">{module.title}</h1>
      {/* Description */}
      <div className="my-2">{module.description}</div>
      {/* License */}
      {module.license ? (
        <div className="my-2">
          License:{" "}
          <Link href={module.license.url}>
            <a className="underline" target="_blank">
              {module.license.name}
            </a>
          </Link>
        </div>
      ) : (
        <></>
      )}
      {module.published ? (
        <div className="my-2">
          DOI:{" "}
          <Link href={`https://doi.org/10.53962/${module.suffix}`}>
            <a target="_blank" className="underline">
              10.53962/{module.suffix}
            </a>
          </Link>
        </div>
      ) : (
        <></>
      )}
    </div>
  )
}

export default MetadataView
