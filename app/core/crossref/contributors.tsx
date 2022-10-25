import { Element, Text } from "xast"

export interface Author {
  firstName?: string | null
  lastName?: string | null
  orcid?: string | null
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

const authorMap = {
  firstName: "given_name",
  lastName: "surname",
  orcid: "ORCID",
}

const dbAuthorToCrossrefAuthor = (author: Author): Contributor["children"] => {
  /**
   * Object.entries returns [key:string, value:any][], always
   * so we need to typecast it
   */
  return (
    (Object.entries(author) as [keyof Author, string][])
      .map(([key, value]) => {
        const baseObject = { type: "element", name: authorMap[key] }
        if (!value) {
          return null
        }

        switch (key) {
          case "firstName":
            return { ...baseObject, children: [{ type: "text", value }] } as GivenName
          case "lastName":
            return { ...baseObject, children: [{ type: "text", value }] } as Surname

          case "orcid":
            return {
              ...baseObject,
              attributes: { authenticated: "true" },
              children: [{ type: "text", value: `https://orcid.org/${value}` }],
            } as Orcid
        }
      })
      /**
       * Filter out null values
       */
      .filter((x) => x) as Contributor["children"]
  )
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
        children: dbAuthorToCrossrefAuthor(author),
      }
      return authorJs
    }),
  }

  return js
}

export default contributors
