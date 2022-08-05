import generateCrossRefObject from "./generateCrossRefObject"
import { readFileSync } from "fs"
import { join } from "path"
import { toXml } from "xast-util-to-xml"

describe("generateCrossRefObject", () => {
  it("should create a proper xast node", () => {
    const x = generateCrossRefObject({
      schema: "5.3.1",
      type: "article",
      title: "Test",
      language: "en",
      authors: [
        {
          firstName: "John",
          lastName: "Doe",
          orcid: "0000-0000-0000-0000",
        },
      ],
      abstractText: "Test",
      license_url: "https://www.test.com",
      doi: "10.12345/12345",
      resolve_url: "https://www.test.com",
      citations: [],
    })

    expect(x).toMatchSnapshot()
  })

  it("should match test.xml", () => {
    const testXML = readFileSync(join("app", "core", "crossref", "test.xml"), "utf8")
    const x = generateCrossRefObject({
      schema: "5.3.1",
      type: "book",
      language: "en",
      title: "ResearchEquals",
      authors: [],
      abstractText: "This is falksdjfdlsa;k jfdsl k;afjsdl; ja",
      license_url: "https://creativecommons.org/publicdomain/zero/1.0/legalcode",
      doi: "10.53962/0000",
      resolve_url: "https://researchequals.com",
      citations: [],
    })

    const xml = toXml(x)
    expect(xml.split("><").join(">\n<")).toEqual(testXML.split("><").join(">\n<"))
  })
})
