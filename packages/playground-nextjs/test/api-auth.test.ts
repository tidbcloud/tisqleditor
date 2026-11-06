/** @jest-environment node */
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { transpileModule, ModuleKind } from 'typescript'
import { Parser } from 'node-sql-parser'
import { apiGuard } from '../../../shared/api-security'

jest.mock('@tidbcloud/serverless', () => ({ connect: jest.fn() }))
const { connect } = require('@tidbcloud/serverless')
const root = resolve(__dirname, '../../..')
const token = 'private-test-token'
const nextRoutes = ['schema', 'jobs', 'chat2data', 'refine-sql']
const edgeRoutes = ['schema', 'job-status', 'chat2data', 'refine-sql', 'hello']

function edgeHandler(name: string) {
  const filename = resolve(root, 'netlify/edge-functions', `${name}.ts`)
  const code = transpileModule(readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ModuleKind.CommonJS }
  }).outputText
  const exports: any = {}
  new Function('require', 'exports', code)((specifier: string) => {
    if (specifier.includes('node-sql-parser')) return { Parser }
    if (specifier.includes('@tidbcloud/serverless')) return { connect }
    return require(resolve(root, 'netlify/edge-functions', specifier))
  }, exports)
  return exports.default
}

beforeEach(() => {
  jest.clearAllMocks()
  process.env.API_TOKEN = token
  delete process.env.STATEMENT_API_TOKEN
  Object.assign(globalThis, {
    Netlify: {
      env: {
        get: (name: string) => process.env[name.replace(/^TIDBCLOUD_/, '')]
      }
    }
  })
})

for (const [platform, names] of [
  ['next', nextRoutes],
  ['edge', edgeRoutes]
] as const) {
  describe(platform, () => {
    it.each(names)('%s permits valid authenticated requests', async (name) => {
      process.env.DATABASE_URL = 'mysql://test:password@localhost/'
      process.env.STATEMENT_ALLOWED_DATABASES = 'game'
      connect.mockReturnValue({ execute: jest.fn().mockResolvedValue([]) })
      const method = ['schema', 'jobs', 'job-status', 'hello'].includes(name)
        ? 'GET'
        : 'POST'
      const handler =
        platform === 'edge'
          ? edgeHandler(name)
          : require(`../app/api/${name}/route`)[method]
      const res = await handler(
        new Request(`http://localhost/api/${name}?job_id=mock-chat2data`, {
          method,
          headers: { authorization: `Bearer ${token}` },
          ...(method === 'POST'
            ? {
                body: JSON.stringify({
                  database: 'game',
                  sql: 'SELECT 1',
                  question: 'demo'
                })
              }
            : {})
        }),
        {}
      )
      expect(res.status).toBe(200)
      if (!['schema'].includes(name)) expect(connect).not.toHaveBeenCalled()
    })

    it.each(names)(
      '%s rejects missing/wrong/absent-config credentials before side effects',
      async (name) => {
        const method = ['schema', 'jobs', 'job-status', 'hello'].includes(name)
          ? 'GET'
          : 'POST'
        const handler =
          platform === 'edge'
            ? edgeHandler(name)
            : require(`../app/api/${name}/route`)[method]
        for (const auth of [
          undefined,
          'Bearer wrong',
          'Basic private-test-token'
        ]) {
          const req = new Request(`http://localhost/api/${name}`, {
            method,
            headers: auth ? { authorization: auth } : {}
          })
          const json = jest.spyOn(req, 'json')
          const res = await handler(req, {})
          expect(res.status).toBe(401)
          expect(res.headers.get('cache-control')).toBe('no-store')
          expect(json).not.toHaveBeenCalled()
        }
        delete process.env.API_TOKEN
        expect(
          (
            await handler(
              new Request(`http://localhost/api/${name}`, {
                method,
                headers: { authorization: `Bearer ${token}` }
              }),
              {}
            )
          ).status
        ).toBe(401)
        expect(connect).not.toHaveBeenCalled()
      }
    )
    it.each(names)(
      '%s rejects unsupported methods when directly invoked',
      async (name) => {
        const method = ['schema', 'jobs', 'job-status', 'hello'].includes(name)
          ? 'GET'
          : 'POST'
        const handler =
          platform === 'edge'
            ? edgeHandler(name)
            : require(`../app/api/${name}/route`)[method]
        const res = await handler(
          new Request(`http://localhost/api/${name}`, {
            method: 'DELETE',
            headers: { authorization: `Bearer ${token}` }
          }),
          {}
        )
        expect(res.status).toBe(405)
        expect(res.headers.get('allow')).toBe(method)
        expect(connect).not.toHaveBeenCalled()
      }
    )
  })
}

it('permits valid credentials and rejects whitespace-only configuration', () => {
  const request = new Request('http://localhost/api/jobs', {
    headers: { authorization: `Bearer ${token}` }
  })
  expect(apiGuard(request, token, 'GET')).toBeUndefined()
  expect(apiGuard(request, '  ')?.status).toBe(401)
})

it('central Next middleware protects future /api routes', () => {
  const { middleware, config } = require('../middleware')
  expect(config.matcher).toBe('/api/:path*')
  expect(middleware(new Request('http://localhost/api/future')).status).toBe(
    401
  )
  expect(
    middleware(
      new Request('http://localhost/api/future', {
        headers: { authorization: `Bearer ${token}` }
      })
    ).headers.get('x-middleware-next')
  ).toBe('1')
})

it('Netlify middleware blocks dispatch or continues only with valid credentials', async () => {
  const handler = edgeHandler('api-auth')
  const context = { next: jest.fn(async () => new Response('ok')) }
  expect(
    (await handler(new Request('http://localhost/api/future'), context)).status
  ).toBe(401)
  expect(context.next).not.toHaveBeenCalled()
  expect(
    (
      await handler(
        new Request('http://localhost/api/future', {
          headers: { authorization: `Bearer ${token}` }
        }),
        context
      )
    ).status
  ).toBe(200)
  expect(context.next).toHaveBeenCalledTimes(1)
})
