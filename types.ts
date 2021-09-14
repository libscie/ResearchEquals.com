import { DefaultCtx, SessionContext, SimpleRolesIsAuthorized } from "blitz"
import { GlobalRole, MembershipRole, Workspace, User } from "db"

export type Role = MembershipRole | GlobalRole

declare module "blitz" {
  export interface Ctx extends DefaultCtx {
    session: SessionContext
  }
  export interface Session {
    isAuthorized: SimpleRolesIsAuthorized<Role>
    PublicData: {
      userId: User["id"]
      roles: Array<Role>
      workspaceId?: Workspace["id"]
    }
  }
}
