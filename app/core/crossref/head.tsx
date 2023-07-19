import { Element, Text } from "xast"

export interface Head extends Element {
  name: "head"
  children: (DOIBatchID | Timestamp | Depositor | Registrant)[]
}

export interface DOIBatchID extends Element {
  name: "doi_batch_id"
  children: [Text]
}

export interface Timestamp extends Element {
  name: "timestamp"
  children: [Text]
}
export interface Depositor extends Element {
  name: "depositor"
  children: (DepositorName | EmailAddress)[]
}

export interface DepositorName extends Element {
  name: "depositor_name"
  children: [Text]
}
export interface EmailAddress extends Element {
  name: "email_address"
  children: [Text]
}

export interface Registrant extends Element {
  name: "registrant"
  children: [Text]
}

// Replace id with Date.now as well?
const head = ({ registrant, email }: { registrant: string; email: string }): Head => {
  const datetime = Date.now()

  const jsHead: Head = {
    type: "element",
    name: "head",
    attributes: {},
    children: [
      {
        type: "element",
        name: "doi_batch_id",
        attributes: {},
        children: [{ type: "text", value: datetime.toString() }],
      },
      {
        type: "element",
        name: "timestamp",
        attributes: {},
        // has to be integer?
        children: [{ type: "text", value: datetime.toString() }],
      },
      {
        type: "element",
        name: "depositor",
        attributes: {},
        children: [
          {
            type: "element",
            name: "depositor_name",
            attributes: {},
            children: [{ type: "text", value: registrant }],
          },
          {
            type: "element",
            name: "email_address",
            attributes: {},
            children: [{ type: "text", value: email }],
          },
        ],
      },
      {
        type: "element",
        name: "registrant",
        attributes: {},
        children: [{ type: "text", value: registrant }],
      },
    ],
  }

  return jsHead
}

export default head
