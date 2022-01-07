// TODO: Verify output generated

const citation_list = ({ citations }) => {
  const js = {
    type: "element",
    name: "citation_list",
    elements: citations.map((citation, index) => {
      const datetime = new Date(citation.publishedAt)
      const citationJs = {
        type: "element",
        name: "citation",
        attributes: {
          // index starts at 0
          key: index + 1,
        },
        elements: [
          {
            type: "element",
            name: "journal_title",
            elements: [
              {
                type: "text",
                text: citation.publishedWhere,
              },
            ],
          },
          {
            type: "element",
            name: "author",
            elements: [
              {
                type: "text",
                text: citation.authors[0].name,
              },
            ],
          },
          {
            type: "element",
            name: "cYear",
            elements: [
              {
                type: "text",
                text: datetime.getUTCFullYear(),
              },
            ],
          },
          {
            type: "element",
            name: "doi",
            elements: [
              {
                type: "text",
                text: `${citation.prefix}/${citation.suffix}`,
              },
            ],
          },
          // {
          //   type: "element",
          //   name: "isbn",
          //   elements: [
          //     {
          //       type: "text",
          //       text: citation.isbn,
          //     },
          //   ],
          // },
          {
            type: "element",
            name: "article_title",
            elements: [
              {
                type: "text",
                text: citation.title,
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
