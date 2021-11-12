import axios from "axios"

const getSupportingFiles = async ({ groupUuid }) => {
  if (groupUuid === undefined) {
    return null
  }
  const datestring = new Date()
  const supportingInfo = await axios.get(`https://api.uploadcare.com/groups/${groupUuid}/`, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/vnd.uploadcare-v0.5+json",
      Date: datestring.toUTCString(),
      Authorization: `Uploadcare.Simple ${process.env.UPLOADCARE_PUBLIC_KEY}:${process.env.UPLOADCARE_SECRET_KEY}`,
    },
  })

  return supportingInfo.data
}

export default getSupportingFiles
