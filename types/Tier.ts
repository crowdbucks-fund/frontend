import { UserTier } from '@xeronith/granola/core/objects'

export type LocalUserTier = Omit<UserTier, 'currency' | 'tierFrequency' | 'timestamp'> & { currency?: { id: number; name: string }; tierFrequency?: { unit: string; id: number; name: string } }
