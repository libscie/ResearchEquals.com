import { Element, Text } from "xast"
export interface Publisher extends Element {
  name: "publisher"
  children: (PublisherName | PublisherPlace)[]
}

export interface PublisherName extends Element {
  name: "publisher_name"
  children: [Text]
}
export interface PublisherPlace extends Element {
  name: "publisher_place"
  children: [Text]
}

const publisher = (publisher?: { name: string; place: string }): Publisher => {
  // https://data.crossref.org/reports/help/schema_doc/4.4.2/schema_4_4_2.html#publisher
  const js: Publisher = {
    type: "element",
    name: "publisher",
    attributes: {},
    children: [
      {
        type: "element",
        name: "publisher_name",
        attributes: {},
        children: [
          {
            type: "text",
            value: "Liberate Science GmbH",
          },
        ],
      },
      {
        type: "element",
        name: "publisher_place",
        attributes: {},
        children: [
          {
            type: "text",
            value: "Berlin (Germany)",
          },
        ],
      },
    ],
  }

  return js
}
export default publisher
