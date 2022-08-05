import { Element, Text } from "xast"
export interface CitationList extends Element {
  name: "citation_list"
  children: Citation[]
}

export interface Citation extends Element {
  name: "citation"
  attributes: {
    key: string
  }
  children: (
    | CitationLabel
    | CitationText
    | CitationDate
    | CitationURL
    | CitationDOI
    | CitationVolume
    | CitationIssue
    | CitationFirstPage
    | CitationLastPage
    | CitationISSN
    | CitationISBN
    | CitationPublisher
    | CitationJournal
    | CitationAuthor
    | CitationYear
    | CitationTitle
  )[]
}

export interface CitationLabel extends Element {
  name: "label"
  children: [Text]
}
export interface CitationAuthor extends Element {
  name: "author"
  children: [Text]
}

export interface CitationText extends Element {
  name: "text"
  children: [Text]
}

export interface CitationDate extends Element {
  name: "cDate"
  children: [Text]
}
export interface CitationYear extends Element {
  name: "cYear"
  children: [Text]
}
export interface CitationURL extends Element {
  name: "url"
  children: [Text]
}
export interface CitationDOI extends Element {
  name: "doi"
  children: [Text]
}
export interface CitationVolume extends Element {
  name: "volume"
  children: [Text]
}
export interface CitationIssue extends Element {
  name: "issue"
  children: [Text]
}
export interface CitationFirstPage extends Element {
  name: "first_page"
  children: [Text]
}
export interface CitationLastPage extends Element {
  name: "last_page"
  children: [Text]
}
export interface CitationISSN extends Element {
  name: "issn"
  children: [Text]
}
export interface CitationISBN extends Element {
  name: "isbn"
  children: [Text]
}
export interface CitationPublisher extends Element {
  name: "publisher"
  children: [Text]
}
export interface CitationJournal extends Element {
  name: "journal_title"
  children: [Text]
}
export interface CitationTitle extends Element {
  name: "article_title"
  children: [Text]
}

// TODO: Verify output generated

export interface Cite {
  publishedWhere: string
  authors: [{ name: string }] | { name: string }[]
  title: string
  prefix: string
  suffix: string
  publishedAt: string | Date
}
const citation_list = ({ citations }: { citations: Cite[] }): CitationList => {
  const js: CitationList = {
    type: "element",
    name: "citation_list",
    children: citations.map((citation, index) => {
      const { publishedWhere, authors, title, prefix, suffix, publishedAt } = citation

      const datetime = typeof publishedAt === "string" ? new Date(publishedAt) : publishedAt
      const citationJs: Citation = {
        type: "element",
        name: "citation",
        attributes: {
          // index starts at 0
          key: `${index + 1}`,
        },
        children: [
          {
            type: "element",
            name: "journal_title",
            children: [
              {
                type: "text",
                value: publishedWhere,
              },
            ],
          },
          {
            type: "element",
            name: "author",
            children: [
              {
                type: "text",
                value: authors[0].name,
              },
            ],
          },
          {
            type: "element",
            name: "cYear",
            children: [
              {
                type: "text",
                value: datetime.getUTCFullYear().toString(),
              },
            ],
          },
          {
            type: "element",
            name: "doi",
            children: [
              {
                type: "text",
                value: `${prefix}/${suffix}`,
              },
            ],
          },
          // {
          //   type: "element",
          //   name: "isbn",
          //   children: [
          //     {
          //       type: "text",
          //       value: isbn,
          //     },
          //   ],
          // },
          {
            type: "element",
            name: "article_title",
            children: [
              {
                type: "text",
                value: title,
              },
            ],
          },
        ],
      }
      return citationJs
    }),
  }

  return js
}

export default citation_list
