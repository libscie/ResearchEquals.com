import { Element } from "xast"

export interface NoISBN extends Element {
  name: "noisbn"
  attributes: {
    reason: "simple_series"
  }
}

const noisbn = (): NoISBN => {
  const js: NoISBN = {
    // https://data.crossref.org/reports/help/schema_doc/4.4.2/schema_4_4_2.html#noisbn
    type: "element",
    name: "noisbn",
    attributes: {
      reason: "simple_series",
    },
    children: [],
  }

  return js
}
export default noisbn
