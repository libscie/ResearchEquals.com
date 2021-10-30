import generateSignature from "app/signature"

export default async function getSignature() {
  const expire = Math.round(Date.now() / 1000) + 120
  const signature = generateSignature(process.env.UPLOADCARE_SECRET_KEY, expire.toString())

  return { signature, expire }
}
