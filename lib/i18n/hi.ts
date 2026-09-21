import type { Translations } from './en';

// Hindi translations (हिंदी)
export const hi = {
  nav: {
    desk: 'डेस्क',
    compare: 'तुलना करें',
    settings: 'सेटिंग्स',
    about: 'जानकारी',
  },
  disclaimer: 'दस्तावेज़ समझने में मदद के लिए कानूनी जानकारी — कानूनी सलाह नहीं। गंभीर निर्णयों के लिए किसी योग्य वकील से मिलें।',
  skipToContent: 'सामग्री पर जाएं',

  onboarding: {
    title: 'Lawesy में आपका स्वागत है',
    subtitle: 'हमें आपका अनुभव बेहतर बनाने में मदद करें। (आप इसे कभी भी बदल सकते हैं)',
    roleLabel: 'आपकी भूमिका',
    rolePlaceholder: 'भूमिका चुनें',
    goalLabel: 'आपका उद्देश्य',
    goalPlaceholder: 'उद्देश्य चुनें',
    expertiseLabel: 'कानूनी अनुभव',
    expertisePlaceholder: 'अनुभव चुनें',
    countryLabel: 'देश',
    countryPlaceholder: 'जैसे IN, US, UK',
    regionLabel: 'राज्य / क्षेत्र',
    regionPlaceholder: 'वैकल्पिक',
    languageLabel: 'AI आउटपुट के लिए भाषा',
    redactLabel: 'व्यक्तिगत जानकारी छुपाएं',
    redactDescription: 'विश्लेषण से पहले नाम, ईमेल और फोन नंबर छुपाएं।',
    saveButton: 'सहेजें और जारी रखें',
    skipButton: 'अभी छोड़ें',
  },

  roles: {
    tenant: 'किरायेदार',
    landlord: 'मकान मालिक',
    employee: 'कर्मचारी / नौकरी तलाशने वाला',
    employer: 'नियोक्ता',
    freelancer: 'फ्रीलांसर',
    small_business: 'छोटा व्यवसाय',
    consumer: 'उपभोक्ता',
    notice_recipient: 'नोटिस प्राप्तकर्ता',
    other: 'अन्य',
  },

  goals: {
    understand: 'बस समझना है कि इसका क्या मतलब है',
    decide_to_sign: 'तय करना है कि हस्ताक्षर करूं या नहीं',
    negotiate: 'बातचीत की तैयारी',
    resolve_dispute: 'विवाद सुलझाना',
    respond_to_notice: 'कानूनी नोटिस का जवाब देना',
    compare_options: 'विकल्पों की तुलना करना',
  },

  expertise: {
    new: 'नया हूं (सब समझाएं)',
    some: 'थोड़ी जानकारी है',
    comfortable: 'कानूनी भाषा से परिचित हूं',
  },

  languages: {
    en: 'English',
    hi: 'हिंदी',
    ta: 'தமிழ்',
  },

  desk: {
    heroTitle: 'अपने कानूनी दस्तावेज़ समझें।',
    heroSubtitle: 'Lawesy जटिल अनुबंधों को सरल भाषा में बदलता है, छिपे जोखिमों को उजागर करता है, और आपकी भूमिका के आधार पर बताता है कि क्या ध्यान रखना है।',
    privacyNote: 'निजी और सुरक्षित — जब तक आप विश्लेषण नहीं चुनते, सब कुछ आपके ब्राउज़र में रहता है।',
    step1Title: 'डेस्क पर रखें',
    step1Body: 'PDF, Word दस्तावेज़ अपलोड करें या सीधे टेक्स्ट पेस्ट करें। हम इसे लेबल किए गए खंडों में बाँटते हैं।',
    step2Title: 'AI अनुवाद करता है',
    step2Body: 'कठिन शब्दों की जगह सरल भाषा। हर अनुभाग के लिए स्पष्ट सारांश।',
    step3Title: 'जोखिम पहचानें',
    step3Body: 'आपकी भूमिका और क्षेत्र के अनुसार अनुचित दायित्वों और अनुपलब्ध सुरक्षाओं की पहचान।',
    parsing: 'दस्तावेज़ पार्स हो रहा है और खंड पहचाने जा रहे हैं…',
  },

  workspace: {
    tabOriginal: 'मूल पाठ',
    tabPlain: 'सरल भाषा',
    tabClauses: 'मुख्य खंड और जोखिम',
    tabAsk: 'पूछें',
    tabNextSteps: 'अगले कदम',
    compareButton: 'तुलना करें',
    noDocuments: 'अभी कोई दस्तावेज़ नहीं',
  },

  plain: {
    original: 'मूल',
    simplifyButton: 'इस अनुभाग को सरल बनाएं →',
    simplifying: 'सरल बनाया जा रहा है…',
    failed: 'यह अनुभाग सरल नहीं किया जा सका।',
  },

  clauses: {
    worthSecondLook: 'ध्यान से देखें',
    missingProtections: 'अनुपलब्ध सुरक्षाएं',
    contradictoryTerms: 'विरोधाभासी शर्तें',
    obligations: 'दायित्व',
    sourceText: 'स्रोत पाठ',
    noClauses: 'इस दस्तावेज़ के लिए कोई विशेष खंड उजागर नहीं किया गया।',
  },

  ask: {
    header: 'इस दस्तावेज़ के बारे में पूछें',
    placeholder: 'जैसे: क्या मैं उप-किरायेदारी कर सकता हूं?',
    emptyState: 'अपने दस्तावेज़ के बारे में प्रश्न पूछें।\nउत्तर पाठ पर आधारित होंगे।',
  },

  act: {
    heading: 'कार्य योजना',
    lawyerBriefButton: 'वकील ब्रीफ',
    exportButton: 'निर्यात करें',
    yourObligations: 'आपके दायित्व',
    deadlines: 'समय-सीमाएं',
    noObligations: 'आपके लिए कोई विशेष दायित्व या समय-सीमा नहीं मिली।',
    addToCalendar: 'कैलेंडर में जोड़ें',
    noDate: 'कोई स्पष्ट तारीख नहीं',
    timeline: 'समयरेखा',
  },

  compare: {
    title: 'दस्तावेज़ों की तुलना करें',
    subtitle: 'अपनी लाइब्रेरी से दो दस्तावेज़ चुनें और उन्हें साथ-साथ देखें।',
    library: 'आपकी लाइब्रेरी',
    instructions: 'पहले डेस्क से एक दस्तावेज़ खोलें, फिर दस्तावेज़ शीर्षक में तुलना पर क्लिक करें।',
    noDocuments: 'आपकी लाइब्रेरी में अभी कोई दस्तावेज़ नहीं है।',
    uploadCta: 'डेस्क पर अपलोड करें',
    openButton: 'खोलें',
    analyzing: 'कानूनी प्रभाव का विश्लेषण हो रहा है…',
    originalDoc: 'मूल',
    newDoc: 'नया',
    favorsUser: 'आपके पक्ष में',
    favorsOther: 'दूसरे पक्ष के लिए',
    neutral: 'तटस्थ',
    favors: 'पक्ष में',
    impact: 'प्रभाव',
    addedClause: '(नए संस्करण में जोड़ा गया)',
    removedClause: '(हटाया गया)',
  },

  brief: {
    backButton: 'डेस्क पर वापस',
    printButton: 'प्रिंट करें',
    title: 'कानूनी समीक्षा मेमो',
    toLabel: 'प्रति',
    fromLabel: 'प्रेषक',
    dateLabel: 'तारीख',
    subjectLabel: 'विषय',
    reviewOf: 'समीक्षा',
    toValue: 'समीक्षा वकील',
    fromValue: 'Lawesy स्वचालित समीक्षा',
    section1: '1. कार्यकारी सारांश',
    section2: '2. महत्वपूर्ण जोखिम',
    section3: '3. मसौदे की कमियां',
    section4: '4. मुवक्किल के दायित्व',
    urgentFlag: 'जरूरी',
    noHighRisk: 'कोई उच्च जोखिम खंड नहीं मिला।',
    missingProtections: 'अनुपलब्ध मानक सुरक्षाएं',
    contradictions: 'आंतरिक विरोधाभास',
  },

  about: {
    title: 'Lawesy के बारे में',
    intro: 'Lawesy एक AI कानूनी सहायक है जो जटिल अनुबंधों को सरल भाषा में बदलता है, छिपे जोखिमों को उजागर करता है। यह कोई कानूनी फर्म नहीं है।',
    disclaimer: 'कानूनी अस्वीकरण:',
    disclaimerBody: 'Lawesy AI-निर्मित जानकारी प्रदान करता है। यह कानूनी सलाह नहीं है। किसी भी महत्वपूर्ण दस्तावेज़ पर हस्ताक्षर करने से पहले योग्य वकील से मिलें।',
  },

  settings: {
    title: 'सेटिंग्स',
    profileSection: 'आपकी प्रोफ़ाइल',
    appearanceSection: 'दिखावट',
    languageSection: 'भाषा',
    privacySection: 'गोपनीयता',
    themeLabel: 'थीम',
    themeLight: 'डे डेस्क (लाइट)',
    themeDark: 'लैम्पलिट स्टडी (डार्क)',
    themeSystem: 'सिस्टम',
    textSizeLabel: 'पाठ आकार',
    reducedMotionLabel: 'गति कम करें',
    clearDataLabel: 'सभी डेटा हटाएं',
    clearDataDescription: 'आपके ब्राउज़र से सभी दस्तावेज़ और सेटिंग्स स्थायी रूप से हटा देता है।',
    clearDataButton: 'सभी डेटा हटाएं',
    saveButton: 'सेटिंग्स सहेजें',
  },

  library: {
    heading: 'आपकी लाइब्रेरी',
    noDocuments: 'अभी कोई दस्तावेज़ नहीं',
    deleteConfirm: 'यह दस्तावेज़ हटाएं?',
  },

  status: {
    loading: 'लोड हो रहा है…',
    analyzing: 'विश्लेषण हो रहा है…',
    saving: 'सहेजा जा रहा है…',
    error: 'कुछ गलत हुआ। कृपया पुनः प्रयास करें।',
  },

  risk: {
    high: 'उच्च जोखिम',
    medium: 'मध्यम जोखिम',
    low: 'कम जोखिम',
    info: 'जानकारी',
  },

  escalation: {
    urgent: 'जरूरी: कानूनी पेशेवर की सिफारिश',
    recommended: 'वकील से मिलने पर विचार करें',
    optional: 'पेशेवर सलाह पर विचार करें',
    action: 'अनुशंसित कार्रवाई:',
    doNotSign: 'कृपया किसी से परामर्श किए बिना कुछ भी हस्ताक्षर या सहमत न करें',
    usePrepareBrief: 'हमारे "ब्रीफ तैयार करें" टूल से अपने वकील को जल्दी जानकारी दें।',
  },
};
