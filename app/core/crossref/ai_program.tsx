import { Element, Text } from "xast"

export interface AiProgramProps {
  url: string
}

export interface AiProgram extends Element {
  name: "program"
  attributes: {
    name: "AccessIndicators"
    xmlns: "http://www.crossref.org/AccessIndicators.xsd"
  }
  children: (FreeToRead | LicenseRef)[]
}

export interface FreeToRead extends Element {
  name: "free_to_read"
}

export interface LicenseRef extends Element {
  name: "license_ref"
  attributes: {
    applies_to: "vor" | Exclude<string, "vor">
  }
  children: Text[]
}

const aiProgram = ({ url }: AiProgramProps): AiProgram => {
  const js: AiProgram = {
    type: "element",
    name: "program",
    attributes: {
      name: "AccessIndicators",
      xmlns: "http://www.crossref.org/AccessIndicators.xsd",
    },
    children: [
      {
        type: "element",
        name: "free_to_read",
        children: [],
      },
      {
        type: "element",
        name: "license_ref",
        attributes: {
          applies_to: "vor",
        },
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
export default aiProgram
