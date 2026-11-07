import { Parser } from 'node-sql-parser'
import {
  statementConfiguration,
  statementAuthorized,
  validateStatement
} from '../../../shared/statement-security'

const parser = new Parser()
const validate = (sql: string, database = 'game') =>
  validateStatement({ database, sql }, parser, ['game'])

it.each([
  'SELECT * FROM games LIMIT 10',
  'SELECT COUNT(*) FROM game.games',
  'SELECT * FROM games WHERE id IN (SELECT id FROM games)',
  'SELECT 1 UNION SELECT 2'
])('accepts safe SELECT: %s', (sql) => {
  expect(validate(sql)).toEqual({ database: 'game', sql })
})

it.each([
  'SELECT 1; DROP TABLE games',
  'DELETE FROM games',
  'SELECT * FROM mysql.user',
  'SELECT * FROM games UNION SELECT * FROM mysql.user',
  'SELECT * FROM games WHERE id IN (SELECT id FROM other.games)',
  'SELECT LOAD_FILE("/etc/passwd")',
  'SELECT SLEEP(10)',
  'SELECT @@version',
  'SELECT @secret',
  'SELECT 1 INTO OUTFILE "/tmp/leak"',
  'SELECT * FROM games FOR UPDATE',
  'SELECT /*!50000 SQL_NO_CACHE */ * FROM games',
  'SELECT /*T! SQL_NO_CACHE */ * FROM games',
  'SELECT 1 INTO @secret',
  'SELECT GET_LOCK("lock", 10)'
])('rejects unsafe SQL: %s', (sql) => {
  expect(() => validate(sql)).toThrow()
})

it.each([
  'other',
  'mysql',
  'game?host=attacker',
  '../game',
  'game#x',
  'game/other',
  'GAME',
  ''
])('rejects database: %s', (database) => {
  expect(() => validate('SELECT 1', database)).toThrow()
})

it('requires an allowlist for a URL without a database', () => {
  const url = 'mysql://name:password@localhost/'
  expect(() => statementConfiguration(url, undefined)).toThrow()
  expect(statementConfiguration(url, 'game, demo').databases).toEqual([
    'game',
    'demo'
  ])
  expect(statementConfiguration(`${url}game`, undefined).databases).toEqual([
    'game'
  ])
  for (const list of ['', 'game,', 'mysql', 'game?host=attacker']) {
    expect(() => statementConfiguration(url, list)).toThrow()
  }
})

it('fails closed without valid server credentials', () => {
  const request = (authorization?: string) =>
    ({
      headers: { get: () => authorization ?? null }
    }) as unknown as Request
  expect(statementAuthorized(request(), undefined)).toBe(false)
  expect(statementAuthorized(request(), 'secret')).toBe(false)
  expect(statementAuthorized(request('Bearer wrong'), 'secret')).toBe(false)
  expect(statementAuthorized(request('Bearer secret'), 'secret')).toBe(true)
})
