const { withBlitz } = require("@blitzjs/next")
const pjson = require("./package.json")

const PDFJS_DIST_VERSION = pjson.dependencies["pdfjs-dist"]

const config = {
  images: {
    domains: ["eu.ui-avatars.com", "ucarecdn.com"],
  },

  env: {
    UPLOADCARE_PUBLIC_KEY: process.env.UPLOADCARE_PUBLIC_KEY,
    ORCID_CLIENT_ID: process.env.ORCID_CLIENT_ID,
    ORCID_CLIENT_SECRET: process.env.ORCID_CLIENT_SECRET,
    ORCID_CLIENT_SANDBOX: process.env.ORCID_CLIENT_SANDBOX,
    ALGOLIA_APP_ID: process.env.ALGOLIA_APP_ID,
    ALGOLIA_API_SEARCH_KEY: process.env.ALGOLIA_API_SEARCH_KEY,
    ALGOLIA_PREFIX: process.env.ALGOLIA_PREFIX,
    DOI_PREFIX: process.env.DOI_PREFIX,
    STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
    PDFJS_DIST_VERSION: PDFJS_DIST_VERSION,
  },

  pageExtensions: ["tsx", "ts", "jsx", "js"],

  webpack(config, options) {
    config.module.rules.push({})

    return config
  },

  i18n: {
    // https://github.com/libscie/ResearchEquals.com/wiki/Localization
    locales: ["en"],
    defaultLocale: "en",
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
module.exports = withBlitz(config)
