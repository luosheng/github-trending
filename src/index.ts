import { Hono } from 'hono'
import * as cheerio from 'cheerio'

const app = new Hono()

type Repository = {
  owner: string
  name: string
  description?: string
  language?: string
  stargazersCount: number
  forksCount: number
}

app.get('/repositories', async (c) => {
  const response = await fetch("https://github.com/trending")
  const html = await response.text()
  const $ = cheerio.load(html)
  const repos: Repository[] = []
  $('article.Box-row').each((i, el) => {
    const $el = $(el)
    const [owner, name] = $el.find('h2 a').text().split('/').map((s) => s.trim())
    const description = $el.find('p').text()
    const language = $el.find('[itemprop=programmingLanguage]').text().trim()
    const stargazersCount = parseInt($el.find('[href$=stargazers]').text().trim().replace(',', ''))
    const forksCount = parseInt($el.find('[href$=forks]').text().trim().replace(',', ''))
    repos.push({
      owner,
      name,
      description: description === '' ? undefined : description,
      language: language === '' ? undefined : language,
      stargazersCount,
      forksCount
    })
  })
  return c.json(repos)
})

export default app
