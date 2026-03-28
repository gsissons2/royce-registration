import { put, list, del, head } from '@vercel/blob'
import { RegistrationData, SignedRegistration } from '@/types/registration'

const REGISTRATIONS_PREFIX = 'registrations/'

export async function saveRegistration(data: RegistrationData | SignedRegistration): Promise<void> {
  const path = `${REGISTRATIONS_PREFIX}${data.id}.json`
  await put(path, JSON.stringify(data), {
    access: 'public',
    addRandomSuffix: false,
  })
}

export async function getRegistration(id: string): Promise<RegistrationData | null> {
  try {
    const path = `${REGISTRATIONS_PREFIX}${id}.json`
    const { blobs } = await list({ prefix: path })
    
    if (blobs.length === 0) return null
    
    const response = await fetch(blobs[0].url)
    if (!response.ok) return null
    
    return await response.json()
  } catch {
    return null
  }
}

export async function listRegistrations(): Promise<RegistrationData[]> {
  try {
    const { blobs } = await list({ prefix: REGISTRATIONS_PREFIX })
    
    const registrations = await Promise.all(
      blobs.map(async (blob) => {
        try {
          const response = await fetch(blob.url)
          if (!response.ok) return null
          return await response.json()
        } catch {
          return null
        }
      })
    )
    
    return registrations
      .filter((r): r is RegistrationData => r !== null)
      .sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
  } catch {
    return []
  }
}

export async function deleteRegistration(id: string): Promise<boolean> {
  try {
    const path = `${REGISTRATIONS_PREFIX}${id}.json`
    const { blobs } = await list({ prefix: path })
    
    if (blobs.length === 0) return false
    
    await del(blobs[0].url)
    return true
  } catch {
    return false
  }
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

// For backwards compatibility
export async function ensureDataDir() {}
