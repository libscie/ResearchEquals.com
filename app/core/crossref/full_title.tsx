import { Element, Text } from "xast"

export interface FullTitle extends Element {
  name: "full_title"
  children: [Text]
}

const full_title = (title: string): FullTitle => {
  const js: FullTitle = {
    type: "element",
    name: "full_title",
    attributes: {},
    children: [
      {
        type: "text",
        value: title,
      },
    ],
  }

  return js
}
export default full_title
