import db from "db"

/*
 * This seed function is executed when you run `blitz db seed`.
 *
 * Probably you want to use a library like https://chancejs.com
 * or https://github.com/Marak/Faker.js to easily generate
 * realistic data.
 */
const seed = async () => {
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
      },
      {
        url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
        name: "CC BY-NC-SA 4.0",
        price: 32999,
      },
      {
        url: "https://creativecommons.org/licenses/by-nd/4.0/legalcode",
        name: "CC BY-ND 4.0",
        price: 24999,
      },
      {
        url: "https://creativecommons.org/licenses/by-nc/4.0/legalcode",
        name: "CC BY-NC 4.0",
        price: 19499,
      },
      {
        url: "https://creativecommons.org/licenses/by-sa/4.0/legalcode",
        name: "CC BY-SA 4.0",
        price: 14999,
      },
      {
        url: "",
        name: "All rights reserved",
        price: 54999,
      },
    ],
    skipDuplicates: true,
  })

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
}

export default seed
