import { SessionContext, SimpleRolesIsAuthorized } from "@blitzjs/auth"
import { GlobalRole, MembershipRole, Workspace, User } from "db"

export type Role = MembershipRole | GlobalRole

declare module "@blitzjs/auth" {
  export interface Ctx {
    session: SessionContext
  }
  export interface Session {
    isAuthorized: SimpleRolesIsAuthorized<Role>
    PublicData: {
      userId: User["id"]
      role: Role
      workspaceId?: Workspace["id"]
    }
  }
}
