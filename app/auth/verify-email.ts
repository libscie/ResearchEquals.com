import { hashPassword, verifyPassword } from "./auth-utils"
import securePassword from "secure-password"

export async function generateCode(secret: string) {
  return await hashPassword(secret)
}

export async function verifyCode(code: string, secret: string | null) {
  try {
    const result = await verifyPassword(code, secret)
    return [securePassword.VALID, securePassword.VALID_NEEDS_REHASH].includes(result)
  } catch (error) {
    return false
  }
}
