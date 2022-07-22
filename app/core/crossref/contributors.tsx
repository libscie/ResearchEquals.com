import { Element, Text } from "xast"

export interface Author {
  firstName: string
  lastName: string
  orcid?: string
}

export interface Contributors extends Element {
  name: "contributors"
  children: Contributor[]
}
export interface Contributor extends Element {
  name: "person_name"
  attributes: {
    contributor_role: "author"
    sequence: "first" | "additional"
  }
  children: (GivenName | Surname | Orcid)[]
}
export interface GivenName extends Element {
  name: "given_name"
  children: Text[]
}

export interface Surname extends Element {
  name: "surname"
  children: Text[]
}
export interface Orcid extends Element {
  name: "ORCID"
  attributes: {
    authenticated: "true" | "false"
  }
  children: Text[]
}

// TODO: Feature update needed for organizations / affiliations
const contributors = (authors: Author[]): Contributors => {
  const js: Contributors = {
    type: "element",
    name: "contributors",
    children: authors.map((author, index) => {
      const authorJs: Contributor = {
        type: "element",
        name: "person_name",
        attributes: {
          sequence: index === 0 ? "first" : "additional",
          contributor_role: "author",
        },
        children: [
          {
            type: "element",
            name: "given_name",
            children: [
              {
                type: "text",
                value: author.firstName,
              },
            ],
          },
          {
            type: "element",
            name: "surname",
            children: [
              {
                type: "text",
                value: author.lastName,
              },
            ],
          },
        ],
      }

      if (author.orcid) {
        authorJs.children.push({
          type: "element",
          name: "ORCID",
          attributes: {
            authenticated: "true",
          },
          children: [
            {
              type: "text",
              value: `https://orcid.org/${author.orcid}`,
            },
          ],
        } as Orcid)
      }

      return authorJs
    }),
  }

  return js
}

export default contributors
