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

const generateSuffix = () => {
  let generatorValue = getRandomInt(17179869184, 34359738367)
  let generatorOutput = ""

  generatorValue
    .toString(2)
    .match(/.{1,5}/g)
    .map((item) => {
      if (generatorOutput.length > 0 && generatorOutput.length % 4 == 0) {
        generatorOutput += "-"
      }
      generatorOutput += ENCODE_CHARS[parseInt(item, 2)]
    })
  generatorOutput += ENCODE_CHARS[generatorValue % 32]

  return generatorOutput
}

export default generateSuffix
