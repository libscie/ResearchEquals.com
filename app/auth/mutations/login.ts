import { SecurePassword } from "@blitzjs/auth";
import { resolver } from "@blitzjs/rpc";
import db from "db"
import { Ctx } from "blitz"

import { Login } from "../validations"

export const authenticateUser = async (rawEmail: string, rawPassword: string) => {
  const email = rawEmail.toLowerCase().trim()
  const password = rawPassword.trim()
  const user = await db.user.findFirst({
    where: { email },
    select: {
      id: true,
      hashedPassword: true,
      name: true,
      email: true,
      role: true,
      memberships: true,
    },
  })
  if (!user) throw new AuthenticationError()

  const result = await SecurePassword.verify(user.hashedPassword, password)

  if (result === SecurePassword.VALID_NEEDS_REHASH) {
    const improvedHash = await SecurePassword.hash(password)
    await db.user.update({ where: { id: user.id }, data: { hashedPassword: improvedHash } })
  }

  const { hashedPassword, ...rest } = user
  return rest
}

export default resolver.pipe(resolver.zod(Login), async ({ email, password }, ctx: Ctx) => {
  const user = await authenticateUser(email, password)

  await ctx.session.$create({
    userId: user.id,
    roles: [user.role, user.memberships[0]!.role],
    workspaceId: user.memberships[0]!.workspaceId,
  })

  return user
})
