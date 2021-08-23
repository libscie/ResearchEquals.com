export function url(strings: TemplateStringsArray, ...values: any[]) {
  let result = process.env.APP_ORIGIN || "https://libscie.org"

  for (let i = 0; i < strings.length - 1; i++) {
    result += strings[i] + values[i]
  }

  result += strings[strings.length - 1]

  return result
}
