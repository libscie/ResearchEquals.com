import { Element, Text } from "xast"

export interface RORAffiliation extends Record<string, unknown> {
  rorId: string
  name?: string | null
}

export interface Author {
  firstName?: string | null
  lastName?: string | null
  affiliations?: (Record<string, unknown> & Record<"organization", RORAffiliation>)[] | null
  orcid?: string | null
}

export interface Contributors extends Element {
  name: "contributors"
  children: PersonName[]
}

export interface PersonName extends Element {
  name: "person_name"
  attributes: {
    contributor_role: "author"
    sequence: "first" | "additional"
  }
  children: (GivenName | Surname | Orcid | Affiliations)[]
}

export interface Affiliations extends Element {
  type: "element"
  name: "affiliations"
  children: Institution[]
}

/** Container element for information about an institution or organization associated with an item.**/
export interface Institution extends Element {
  type: "element"
  name: "institution"
  children: [InstitutionName, InstitutionId] | [InstitutionId]
}

/** Identifier for an institution or organization (currently supported: ROR, ISNI, Wikidata). Identifiers must be included as a URI**/
export interface InstitutionId extends PID {
  type: "element"
  name: "institution_id"
  attributes: {
    type: InstitutionIdType
  }
}

export interface PID extends Element {
  name: string
  children: [
    {
      type: "text"
      /**
       * @pattern [hH][tT][tT][pP][sS]:\/\/.{1,50}
       **/
      value: string
    }
  ]
}

/** The full name of an institution.
 * @minLength 1
 * @maxLength 1024
 **/
export interface InstitutionName extends Element {
  name: "institution_name"
  children: [
    {
      type: "text"
      /**
       * @minLength 1
       * @maxLength 1024
       **/
      value: string
    }
  ]
}

export type InstitutionIdType = "ror" | "isni" | "wikidata"

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

/**
 * This maps the keys of the input object from R= to the names of the CrossRef XML elements
 * e.g. the R= object has a key "firstName" and the corresponding CrossRef XML element is "given_name"
 *
 * The `as const` is needed to make the type of the object literal be the type of the object.
 * Otherwise `typeof authorMap` would be `{firstName: string, lastName: string, orcid: string, affiliations: string}`
 */
const authorMap = {
  firstName: "given_name",
  lastName: "surname",
  affiliations: "affiliations",
  orcid: "ORCID",
} as const

const dbAuthorToCrossrefAuthor = (author: Author): PersonName["children"] => {
  /**
   * Object.entries returns [key:string, value:any][], always
   * so we need to typecast it
   */
  return (
    (Object.entries(author) as [keyof Author, Author[keyof Author]][])
      .map(([key, value]) => {
        if (!value) {
          return null
        }

        // we check this here instead of in the `switch` block so that we don't have to typecast `value` to `string` in the `switch` block
        if (Array.isArray(value)) {
          if (value.length === 0 || key !== "affiliations") {
            return null
          }
          return {
            type: "element",
            name: authorMap[key],
            children: value.map((affiliation) => {
              const institutionId = {
                type: "element",
                name: "institution_id",
                attributes: { type: "ror" },
                children: [
                  {
                    type: "text",
                    value: affiliation.organization.rorId,
                  },
                ],
              } as InstitutionId

              const institutionName: InstitutionName = {
                type: "element",
                name: "institution_name",
                children: [
                  {
                    type: "text",
                    value: affiliation.organization.name || "",
                  },
                ],
              }

              const institutionChildren: [InstitutionName, InstitutionId] | [InstitutionId] =
                affiliation.organization.name ? [institutionName, institutionId] : [institutionId]

              return {
                type: "element",
                name: "institution",
                children: institutionChildren,
              } satisfies Institution
            }),
          } satisfies Affiliations
        }

        switch (key) {
          case "firstName":
            return {
              type: "element",
              name: authorMap[key],
              children: [{ type: "text", value }],
            } satisfies GivenName
          case "lastName":
            return {
              type: "element",
              name: authorMap[key],
              children: [{ type: "text", value }],
            } satisfies Surname

          case "orcid":
            return {
              type: "element",
              name: authorMap[key],
              attributes: { authenticated: "true" },
              children: [{ type: "text", value: `https://orcid.org/${value}` }],
            } satisfies Orcid
        }
      })
      /**
       * Filter out null values
       */
      .filter(Boolean)
      // we need to sort the elements, as CrossRef expects e.g. affiliations to always come before ORCID
      .sort((a, b) => {
        // this should never happen as we just filtered the array, but we need to check for it to make TypeScript happy
        if (!a || !b) return 0
        const order = Object.values(authorMap)
        return order.indexOf(a.name) - order.indexOf(b.name)
      }) as PersonName["children"]
  )
}

// TODO: Feature update needed for organizations / affiliations
const contributors = (authors: Author[]): Contributors => {
  const js: Contributors = {
    type: "element",
    name: "contributors",
    children: authors.map((author, index) => {
      const authorJs: PersonName = {
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
