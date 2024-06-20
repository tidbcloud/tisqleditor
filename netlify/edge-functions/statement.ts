import { connect } from 'https://esm.sh/@tidbcloud/serverless'

export default async () => {
  const conn = connect({
    url: Netlify.env.get('TIDBCLOUD_DATABASE_URL')
  })

  const res = await conn.execute(
    `
SELECT g.*
FROM game_genre gg
LEFT JOIN games g ON g.app_id = gg.app_id
WHERE gg.genre_id  = 9
ORDER BY g.estimated_owners DESC
LIMIT 10`,
    null,
    { arrayMode: true, fullResult: true }
  )

  return new Response(JSON.stringify({ code: 200, message: 'ok', data: res }))
}

export const config = { path: '/api/statement' }
