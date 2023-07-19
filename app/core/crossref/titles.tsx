import { Element, Text } from "xast"

export interface Titles extends Element {
  name: "titles"
  children: (Title | Subtitle)[]
}

export interface Title extends Element {
  name: "title"
  children: [Text]
}
export interface Subtitle extends Element {
  name: "subtitle"
  children: [Text]
}

const titles = (title: string, subtitle?: string): Titles => {
  const js: Titles = {
    type: "element",
    name: "titles",
    attributes: {},
    children: [
      {
        type: "element",
        name: "title",
        attributes: {},
        children: [
          {
            type: "text",
            value: title,
          },
        ],
      },
    ],
  }

  if (subtitle) {
    js.children.push({
      type: "element",
      name: "subtitle",
      attributes: {},
      children: [
        {
          type: "text",
          value: subtitle,
        },
      ],
    })
  }

  return js
}
export default titles
