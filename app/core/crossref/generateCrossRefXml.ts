import { toXml } from "xast-util-to-xml"
import generateCrossRefObject, { generateCollection } from "./generateCrossRefObject"

type CrossRefArgs = Parameters<typeof generateCrossRefObject>[0]
type CollectionArgs = Parameters<typeof generateCollection>[0]

export default function generateCrossRefXml(args: CrossRefArgs) {
  const crossRefObject = generateCrossRefObject(args)
  const xml = toXml(crossRefObject)
  return xml
}

const generateCollectionXml = (args: CollectionArgs) => {
  const crossRefObject = generateCollection(args)
  const xml = toXml(crossRefObject)
  return xml
}

export { generateCollectionXml }
