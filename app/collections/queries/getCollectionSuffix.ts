import generateSuffix from "../../modules/mutations/generateSuffix"

export default async function getCollectionSuffix({}) {
  const suffix = await generateSuffix(6)

  return suffix
}
