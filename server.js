const Koa = require('koa')
const next = require('next')
const Router = require('koa-router')
const LRUCache = require('lru-cache')

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

// This is where we cache our rendered HTML pages
const ssrCache = new LRUCache({
  max: 100,
  maxAge: 1000 * 60 * 60 // 1hour
})

app.prepare()
  .then(() => {
    const server = new Koa()
    const router = new Router()

    router.get('/a', async ctx => {
      // return ctx.body = 'koa2 string'
      // ctx.respond = false
      // await app.render(ctx.req, ctx.res, '/b', ctx.query)
      return ctx.body = await renderAndCache(ctx.req, ctx.res, '/a', ctx.query)
      ctx.respond = false
    })


    router.get('/b', async ctx => {
      await app.render(ctx.req, ctx.res, '/a', ctx.query)
      ctx.respond = false
    })

    router.get('/', async ctx => {
      return ctx.body = await renderAndCache(ctx.req, ctx.res, '/', ctx.query)
      ctx.respond = false
    })

    router.get('*', async ctx => {
      await handle(ctx.req, ctx.res)

      ctx.respond = false
    })

    server.use(async (ctx, next) => {
      ctx.res.statusCode = 200
      await next()
    })

    server.use(router.routes())
    server.listen(port, () => {
      console.log(`> Ready on http://localhost:${port}`)
    })
  })


/*
 * NB: make sure to modify this to take into account anything that should trigger
 * an immediate page change (e.g a locale stored in req.session)
 */
function getCacheKey (req) {
  return `${req.url}`
}

async function renderAndCache (req, res, pagePath, queryParams) {
  const key = getCacheKey(req)

  // If we have a page in the cache, let's serve it
  if (ssrCache.has(key)) {
    res.setHeader('x-cache', 'HIT')
    // res.send(ssrCache.get(key))
    console.log(1111)
    return ssrCache.get(key);
  }

  try {
    // If not let's render the page into HTML
    const html = await app.renderToHTML(req, res, pagePath, queryParams)
    // Something is wrong with the request, let's skip the cache
    // if (res.statusCode !== 200) {
    //   return res.body = html;
    // }
    console.log(222)
    // Let's cache this page
    ssrCache.set(key, html)

    res.setHeader('x-cache', 'MISS')
    // res.send(html)
    return html;
  } catch (err) {
    console.log(err)
    return await app.renderError(err, req, res, pagePath, queryParams)
  }
}