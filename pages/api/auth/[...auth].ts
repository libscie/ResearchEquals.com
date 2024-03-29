import { passportAuth } from "@blitzjs/auth"
import db from "db"
import { Strategy as OrcidStrategy } from "passport-orcid"
import algoliasearch from "algoliasearch"
import { api } from "app/blitz-server"

const client = algoliasearch(process.env.ALGOLIA_APP_ID!, process.env.ALGOLIA_API_ADMIN_KEY!)
const index = client.initIndex(`${process.env.ALGOLIA_PREFIX}_workspaces`)

export default api(
  passportAuth(({ ctx, req, res }) => ({
    successRedirectUrl: "/dashboard",
    errorRedirectUrl: "/dashboard",
    strategies: [
      {
        strategy: new OrcidStrategy(
          // This strategy can only be used to add the ORCID to a workspace (right now)
          // Not used to login (yet)
          {
            sandbox: process.env.ORCID_CLIENT_SANDBOX === "true",
            clientID: process.env.ORCID_CLIENT_ID,
            clientSecret: process.env.ORCID_CLIENT_SECRET,
            callbackURL: `${process.env.APP_ORIGIN}/api/auth/orcid/callback`,
          },
          async function (accessToken, refreshToken, params, profile, done) {
            // TODO add a way for the user to know when this fails
            // EG when another account is already linked to the orcid
            try {
              const workspace = await db.workspace.update({
                where: {
                  id: ctx.session.$publicData.workspaceId,
                },
                data: {
                  orcid: params.orcid,
                },
              })

              await index.partialUpdateObjects([
                {
                  objectID: workspace.id,
                  orcid: params.orcid,
                },
              ])
            } catch (e) {
              // TODO: Could improve the situation by adding an error state upon going back to dashboard
              console.log(e)
            }

            return done(null, { publicData: ctx.session.$publicData })
          }
        ),
      },
    ],
  }))
)
