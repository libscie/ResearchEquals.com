const noisbn = () => {
  const js = {
    // https://data.crossref.org/reports/help/schema_doc/4.4.2/schema_4_4_2.html#noisbn
    type: "element",
    name: "noisbn",
    attributes: {
      reason: "simple_series",
    },
  }

  return js
}
export default noisbn
