import { promises as fs } from 'fs'
import path from 'path'
import { RegistrationData, SignedRegistration } from '@/types/registration'

const DATA_DIR = path.join(process.cwd(), 'data', 'registrations')

export async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true })
}

export async function saveRegistration(data: RegistrationData): Promise<void> {
  await ensureDataDir()
  const filePath = path.join(DATA_DIR, `${data.id}.json`)
  await fs.writeFile(filePath, JSON.stringify(data, null, 2))
}

export async function getRegistration(id: string): Promise<RegistrationData | null> {
  try {
    const filePath = path.join(DATA_DIR, `${id}.json`)
    const content = await fs.readFile(filePath, 'utf-8')
    return JSON.parse(content)
  } catch {
    return null
  }
}

export async function listRegistrations(): Promise<RegistrationData[]> {
  await ensureDataDir()
  const files = await fs.readdir(DATA_DIR)
  const registrations = await Promise.all(
    files
      .filter(f => f.endsWith('.json'))
      .map(async f => {
        const content = await fs.readFile(path.join(DATA_DIR, f), 'utf-8')
        return JSON.parse(content)
      })
  )
  return registrations.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}

export async function deleteRegistration(id: string): Promise<boolean> {
  try {
    const filePath = path.join(DATA_DIR, `${id}.json`)
    await fs.unlink(filePath)
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
