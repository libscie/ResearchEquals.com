import { Element, Text } from "xast"

export interface DoiData extends Element {
  name: "doi_data"
  children: (DOI | Resource)[]
}
export interface DOI extends Element {
  name: "doi"
  children: [Text]
}
export interface Resource extends Element {
  name: "resource"
  children: [Text]
}

const doi_data = ({ doi, url }: { doi: string; url: string }): DoiData => {
  const js: DoiData = {
    type: "element",
    name: "doi_data",
    attributes: {},
    children: [
      {
        type: "element",
        name: "doi",
        attributes: {},
        children: [
          {
            type: "text",
            value: doi,
          },
        ],
      },
      {
        type: "element",
        name: "resource",
        attributes: {},
        children: [
          {
            type: "text",
            value: url,
          },
        ],
      },
    ],
  }

  return js
}

export default doi_data
