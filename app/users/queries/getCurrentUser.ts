import { Ctx } from "blitz"
import db from "db"

export default async function getCurrentUser(_ = null, { session }: Ctx) {
  if (!session.userId) return null

  const user = await db.user.findFirst({
    where: { id: session.userId },
    select: {
      id: true,
      name: true,
      email: true,
      emailIsVerified: true,
      emailConsent: true,
      marketingConsent: true,
      supportingMember: true,
      role: true,
      memberships: {
        select: {
          id: true,
          role: true,
          emailInvitations: true,
          emailApprovals: true,
          emailWeeklyDigest: true,
          emailCollections: true,
          workspace: {
            select: {
              avatar: true,
              handle: true,
              name: true,
              id: true,
            },
          },
        },
      },
    },
  })

  return user
}
