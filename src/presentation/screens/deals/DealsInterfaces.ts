import { MembershipTier } from './DealsEnums';

export interface MembershipBenefit {
  id: string;
  icon: string;
  description: string;
}

export interface MembershipTierData {
  id: MembershipTier;
  name: string;
  color: string;
  benefits: MembershipBenefit[];
}

export interface MockUser {
  currentTier: MembershipTier;
}

export type SelectedTier = MembershipTier | null;