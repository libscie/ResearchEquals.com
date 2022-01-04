const publication_date = () => {
  const datetime = Date.now()
  const dateObject = new Date(datetime)
  // Months are zero-indexed, so adding one for accurate deposit
  // 11 = december by default
  const month = dateObject.getUTCMonth() + 1

  const js = {
    // https://data.crossref.org/reports/help/schema_doc/4.4.2/schema_4_4_2.html#publication_date
    type: "element",
    name: "publication_date",
    attributes: {
      media_type: "online",
    },
    elements: [
      {
        type: "element",
        name: "month",
        elements: [
          {
            type: "text",
            text: month.toString().padStart(2, "0"),
          },
        ],
      },
      {
        type: "element",
        name: "day",
        elements: [
          {
            type: "text",
            text: dateObject.getUTCDate().toString().padStart(2, "0"),
          },
        ],
      },
      {
        type: "element",
        name: "year",
        elements: [
          {
            type: "text",
            text: dateObject.getUTCFullYear().toString(),
          },
        ],
      },
    ],
  }

  return js
}
export default publication_date
