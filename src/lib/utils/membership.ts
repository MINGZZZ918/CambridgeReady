import type { Membership, Profile } from '@/types';

export function getEffectiveMembership(
  profile: Pick<Profile, 'membership' | 'membership_expires_at'>
): Membership {
  if (profile.membership === 'free') return 'free';

  if (!profile.membership_expires_at) return profile.membership;

  const expiresAt = new Date(profile.membership_expires_at);
  if (expiresAt < new Date()) return 'free';

  return profile.membership;
}
