import { Element, Text } from "xast"
import contributors, { Contributors } from "./contributors"
import doi_data, { DoiData } from "./doi_data"
import journal_issue, { JournalIssue, JournalIssueProps } from "./journal_issue"
import journal_metadata, { JournalMetadata } from "./journal_metadata"
import publication_date, { PublicationDate } from "./publication_date"
import titles, { Titles } from "./titles"

export interface Journal extends Element {
  name: "journal"
  children: [JournalMetadata, JournalIssue]
}

const journal = ({ title, subtitle, authors, doi, resolve_url }: JournalIssueProps) => {
  const js: Journal = {
    type: "element",
    name: "journal",
    attributes: {},
    children: [journal_metadata(), journal_issue({ title, subtitle, authors, doi, resolve_url })],
  }

  return js
}

export default journal
