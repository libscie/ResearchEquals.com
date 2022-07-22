import { Element, Text } from "xast"

import head, { Head } from "./head"
import body, { Body } from "./body"
import { Cite } from "./citation_list"
import { Author } from "./contributors"

export interface CrossRef extends Element {
  declaration: {
    attributes: {
      version: "1.0"
      encoding: "UTF-8"
    }
  }
  children: DOIBatch[]
}
export interface DOIBatch extends Element {
  name: "doi_batch"
  attributes: {
    version: string
    xmlns: string
    "xmlns:xsi": string
    "xsi:schemaLocation": string
    "xmlns:jats": string
  }
  elements: (Head | Body)[]
}
const generateCrossRef = ({
  schema,
  type,
  title,
  authors,
  abstractText,
  license_url,
  doi,
  resolve_url,
  citations,
}: {
  schema: string
  type: string
  title: string
  authors: Author[]
  abstractText: string
  license_url: string
  doi: string
  resolve_url: string
  citations: Cite[]
}) => {
  const jsCrossRef = {
    declaration: {
      attributes: {
        version: "1.0",
        encoding: "UTF-8",
      },
    },
    elements: [
      {
        type: "element",
        name: "doi_batch",
        attributes: {
          version: schema,
          xmlns: `http://www.crossref.org/schema/${schema}`,
          "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
          "xsi:schemaLocation": `http://www.crossref.org/schema/${schema} http://www.crossref.org/schemas/crossref${schema}.xsd`,
          "xmlns:jats": "http://www.ncbi.nlm.nih.gov/JATS1",
        },
        elements: [
          head({
            registrant: "Liberate Science GmbH",
            email: "info@libscie.org",
          }),
          body({
            type,
            title,
            authors,
            abstractText,
            license_url,
            doi,
            resolve_url,
            citations,
          }),
        ],
      },
    ],
  }

  return jsCrossRef
}

export default generateCrossRef
