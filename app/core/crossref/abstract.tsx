const abstract = (abstract) => {
  const js = {
    type: "element",
    name: "jats:abstract",
    elements: [
      {
        type: "element",
        name: "jats:p",
        elements: [
          {
            type: "text",
            text: abstract,
          },
        ],
      },
    ],
  }

  return js
}
export default abstract
