const jsonServer = require('json-server')
const fs = require('fs')
const path = require('path')
const { parse } = require('filter-string')
const { mockDir } = require('../utils/paths')
const signale = require('signale')

const createServer = () => {
  // server
  const server = jsonServer.create()

  // db path
  const dbPath = path.resolve(mockDir, 'db.json')

  if (!fs.existsSync(dbPath)) {
    signale.error('No db.json found in project, please see docs\n')
    process.exit(1)
  }

  const router = jsonServer.router(dbPath)
  const middlewares = jsonServer.defaults()

  // transform req query, such as $offset -> _page, $limit -> _limit
  const reqTransformMiddleware = (req, res, next) => {
    // $limit
    if (req.query.$limit) {
      req.query._limit = req.query.$limit
    }
    // $offset
    if (req.query.$offset) {
      const limit = req.query._limit || 10
      // req.query['_page'] = Math.floor(req.query['$offset'] / limit) + 1
      req.query._start = req.query.$offset
      req.query._limit = limit
    }

    // ops
    const filters = parse(req.query.$filter)
    filters.forEach(({ key, op, value }) => {
      if (op === 'like') {
        req.query[`${key}_like`] = value
      }

      if (op === 'gt' || op === 'ge' || op === 'le' || op === 'lt') {
        req.query[`${key}_${op[0] + 'te'}`] = value
      }

      if (op === 'ne') {
        req.query[`${key}_ne`] = value
      }

      if (op === 'eq') {
        req.query[key] = value
      }
    })

    // sort, only support one field
    if (req.query.$orderby) {
      const orderby = req.query.$orderby
      const key = orderby.split(' ')[0]
      const order = orderby.split(' ') || 'asc'
      req.query._sort = key
      req.query._order = order
    }

    next()
  }

  // apply transform
  server.use(reqTransformMiddleware)

  // apply defaults
  server.use(middlewares)

  // apply router
  server.use(router)

  return server
}

module.exports = createServer
