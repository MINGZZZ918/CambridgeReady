import { createClient } from "@/lib/supabase/server";
import { getMembershipStatus, getDaysUntilExpiry, formatExpiryDate } from "@/lib/utils/membership";
import type { MembershipStatus } from "@/lib/utils/membership";
import PricingPageContent from "./PricingPageContent";

export interface MembershipInfo {
  status: MembershipStatus;
  daysUntilExpiry: number | null;
  expiryDateStr: string | null;
}

export default async function PricingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let membershipInfo: MembershipInfo = {
    status: "free",
    daysUntilExpiry: null,
    expiryDateStr: null,
  };

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("membership, membership_expires_at")
      .eq("id", user.id)
      .single();

    if (profile) {
      membershipInfo = {
        status: getMembershipStatus(profile),
        daysUntilExpiry: getDaysUntilExpiry(profile),
        expiryDateStr: profile.membership_expires_at
          ? formatExpiryDate(profile.membership_expires_at)
          : null,
      };
    }
  }

  return (
    <div className="py-10">
      <PricingPageContent membershipInfo={membershipInfo} />
    </div>
  );
}
