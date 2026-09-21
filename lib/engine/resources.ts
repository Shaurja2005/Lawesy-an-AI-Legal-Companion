export interface LegalResource {
  name: string;
  url: string;
  description: string;
}

export const LEGAL_RESOURCES: Record<string, LegalResource[]> = {
  IN: [
    {
      name: 'National Legal Services Authority (NALSA)',
      url: 'https://nalsa.gov.in/',
      description: 'Provides free legal services to the weaker sections of society in India.',
    }
  ],
  US: [
    {
      name: 'LawHelp.org',
      url: 'https://www.lawhelp.org/',
      description: 'Helps low and moderate income people find free legal aid programs in their communities.',
    },
    {
      name: 'American Bar Association Free Legal Answers',
      url: 'https://abafreelegalanswers.org/',
      description: 'A virtual legal advice clinic where qualifying users can post civil legal questions.',
    }
  ],
  UK: [
    {
      name: 'Citizens Advice',
      url: 'https://www.citizensadvice.org.uk/',
      description: 'Provides free, confidential and independent advice to help people overcome their problems.',
    }
  ]
};

export function getResourcesForJurisdiction(countryCode: string): LegalResource[] {
  return LEGAL_RESOURCES[countryCode.toUpperCase()] || [];
}
