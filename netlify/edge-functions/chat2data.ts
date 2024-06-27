import type { Config, Context } from '@netlify/edge-functions'

const url =
  Netlify.env.get('TIDBCLOUD_CHAT2QUERY_APP_URL_ENDPOINT') + '/v3/chat2data'
const publicKey = Netlify.env.get('TIDBCLOUD_CHAT2QUERY_APP_PUBLIC_KEY')
const privateKey = Netlify.env.get('TIDBCLOUD_CHAT2QUERY_APP_PRIVATE_KEY')

export default async (_req: Request, _context: Context) => {
  const data = {
    cluster_id: '10571975649917075631',
    database: 'game',
    question: 'show most 10 popular games'
  }

  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Basic ' + btoa(`${publicKey}:${privateKey}`)
    },
    body: JSON.stringify(data)
  }

  const res = await fetch(url, fetchOptions).then((res) => res.json())

  return new Response(JSON.stringify(res))
}

export const config: Config = { path: '/api/chat2data' }
