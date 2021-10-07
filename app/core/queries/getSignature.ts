import generateSignature from "app/signature"

export default async function getSignature() {
  const expire = Math.round(Date.now() / 1000) + 120
  const signature = generateSignature("c1dab0a41e2ce88da42c", expire.toString())

  return { signature, expire }
}
