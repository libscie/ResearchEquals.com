const titles = (title) => {
  const js = {
    type: "element",
    name: "titles",
    elements: [
      {
        type: "element",
        name: "title",
        elements: [
          {
            type: "text",
            text: title,
          },
        ],
      },
    ],
  }

  return js
}
export default titles
