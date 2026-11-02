/** @jest-environment node */
import { audit, readOnlyURL } from '../db-access'
import { POST } from '../../packages/playground-nextjs/app/api/statement/route'
import { GET } from '../../packages/playground-nextjs/app/api/schema/route'

const execute = jest.fn()
const mockConnect = jest.fn((..._args: unknown[]) => ({ execute }))
jest.mock(
  '@tidbcloud/serverless',
  () => ({
    connect: (...args: unknown[]) => mockConnect(...args)
  }),
  { virtual: true }
)

let log: jest.SpyInstance
beforeEach(() => {
  jest.clearAllMocks()
  log = jest.spyOn(console, 'info').mockImplementation(() => {})
  process.env.READONLY_DATABASE_URL = 'mysql://reader:secret@localhost/demo'
  execute.mockResolvedValue([])
})
afterEach(() => {
  log.mockRestore()
  delete process.env.READONLY_DATABASE_URL
})
const request = (database: string, sql: string) =>
  new Request('http://localhost/api/statement', {
    method: 'POST',
    body: JSON.stringify({ database, sql })
  })

test('requires explicit credentials with a database', () => {
  expect(() => readOnlyURL(undefined)).toThrow()
  expect(() => readOnlyURL('mysql://reader:secret@localhost/')).toThrow()
})

test('rejects database URL injection and logs 403 without connecting', async () => {
  const response = await POST(request('demo?user=root', 'select 1'))
  expect(response.status).toBe(403)
  expect(mockConnect).not.toHaveBeenCalled()
  expect(log).toHaveBeenCalledWith(expect.stringContaining('"status":403'))
})

test('rejects writes without touching the database', async () => {
  expect((await POST(request('demo', 'delete from users'))).status).toBe(403)
  expect(execute).not.toHaveBeenCalled()
})

test('executes reads using the read-only account and logs access', async () => {
  expect((await POST(request('demo', 'select 1'))).status).toBe(200)
  expect(mockConnect).toHaveBeenCalledWith({
    url: process.env.READONLY_DATABASE_URL
  })
  expect(log).toHaveBeenCalledWith(
    expect.stringContaining('statement.query:attempt')
  )
  expect(log).toHaveBeenCalledWith(expect.stringContaining('"status":200'))
})

test('missing read-only credentials never falls back to privileged credentials', async () => {
  delete process.env.READONLY_DATABASE_URL
  process.env.DATABASE_URL = 'mysql://root:secret@localhost/demo'
  expect((await POST(request('demo', 'select 1'))).status).toBe(500)
  expect(mockConnect).not.toHaveBeenCalled()
  delete process.env.DATABASE_URL
})

test('schema queries only the configured database and disables caching', async () => {
  const response = await GET()
  expect(response.status).toBe(200)
  expect(response.headers.get('cache-control')).toBe('no-store')
  expect(execute).toHaveBeenCalledTimes(1)
  expect(execute.mock.calls[0][1]).toEqual(['demo'])
  expect(execute.mock.calls[0][0]).not.toMatch(/show databases/i)
})

test('database errors are logged and returned without leaking SQL or credentials', async () => {
  execute.mockRejectedValue(new Error('secret sensitive SQL'))
  const response = await POST(request('demo', 'select private_data'))
  expect(response.status).toBe(500)
  expect(await response.text()).not.toMatch(/secret|private_data/)
  expect(JSON.stringify(log.mock.calls)).not.toMatch(/secret|private_data/)
  expect(log).toHaveBeenCalledWith(expect.stringContaining('"status":500'))
})

test('audit records failures and sanitizes driver exceptions', async () => {
  await expect(
    audit('request', 'query', async () => {
      throw new Error('secret')
    })
  ).rejects.toThrow('Database access failed')
  expect(JSON.stringify(log.mock.calls)).not.toContain('secret')
})
