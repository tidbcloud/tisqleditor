import { NextResponse } from 'next/server'
import { apiGuard } from '../../shared/api-security'

export function middleware(request: Request) {
  const denied = apiGuard(
    request,
    process.env.API_TOKEN ?? process.env.STATEMENT_API_TOKEN
  )
  if (denied) return denied
  const response = NextResponse.next()
  response.headers.set('cache-control', 'no-store')
  return response
}

export const config = { matcher: '/api/:path*' }
