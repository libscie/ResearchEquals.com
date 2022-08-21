import { Element, Text } from "xast"
import titles from "./titles"
import publicationDate from "./publication_date"
import noisbn from "./noisbn"
import publisher from "./publisher"
import abstract from "./abstract"
import aiProgram from "./ai_program"
import doiData from "./doi_data"
import contributors, { Author } from "./contributors"
import citationList, { Citation, Cite } from "./citation_list"
import componentList from "./component_list"

export interface BookProps {
  title: string
  language: string
  authors: Author[]
  abstractText: string
  license_url: string
  doi: string
  resolve_url: string
  citations: Cite[]
}

export interface Book extends Element {
  name: "book"
  attributes: {
    book_type: "other"
  }
  children: [BookMetadata, ContentItem]
}

export interface BookMetadata extends Element {
  name: "book_metadata"
  attributes: {
    language: string
  }
}

export interface ContentItem extends Element {
  name: "content_item"
  attributes: {
    component_type: "other"
  }
}

const book = ({
  title,
  language,
  authors,
  abstractText,
  license_url,
  doi,
  resolve_url,
  citations,
}: BookProps) => {
  const js: Book = {
    type: "element",
    name: "book",
    attributes: {
      book_type: "other",
    },
    children: [
      {
        // https://data.crossref.org/reports/help/schema_doc/4.4.2/schema_4_4_2.html#book_metadata
        type: "element",
        name: "book_metadata",
        attributes: {
          language: "en",
        },
        children: [
          titles("ResearchEquals"),
          publicationDate(),
          noisbn(),
          publisher(),
          aiProgram({
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
          language,
        },
        children: [
          contributors(authors),
          titles(title),
          abstract(abstractText),
          publicationDate(),
          aiProgram({ url: license_url }),
          doiData({ doi, url: resolve_url }),
          citationList({ citations }),
          componentList(),
        ],
      } as ContentItem,
    ],
  }

  return js
}

export default book
