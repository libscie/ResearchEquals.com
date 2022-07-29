import book from "./book"

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
}) => {
  const js = {
    type: "element",
    name: "body",
    elements: [
      book({ title, language, authors, abstractText, license_url, doi, resolve_url, citations }),
    ],
  }

  return js
}
export default body
