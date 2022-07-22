import { Element, Text } from "xast"

export interface PublicationDate extends Element {
  name: "publication_date"
  attributes: {
    media_type: "online"
  }
  children: (Month | Day | Year)[]
}
export interface Month extends Element {
  name: "month"
  children: [Text]
}
export interface Day extends Element {
  name: "day"
  children: [Text]
}
export interface Year extends Element {
  name: "year"
  children: [Text]
}

const publication_date = (date?: Date): PublicationDate => {
  const datetime = date ?? Date.now()
  const dateObject = new Date(datetime)
  // Months are zero-indexed, so adding one for accurate deposit
  // 11 = december by default
  const month = dateObject.getUTCMonth() + 1

  const js: PublicationDate = {
    // https://data.crossref.org/reports/help/schema_doc/4.4.2/schema_4_4_2.html#publication_date
    type: "element",
    name: "publication_date",
    attributes: {
      media_type: "online",
    },
    children: [
      {
        type: "element",
        name: "month",
        children: [
          {
            type: "text",
            value: month.toString().padStart(2, "0"),
          },
        ],
      },
      {
        type: "element",
        name: "day",
        children: [
          {
            type: "text",
            value: dateObject.getUTCDate().toString().padStart(2, "0"),
          },
        ],
      },
      {
        type: "element",
        name: "year",
        children: [
          {
            type: "text",
            value: dateObject.getUTCFullYear().toString(),
          },
        ],
      },
    ],
  }

  return js
}
export default publication_date
