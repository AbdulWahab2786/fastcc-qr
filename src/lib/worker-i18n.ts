export type WorkerLang = "en" | "hi" | "te" | "mr" | "ta";

export interface WorkerLangMeta {
  code: WorkerLang;
  label: string;
  shortLabel: string;
  legacyKey: string;
}

export const WORKER_LANGS: readonly WorkerLangMeta[] = [
  { code: "en", label: "English", shortLabel: "EN", legacyKey: "English" },
  { code: "hi", label: "हिन्दी", shortLabel: "हिन्दी", legacyKey: "Hindi" },
  { code: "te", label: "తెలుగు", shortLabel: "తెలుగు", legacyKey: "Telugu" },
  { code: "mr", label: "मराठी", shortLabel: "मराठी", legacyKey: "Marathi" },
  { code: "ta", label: "தமிழ்", shortLabel: "தமிழ்", legacyKey: "Tamil" },
] as const;

export function isWorkerLang(value: unknown): value is WorkerLang {
  return (
    value === "en" ||
    value === "hi" ||
    value === "te" ||
    value === "mr" ||
    value === "ta"
  );
}

export interface WorkerStrings {
  // Status badges
  statusOkBadge: string;
  statusMaintenanceBadge: string;
  statusFaultyBadge: string;
  lastInspected: string;
  justNow: string;

  // Schedule pills
  dailyCheck: string;
  weeklyCheck: string;
  monthlyCheck: string;
  inspectionOverdue: string;

  // Header & types
  videoSop: string;
  sopAndChecklist: string;
  digitalForm: string;
  operationalLink: string;
  shopFloorReference: string;
  translatingSop: string;

  // SOP & Checklist
  sopInstructions: string;
  noSopSteps: string;
  criticalStep: string;
  checklist: string;
  checkedCountSuffix: string;
  required: string;

  // Paper form
  inspectionFields: string;
  passLabel: string;
  failLabel: string;
  enterObservation: string;
  tapToCapturePhoto: string;
  capturedPrefix: string;

  // URL / File
  verifiedOperationalDest: string;
  openLink: string;
  documentInstructions: string;
  openFile: string;

  // Inspection form
  submitInspection: string;
  zeroLoginSignoff: string;
  workerName: string;
  workerNamePlaceholder: string;
  equipmentStatus: string;
  ok: string;
  needsMaintenance: string;
  faulty: string;
  photoProof: string;
  liveCameraProofBadge: string;
  takePhotoProof: string;
  stampingTimeGps: string;
  photoAttachedPrefix: string;
  notesObservations: string;
  notesPlaceholder: string;
  workerDigitalSignature: string;
  signedBadge: string;
  clear: string;
  signHereHint: string;
  submitting: string;

  // Validation errors
  errWorkerNameRequired: string;
  errChecklistRequired: string;
  errFieldRequiredPrefix: string;

  // Confirmation & WhatsApp
  loggedSuccessfully: string;
  inspectionRecordedFor: string;
  statusLabel: string;
  timestampLabel: string;
  workerSignatureLabel: string;
  faultReportedTitle: string;
  maintenanceNeededTitle: string;
  sendWhatsappAlert: string;
  submitAnotherLog: string;
}

