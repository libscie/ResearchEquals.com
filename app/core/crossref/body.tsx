import { Element } from "xast"
import book, { Book } from "./book"

export interface BodyProps {
  type: any
  title: string
  authors: Author[]
  abstractText: string
  license_url: string
  doi: string
  resolve_url: string
  citations: Citation[]
}
export interface Body extends Element {
  name: "body"
  children: [Book]
}

const body = ({
  type,
  title,
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
    children: [book({ title, authors, abstractText, license_url, doi, resolve_url, citations })],
  }

  return js
}
export default body
