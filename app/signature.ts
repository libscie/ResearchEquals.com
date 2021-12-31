import crypto from "crypto"

export default function generateSignature(secret, expire) {
  const hmac = crypto.createHmac("sha256", secret)
  hmac.update(expire)
  return hmac.digest("hex")
}
