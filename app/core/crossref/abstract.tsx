import { Element, Text } from "xast"

export interface Abstract extends Element {
  name: "jats:abstract"
  children: JATS<"p">[]
}

export interface JATS<T extends string = "p"> extends Element {
  name: `jats:${T}`
  children: (Text | JATS)[]
}

const abstract = (abstract: string): Abstract => {
  const js: Abstract = {
    type: "element",
    name: "jats:abstract",
    attributes: {},
    children: [
      {
        type: "element",
        name: "jats:p",
        attributes: {},
        children: [
          {
            type: "text",
            value: abstract,
          },
        ],
      },
    ],
  }

  return js
}
export default abstract
