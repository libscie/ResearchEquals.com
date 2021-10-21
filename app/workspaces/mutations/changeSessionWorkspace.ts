import { Ctx } from "blitz"

export default async function changeSessionWorkspace(workspaceId: number, ctx: Ctx) {
  await ctx.session.$setPublicData({ workspaceId })
}
