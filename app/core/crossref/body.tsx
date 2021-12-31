import book from "./book"

const body = ({
  type,
  title,
  authors,
  abstractText,
  license,
  license_url,
  doi,
  resolve_url,
  citations,
}) => {
  const js = {
    type: "element",
    name: "body",
    elements: [
      book({ title, authors, abstractText, license, license_url, doi, resolve_url, citations }),
    ],
  }

  return js
}
export default body
