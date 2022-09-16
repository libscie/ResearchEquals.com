import { Element, Text } from "xast"

export interface Titles extends Element {
  name: "titles"
  children: [Title]
}

export interface Title extends Element {
  name: "title"
  children: [Text]
}

const titles = (title: string): Titles => {
  const js: Titles = {
    type: "element",
    name: "titles",
    children: [
      {
        type: "element",
        name: "title",
        children: [
          {
            type: "text",
            value: title,
          },
        ],
      },
    ],
  }

  return js
}
export default titles
