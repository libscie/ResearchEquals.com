import { Element } from "xast"
import { URI } from "./ai_program"
import book, { Book } from "./book"
import { Cite } from "./citation_list"
import { Author } from "./contributors"
import journal, { Journal } from "./journal"
import { JournalIssueProps } from "./journal_issue"

export interface BodyProps {
  type: any
  title: string
  language: string
  authors: Author[]
  abstractText: string
  license_url: URI
  doi: string
  resolve_url: URI
  citations: Cite[]
}
export interface Body extends Element {
  name: "body"
  children: [Book]
}

const body = ({
  type,
  title,
  language,
  authors,
  abstractText,
  license_url,
  doi,
  resolve_url,
  citations,
}: BodyProps): Body => {
  const js: Body = {
    type: "element",
    name: "body",
    attributes: {},
    children: [
      book({ title, language, authors, abstractText, license_url, doi, resolve_url, citations }),
    ],
  }

  return js
}

export interface BodyProps {
  type: any
  title: string
  language: string
  authors: Author[]
  abstractText: string
  license_url: URI
  doi: string
  resolve_url: URI
  citations: Cite[]
}

export interface BodyJournal extends Element {
  name: "body"
  children: [Journal]
}

const bodyJournal = ({
  title,
  subtitle,
  authors,
  doi,
  resolve_url,
}: JournalIssueProps): BodyJournal => {
  const js: BodyJournal = {
    type: "element",
    name: "body",
    attributes: {},
    children: [journal({ title, subtitle, authors, doi, resolve_url })],
  }

  return js
}

export default body
export { bodyJournal }
