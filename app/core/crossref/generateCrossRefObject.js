import head from "./head"
import body from "./body"

const generateCrossRef = ({
  schema,
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
            license,
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
