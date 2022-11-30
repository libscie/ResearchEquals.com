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
  children: (DOI | ISBN | JournalTitle | CitationAuthor | CYear | ArticleTitle)[]
}

export interface CitationAuthor extends Element {
  name: "author"
  children: [Text]
}

export interface CYear extends Element {
  name: "cYear"
  children: [Text]
}
export interface DOI extends Element {
  name: "doi"
  children: [Text]
}
export interface ISBN extends Element {
  name: "isbn"
  children: [Text]
}
export interface JournalTitle extends Element {
  name: "journal_title"
  children: [Text]
}
export interface ArticleTitle extends Element {
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
          } as JournalTitle,
          {
            type: "element",
            name: "author",
            children: [
              {
                type: "text",
                value: authors.length > 0 ? authors[0].name : "N/A",
              },
            ],
          } as CitationAuthor,
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
          } as DOI,
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
          } as ArticleTitle,
        ],
      }
      return citationJs
    }),
  }

  return js
}

export default citation_list
