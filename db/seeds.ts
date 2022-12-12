import db from "db"
import moment from "moment"
import algoliasearch from "algoliasearch"
import { faker } from "@faker-js/faker"

import generateSuffix from "../app/modules/mutations/generateSuffix"

const client = algoliasearch(process.env.ALGOLIA_APP_ID!, process.env.ALGOLIA_API_ADMIN_KEY!)
const algIndex = client.initIndex(`${process.env.ALGOLIA_PREFIX}_workspaces`)
const modIndex = client.initIndex(`${process.env.ALGOLIA_PREFIX}_modules`)

/*
 * This seed function is executed when you run `blitz db seed`.
 *
 * Probably you want to use a library like https://chancejs.com
 * or https://github.com/Marak/Faker.js to easily generate
 * realistic data.
 */
const seed = async () => {
  // Always do this
  const types = [
    { wikidata: "Q131841", name: "Idea", schema: "CreativeWork" },
    { wikidata: "Q1371819", name: "Plan", schema: "CreativeWork" },
    { wikidata: "Q17737", name: "Theory", schema: "CreativeWork" },
    { wikidata: "Q2412849", name: "Literature review", schema: "CreativeWork" },
    { wikidata: "Q321703", name: "Premise", schema: "CreativeWork" },
    { wikidata: "Q41719", name: "Hypothesis", schema: "CreativeWork" },
    { wikidata: "Q748250", name: "Prediction", schema: "CreativeWork" },
    { wikidata: "Q94535766", name: "Assertion", schema: "CreativeWork" },
    { wikidata: "Q185698", name: "Methodology", schema: "CreativeWork" },
    { wikidata: "Q82604", name: "Design", schema: "CreativeWork" },
    { wikidata: "Q41689629", name: "Procedure", schema: "CreativeWork" },
    { wikidata: "Q16798631", name: "Equipment", schema: "CreativeWork" },
    { wikidata: "Q42848", name: "Data", schema: "Dataset" },
    { wikidata: "Q1070421", name: "Script", schema: "CreativeWork" },
    { wikidata: "Q1347572", name: "Evidence", schema: "CreativeWork" },
    { wikidata: "Q217602", name: "Analysis", schema: "CreativeWork" },
    { wikidata: "Q17104930", name: "Outcome", schema: "CreativeWork" },
    { wikidata: "Q3030248", name: "Discussion", schema: "CreativeWork" },
    { wikidata: "Q333291", name: "Abstract", schema: "CreativeWork" },
    { wikidata: "Q1318295", name: "Narrative", schema: "CreativeWork" },
    { wikidata: "Q604733", name: "Presentation", schema: "CreativeWork" },
    { wikidata: "Q265158", name: "Review", schema: "Review" },
    { wikidata: "Q55107540", name: "Other", schema: "CreativeWork" },
    { wikidata: "Q947859", name: "Research proposal", schema: "CreativeWork" },
    { wikidata: "Q7397", name: "Software", schema: "SoftwareApplication" },
    { wikidata: "Q871232", name: "Editorial", schema: "CreativeWork" },
    { wikidata: "Q30849", name: "Blog", schema: "Blog" },
    { wikidata: "Q60752967", name: "Preregistration", schema: "CreativeWork" },
    { wikidata: "Q429785", name: "Poster", schema: "Poster" },
    { wikidata: "Q59094171", name: "Ethical review", schema: "CreativeWork" },
    { wikidata: "Q580922", name: "Preprint", schema: "CreativeWork" },
    { wikidata: "Q1744627", name: "Classification algorithm", schema: "CreativeWork" },
    { wikidata: "Q642946", name: "Gamebook", schema: "CreativeWork" },

  // This adds the record or updates the existing one
  for (let index = 0; index < types.length; index++) {
    await db.moduleType.upsert({
      where: {
        name: types[index]!.name,
      },
      // This ensures  the latest update
      update: {
        wikidata: types[index]!.wikidata,
        name: types[index]!.name,
        schema: types[index]!.schema,
      },
      // This is the original
      create: {
        wikidata: types[index]!.wikidata,
        name: types[index]!.name,
        schema: types[index]!.schema,
      },
    })
  }

  // Only do this in production
  if (process.env.ALGOLIA_PREFIX === "production") {
    // These are the production licenses (and prices)
    // [PROD] CC0 Public Domain Dedication
    await db.license.upsert({
      where: {
        url: "https://creativecommons.org/publicdomain/zero/1.0/legalcode",
      },
      // This contains the latest update, change this to update the price
      update: {
        price: 0,
        prod_id: "prod_M0VJdtMgxTMRvS",
      },
      // This is the original
      create: {
        url: "https://creativecommons.org/publicdomain/zero/1.0/legalcode",
        name: "CC0 Public Domain Dedication",
        price: 0,
        prod_id: "prod_M0VJdtMgxTMRvS",
      },
    })

    // [PROD] CC BY 4.0
    await db.license.upsert({
      where: {
        url: "https://creativecommons.org/licenses/by/4.0/legalcode",
      },
      // This contains the latest update, change this to update the price
      update: {
        price: 0,
        prod_id: "prod_M0VKT0n4i9hFlz",
      },
      // This is the original
      create: {
        url: "https://creativecommons.org/licenses/by/4.0/legalcode",
        name: "CC BY 4.0",
        price: 0,
        prod_id: "prod_M0VKT0n4i9hFlz",
      },
    })

    // [PROD] CC BY-NC-ND 4.0
    await db.license.upsert({
      where: {
        url: "https://creativecommons.org/licenses/by-nc-nd/4.0/legalcode",
      },
      // This contains the latest update, change this to update the price
      update: {
        price: 42999,
        price_id: "price_1KCTCfLmgtJbKHNGKwS8Da2l",
      },
      // This is the original
      create: {
        url: "https://creativecommons.org/licenses/by-nc-nd/4.0/legalcode",
        name: "CC BY-NC-ND 4.0",
        price: 42999,
        price_id: "price_1KCTCfLmgtJbKHNGKwS8Da2l",
      },
    })

    // [PROD] CC BY-NC-SA 4.0
    await db.license.upsert({
      where: {
        url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
      },
      // This contains the latest update, change this to update the price
      update: {
        price: 32999,
        price_id: "price_1KCTCgLmgtJbKHNGFMFbG3zs",
      },
      // This is the original
      create: {
        url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
        name: "CC BY-NC-SA 4.0",
        price: 32999,
        price_id: "price_1KCTCgLmgtJbKHNGFMFbG3zs",
      },
    })

    // [PROD] CC BY-ND 4.0
    await db.license.upsert({
      where: {
        url: "https://creativecommons.org/licenses/by-nd/4.0/legalcode",
      },
      // This contains the latest update, change this to update the price
      update: {
        price: 24999,
        price_id: "price_1KCTCiLmgtJbKHNGdXWdgVY9",
      },
      // This is the original
      create: {
        url: "https://creativecommons.org/licenses/by-nd/4.0/legalcode",
        name: "CC BY-ND 4.0",
        price: 24999,
        price_id: "price_1KCTCiLmgtJbKHNGdXWdgVY9",
      },
    })

    // [PROD] CC BY-NC 4.0
    await db.license.upsert({
      where: {
        url: "https://creativecommons.org/licenses/by-nc/4.0/legalcode",
      },
      // This contains the latest update, change this to update the price
      update: {
        price: 19499,
        price_id: "price_1KCTCjLmgtJbKHNG6G1nkZYe",
      },
      // This is the original
      create: {
        url: "https://creativecommons.org/licenses/by-nc/4.0/legalcode",
        name: "CC BY-NC 4.0",
        price: 19499,
        price_id: "price_1KCTCjLmgtJbKHNG6G1nkZYe",
      },
    })

    // [PROD] CC BY-SA 4.0
    await db.license.upsert({
      where: {
        url: "https://creativecommons.org/licenses/by-sa/4.0/legalcode",
      },
      // This contains the latest update, change this to update the price
      update: {
        price: 14999,
        price_id: "price_1KCTCcLmgtJbKHNGbu2vXiYR",
      },
      // This is the original
      create: {
        url: "https://creativecommons.org/licenses/by-sa/4.0/legalcode",
        name: "CC BY-SA 4.0",
        price: 14999,
        price_id: "price_1KCTCcLmgtJbKHNGbu2vXiYR",
      },
    })

    // [PROD] All rights reserved
    await db.license.upsert({
      where: {
        url: "https://en.wikipedia.org/wiki/All_rights_reserved",
      },
      // This contains the latest update, change this to update the price
      update: {
        price: 54999,
        price_id: "price_1KCTBbLmgtJbKHNGQSZHsNO0",
      },
      // This is the original
      create: {
        url: "https://en.wikipedia.org/wiki/All_rights_reserved",
        name: "All rights reserved",
        price: 54999,
        price_id: "price_1KCTBbLmgtJbKHNGQSZHsNO0",
      },
    })

    // Add collections pricing
    // [PROD] Individual collection
    await db.collectionType.upsert({
      where: {
        type: "INDIVIDUAL",
      },
      // This contains the latest update, change this to update the price
      update: {
        price: 0,
      },
      // This is the original
      create: {
        type: "INDIVIDUAL",
        price: 0,
      },
    })
    // [PROD] Collaborative collection
    await db.collectionType.upsert({
      where: {
        type: "COLLABORATIVE",
      },
      // This contains the latest update, change this to update the price
      update: {
        price: 1499,
        price_id: "price_1LgCMbLmgtJbKHNGvX5LHLoo",
      },
      // This is the original
      create: {
        type: "COLLABORATIVE",
        price: 1499,
        price_id: "price_1LgCMbLmgtJbKHNGvX5LHLoo",
      },
    })
    // [PROD] Community collection
    await db.collectionType.upsert({
      where: {
        type: "COMMUNITY",
      },
      // This contains the latest update, change this to update the price
      update: {
        price: 14999,
        price_id: "price_1LgCLQLmgtJbKHNGNoiEKuv1",
      },
      // This is the original
      create: {
        type: "COMMUNITY",
        price: 14999,
        price_id: "price_1LgCLQLmgtJbKHNGNoiEKuv1",
      },
    })
  }

  // Do this when not in production
  if (process.env.ALGOLIA_PREFIX !== "production") {
    // These are the test environment prices
    // CC0 Public Domain Dedication
    await db.license.upsert({
      where: {
        url: "https://creativecommons.org/publicdomain/zero/1.0/legalcode",
      },
      // This contains the latest update, change this to update the price
      update: {
        price: 0,
        prod_id: "prod_M0VIEuGW4US4mL",
      },
      // This is the original
      create: {
        url: "https://creativecommons.org/publicdomain/zero/1.0/legalcode",
        name: "CC0 Public Domain Dedication",
        price: 0,
        prod_id: "prod_M0VIEuGW4US4mL",
      },
    })

    // CC BY 4.0
    await db.license.upsert({
      where: {
        url: "https://creativecommons.org/licenses/by/4.0/legalcode",
      },
      // This contains the latest update, change this to update the price
      update: {
        price: 0,
        prod_id: "prod_M0VJVhT9ulOw1c",
      },
      // This is the original
      create: {
        url: "https://creativecommons.org/licenses/by/4.0/legalcode",
        name: "CC BY 4.0",
        price: 0,
        prod_id: "prod_M0VJVhT9ulOw1c",
      },
    })

    // CC BY-NC-ND 4.0
    await db.license.upsert({
      where: {
        url: "https://creativecommons.org/licenses/by-nc-nd/4.0/legalcode",
      },
      // This contains the latest update, change this to update the price
      update: {
        price: 42999,
        price_id: "price_1KCRaTLmgtJbKHNG9WZlp04W",
      },
      // This is the original
      create: {
        url: "https://creativecommons.org/licenses/by-nc-nd/4.0/legalcode",
        name: "CC BY-NC-ND 4.0",
        price: 42999,
        price_id: "price_1KCRaTLmgtJbKHNG9WZlp04W",
      },
    })

    // CC BY-NC-SA 4.0
    await db.license.upsert({
      where: {
        url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
      },
      // This contains the latest update, change this to update the price
      update: {
        price: 32999,
        price_id: "price_1KCRaqLmgtJbKHNGoj6TG4BQ",
      },
      // This is the original
      create: {
        url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
        name: "CC BY-NC-SA 4.0",
        price: 32999,
        price_id: "price_1KCRaqLmgtJbKHNGoj6TG4BQ",
      },
    })

    // CC BY-ND 4.0
    await db.license.upsert({
      where: {
        url: "https://creativecommons.org/licenses/by-nd/4.0/legalcode",
      },
      // This contains the latest update, change this to update the price
      update: {
        price: 24999,
        price_id: "price_1KCRbQLmgtJbKHNGQtGY2BtP",
      },
      // This is the original
      create: {
        url: "https://creativecommons.org/licenses/by-nd/4.0/legalcode",
        name: "CC BY-ND 4.0",
        price: 24999,
        price_id: "price_1KCRbQLmgtJbKHNGQtGY2BtP",
      },
    })

    // CC BY-NC 4.0
    await db.license.upsert({
      where: {
        url: "https://creativecommons.org/licenses/by-nc/4.0/legalcode",
      },
      // This contains the latest update, change this to update the price
      update: {
        price: 19499,
        price_id: "price_1KCRdCLmgtJbKHNGop8lJ0r5",
      },
      // This is the original
      create: {
        url: "https://creativecommons.org/licenses/by-nc/4.0/legalcode",
        name: "CC BY-NC 4.0",
        price: 19499,
        price_id: "price_1KCRdCLmgtJbKHNGop8lJ0r5",
      },
    })

    // CC BY-SA 4.0
    await db.license.upsert({
      where: {
        url: "https://creativecommons.org/licenses/by-sa/4.0/legalcode",
      },
      // This contains the latest update, change this to update the price
      update: {
        price: 14999,
        price_id: "price_1KCMOZLmgtJbKHNGvjMirRp0",
      },
      // This is the original
      create: {
        url: "https://creativecommons.org/licenses/by-sa/4.0/legalcode",
        name: "CC BY-SA 4.0",
        price: 14999,
        price_id: "price_1KCMOZLmgtJbKHNGvjMirRp0",
      },
    })

    // All rights reserved
    await db.license.upsert({
      where: {
        url: "https://en.wikipedia.org/wiki/All_rights_reserved",
      },
      // This contains the latest update, change this to update the price
      update: {
        price: 54999,
        price_id: "price_1KCRbjLmgtJbKHNGLa8TS0aH",
      },
      // This is the original
      create: {
        url: "https://en.wikipedia.org/wiki/All_rights_reserved",
        name: "All rights reserved",
        price: 54999,
        price_id: "price_1KCRbjLmgtJbKHNGLa8TS0aH",
      },
    })

    // Add collections pricing
    // Individual collection
    await db.collectionType.upsert({
      where: {
        type: "INDIVIDUAL",
      },
      // This contains the latest update, change this to update the price
      update: {
        price: 0,
      },
      // This is the original
      create: {
        type: "INDIVIDUAL",
        price: 0,
      },
    })
    // Collaborative collection
    await db.collectionType.upsert({
      where: {
        type: "COLLABORATIVE",
      },
      // This contains the latest update, change this to update the price
      update: {
        price: 1499,
        price_id: "price_1LgCBCLmgtJbKHNG3r9B3C1C",
      },
      // This is the original
      create: {
        type: "COLLABORATIVE",
        price: 1499,
        price_id: "price_1LgCBCLmgtJbKHNG3r9B3C1C",
      },
    })
    // Community collection
    await db.collectionType.upsert({
      where: {
        type: "COMMUNITY",
      },
      // This contains the latest update, change this to update the price
      update: {
        price: 14999,
        price_id: "price_1LgCCSLmgtJbKHNG0hJCGKhd",
      },
      // This is the original
      create: {
        type: "COMMUNITY",
        price: 14999,
        price_id: "price_1LgCCSLmgtJbKHNG0hJCGKhd",
      },
    })

    let user
    for (let index = 0; index < 50; index++) {
      user = await db.user.create({
        data: {
          email: faker.internet.email(),
          role: "CUSTOMER",
          memberships: {
            create: [
              {
                role: "OWNER",
                workspace: {
                  create: {
                    handle: faker.internet.userName().toLowerCase(),
                    avatar: `https://eu.ui-avatars.com/api/?rounded=true&background=574cfa&color=ffffff&name=${faker.internet.userName()}`,
                    firstName: faker.name.firstName(),
                    lastName: faker.name.lastName(),
                    url: faker.internet.url(),
                  },
                },
              },
            ],
          },
        },
        include: {
          memberships: {
            include: {
              workspace: true,
            },
          },
        },
      })

      user!.memberships!.map(async (membership) => {
        await algIndex.saveObject({
          objectID: membership.workspace.id,
          firstName: membership.workspace.firstName,
          lastName: membership.workspace.lastName,
          handle: membership.workspace.handle,
          avatar: membership.workspace.avatar,
          pronouns: membership.workspace.pronouns,
        })
      })
    }

    let datetime
    let suffix
    let currentModule
    for (let index = 0; index < 10; index++) {
      datetime = Date.now()
      suffix = await generateSuffix(undefined)
      const catImage = `https://ucarecdn.com/fea4c143-6382-467d-a500-23826acbb1e4/`
      currentModule = await db.module.create({
        data: {
          prefix: "10.53962",
          suffix: await generateSuffix(undefined),
          title: faker.lorem.sentence(),
          description: faker.lorem.sentences(5 * (index + 1)),
          published: true,
          publishedWhere: "ResearchEquals",
          publishedAt: faker.date.past(),
          url: `https://doi.org/10.53962/${suffix}`,
          main: {
            name: faker.system.fileName(),
            size: 603268,
            uuid: faker.datatype.uuid(),
            cdnUrl: catImage,
            isImage: true,
            isStored: true,
            mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            sourceInfo: { file: {}, source: "local" },
            originalUrl: catImage,
            cdnUrlModifiers: null,
            originalImageInfo: null,
          },
          type: {
            connect: { id: 2 },
          },
          license: {
            connect: { id: 1 },
          },
          authors: {
            create: [
              {
                workspaceId: 1,
                acceptedInvitation: true,
              },
              {
                workspaceId: 2,
                acceptedInvitation: true,
              },
              {
                workspaceId: 3,
                acceptedInvitation: true,
              },
              {
                workspaceId: 4,
                acceptedInvitation: true,
              },
              {
                workspaceId: 5,
                acceptedInvitation: true,
              },
              {
                workspaceId: 6,
                acceptedInvitation: true,
              },
              {
                workspaceId: 7,
                acceptedInvitation: true,
              },
            ],
          },
        },
        include: {
          type: true,
          license: true,
        },
      })
      await modIndex.saveObject({
        objectID: module.id,
        doi: `${process.env.DOI_PREFIX}/${currentModule.suffix}`,
        suffix: currentModule.suffix,
        license: currentModule.license?.url,
        type: currentModule.type.name,
        // It's called name and not title to improve Algolia search
        name: currentModule.title,
        description: currentModule.description,
        publishedAt: currentModule.publishedAt,
      })
    }
  }
}

export default seed
