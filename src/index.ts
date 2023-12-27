import { Hono } from 'hono'

const app = new Hono()

app.get('/repositories', async (c) => {
  const response = await fetch("https://github.com/trending")
  const html = await response.text() // HTML string
  return c.text(html)
})

export default app
