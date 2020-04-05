'use strict'

const { test } = require('tap')
const handleRequest = require('../../lib/handleRequest')
const internals = require('../../lib/handleRequest')[Symbol.for('internals')]
const Request = require('../../lib/request')
const Reply = require('../../lib/reply')
const buildSchema = require('../../lib/validation').compileSchemasForValidation
const sget = require('simple-get').concat

const Ajv = require('ajv')
const ajv = new Ajv({ coerceTypes: true })

function schemaValidator (schema, method, url, httpPart) {
  const validateFuncion = ajv.compile(schema)
  const fn = function (body) {
    const isOk = validateFuncion(body)
    if (isOk) return
    return false
  }
  fn.errors = []
  return fn
}

test('Request object', t => {
  t.plan(14)
  const req = {
    method: 'GET',
    url: '/',
    connection: { foo: 'bar' }
  }
  const request = new Request('id', 'params', req, 'query', 'headers', 'log', 'ip', 'ips', 'hostname')
  t.type(request, Request)
  t.strictEqual(request.id, 'id')
  t.strictEqual(request.params, 'params')
  t.deepEqual(request.raw, req)
  t.strictEqual(request.query, 'query')
  t.strictEqual(request.headers, 'headers')
  t.strictEqual(request.log, 'log')
  t.strictEqual(request.ip, 'ip')
  t.strictEqual(request.ips, 'ips')
  t.strictEqual(request.hostname, 'hostname')
  t.strictEqual(request.body, null)
  t.strictEqual(request.method, 'GET')
  t.strictEqual(request.url, '/')
  t.deepEqual(request.connection, req.connection)
})

test('handleRequest function - sent reply', t => {
  t.plan(1)
  const request = {}
  const reply = { sent: true }
  const res = handleRequest(null, request, reply)
  t.equal(res, undefined)
})

test('handleRequest function - invoke with error', t => {
  t.plan(1)
  const request = {}
  const reply = {}
  reply.send = (err) => t.is(err.message, 'Kaboom')
  handleRequest(new Error('Kaboom'), request, reply)
})

test('handler function - invalid schema', t => {
  t.plan(2)
  const res = {}
  res.end = () => {
    t.equal(res.statusCode, 400)
    t.pass()
  }
  res.writeHead = () => {}
  res.log = { error: () => {}, info: () => {} }
  const context = {
    config: {
      method: 'GET',
      url: '/an-url'
    },
    schema: {
      body: {
        type: 'object',
        properties: {
          hello: { type: 'number' }
        }
      }
    },
    handler: () => {},
    Reply: Reply,
    Request: Request,
    preValidation: [],
    preHandler: [],
    onSend: [],
    onError: [],
    attachValidation: false
  }
  buildSchema(context, schemaValidator)
  const request = {
    body: { hello: 'world' }
  }
  internals.handler(request, new Reply(res, context, request))
})

test('handler function - reply', t => {
  t.plan(3)
  const res = {}
  res.end = () => {
    t.equal(res.statusCode, 204)
    t.pass()
  }
  res.writeHead = () => {}
  const context = {
    handler: (req, reply) => {
      t.is(typeof reply, 'object')
      reply.code(204)
      reply.send(undefined)
    },
    Reply: Reply,
    Request: Request,
    preValidation: [],
    preHandler: [],
    onSend: [],
    onError: []
  }
  buildSchema(context, schemaValidator)
  internals.handler({}, new Reply(res, context, {}))
})

test('handler function - preValidationCallback with finished response', t => {
  t.plan(0)
  const res = {}
  res.finished = true
  res.end = () => {
    t.fail()
  }
  res.writeHead = () => {}
  const context = {
    handler: (req, reply) => {
      t.fail()
      reply.send(undefined)
    },
    Reply: Reply,
    Request: Request,
    preValidation: null,
    preHandler: [],
    onSend: [],
    onError: []
  }
  buildSchema(context, schemaValidator)
  internals.handler({}, new Reply(res, context, {}))
})

test('request should be defined in onSend Hook on post request with content type application/json', t => {
  t.plan(8)
  const fastify = require('../..')()

  fastify.addHook('onSend', (request, reply, payload, done) => {
    t.ok(request)
    t.ok(request.raw)
    t.ok(request.id)
    t.ok(request.params)
    t.ok(request.query)
    done()
  })
  fastify.post('/', (request, reply) => {
    reply.send(200)
  })
  fastify.listen(0, err => {
    fastify.server.unref()
    t.error(err)
    sget({
      method: 'POST',
      url: 'http://localhost:' + fastify.server.address().port,
      headers: {
        'content-type': 'application/json'
      }
    }, (err, response, body) => {
      t.error(err)
      // a 400 error is expected because of no body
      t.strictEqual(response.statusCode, 400)
    })
  })
})

test('request should be defined in onSend Hook on post request with content type application/x-www-form-urlencoded', t => {
  t.plan(7)
  const fastify = require('../..')()

  fastify.addHook('onSend', (request, reply, payload, done) => {
    t.ok(request)
    t.ok(request.raw)
    t.ok(request.params)
    t.ok(request.query)
    done()
  })
  fastify.post('/', (request, reply) => {
    reply.send(200)
  })
  fastify.listen(0, err => {
    fastify.server.unref()
    t.error(err)
    sget({
      method: 'POST',
      url: 'http://localhost:' + fastify.server.address().port,
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      }
    }, (err, response, body) => {
      t.error(err)
      // a 415 error is expected because of missing content type parser
      t.strictEqual(response.statusCode, 415)
    })
  })
})

test('request should be defined in onSend Hook on options request with content type application/x-www-form-urlencoded', t => {
  t.plan(7)
  const fastify = require('../..')()

  fastify.addHook('onSend', (request, reply, payload, done) => {
    t.ok(request)
    t.ok(request.raw)
    t.ok(request.params)
    t.ok(request.query)
    done()
  })
  fastify.options('/', (request, reply) => {
    reply.send(200)
  })
  fastify.listen(0, err => {
    fastify.server.unref()
    t.error(err)
    sget({
      method: 'OPTIONS',
      url: 'http://localhost:' + fastify.server.address().port,
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      }
    }, (err, response, body) => {
      t.error(err)
      // Body parsing skipped, so no body sent
      t.strictEqual(response.statusCode, 200)
    })
  })
})

test('request should respond with an error if an unserialized payload is sent inside an an async handler', t => {
  t.plan(3)

  const fastify = require('../..')()

  fastify.get('/', (request, reply) => {
    reply.type('text/html')
    return Promise.resolve(request.headers)
  })

  fastify.inject({
    method: 'GET',
    url: '/'
  }, (err, res) => {
    t.error(err)
    t.strictEqual(res.statusCode, 500)
    t.strictDeepEqual(JSON.parse(res.payload), {
      error: 'Internal Server Error',
      code: 'FST_ERR_REP_INVALID_PAYLOAD_TYPE',
      message: 'Attempted to send payload of invalid type \'object\'. Expected a string or Buffer.',
      statusCode: 500
    })
  })
})
