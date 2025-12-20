function getFirstHeaderValue(value: string | null): string | null {
  if (!value) return null
  return value.split(',')[0]?.trim() || null
}

export function getClientIp(headers: Headers): string | null {
  return (
    getFirstHeaderValue(headers.get('x-forwarded-for')) ||
    headers.get('x-real-ip') ||
    headers.get('cf-connecting-ip') ||
    null
  )
}

export function getRequestOrigin(headers: Headers): string | null {
  const origin = headers.get('origin')
  if (origin) return origin

  const proto =
    getFirstHeaderValue(headers.get('x-forwarded-proto')) ||
    getFirstHeaderValue(headers.get('x-forwarded-scheme')) ||
    getFirstHeaderValue(headers.get('x-scheme')) ||
    getFirstHeaderValue(headers.get('x-forwarded-protocol'))
  const host =
    getFirstHeaderValue(headers.get('x-forwarded-host')) || headers.get('host')

  if (!host) return null

  const normalizedProto =
    proto || (host.startsWith('localhost') || host.startsWith('127.0.0.1') ? 'http' : 'https')

  return `${normalizedProto}://${host}`
}
