// Mock-only session capabilities. This is not authentication for real jobs.
const cookieName = 'tisqleditor_mock_session'
const lifetime = 3600
const encoder = new TextEncoder()

function hex(bytes: Uint8Array) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join(
    ''
  )
}

function session(req: Request) {
  const value = (req.headers.get('cookie') ?? '')
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(cookieName + '='))
    ?.slice(cookieName.length + 1)
  return value && /^[0-9a-f]{64}$/.test(value) ? value : undefined
}

function key(secret: string) {
  return crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  )
}

export async function createMockJob(
  req: Request,
  type: 'chat2data' | 'refine-sql'
) {
  const secret = session(req) ?? hex(crypto.getRandomValues(new Uint8Array(32)))
  const expires = Math.floor(Date.now() / 1000) + lifetime
  const payload = `mock-${type}-${crypto.randomUUID()}.${expires}`
  const signature = await crypto.subtle.sign(
    'HMAC',
    await key(secret),
    encoder.encode(payload)
  )
  return {
    jobId: payload + '.' + hex(new Uint8Array(signature)),
    cookie:
      `${cookieName}=${secret}; HttpOnly; SameSite=Strict; Path=/api; Max-Age=${lifetime}` +
      (new URL(req.url).protocol === 'https:' ? '; Secure' : '')
  }
}

export async function ownsMockJob(req: Request, jobId: string) {
  const secret = session(req)
  const match =
    /^(mock-(?:chat2data|refine-sql)-[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12})\.(\d{10})\.([0-9a-f]{64})$/.exec(
      jobId
    )
  if (!secret || !match) return false
  const now = Math.floor(Date.now() / 1000)
  const expires = Number(match[2])
  if (expires <= now || expires > now + lifetime) return false
  const signature = new Uint8Array(
    match[3].match(/../g)!.map((byte) => parseInt(byte, 16))
  )
  return crypto.subtle.verify(
    'HMAC',
    await key(secret),
    signature,
    encoder.encode(`${match[1]}.${match[2]}`)
  )
}
