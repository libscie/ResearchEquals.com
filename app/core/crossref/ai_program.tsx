const aiProgram = ({ license, url }) => {
  const js = {
    type: "element",
    name: "program",
    attributes: {
      name: "AccessIndicators",
      xmlns: "http://www.crossref.org/AccessIndicators.xsd",
    },
    elements: [
      {
        type: "element",
        name: "free_to_read",
      },
      {
        type: "element",
        name: "license_ref",
        attributes: {
          applies_to: "vor",
        },
        elements: [
          {
            type: "text",
            text: url,
          },
        ],
      },
    ],
  }

  return js
}
export default aiProgram
