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

export type MembershipStatus = 'free' | 'premium_active' | 'premium_expiring' | 'premium_expired';

export function getDaysUntilExpiry(
  profile: Pick<Profile, 'membership' | 'membership_expires_at'>
): number | null {
  if (profile.membership === 'free' || !profile.membership_expires_at) return null;
  const expiresAt = new Date(profile.membership_expires_at);
  const now = new Date();
  const diffMs = expiresAt.getTime() - now.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

export function getMembershipStatus(
  profile: Pick<Profile, 'membership' | 'membership_expires_at'>
): MembershipStatus {
  if (profile.membership === 'free') return 'free';
  if (!profile.membership_expires_at) return 'premium_active';

  const days = getDaysUntilExpiry(profile);
  if (days === null) return 'free';
  if (days <= 0) return 'premium_expired';
  if (days <= 30) return 'premium_expiring';
  return 'premium_active';
}

export function formatExpiryDate(isoString: string): string {
  const date = new Date(isoString);
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
}
