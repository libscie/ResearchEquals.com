const doi_data = ({ doi, url }) => {
  const js = {
    type: "element",
    name: "doi_data",
    elements: [
      {
        type: "element",
        name: "doi",
        elements: [
          {
            type: "text",
            text: doi,
          },
        ],
      },
      {
        type: "element",
        name: "resource",
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

export default doi_data
