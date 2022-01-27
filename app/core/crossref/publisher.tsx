const publisher = () => {
  // https://data.crossref.org/reports/help/schema_doc/4.4.2/schema_4_4_2.html#publisher
  const js = {
    type: "element",
    name: "publisher",
    elements: [
      {
        type: "element",
        name: "publisher_name",
        elements: [
          {
            type: "text",
            text: "Liberate Science GmbH",
          },
        ],
      },
      {
        type: "element",
        name: "publisher_place",
        elements: [
          {
            type: "text",
            text: "Berlin (Germany)",
          },
        ],
      },
    ],
  }

  return js
}
export default publisher
