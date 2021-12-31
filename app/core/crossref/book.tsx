import titles from "./titles"
import publicationDate from "./publication_date"
import noisbn from "./noisbn"
import publisher from "./publisher"
import abstract from "./abstract"
import aiProgram from "./ai_program"
import doiData from "./doi_data"
import contributors from "./contributors"
import citationList from "./citation_list"
import componentList from "./component_list"

const book = ({
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
    name: "book",
    attributes: {
      book_type: "other",
    },
    elements: [
      {
        // https://data.crossref.org/reports/help/schema_doc/4.4.2/schema_4_4_2.html#book_metadata
        type: "element",
        name: "book_metadata",
        attributes: {
          language: "en",
        },
        elements: [
          titles("ResearchEquals"),
          publicationDate(),
          noisbn(),
          publisher(),
          aiProgram({
            license: "CC0 Public Domain Dedication",
            url: "https://creativecommons.org/publicdomain/zero/1.0/legalcode",
          }),
          doiData({ doi: "10.53962/0000", url: "https://researchequals.com" }),
        ],
      },
      {
        // https://data.crossref.org/reports/help/schema_doc/4.4.2/schema_4_4_2.html#content_item
        type: "element",
        name: "content_item",
        attributes: {
          component_type: "other",
        },
        elements: [
          contributors(authors),
          titles(title),
          abstract(abstractText),
          publicationDate(),
          aiProgram({ license, url: license_url }),
          doiData({ doi, url: resolve_url }),
          citationList({ citations, authors }),
          componentList(),
        ],
      },
    ],
  }

  return js
}

export default book
