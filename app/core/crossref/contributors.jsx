// TODO: Feature update needed for organizations / affiliations
const contributors = (authors) => {
  const js = {
    type: "element",
    name: "contributors",
    elements: authors.map((author, index) => {
      const authorJs = {
        type: "element",
        name: "person_name",
        attributes: {
          sequence: index === 0 ? "first" : "additional",
          contributor_role: "author",
        },
        elements: [
          {
            type: "element",
            name: "given_name",
            elements: [
              {
                type: "text",
                text: author.firstName,
              },
            ],
          },
          {
            type: "element",
            name: "surname",
            elements: [
              {
                type: "text",
                text: author.lastName,
              },
            ],
          },
        ],
      }

      if (author.orcid) {
        authorJs.elements.push({
          type: "element",
          name: "ORCID",
          attributes: {
            authenticated: true,
          },
          elements: [
            {
              type: "text",
              text: `https://orcid.org/${author.orcid}`,
            },
          ],
        })
      }

      return authorJs
    }),
  }

  return js
}

export default contributors
