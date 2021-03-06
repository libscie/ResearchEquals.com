// Replace id with Date.now as well?
const head = ({ registrant, email }) => {
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
        // has to be integer?
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

export default head
