import db from "db"
import moment from "moment"
import faker from "faker"

import generateSuffix from "../app/modules/mutations/generateSuffix"

/*
 * This seed function is executed when you run `blitz db seed`.
 *
 * Probably you want to use a library like https://chancejs.com
 * or https://github.com/Marak/Faker.js to easily generate
 * realistic data.
 */
const seed = async () => {
  // Always do this
  await db.moduleType.createMany({
    data: [
      { wikidata: "Q131841", name: "Idea" },
      { wikidata: "Q1371819", name: "Plan" },
      { wikidata: "Q17737", name: "Theory" },
      { wikidata: "Q2412849", name: "Literature review" },
      { wikidata: "Q321703", name: "Premise" },
      { wikidata: "Q41719", name: "Hypothesis" },
      { wikidata: "Q748250", name: "Prediction" },
      { wikidata: "Q94535766", name: "Assertion" },
      { wikidata: "Q185698", name: "Methodology" },
      { wikidata: "Q82604", name: "Design" },
      { wikidata: "Q41689629", name: "Procedure" },
      { wikidata: "Q16798631", name: "Equipment" },
      { wikidata: "Q42848", name: "Data" },
      { wikidata: "Q1070421", name: "Script" },
      { wikidata: "Q1347572", name: "Evidence" },
      { wikidata: "Q217602", name: "Analysis" },
      { wikidata: "Q17104930", name: "Outcome" },
      { wikidata: "Q3030248", name: "Discussion" },
      { wikidata: "Q333291", name: "Abstract" },
      { wikidata: "Q1318295", name: "Narrative" },
      { wikidata: "Q604733", name: "Presentation" },
      { wikidata: "Q265158", name: "Review" },
      { wikidata: "Q55107540", name: "Other" },
    ],
    skipDuplicates: true,
  })

  // Only do this in production
  if (process.env.ALGOLIA_PREFIX === "production") {
    // These are the production licenses (and prices)
    await db.license.createMany({
      data: [
        {
          url: "https://creativecommons.org/publicdomain/zero/1.0/legalcode",
          name: "CC0 Public Domain Dedication",
          price: 0,
        },
        {
          url: "https://creativecommons.org/licenses/by/4.0/legalcode",
          name: "CC BY 4.0",
          price: 0,
        },
        {
          url: "https://creativecommons.org/licenses/by-nc-nd/4.0/legalcode",
          name: "CC BY-NC-ND 4.0",
          price: 42999,
          price_id: "price_1KCTCfLmgtJbKHNGKwS8Da2l",
        },
        {
          url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
          name: "CC BY-NC-SA 4.0",
          price: 32999,
          price_id: "price_1KCTCgLmgtJbKHNGFMFbG3zs",
        },
        {
          url: "https://creativecommons.org/licenses/by-nd/4.0/legalcode",
          name: "CC BY-ND 4.0",
          price: 24999,
          price_id: "price_1KCTCiLmgtJbKHNGdXWdgVY9",
        },
        {
          url: "https://creativecommons.org/licenses/by-nc/4.0/legalcode",
          name: "CC BY-NC 4.0",
          price: 19499,
          price_id: "price_1KCTCjLmgtJbKHNG6G1nkZYe",
        },
        {
          url: "https://creativecommons.org/licenses/by-sa/4.0/legalcode",
          name: "CC BY-SA 4.0",
          price: 14999,
          price_id: "price_1KCTCcLmgtJbKHNGbu2vXiYR",
        },
        {
          url: "",
          name: "All rights reserved",
          price: 54999,
          price_id: "price_1KCTBbLmgtJbKHNGQSZHsNO0",
        },
      ],
      skipDuplicates: true,
    })
  }

  // Do this when not in production
  if (process.env.ALGOLIA_PREFIX !== "production") {
    // These are the test environment prices
    await db.license.createMany({
      data: [
        {
          url: "https://creativecommons.org/publicdomain/zero/1.0/legalcode",
          name: "CC0 Public Domain Dedication",
          price: 0,
        },
        {
          url: "https://creativecommons.org/licenses/by/4.0/legalcode",
          name: "CC BY 4.0",
          price: 0,
        },
        {
          url: "https://creativecommons.org/licenses/by-nc-nd/4.0/legalcode",
          name: "CC BY-NC-ND 4.0",
          price: 42999,
          price_id: "price_1KCRaTLmgtJbKHNG9WZlp04W",
        },
        {
          url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
          name: "CC BY-NC-SA 4.0",
          price: 32999,
          price_id: "price_1KCRaqLmgtJbKHNGoj6TG4BQ",
        },
        {
          url: "https://creativecommons.org/licenses/by-nd/4.0/legalcode",
          name: "CC BY-ND 4.0",
          price: 24999,
          price_id: "price_1KCRbQLmgtJbKHNGQtGY2BtP",
        },
        {
          url: "https://creativecommons.org/licenses/by-nc/4.0/legalcode",
          name: "CC BY-NC 4.0",
          price: 19499,
          price_id: "price_1KCRdCLmgtJbKHNGop8lJ0r5",
        },
        {
          url: "https://creativecommons.org/licenses/by-sa/4.0/legalcode",
          name: "CC BY-SA 4.0",
          price: 14999,
          price_id: "price_1KCMOZLmgtJbKHNGvjMirRp0",
        },
        {
          url: "",
          name: "All rights reserved",
          price: 54999,
          price_id: "price_1KCRbjLmgtJbKHNGLa8TS0aH",
        },
      ],
      skipDuplicates: true,
    })

    for (let index = 0; index < 50; index++) {
      await db.user.create({
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
                    avatar: faker.image.abstract(),
                    name: faker.name.findName(),
                    url: faker.internet.url(),
                  },
                },
              },
            ],
          },
        },
      })
    }

    let datetime
    let suffix
    for (let index = 0; index < 10; index++) {
      datetime = Date.now()
      suffix = await generateSuffix(undefined)
      await db.module.create({
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
            cdnUrl: faker.image.cats(),
            isImage: true,
            isStored: true,
            mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            sourceInfo: { file: {}, source: "local" },
            originalUrl: faker.image.cats(),
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
      })
    }
  }
}

export default seed
