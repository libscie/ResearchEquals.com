let ENCODE_CHARS = [
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "j",
  "k",
  "m",
  "n",
  "p",
  "q",
  "r",
  "s",
  "t",
  "v",
  "w",
  "x",
  "y",
  "z",
]

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min
}

// https://libscie.org/minting-dois-for-research-modules/
const generateSuffix = async (length = 8) => {
  const binaryLength = (length - 1) * 5
  const floorInt = "1" + "0".repeat(binaryLength - 1)
  const ceilingInt = "1".repeat(binaryLength)

  let generatorValue = getRandomInt(parseInt(floorInt, 2), parseInt(ceilingInt, 2))
  let generatorOutput = ""

  generatorValue
    .toString(2)
    .match(/.{1,5}/g)
    .map((item, index) => {
      if (index > 0 && index % 4 == 0) {
        generatorOutput += "-"
      }
      generatorOutput += ENCODE_CHARS[parseInt(item, 2)]
    })
  if ((generatorOutput.length + 1) % 5 == 0) {
    generatorOutput += "-"
  }
  generatorOutput += ENCODE_CHARS[generatorValue % 31]

  return generatorOutput
}

export default generateSuffix
