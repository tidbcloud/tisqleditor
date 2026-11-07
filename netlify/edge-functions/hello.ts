import { apiGuard } from '../../shared/api-security.ts'
export default (req: Request) => {
  const denied = apiGuard(
    req,
    Netlify.env.get('TIDBCLOUD_API_TOKEN') ??
      Netlify.env.get('STATEMENT_API_TOKEN'),
    'GET'
  )
  if (denied) return denied

  return new Response('Hello world')
}

export const config = { path: '/api/hello' }
