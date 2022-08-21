import { join } from "path"
import LibXML from "node-libxml"
import generateCrossRefXml from "./generateCrossRefXml"

const main = () => {
  const xml = generateCrossRefXml({
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

  const libxml = new LibXML()

  const xmlIsWellFormed = libxml.loadXmlFromString(xml)
  console.log({ xmlIsWellFormed })
  // this is always relative to the main directory
  const xsdFolder = join(__dirname, "schemas")
  const xsdPath = join(xsdFolder, "crossref5.3.1.xsd")

  const loadSchemas = libxml.loadSchemas([xsdPath])

  let valid
  try {
    valid = libxml.validateAgainstSchemas()
    console.log(libxml.schemasLoadedErrors)
    // valid = await validateXML(xml, join(__dirname, "schemas", "crossref5.3.1.xsd"))
  } catch (e) {
    valid = e
    throw new Error("Generated XML is invalid!", e)
  }
  console.log(xml)
  console.log({ valid })
  return valid
}

main()
