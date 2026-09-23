export type Translations = Record<string, any>;

// English translations — the reference locale
export const en: Translations = {
  // Global / Chrome
  nav: {
    desk: 'Desk',
    compare: 'Compare',
    settings: 'Settings',
    about: 'About',
  },
  disclaimer: 'Legal information to help you understand documents — not legal advice. For decisions with serious consequences, consult a qualified lawyer.',
  skipToContent: 'Skip to content',

  // Onboarding
  onboarding: {
    languagePlaceholder: 'Select language',
    title: 'Welcome to Lawesy',
    subtitle: 'Help us tailor your experience. (You can change this anytime)',
    roleLabel: 'Your Role',
    rolePlaceholder: 'Select a role',
    goalLabel: 'Your Goal',
    goalPlaceholder: 'Select your goal',
    expertiseLabel: 'Legal Expertise',
    expertisePlaceholder: 'Select expertise',
    countryLabel: 'Country',
    countryPlaceholder: 'e.g. IN, US, UK',
    regionLabel: 'State / Region',
    regionPlaceholder: 'Optional',
    languageLabel: 'Language for AI outputs',
    redactLabel: 'Redact PII',
    redactDescription: 'Hide names, emails, and phone numbers before analysis.',
    saveButton: 'Save & Continue',
    skipButton: 'Skip for now',
  },

  // Roles
  roles: {
    tenant: 'Tenant',
    landlord: 'Landlord',
    employee: 'Employee / Job Seeker',
    employer: 'Employer',
    freelancer: 'Freelancer',
    small_business: 'Small Business',
    consumer: 'Consumer',
    notice_recipient: 'Received a Notice',
    other: 'Other',
  },

  // Goals
  goals: {
    understand: 'Just understand what it means',
    decide_to_sign: 'Decide whether to sign',
    negotiate: 'Prepare to negotiate',
    resolve_dispute: 'Resolve a dispute',
    respond_to_notice: 'Respond to a legal notice',
    compare_options: 'Compare options',
  },

  // Expertise
  expertise: {
    new: 'New to this (Explain everything)',
    some: 'Some familiarity',
    comfortable: 'Comfortable with legal text',
  },

  // Languages
  languages: {
    en: 'English',
    hi: 'Hindi (हिंदी)',
    ta: 'Tamil (தமிழ்)',
  },

  // Desk / upload
  desk: {
    heroTitle: 'Understand your legal documents.',
    heroSubtitle: 'Lawesy translates dense contracts into plain language, highlights hidden risks, and tells you what to watch out for — based on your role.',
    privacyNote: 'Private & secure — everything stays in your browser until you choose to analyse it.',
    step1Title: 'Drop it on the desk',
    step1Body: 'Upload a PDF, Word doc, or paste text directly. We instantly segment it into labelled clauses.',
    step2Title: 'AI translates it',
    step2Body: 'Jargon replaced with plain English. A clear summary generated for every section.',
    step3Title: 'Spot the risks',
    step3Body: 'Checked against your role and jurisdiction to flag unfair obligations and missing protections.',
    parsing: 'Parsing document and identifying clauses…',
  },

  // Document workspace tabs
  workspace: {
    documentDetails: 'Document Details',
    analyzing: 'AI is analysing your document…',
    analysisFailed: 'Some of the AI analysis could not be completed.',
    tabOriginal: 'Original Text',
    tabPlain: 'Plain Language',
    tabClauses: 'Key Clauses & Risks',
    tabAsk: 'Ask',
    tabNextSteps: 'Next Steps',
    compareButton: 'Compare',
    noDocuments: 'No documents yet',
  },

  // Plain language tab
  plain: {
    heading: 'Plain language',
    original: 'Original',
    simplifyButton: 'Simplify this section →',
    simplifying: 'Simplifying…',
    failed: 'Could not simplify this section.',
  },

  // Clauses tab
  clauses: {
    seeClauses: 'See clauses',
    analyzingClauses: 'Analysing clauses…',
    worthSecondLook: 'Worth a Second Look',
    missingProtections: 'Missing Protections',
    contradictoryTerms: 'Contradictory Terms',
    obligations: 'Obligations',
    sourceText: 'Source Text',
    noClauses: 'No specific clauses highlighted for this document type.',
  },

  // Ask (chat) tab
  ask: {
    jumpToClause: 'Jump to clause',
    error: 'Sorry, I couldn\'t get an answer right now. Please try again.',
    send: 'Send',
    header: 'Ask about this document',
    placeholder: 'E.g. Can I sublet the apartment?',
    emptyState: 'Ask questions about your document.\nAnswers are grounded in the text.',
  },

  // Next Steps / Act tab
  act: {
    dateLabel: 'Date',
    heading: 'Action Plan',
    lawyerBriefButton: 'Lawyer Brief',
    exportButton: 'Export MD',
    yourObligations: 'Your Obligations',
    deadlines: 'Deadlines & Timelines',
    noObligations: 'No specific obligations or deadlines were identified for you.',
    addToCalendar: 'Add to Calendar',
    noDate: 'No explicit date',
    timeline: 'Timeline',
  },

  // Compare page
  compare: {
    versionsTitle: 'Compare Versions',
    selectDocument: 'Select a document to compare',
    noOtherDocs: 'No other documents found.',
    uploadAnother: 'Upload another version to compare.',
    failed: 'Could not analyse the differences.',
    retry: 'Try again',
    identical: 'These documents are identical.',
    notFound: 'One of these documents could not be found in your library.',
    truncated: 'Only the first {n} changes were analysed by AI.',
    unclear: 'Unclear',
    sigHigh: 'High',
    sigMedium: 'Medium',
    sigLow: 'Low',
    title: 'Compare Documents',
    subtitle: 'Select two documents from your library to compare them side-by-side.',
    library: 'Your Library',
    instructions: 'Open a document from your desk first, then click Compare in the document header to select a second version to compare it against.',
    noDocuments: 'No documents in your library yet.',
    uploadCta: 'Upload one on the Desk',
    openButton: 'Open',
    analyzing: 'Analyzing legal impact…',
    originalDoc: 'Original',
    newDoc: 'New',
    favorsUser: 'Favors you',
    favorsOther: 'Favors other party',
    neutral: 'Neutral',
    favors: 'Favors',
    impact: 'Impact',
    addedClause: '(Added in new version)',
    removedClause: '(Removed)',
  },

  // Lawyer brief page
  brief: {
    loading: 'Loading brief…',
    clause: 'Clause',
    see: 'See',
    backButton: 'Back to Desk',
    printButton: 'Print Brief',
    title: 'Legal Review Memo',
    toLabel: 'To',
    fromLabel: 'From',
    dateLabel: 'Date',
    subjectLabel: 'Subject',
    reviewOf: 'Review of',
    toValue: 'Reviewing Attorney',
    fromValue: 'Lawesy Automated Review',
    section1: '1. Executive Summary',
    section2: '2. Material Risks & Red Flags',
    section3: '3. Draft Deficiencies',
    section4: '4. Client Obligations',
    urgentFlag: 'URGENT FLAG',
    noHighRisk: 'No high-risk clauses identified.',
    missingProtections: 'Missing Standard Protections',
    contradictions: 'Internal Contradictions',
  },

  // About page
  about: {
    privacyTitle: 'Privacy by default',
    privacyBody: 'Everything you paste or upload stays in your browser\'s local storage (IndexedDB). Nothing is sent for AI analysis until you click "Analyse". No document text is ever logged or retained by Lawesy.',
    aiTitle: 'How the AI works',
    aiBody: 'Lawesy uses Google Gemini (Flash tier) to classify your document, extract key clauses, summarise the key points in plain language, and flag unusual or risky terms. The model is instructed to ground every answer strictly in the text you provide.',
    scopeTitle: 'What we analyse',
    scopeBody: 'Tenancy agreements, employment contracts, NDAs, service agreements, purchase orders, and general contracts. The more structured the document, the better the analysis.',
    limitsTitle: 'Limitations',
    limitsBody: 'AI can miss nuance, misread complex legalese, or give incomplete analysis for unusual clause structures. Always read the original document yourself, and consult a qualified lawyer for anything you plan to sign.',
    title: 'About Lawesy',
    intro: 'Lawesy is an AI legal companion that translates dense contracts into plain language, highlights hidden risks, and tells you what to watch out for — based on your role and situation. It is not a law firm and does not give legal advice.',
    disclaimer: 'Legal Disclaimer:',
    disclaimerBody: 'Lawesy provides AI-generated information to help you understand documents. This is not legal advice. For any document with serious financial, legal, or personal consequences — including anything you intend to sign — please consult a qualified solicitor or lawyer in your jurisdiction.',
  },

  // Settings page
  settings: {
    languageHelp: 'AI outputs (summaries, clause analysis, answers) will be generated in this language.',
    viewingAs: 'You are viewing as:',
    editProfile: 'Edit profile in onboarding →',
    confirmClear: 'Confirm — this cannot be undone',
    title: 'Settings',
    profileSection: 'Your Profile',
    appearanceSection: 'Appearance',
    languageSection: 'Language',
    privacySection: 'Privacy',
    themeLabel: 'Theme',
    themeLight: 'Day Desk (Light)',
    themeDark: 'Lamplit Study (Dark)',
    themeSystem: 'System',
    textSizeLabel: 'Text Size',
    reducedMotionLabel: 'Reduce Motion',
    clearDataLabel: 'Clear All My Data',
    clearDataDescription: 'Permanently deletes all documents and settings from your browser.',
    clearDataButton: 'Clear All Data',
    saveButton: 'Save Settings',
  },

  // Library drawer
  library: {
    deleteLabel: 'Delete document',
    heading: 'Your Library',
    noDocuments: 'No documents yet',
    deleteConfirm: 'Delete this document?',
  },

  // Status / loading
  status: {
    loading: 'Loading…',
    analyzing: 'Analyzing…',
    saving: 'Saving…',
    error: 'Something went wrong. Please try again.',
  },

  // Risk levels
  risk: {
    high: 'High Risk',
    medium: 'Medium Risk',
    low: 'Low Risk',
    info: 'Info',
  },

  // Escalation
  escalation: {
    consultBeforeSigning: 'Please do not sign or agree to anything before consulting a qualified attorney in your jurisdiction.',
    reasonNotice: 'Legal notices often require formal, timely responses.',
    reasonSensitive: 'This document touches on highly sensitive areas: {signals}.',
    reasonDeadline: 'There is a deadline within the next 14 days.',
    reasonHighRisk: 'Significant risks were detected.',
    urgent: 'Urgent: Legal Professional Recommended',
    recommended: 'Strongly Consider a Lawyer',
    optional: 'Consider Professional Advice',
    action: 'Recommended Action:',
    doNotSign: 'Please do not sign or agree to anything before consulting',
    usePrepareBrief: 'You can use our "Prepare Brief" tool to help your lawyer get up to speed quickly.',
  },

  common: {
    back: 'Back',
    cancel: 'Cancel',
    untitled: 'Untitled document',
  },

  input: {
    methodLabel: 'Input method',
    tabUpload: 'Upload file',
    tabPaste: 'Paste text',
    dropZoneLabel: 'Drop zone: click or drag a file here',
    clickToUpload: 'Click to upload',
    orDragDrop: 'or drag & drop',
    fileHint: 'PDF, DOCX, or TXT · Max 20 MB',
    fileInputLabel: 'File input',
    removeFile: 'Remove selected file',
    trySample: 'Or try a sample',
    sampleLease: 'Lease Agreement',
    sampleOffer: 'Offer Letter',
    sampleTos: 'Terms of Service',
    pastePlaceholder: 'Paste the text of your legal document here…',
    documentTextLabel: 'Document text',
    extracting: 'Reading file…',
    processing: 'Processing…',
    submit: 'Analyse document →',
    errorSample: 'Could not load sample document.',
    errorType: 'Unsupported file type. Please use PDF, DOCX, or plain text.',
    errorSize: 'File is too large. Maximum size is 20 MB.',
    errorNoText: 'Please paste some text.',
    errorNoFile: 'Please select a file.',
    errorEmptyFile: 'This file is empty.',
    errorExtract: 'Could not read this file. Try pasting the text instead.',
    errorScanned: 'No selectable text found. The file may be a scanned image — try pasting the text instead.',
    errorParse: 'Could not parse this document.',
  },

  who: {
    user: 'you',
    other_party: 'other party',
    both: 'both parties',
  },

  summary: {
    parties: 'Parties',
    term: 'Term',
    financials: 'Financials',
  },

  docTypes: {
    lease: 'LEASE AGREEMENT',
    employment: 'EMPLOYMENT CONTRACT',
    nda: 'NON-DISCLOSURE AGREEMENT',
    service_agreement: 'SERVICE AGREEMENT',
    terms_of_service: 'TERMS OF SERVICE',
    privacy_policy: 'PRIVACY POLICY',
    loan: 'LOAN AGREEMENT',
    legal_notice: 'LEGAL NOTICE',
    policy: 'COMPANY POLICY',
    other_legal: 'LEGAL DOCUMENT',
    not_legal: 'NOT A LEGAL DOCUMENT',
    lowConfidence: '(low confidence)',
    changeType: 'Click to change document type',
  },
};
