import { UserTier } from '@xeronith/granola/core/objects';

export const sortTiers = (a: UserTier, b: UserTier) => {
  // Sort recommended tiers first
  if (a.recommended && !b.recommended) return -1;
  if (!a.recommended && b.recommended) return 1;
  return 0;
}
