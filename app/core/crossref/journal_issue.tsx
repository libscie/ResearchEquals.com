import { Element, Text } from "xast"
import { URI } from "./ai_program"
import contributors, { Author, Contributors } from "./contributors"
import doi_data, { DoiData } from "./doi_data"
import publication_date, { PublicationDate } from "./publication_date"
import titles, { Titles } from "./titles"

export interface JournalIssue extends Element {
  name: "journal_issue"
  children: [Contributors, Titles, PublicationDate, DoiData]
}

export interface JournalIssueProps {
  title: string
  subtitle?: string
  authors: Author[]
  doi: string
  resolve_url: URI
}

const journal_issue = ({ title, subtitle, authors, doi, resolve_url }: JournalIssueProps) => {
  const js: JournalIssue = {
    type: "element",
    name: "journal_issue",
    children: [
      contributors(authors),
      titles(title, subtitle),
      publication_date(),
      doi_data({ doi, url: resolve_url }),
    ],
  }

  return js
}

export default journal_issue
