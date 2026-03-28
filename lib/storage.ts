import { Redis } from '@upstash/redis'
import { RegistrationData, SignedRegistration } from '@/types/registration'

// Initialize Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
})

const REGISTRATIONS_KEY = 'registrations'

export async function saveRegistration(data: RegistrationData | SignedRegistration): Promise<void> {
  await redis.hset(REGISTRATIONS_KEY, { [data.id]: JSON.stringify(data) })
}

export async function getRegistration(id: string): Promise<RegistrationData | null> {
  const data = await redis.hget(REGISTRATIONS_KEY, id)
  if (!data) return null
  return typeof data === 'string' ? JSON.parse(data) : data as RegistrationData
}

export async function listRegistrations(): Promise<RegistrationData[]> {
  const all = await redis.hgetall(REGISTRATIONS_KEY)
  if (!all) return []
  
  const registrations = Object.values(all).map(item => {
    if (typeof item === 'string') {
      return JSON.parse(item)
    }
    return item
  }) as RegistrationData[]
  
  return registrations.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}

export async function deleteRegistration(id: string): Promise<boolean> {
  const result = await redis.hdel(REGISTRATIONS_KEY, id)
  return result > 0
}

export async function signRegistration(
  id: string, 
  signature: string, 
  marketingOptOut: boolean
): Promise<SignedRegistration | null> {
  const reg = await getRegistration(id)
  if (!reg) return null
  
  const signed: SignedRegistration = {
    ...reg,
    status: 'signed',
    signedAt: new Date().toISOString(),
    signature,
    marketingOptOut,
  }
  
  await saveRegistration(signed)
  return signed
}

// For backwards compatibility, no-op
export async function ensureDataDir() {}
