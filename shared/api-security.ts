// Used by middleware and handlers: middleware alone is not an auth boundary.
export function apiGuard(
  request: Request,
  token: string | undefined,
  method?: string
): Response | undefined {
  if (
    !token?.trim() ||
    request.headers.get('authorization') !== `Bearer ${token}`
  ) {
    return Response.json(
      { code: 401, message: 'Unauthorized', msg: 'Unauthorized', data: {} },
      {
        status: 401,
        headers: { 'cache-control': 'no-store', 'www-authenticate': 'Bearer' }
      }
    )
  }
  if (method && request.method !== method) {
    return Response.json(
      {
        code: 405,
        message: 'Method not allowed',
        msg: 'Method not allowed',
        data: {}
      },
      { status: 405, headers: { Allow: method, 'cache-control': 'no-store' } }
    )
  }
}
