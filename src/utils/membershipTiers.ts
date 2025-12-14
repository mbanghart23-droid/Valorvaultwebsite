export interface MembershipTier {
  id: string;
  name: string;
  description: string;
  catalogLimit: number | null; // null means unlimited
  price: number; // monthly price in dollars (0 for free)
  features: string[];
  isActive: boolean; // whether to show this tier in registration
}

export const MEMBERSHIP_TIERS: MembershipTier[] = [
  {
    id: 'beta-user',
    name: 'Beta User',
    description: 'Unlimited catalog size',
    catalogLimit: null,
    price: 0,
    features: [
      'Unlimited service members',
      'Unlimited medals per member',
      'Photo uploads',
      'Global search access',
      'Connect with other collectors'
    ],
    isActive: true
  },
  // Future tiers (currently inactive)
  {
    id: 'free',
    name: 'Free',
    description: 'Perfect for small collections',
    catalogLimit: 10,
    price: 0,
    features: [
      'Up to 10 service members',
      'Basic photo uploads',
      'Limited global search',
      'Connect with collectors'
    ],
    isActive: false
  },
  {
    id: 'collector',
    name: 'Collector',
    description: 'For growing collections',
    catalogLimit: 50,
    price: 9.99,
    features: [
      'Up to 50 service members',
      'Unlimited photos',
      'Full global search',
      'Priority support',
      'Advanced filtering'
    ],
    isActive: false
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'For serious collectors',
    catalogLimit: null,
    price: 19.99,
    features: [
      'Unlimited service members',
      'Unlimited photos',
      'Full global search',
      'Priority support',
      'Advanced analytics',
      'Export options',
      'Early access to new features'
    ],
    isActive: false
  }
];

export function getActiveTiers(): MembershipTier[] {
  return MEMBERSHIP_TIERS.filter(tier => tier.isActive);
}

export function getTierById(id: string): MembershipTier | undefined {
  return MEMBERSHIP_TIERS.find(tier => tier.id === id);
}

export function getDefaultTier(): MembershipTier {
  const activeTiers = getActiveTiers();
  return activeTiers[0] || MEMBERSHIP_TIERS[0];
}

export function canAddPerson(currentCount: number, tierID: string): boolean {
  const tier = getTierById(tierID);
  if (!tier) return false;
  if (tier.catalogLimit === null) return true; // unlimited
  return currentCount < tier.catalogLimit;
}
