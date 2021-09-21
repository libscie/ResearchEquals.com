import { passportAuth } from "blitz"
import db from "db"
import { Strategy as OrcidStrategy } from "passport-orcid"

export default passportAuth(({ ctx, req, res }) => ({
  successRedirectUrl: "/dashboard",
  errorRedirectUrl: "/",
  strategies: [
    {
      strategy: new OrcidStrategy(
        // This strategy can only be used to add the ORCID to a workspace (right now)
        // Not used to login (yet)
        {
          sandbox: true,
          clientID: process.env.ORCID_CLIENT_ID,
          clientSecret: process.env.ORCID_CLIENT_SECRET,
          // TODO update for production
          callbackURL: "http://localhost:3000/api/auth/orcid/callback",
        },
        async function (accessToken, refreshToken, params, profile, done) {
          // TODO add a way for the user to know when this fails
          // EG when another account is already linked to the orcid
          await db.workspace.update({
            where: {
              id: ctx.session.$publicData.workspaceId,
            },
            data: {
              orcid: params.orcid,
            },
          })

          return done(null, { publicData: ctx.session.$publicData })
        }
      ),
    },
  ],
}))