const DICTIONARY: Record<WorkerLang, WorkerStrings> = {
  en: {
    statusOkBadge: "OPERATIONAL (OK)",
    statusMaintenanceBadge: "NEEDS MAINTENANCE",
    statusFaultyBadge: "FAULTY — DO NOT USE",
    lastInspected: "Last inspected",
    justNow: "Just now",

    dailyCheck: "Daily Check",
    weeklyCheck: "Weekly Check",
    monthlyCheck: "Monthly Check",
    inspectionOverdue: "Inspection Overdue",

    videoSop: "Video SOP",
    sopAndChecklist: "SOP & Checklist",
    digitalForm: "Digital Form",
    operationalLink: "Operational Link",
    shopFloorReference: "Shop-Floor Reference",
    translatingSop: "Translating SOP...",

    sopInstructions: "SOP Instructions",
    noSopSteps:
      "No SOP steps attached yet. Complete the QC checklist below to log your inspection.",
    criticalStep: "Critical Safety / Quality Step",
    checklist: "Checklist",
    checkedCountSuffix: "checked",
    required: "Required",

    inspectionFields: "Inspection Fields",
    passLabel: "PASS",
    failLabel: "FAIL",
    enterObservation: "Enter observation...",
    tapToCapturePhoto: "Tap to Capture Photo",
    capturedPrefix: "Captured:",

    verifiedOperationalDest: "Verified Operational Destination",
    openLink: "Open Link",
    documentInstructions: "Document / Instructions",
    openFile: "Open File",

    submitInspection: "Submit Inspection",
    zeroLoginSignoff: "Zero-login sign-off — timestamped automatically.",
    workerName: "Worker Name",
    workerNamePlaceholder: "e.g. Rajesh Kumar",
    equipmentStatus: "Equipment Status",
    ok: "OK",
    needsMaintenance: "Needs Maintenance",
    faulty: "Faulty",
    photoProof: "Photo Proof",
    liveCameraProofBadge: "Live Camera Proof • Auto-stamped with Time & GPS",
    takePhotoProof: "Take Photo Proof",
    stampingTimeGps: "Stamping Time & GPS...",
    photoAttachedPrefix: "Photo attached:",
    notesObservations: "Notes / Observations",
    notesPlaceholder: "Any defect or shift note...",
    workerDigitalSignature: "Worker Digital Signature",
    signedBadge: "Signed",
    clear: "Clear",
    signHereHint: "Sign here with finger or mouse",
    submitting: "Submitting...",

    errWorkerNameRequired: "Please enter your name before submitting the log.",
    errChecklistRequired:
      "Please complete all required QC checklist items before submitting.",
    errFieldRequiredPrefix: "Please complete required field:",

    loggedSuccessfully: "Logged Successfully",
    inspectionRecordedFor: "Inspection recorded for",
    statusLabel: "Status",
    timestampLabel: "Timestamp",
    workerSignatureLabel: "Worker Signature",
    faultReportedTitle: "Fault Reported — Alert Manager Now",
    maintenanceNeededTitle: "Maintenance Needed — Notify Manager",
    sendWhatsappAlert: "Send Instant Alert on WhatsApp",
    submitAnotherLog: "Submit Another Log",
  },
  hi: {
    statusOkBadge: "चालू हालत (OK)",
    statusMaintenanceBadge: "सर्विस / मरम्मत ज़रूरी",
    statusFaultyBadge: "खराब — इस्तेमाल न करें",
    lastInspected: "पिछली जाँच",
    justNow: "अभी",

    dailyCheck: "रोज़ाना जाँच",
    weeklyCheck: "साप्ताहिक जाँच",
    monthlyCheck: "मासिक जाँच",
    inspectionOverdue: "जाँच बाकी है",

    videoSop: "वीडियो SOP",
    sopAndChecklist: "SOP और चेकलिस्ट",
    digitalForm: "डिजिटल फ़ॉर्म",
    operationalLink: "ऑपरेशनल लिंक",
    shopFloorReference: "शॉप-फ़्लोर गाइड",
    translatingSop: "SOP अनुवाद हो रहा है...",

    sopInstructions: "SOP निर्देश",
    noSopSteps:
      "अभी कोई SOP चरण नहीं जुड़े हैं। लॉग जमा करने के लिए नीचे दी गई चेकलिस्ट पूरी करें।",
    criticalStep: "जरूरी सुरक्षा / क्वालिटी चरण",
    checklist: "चेकलिस्ट",
    checkedCountSuffix: "पूरे हुए",
    required: "ज़रूरी",

    inspectionFields: "जाँच के बिंदु",
    passLabel: "सही (PASS)",
    failLabel: "खराब (FAIL)",
    enterObservation: "अपना विवरण लिखें...",
    tapToCapturePhoto: "फ़ोटो खींचने के लिए दबाएं",
    capturedPrefix: "फ़ोटो ली गई:",

    verifiedOperationalDest: "सत्यापित कार्य लिंक",
    openLink: "लिंक खोलें",
    documentInstructions: "दस्तावेज़ / निर्देश",
    openFile: "फ़ाइल खोलें",

    submitInspection: "जाँच जमा करें",
    zeroLoginSignoff: "बिना लॉगिन के — समय अपने आप दर्ज होगा।",
    workerName: "कर्मचारी का नाम",
    workerNamePlaceholder: "जैसे राजेश कुमार",
    equipmentStatus: "मशीन की स्थिति",
    ok: "सही (OK)",
    needsMaintenance: "मरम्मत ज़रूरी",
    faulty: "खराब",
    photoProof: "फ़ोटो सबूत",
    liveCameraProofBadge: "लाइव कैमरा प्रूफ़ • समय और GPS ऑटो-स्टैम्प",
    takePhotoProof: "फ़ोटो खींचें",
    stampingTimeGps: "समय और GPS लग रहा है...",
    photoAttachedPrefix: "फ़ोटो जुड़ी:",
    notesObservations: "नोट्स / टिप्पणी",
    notesPlaceholder: "कोई खराबी या शिफ्ट की बात लिखें...",
    workerDigitalSignature: "कर्मचारी के डिजिटल हस्ताक्षर",
    signedBadge: "हस्ताक्षर हो गए",
    clear: "साफ़ करें",
    signHereHint: "यहाँ उंगली या माउस से साइन करें",
    submitting: "जमा हो रहा है...",

    errWorkerNameRequired: "कृपया लॉग जमा करने से पहले अपना नाम लिखें।",
    errChecklistRequired:
      "कृपया जमा करने से पहले सभी ज़रूरी चेकलिस्ट आइटम पूरे करें।",
    errFieldRequiredPrefix: "कृपया यह ज़रूरी फ़ील्ड भरें:",

    loggedSuccessfully: "सफलतापूर्वक दर्ज हुआ",
    inspectionRecordedFor: "इनके लिए जाँच दर्ज की गई:",
    statusLabel: "स्थिति",
    timestampLabel: "समय",
    workerSignatureLabel: "कर्मचारी के हस्ताक्षर",
    faultReportedTitle: "खराबी दर्ज — अभी मैनेजर को सूचना दें",
    maintenanceNeededTitle: "मरम्मत ज़रूरी — मैनेजर को बताएं",
    sendWhatsappAlert: "WhatsApp पर तुरंत अलर्ट भेजें",
    submitAnotherLog: "एक और जाँच दर्ज करें",
  },
  te: {
    statusOkBadge: "పనిచేస్తోంది (OK)",
    statusMaintenanceBadge: "మరమ్మత్తు అవసరం",
    statusFaultyBadge: "చెడిపోయింది — వాడవద్దు",
    lastInspected: "చివరి తనిఖీ",
    justNow: "ఇప్పుడే",

    dailyCheck: "రోజువారీ తనిఖీ",
    weeklyCheck: "వారపు తనిఖీ",
    monthlyCheck: "నెలవారీ తనిఖీ",
    inspectionOverdue: "తనిఖీ ఆలస్యమైంది",

    videoSop: "వీడియో SOP",
    sopAndChecklist: "SOP & చెక్‌లిస్ట్",
    digitalForm: "డిజిటల్ ఫారం",
    operationalLink: "పని లింక్",
    shopFloorReference: "షాప్-ఫ్లోర్ గైడ్",
    translatingSop: "SOP అనువాదం అవుతోంది...",

    sopInstructions: "SOP సూచనలు",
    noSopSteps:
      "ఇంకా SOP దశలు లేవు. తనిఖీ నమోదు చేయడానికి కింది చెక్‌లిస్ట్ పూర్తి చేయండి.",
    criticalStep: "ముఖ్యమైన భద్రత / నాణ్యత దశ",
    checklist: "చెక్‌లిస్ట్",
    checkedCountSuffix: "పూర్తయ్యాయి",
    required: "తప్పనిసరి",

    inspectionFields: "తనిఖీ అంశాలు",
    passLabel: "సరిగ్గా ఉంది (PASS)",
    failLabel: "లోపం (FAIL)",
    enterObservation: "వివరాలు రాయండి...",
    tapToCapturePhoto: "ఫోటో తీయడానికి నొక్కండి",
    capturedPrefix: "ఫోటో తీసింది:",

    verifiedOperationalDest: "ధృవీకరించబడిన పని లింక్",
    openLink: "లింక్ తెరవండి",
    documentInstructions: "పత్రం / సూచనలు",
    openFile: "ఫైల్ తెరవండి",

    submitInspection: "తనిఖీ సమర్పించండి",
    zeroLoginSignoff: "లాగిన్ అవసరం లేదు — సమయం ఆటోమేటిక్‌గా నమోదవుతుంది.",
    workerName: "ఉద్యోగి పేరు",
    workerNamePlaceholder: "ఉదా. రాజేష్ కుమార్",
    equipmentStatus: "యంత్రం స్థితి",
    ok: "బాగుంది (OK)",
    needsMaintenance: "మరమ్మత్తు అవసరం",
    faulty: "చెడిపోయింది",
    photoProof: "ఫోటో రుజువు",
    liveCameraProofBadge: "లైవ్ కెమెరా ప్రూఫ్ • సమయం & GPS ఆటో-స్టాంప్",
    takePhotoProof: "ఫోటో తీయండి",
    stampingTimeGps: "సమయం & GPS జోడిస్తోంది...",
    photoAttachedPrefix: "ఫోటో జతచేయబడింది:",
    notesObservations: "గమనికలు / పరిశీలనలు",
    notesPlaceholder: "ఏదైనా లోపం లేదా షిఫ్ట్ నోట్ రాయండి...",
    workerDigitalSignature: "ఉద్యోగి డిజిటల్ సంతకం",
    signedBadge: "సంతకం అయింది",
    clear: "తొలగించు",
    signHereHint: "ఇక్కడ వేలితో లేదా మౌస్‌తో సంతకం చేయండి",
    submitting: "సమర్పిస్తోంది...",

    errWorkerNameRequired: "దయచేసి సమర్పించే ముందు మీ పేరు రాయండి.",
    errChecklistRequired:
      "దయచేసి సమర్పించే ముందు అన్ని తప్పనిసరి చెక్‌లిస్ట్ అంశాలను పూర్తి చేయండి.",
    errFieldRequiredPrefix: "దయచేసి ఈ తప్పనిసరి ఫీల్డ్ పూర్తి చేయండి:",

    loggedSuccessfully: "విజయవంతంగా నమోదైంది",
    inspectionRecordedFor: "వీరి కోసం తనిఖీ నమోదైంది:",
    statusLabel: "స్థితి",
    timestampLabel: "సమయం",
    workerSignatureLabel: "ఉద్యోగి సంతకం",
    faultReportedTitle: "లోపం నమోదైంది — వెంటనే మేనేజర్‌కు తెలపండి",
    maintenanceNeededTitle: "మరమ్మత్తు అవసరం — మేనేజర్‌కు తెలపండి",
    sendWhatsappAlert: "WhatsApp లో వెంటనే అలర్ట్ పంపండి",
    submitAnotherLog: "మరో తనిఖీ నమోదు చేయండి",
  },
  mr: {
    statusOkBadge: "चालू स्थिती (OK)",
    statusMaintenanceBadge: "दुरुस्ती आवश्यक",
    statusFaultyBadge: "बंद / खराब — वापरू नका",
    lastInspected: "शेवटची तपासणी",
    justNow: "आत्ताच",

    dailyCheck: "दैनिक तपासणी",
    weeklyCheck: "साप्ताहिक तपासणी",
    monthlyCheck: "मासिक तपासणी",
    inspectionOverdue: "तपासणी बाकी आहे",

    videoSop: "व्हिडिओ SOP",
    sopAndChecklist: "SOP आणि चेकलिस्ट",
    digitalForm: "डिजिटल फॉर्म",
    operationalLink: "कामाची लिंक",
    shopFloorReference: "शॉप-फ्लोर माहिती",
    translatingSop: "SOP भाषांतर होत आहे...",

    sopInstructions: "SOP सूचना",
    noSopSteps:
      "अद्याप SOP पायऱ्या जोडलेल्या नाहीत. नोंद करण्यासाठी खालील चेकलिस्ट पूर्ण करा.",
    criticalStep: "महत्त्वाची सुरक्षा / गुणवत्ता पायरी",
    checklist: "चेकलिस्ट",
    checkedCountSuffix: "पूर्ण",
    required: "आवश्यक",

    inspectionFields: "तपासणी मुद्दे",
    passLabel: "योग्य (PASS)",
    failLabel: "दोष (FAIL)",
    enterObservation: "निरीक्षण लिहा...",
    tapToCapturePhoto: "फोटो काढण्यासाठी दाबा",
    capturedPrefix: "फोटो घेतला:",

    verifiedOperationalDest: "पडताळलेली कामाची लिंक",
    openLink: "लिंक उघडा",
    documentInstructions: "दस्तऐवज / सूचना",
    openFile: "फाइल उघडा",

    submitInspection: "तपासणी सबमिट करा",
    zeroLoginSignoff: "लॉगिनशिवाय — वेळ आपोआप नोंदवली जाईल.",
    workerName: "कामगाराचे नाव",
    workerNamePlaceholder: "उदा. राजेश कुमार",
    equipmentStatus: "मशीनची स्थिती",
    ok: "ठीक (OK)",
    needsMaintenance: "दुरुस्ती आवश्यक",
    faulty: "खराब",
    photoProof: "फोटो पुरावा",
    liveCameraProofBadge: "लाइव्ह कॅमेरा पुरावा • वेळ आणि GPS ऑटो-स्टॅम्प",
    takePhotoProof: "फोटो काढा",
    stampingTimeGps: "वेळ आणि GPS जोडत आहे...",
    photoAttachedPrefix: "फोटो जोडला:",
    notesObservations: "नोंदी / निरीक्षणे",
    notesPlaceholder: "काही दोष किंवा शिफ्टची नोंद लिहा...",
    workerDigitalSignature: "कामगाराची डिजिटल सही",
    signedBadge: "सही झाली",
    clear: "पुसा",
    signHereHint: "येथे बोटाने किंवा माउसने सही करा",
    submitting: "सबमिट होत आहे...",

    errWorkerNameRequired: "कृपया सबमिट करण्यापूर्वी तुमचे नाव लिहा.",
    errChecklistRequired:
      "कृपया सबमिट करण्यापूर्वी सर्व आवश्यक चेकलिस्ट पूर्ण करा.",
    errFieldRequiredPrefix: "कृपया हे आवश्यक रकाने भरा:",

    loggedSuccessfully: "यशस्वीरित्या नोंदवले",
    inspectionRecordedFor: "यांच्यासाठी तपासणी नोंदवली:",
    statusLabel: "स्थिती",
    timestampLabel: "वेळ",
    workerSignatureLabel: "कामगाराची सही",
    faultReportedTitle: "दोष आढळला — लगेच मॅनेजरला कळवा",
    maintenanceNeededTitle: "दुरुस्ती आवश्यक — मॅनेजरला कळवा",
    sendWhatsappAlert: "WhatsApp वर तात्काळ अलर्ट पाठवा",
    submitAnotherLog: "दुसरी तपासणी नोंदवा",
  },
  ta: {
    statusOkBadge: "இயங்கும் நிலை (OK)",
    statusMaintenanceBadge: "பராமரிப்பு தேவை",
    statusFaultyBadge: "பழுது — பயன்படுத்த வேண்டாம்",
    lastInspected: "கடைசி ஆய்வு",
    justNow: "இப்போது",

    dailyCheck: "தினசரி ஆய்வு",
    weeklyCheck: "வாராந்திர ஆய்வு",
    monthlyCheck: "மாதாந்திர ஆய்வு",
    inspectionOverdue: "ஆய்வு தாமதமானது",

    videoSop: "வீடியோ SOP",
    sopAndChecklist: "SOP & சரிபார்ப்புப் பட்டியல்",
    digitalForm: "டிஜிட்டல் படிவம்",
    operationalLink: "பணி இணைப்பு",
    shopFloorReference: "பணித்தள வழிகாட்டி",
    translatingSop: "SOP மொழிபெயர்க்கப்படுகிறது...",

    sopInstructions: "SOP வழிமுறைகள்",
    noSopSteps:
      "SOP படிகள் இன்னும் சேர்க்கப்படவில்லை. பதிவு செய்ய கீழே உள்ள சரிபார்ப்புப் பட்டியலை முடிக்கவும்.",
    criticalStep: "முக்கிய பாதுகாப்பு / தரப் படி",
    checklist: "சரிபார்ப்புப் பட்டியல்",
    checkedCountSuffix: "முடிந்தது",
    required: "கட்டாயம்",

    inspectionFields: "ஆய்வு விவரங்கள்",
    passLabel: "சரி (PASS)",
    failLabel: "தவறு (FAIL)",
    enterObservation: "குறிப்பை உள்ளிடவும்...",
    tapToCapturePhoto: "புகைப்படம் எடுக்க அழுத்தவும்",
    capturedPrefix: "எடுக்கப்பட்டது:",

    verifiedOperationalDest: "சரிபார்க்கப்பட்ட பணி இணைப்பு",
    openLink: "இணைப்பைத் திற",
    documentInstructions: "ஆவணம் / வழிமுறைகள்",
    openFile: "கோப்பைத் திற",

    submitInspection: "ஆய்வைச் சமர்ப்பி",
    zeroLoginSignoff: "உள்நுழைவு தேவையில்லை — நேரம் தானாகப் பதிவாகும்.",
    workerName: "பணியாளர் பெயர்",
    workerNamePlaceholder: "எ.கா. ராஜேஷ் குமார்",
    equipmentStatus: "இயந்திர நிலை",
    ok: "நன்று (OK)",
    needsMaintenance: "பராமரிப்பு தேவை",
    faulty: "பழுது",
    photoProof: "புகைப்பட ஆதாரம்",
    liveCameraProofBadge: "நேரடி கேமரா ஆதாரம் • நேரம் & GPS தானியங்கி முத்திரை",
    takePhotoProof: "புகைப்படம் எடு",
    stampingTimeGps: "நேரம் & GPS சேர்க்கப்படுகிறது...",
    photoAttachedPrefix: "புகைப்படம் இணைக்கப்பட்டது:",
    notesObservations: "குறிப்புகள் / அவதானிப்புகள்",
    notesPlaceholder: "ஏதேனும் பழுது அல்லது ஷிப்ட் குறிப்பு...",
    workerDigitalSignature: "பணியாளர் டிஜிட்டல் கையொப்பம்",
    signedBadge: "கையொப்பமிடப்பட்டது",
    clear: "அழி",
    signHereHint: "இங்கே விரல் அல்லது மவுஸ் மூலம் கையொப்பமிடவும்",
    submitting: "சமர்ப்பிக்கிறது...",

    errWorkerNameRequired: "சமர்ப்பிக்கும் முன் உங்கள் பெயரை உள்ளிடவும்.",
    errChecklistRequired:
      "சமர்ப்பிக்கும் முன் அனைத்து கட்டாய சரிபார்ப்புப் பட்டியல் உருப்படிகளையும் முடிக்கவும்.",
    errFieldRequiredPrefix: "இந்தக் கட்டாயப் புலத்தை நிரப்பவும்:",

    loggedSuccessfully: "வெற்றிகரமாகப் பதிவானது",
    inspectionRecordedFor: "இவருக்கான ஆய்வுப் பதிவு:",
    statusLabel: "நிலை",
    timestampLabel: "நேரம்",
    workerSignatureLabel: "பணியாளர் கையொப்பம்",
    faultReportedTitle: "பழுது பதிவானது — மேலாளருக்கு உடனே தெரிவிக்கவும்",
    maintenanceNeededTitle: "பராமரிப்பு தேவை — மேலாளருக்குத் தெரிவிக்கவும்",
    sendWhatsappAlert: "WhatsApp-இல் உடனடி எச்சரிக்கை அனுப்பு",
    submitAnotherLog: "மற்றொரு ஆய்வைப் பதிவு செய்",
  },
};

export function getWorkerStrings(lang: WorkerLang): WorkerStrings {
  return DICTIONARY[lang];
}
