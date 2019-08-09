'use strict'

const t = require('tap')
const test = t.test

const { Hooks } = require('../../lib/hooks')
const noop = () => {}

test('hooks should have 4 array with the registered hooks', t => {
  const hooks = new Hooks()
  t.is(typeof hooks, 'object')
  t.ok(Array.isArray(hooks.onRequest))
  t.ok(Array.isArray(hooks.onSend))
  t.ok(Array.isArray(hooks.preParsing))
  t.ok(Array.isArray(hooks.preValidation))
  t.ok(Array.isArray(hooks.preHandler))
  t.ok(Array.isArray(hooks.onResponse))
  t.ok(Array.isArray(hooks.onError))
  t.end()
})

test('hooks.add should add a hook to the given hook', t => {
  const hooks = new Hooks()
  hooks.add('onRequest', noop)
  t.is(hooks.onRequest.length, 1)
  t.is(typeof hooks.onRequest[0], 'function')

  hooks.add('preParsing', noop)
  t.is(hooks.preParsing.length, 1)
  t.is(typeof hooks.preParsing[0], 'function')

  hooks.add('preValidation', noop)
  t.is(hooks.preValidation.length, 1)
  t.is(typeof hooks.preValidation[0], 'function')

  hooks.add('preHandler', noop)
  t.is(hooks.preHandler.length, 1)
  t.is(typeof hooks.preHandler[0], 'function')

  hooks.add('onResponse', noop)
  t.is(hooks.onResponse.length, 1)
  t.is(typeof hooks.onResponse[0], 'function')

  hooks.add('onSend', noop)
  t.is(hooks.onSend.length, 1)
  t.is(typeof hooks.onSend[0], 'function')

  hooks.add('onError', noop)
  t.is(hooks.onError.length, 1)
  t.is(typeof hooks.onError[0], 'function')
  t.end()
})

test('hooks should throw on unexisting handler', t => {
  t.plan(1)
  const hooks = new Hooks()
  try {
    hooks.add('onUnexistingHook', noop)
    t.fail()
  } catch (e) {
    t.pass()
  }
})

test('should throw on wrong parameters', t => {
  const hooks = new Hooks()
  t.plan(4)
  try {
    hooks.add(null, noop)
    t.fail()
  } catch (e) {
    t.is(e.code, 'FST_ERR_HOOK_INVALID_TYPE')
    t.is(e.message, 'The hook name must be a string')
  }

  try {
    hooks.add('', null)
    t.fail()
  } catch (e) {
    t.is(e.code, 'FST_ERR_HOOK_INVALID_HANDLER')
    t.is(e.message, 'The hook callback must be a function')
  }
})
