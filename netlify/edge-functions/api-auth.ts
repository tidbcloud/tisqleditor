import type { Config, Context } from '@netlify/edge-functions'
import { apiGuard } from '../../shared/api-security.ts'

export default async (request: Request, context: Context) => {
  const denied = apiGuard(
    request,
    Netlify.env.get('TIDBCLOUD_API_TOKEN') ??
      Netlify.env.get('STATEMENT_API_TOKEN')
  )
  if (denied) return denied
  const response = await context.next()
  response.headers.set('cache-control', 'no-store')
  return response
}

export const config: Config = { path: '/api/*' }
