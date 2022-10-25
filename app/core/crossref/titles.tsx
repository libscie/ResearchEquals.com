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

  if (subtitle) {
    js.children.push({
      type: "element",
      name: "subtitle",
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
