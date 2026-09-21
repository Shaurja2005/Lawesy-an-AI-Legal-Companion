import type { Role, DocType } from '../schemas/ai';

export const DEFAULT_FOCUS = [
  'termination',
  'payment',
  'liability',
  'warranties',
  'dispute_resolution',
  'confidentiality',
];

export const FOCUS_MAPS: Partial<Record<Role, Partial<Record<DocType, string[]>>>> = {
  tenant: {
    lease: [
      'rent_and_deposit',
      'maintenance_obligations',
      'termination',
      'penalties',
      'pet_policies',
      'subletting',
    ],
  },
  landlord: {
    lease: [
      'default_and_eviction',
      'rent_collection',
      'liability',
      'property_damage',
      'insurance_requirements',
    ],
  },
  employee: {
    employment: [
      'compensation',
      'benefits',
      'termination_conditions',
      'non_compete',
      'intellectual_property',
      'probation_period',
    ],
  },
  employer: {
    employment: [
      'at_will_employment',
      'intellectual_property',
      'confidentiality',
      'non_compete',
      'termination_for_cause',
    ],
  },
  freelancer: {
    service_agreement: [
      'payment_terms',
      'scope_of_work',
      'intellectual_property_ownership',
      'termination',
      'liability',
    ],
  },
  consumer: {
    terms_of_service: [
      'hidden_fees',
      'auto_renewal',
      'arbitration_clause',
      'data_privacy',
      'account_termination',
    ],
    privacy_policy: [
      'data_selling',
      'third_party_sharing',
      'opt_out_options',
      'data_retention',
    ],
  },
};

export function getFocusCategories(role: Role, docType: DocType): string[] {
  const roleMap = FOCUS_MAPS[role];
  if (roleMap) {
    const categories = roleMap[docType];
    if (categories && categories.length > 0) {
      return categories;
    }
  }
  return DEFAULT_FOCUS;
}
