import { BlitzApiRequest, BlitzApiResponse } from "blitz"
import puppeteer from "puppeteer"

const handler = async (req: BlitzApiRequest, res: BlitzApiResponse) => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.setViewport({
    width: 1200,
    height: 628,
    deviceScaleFactor: 1,
  })

  await page.goto(process.env.APP_ORIGIN!)
  const content = await page.$("#hero")
  await page.click("#rcc-confirm-button")

  const imageBuffer = await content!.screenshot({ omitBackground: true })

  await page.close()
  await browser.close()

  res.statusCode = 200

  res.setHeader("Content-Type", "image/png")
  res.end(imageBuffer)
}
export default handler
