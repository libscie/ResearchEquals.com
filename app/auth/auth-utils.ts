import { SecurePassword } from "@blitzjs/auth"
import { AuthenticationError } from "blitz"
import db from "db"

export const hashPassword = async (password: string) => {
  return await SecurePassword.hash(password)
}
export const verifyPassword = async (hashedPassword: string | null, password: string | null) => {
  return await SecurePassword.verify(hashedPassword, password)
}

export const authenticateUser = async (email: string, password: string) => {
  const user = await db.user.findUnique({ where: { email } })

  if (!user || !user.hashedPassword) throw new AuthenticationError()

  switch (await verifyPassword(user.hashedPassword, password)) {
    case SecurePassword.VALID:
      break
    case SecurePassword.VALID_NEEDS_REHASH:
      // Upgrade hashed password with a more secure hash
      const improvedHash = await hashPassword(password)
      await db.user.update({
        where: { id: user.id },
        data: { hashedPassword: improvedHash },
      })
      break
    default:
      throw new AuthenticationError()
  }

  return {
    id: user.id,
    email: user.email,
    emailIsVerified: user.emailIsVerified,
    createdAt: user.createdAt,
  }
}
