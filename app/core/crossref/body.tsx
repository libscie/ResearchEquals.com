import { Element } from "xast"
import { URI } from "./ai_program"
import book, { Book } from "./book"
import { Cite } from "./citation_list"
import { Author } from "./contributors"

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
    children: [
      book({ title, language, authors, abstractText, license_url, doi, resolve_url, citations }),
    ],
  }

  return js
}
export default body
