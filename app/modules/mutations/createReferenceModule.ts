import { resolver } from "blitz"
import db, { Prisma } from "db"
import axios from "axios"

import generateSuffix from "./generateSuffix"

export default resolver.pipe(resolver.authorize(), async ({ doi }, ctx) => {
  // Info crossref
  const cr = await axios.get(`https://api.crossref.org/works/${doi}`)
  const metadata = cr.data.message
  // Info datacite
  // Create module
  console.log(JSON.stringify(metadata))
  const module = await db.module.create({
    data: {
      published: true,
      publishedAt: metadata,
      publishedWhere: metadata,
      prefix: metadata.prefix,
      url: `https://doi.org/${metadata.DOI}`,
      title: metadata.title,
      description: metadata.abstract,
      type: {
        connect: {},
      },
    },
  })

  // publishedAt    DateTime?
  // publishedWhere String?
  // isbn           String?
  // prefix         String?
  // suffix         String?
  // license        License?  @relation(fields: [licenseId], references: [id])
  // licenseId      Int?

  // metadata.type
  // type         ModuleType @relation(fields: [moduleTypeId], references: [id])
  // moduleTypeId Int

  // main       Json? @default("{}")
  // supporting Json? @default("{\"files\": []}")

  // authors    Authorship[]
  // authorsRaw Json?        @default("{}")

  // parents  Module[] @relation("ModuleToModule", references: [id])
  // children Module[] @relation("ModuleToModule", references: [id])

  // references    Module[] @relation("ModuleReference", references: [id])
  // referencedBy  Module[] @relation("ModuleReference", references: [id])
  // referencesRaw

  // TODO: Index into algolia

  return true
})
