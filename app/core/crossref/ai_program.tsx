import { Element, Text } from "xast"

export type URI = `http${"s" | ""}://${string}`
export const isURI = (uri: string): uri is URI => /https?:\/\.*/.test(uri)
export interface AiProgramProps {
  url: URI
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

interface URINode extends Text {
  value: URI
}
export interface LicenseRef extends Element {
  name: "license_ref"
  attributes: {
    applies_to: "vor" | Exclude<string, "vor">
  }
  children: URINode[]
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
        attributes: {},
        children: [],
      } as FreeToRead,
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
      } as LicenseRef,
    ],
  }

  return js
}
export default aiProgram
