import { createHmac, timingSafeEqual } from 'crypto'

const SIGNATURE_PREFIX = 'ptsr'
const ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
const BASE = ALPHABET.length

export type FingerprintInput = {
  author: string
  title: string
  body: string
  tags?: string[]
}

function normalize(value: string) {
  return value.trim().replace(/\s+/g, ' ')
}

function serialize(input: FingerprintInput, issuedAt: number) {
  return JSON.stringify({
    author: normalize(input.author),
    title: normalize(input.title),
    body: normalize(input.body),
    tags: (input.tags ?? []).map(normalize).sort(),
    issuedAt,
  })
}

function base62Encode(buffer: Buffer) {
  const digits = [0]

  for (let i = 0; i < buffer.length; i += 1) {
    let carry = buffer[i]

    for (let j = 0; j < digits.length; j += 1) {
      const value = digits[j] * 256 + carry
      digits[j] = value % BASE
      carry = Math.floor(value / BASE)
    }

    while (carry > 0) {
      digits.push(carry % BASE)
      carry = Math.floor(carry / BASE)
    }
  }

  return digits.reverse().map((digit) => ALPHABET[digit]).join('')
}

function safeSecret(secret?: string) {
  if (!secret) {
    throw new Error('CONTENT_SIGNATURE_SECRET is required to sign content')
  }

  return secret
}

export function createContentFingerprint(input: FingerprintInput, secret = process.env.CONTENT_SIGNATURE_SECRET) {
  const issuedAt = Date.now()
  const payload = serialize(input, issuedAt)
  const mac = createHmac('sha256', safeSecret(secret))
  mac.update(payload)

  const signature = base62Encode(mac.digest()).slice(0, 32)
  return `${SIGNATURE_PREFIX}.${issuedAt}.${signature}`
}

export function verifyContentFingerprint(input: FingerprintInput, fingerprint: string, secret = process.env.CONTENT_SIGNATURE_SECRET) {
  const [prefix, issuedAtString, signature] = fingerprint.split('.')
  if (prefix !== SIGNATURE_PREFIX || !issuedAtString || !signature) {
    return false
  }

  const issuedAt = Number(issuedAtString)
  if (!Number.isFinite(issuedAt)) {
    return false
  }

  const payload = serialize(input, issuedAt)
  const mac = createHmac('sha256', safeSecret(secret))
  mac.update(payload)

  const expected = base62Encode(mac.digest()).slice(0, 32)
  if (expected.length !== signature.length) {
    return false
  }

  return timingSafeEqual(Buffer.from(expected, 'utf8'), Buffer.from(signature, 'utf8'))
}
