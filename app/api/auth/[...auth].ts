import { passportAuth } from "blitz"
import db from "db"
import { Strategy as OrcidStrategy } from "passport-orcid"
import algoliasearch from "algoliasearch"

const client = algoliasearch(process.env.ALGOLIA_APP_ID!, process.env.ALGOLIA_API_ADMIN_KEY!)
const index = client.initIndex(`${process.env.ALGOLIA_PREFIX}_workspaces`)

export default passportAuth(({ ctx, req, res }) => ({
  successRedirectUrl: "/dashboard",
  errorRedirectUrl: "/dashboard",
  strategies: [
    {
      strategy: new OrcidStrategy(
        // This strategy can only be used to add the ORCID to a workspace (right now)
        // Not used to login (yet)
        {
          sandbox: process.env.ORCID_CLIENT_SANDBOX,
          clientID: process.env.ORCID_CLIENT_ID,
          clientSecret: process.env.ORCID_CLIENT_SECRET,
          callbackURL: `${process.env.APP_ORIGIN}/api/auth/orcid/callback`,
        },
        async function (accessToken, refreshToken, params, profile, done) {
          // TODO add a way for the user to know when this fails
          // EG when another account is already linked to the orcid
          const workspace = await db.workspace.update({
            where: {
              id: ctx.session.$publicData.workspaceId,
            },
            data: {
              name: params.name,
              orcid: params.orcid,
            },
          })

          await index.partialUpdateObjects([
            {
              objectID: workspace.id,
              name: params.name,
              orcid: params.orcid,
            },
          ])

          return done(null, { publicData: ctx.session.$publicData })
        }
      ),
    },
  ],
}))
