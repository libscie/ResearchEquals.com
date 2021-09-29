// Replace id with Date.now as well?
const generateHead = ({ registrant, email }) => {
  const datetime = Date.now()

  const jsHead = {
    type: "element",
    name: "head",
    elements: [
      {
        type: "element",
        name: "doi_batch_id",
        elements: [{ type: "text", text: datetime.toString() }],
      },
      {
        type: "element",
        name: "timestamp",
        elements: [{ type: "text", text: datetime }],
      },
      {
        type: "element",
        name: "depositor",
        elements: [
          {
            type: "element",
            name: "depositor_name",
            elements: [{ type: "text", text: registrant }],
          },
          {
            type: "element",
            name: "email_address",
            elements: [{ type: "text", text: email }],
          },
        ],
      },
      {
        type: "element",
        name: "registrant",
        elements: [{ type: "text", text: registrant }],
      },
    ],
  }

  return jsHead
}

const generateBody = () => {}

const generateCrossRef = ({ schema, registrant, email }) => {
  const jsCrossRef = {
    declaration: {
      attributes: {
        version: "1.0",
        encoding: "UTF-8",
      },
    },
    elements: [
      {
        type: "element",
        name: "doi_batch",
        attributes: {
          version: schema,
          xmlns: `http://www.crossref.org/schema/${schema}`,
          "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
          "xsi:schemaLocation": `http://www.crossref.org/schema/${schema} http://www.crossref.org/schemas/crossref${schema}.xsd`,
        },
        elements: [
          generateHead({
            registrant,
            email,
          }),
        ],
      },
    ],
  }

  return jsCrossRef
}

export default generateCrossRef
