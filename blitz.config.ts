import { BlitzConfig, sessionMiddleware, simpleRolesIsAuthorized } from "blitz"

const config: BlitzConfig = {
  images: {
    domains: ["eu.ui-avatars.com"],
  },
  middleware: [
    sessionMiddleware({
      cookiePrefix: "web-app-tbd",
      isAuthorized: simpleRolesIsAuthorized,
    }),
  ],
  env: {
    UPLOADCARE_PUBLIC_KEY: process.env.UPLOADCARE_PUBLIC_KEY,
    ORCID_CLIENT_ID: process.env.ORCID_CLIENT_ID,
    ORCID_CLIENT_SECRET: process.env.ORCID_CLIENT_SECRET,
    ORCID_CLIENT_SANDBOX: process.env.ORCID_CLIENT_SANDBOX,
    ALGOLIA_APP_ID: process.env.ALGOLIA_APP_ID,
    ALGOLIA_API_SEARCH_KEY: process.env.ALGOLIA_API_SEARCH_KEY,
    ALGOLIA_PREFIX: process.env.ALGOLIA_PREFIX,
  },
  /* Uncomment this to customize the webpack config
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Note: we provide webpack above so you should not `require` it
    // Perform customizations to webpack config
    // Important: return the modified config
    return config
  },
  */
}
module.exports = config
