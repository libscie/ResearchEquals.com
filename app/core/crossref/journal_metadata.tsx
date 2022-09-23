import { Element, Text } from "xast"

import doi_data, { DoiData } from "./doi_data"
import full_title, { FullTitle } from "./full_title"

export interface JournalMetadata extends Element {
  name: "journal_metadata"
  attributes: {
    language: string
  }
  children: [FullTitle, DoiData]
}

const journal_metadata = () => {
  const js: JournalMetadata = {
    type: "element",
    name: "journal_metadata",
    attributes: {
      language: "en",
    },
    children: [
      full_title("ResearchEquals Collections"),
      doi_data({ doi: "10.53962/0000-00", url: "https://researchequals.com" }),
    ],
  }

  return js
}

export default journal_metadata
