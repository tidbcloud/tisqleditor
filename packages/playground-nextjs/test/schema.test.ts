import { readSchema } from '../../../shared/schema'

it('reads only allowlisted schema using bound parameters', async () => {
  const query = jest
    .fn()
    .mockResolvedValueOnce([{ name: 'games' }])
    .mockResolvedValueOnce([{ col: 'id', data_type: 'int', is_nullable: 'NO' }])
  expect(await readSchema(['game', 'game'], query)).toEqual([
    {
      name: 'game',
      tables: [
        {
          name: 'games',
          columns: [{ col: 'id', data_type: 'int', nullable: false }]
        }
      ]
    }
  ])
  expect(query).toHaveBeenCalledTimes(2)
  expect(query.mock.calls[0][1]).toEqual(['game'])
  expect(query.mock.calls[1][1]).toEqual(['game', 'games'])
  expect(
    query.mock.calls.every(
      ([sql]) => !sql.toLowerCase().includes('show databases')
    )
  ).toBe(true)
})

it('propagates database failures for the route to handle', async () => {
  await expect(
    readSchema(['game'], async () => {
      throw new Error('connection failed')
    })
  ).rejects.toThrow('connection failed')
})
