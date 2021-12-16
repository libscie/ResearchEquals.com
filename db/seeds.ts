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
}

export default seed
