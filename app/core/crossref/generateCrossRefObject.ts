import { Element, Instruction, Root, Text } from "xast"

import head, { Head } from "./head"
import body, { Body, BodyJournal, bodyJournal } from "./body"
import { Cite } from "./citation_list"
import { Author } from "./contributors"
import { URI } from "./ai_program"

export interface CrossRef extends Root {
  children: (Instruction | DOIBatch)[]
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
  children: (Head | Body | BodyJournal)[]
}
const generateCrossRef = ({
  schema,
  type,
  title,
  language,
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
  language: string
  authors: Author[]
  abstractText: string
  license_url: URI
  doi: string
  resolve_url: URI
  citations: Cite[]
}): CrossRef => {
  const jsCrossRef: CrossRef = {
    type: "root",
    children: [
      {
        type: "instruction",
        name: "xml",
        value: 'version="1.0" encoding="UTF-8"',
      },
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
        children: [
          head({
            registrant: "Liberate Science GmbH",
            email: "info@libscie.org",
          }),
          body({
            type,
            title,
            language,
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

const generateCollection = ({
  schema,
  title,
  subtitle,
  authors,
  doi,
  resolve_url,
}: {
  schema: string
  title: string
  subtitle?: string
  authors: Author[]
  doi: string
  resolve_url: URI
}): CrossRef => {
  const jsCrossRef: CrossRef = {
    type: "root",
    children: [
      {
        type: "instruction",
        name: "xml",
        value: 'version="1.0" encoding="UTF-8"',
      },
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
        children: [
          head({
            registrant: "Liberate Science GmbH",
            email: "info@libscie.org",
          }),
          bodyJournal({
            title,
            subtitle,
            authors,
            doi,
            resolve_url,
          }),
        ],
      },
    ],
  }

  return jsCrossRef
}

export default generateCrossRef
export { generateCollection }
