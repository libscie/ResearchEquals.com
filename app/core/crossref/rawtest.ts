import { readFileSync, writeFileSync } from "fs"
import { join } from "path"
import { toXml } from "xast-util-to-xml"
import generateCrossRefObject from "./generateCrossRefObject"
import validator from "xsd-schema-validator"
import { promisify } from "util"

const validateXML = promisify(validator.validateXML)
// const testXML = readFileSync(join("app", "core", "crossref", "test.xml"), "utf8")
const x = generateCrossRefObject({
  schema: "5.3.1",
  type: "book",
  language: "en",
  title: "ResearchEquals",
  authors: [{ firstName: "John", lastName: "Doe", orcid: "0000-0003-1050-6809" }],
  abstractText: "This is falksdjfdlsa;k jfdsl k;afjsdl; ja",
  license_url: "https://creativecommons.org/publicdomain/zero/1.0/legalcode",
  doi: "10.53962/0001",
  resolve_url: "https://researchequals.com",
  citations: [],
})

const xml = toXml(x)

const main = async (xml: string) => {
  let valid
  try {
    valid = await validateXML(xml, join(__dirname, "schemas", "crossref5.3.1.xsd"))
  } catch (e) {
    valid = e
  }
  writeFileSync(__dirname + "/rawText.xml", xml)
  console.log(xml)
  return valid
}

main(xml).then(console.log)
