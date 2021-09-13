import { resolver, SecurePassword, AuthenticationError } from "blitz"
import db from "db"
import { Login } from "../validations"

export const authenticateUser = async (rawEmail: string, rawPassword: string) => {
  const email = rawEmail.toLowerCase().trim()
  const password = rawPassword.trim()
  const user = await db.user.findFirst({ where: { email } })
  if (!user) throw new AuthenticationError()

  const result = await SecurePassword.verify(user.hashedPassword, password)

  if (result === SecurePassword.VALID_NEEDS_REHASH) {
    // Upgrade hashed password with a more secure hash
    const improvedHash = await SecurePassword.hash(password)
    await db.user.update({ where: { id: user.id }, data: { hashedPassword: improvedHash } })
  }

  const { hashedPassword, ...rest } = user
  return rest
}

export default resolver.pipe(resolver.zod(Login), async ({ email, password }, ctx) => {
  // const user = await authenticateUser(email, password)
  await authenticateUser(email, password)

  const user = await db.user.findFirst({
    where: { email },
    select: { id: true, name: true, email: true, role: true, memberships: true },
  })

  await ctx.session.$create({
    userId: user.id,
    roles: [user.role, user.memberships[0].role],
    workspaceId: user.memberships[0].workspaceId,
  })

  return user
})
