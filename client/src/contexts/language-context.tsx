import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Language = "en" | "kn" | "hi" | "ta";

type Translations = {
  [key: string]: {
    en: string;
    kn: string;
    hi: string;
    ta: string;
  };
};

export const translations: Translations = {
  // Common
  "app.title": {
    en: "Citizen Grievance Portal",
    kn: "ನಾಗರಿಕ ದೂರು ಪೋರ್ಟಲ್",
    hi: "नागरिक शिकायत पोर्टल",
    ta: "குடிமக்கள் குறை தீர்க்கும் போர்டல்",
  },
  "app.tagline": {
    en: "Submit and Track Your Complaints",
    kn: "ನಿಮ್ಮ ದೂರುಗಳನ್ನು ಸಲ್ಲಿಸಿ ಮತ್ತು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ",
    hi: "अपनी शिकायतें दर्ज करें और ट्रैक करें",
    ta: "உங்கள் புகார்களை சமர்ப்பித்து கண்காணிக்கவும்",
  },
  "nav.home": {
    en: "Home",
    kn: "ಮುಖಪುಟ",
    hi: "होम",
    ta: "முகப்பு",
  },
  "nav.dashboard": {
    en: "Dashboard",
    kn: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    hi: "डैशबोर्ड",
    ta: "டாஷ்போர்டு",
  },
  "nav.track": {
    en: "Track Complaint",
    kn: "ದೂರು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ",
    hi: "शिकायत ट्रैक करें",
    ta: "புகாரை கண்காணிக்க",
  },
  "nav.logout": {
    en: "Logout",
    kn: "ಲಾಗ್ ಔಟ್",
    hi: "लॉग आउट",
    ta: "வெளியேறு",
  },
  "nav.login": {
    en: "Login",
    kn: "ಲಾಗಿನ್",
    hi: "लॉगिन",
    ta: "உள்நுழை",
  },

  // Landing page
  "landing.hero.title": {
    en: "Your Voice Matters",
    kn: "ನಿಮ್ಮ ಧ್ವನಿ ಮುಖ್ಯ",
    hi: "आपकी आवाज़ मायने रखती है",
    ta: "உங்கள் குரல் முக்கியம்",
  },
  "landing.hero.subtitle": {
    en: "Report civic issues and track their resolution in real-time",
    kn: "ನಾಗರಿಕ ಸಮಸ್ಯೆಗಳನ್ನು ವರದಿ ಮಾಡಿ ಮತ್ತು ನೈಜ ಸಮಯದಲ್ಲಿ ಅವುಗಳ ಪರಿಹಾರವನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ",
    hi: "नागरिक मुद्दों की रिपोर्ट करें और वास्तविक समय में उनके समाधान को ट्रैक करें",
    ta: "குடிமை சிக்கல்களை புகாரளித்து நேரடியாக தீர்வைக் கண்காணிக்கவும்",
  },
  "landing.citizen.login": {
    en: "Citizen Login",
    kn: "ನಾಗರಿಕ ಲಾಗಿನ್",
    hi: "नागरिक लॉगिन",
    ta: "குடிமக்கள் உள்நுழைவு",
  },
  "landing.officer.login": {
    en: "Officer Login",
    kn: "ಅಧಿಕಾರಿ ಲಾಗಿನ್",
    hi: "अधिकारी लॉगिन",
    ta: "அதிகாரி உள்நுழைவு",
  },
  "landing.feature.submit": {
    en: "Submit Complaint",
    kn: "ದೂರು ಸಲ್ಲಿಸಿ",
    hi: "शिकायत दर्ज करें",
    ta: "புகார் அளிக்கவும்",
  },
  "landing.feature.submit.desc": {
    en: "Easily report issues related to electricity, water, roads, waste, and more",
    kn: "ವಿದ್ಯುತ್, ನೀರು, ರಸ್ತೆಗಳು, ತ್ಯಾಜ್ಯ ಮತ್ತು ಹೆಚ್ಚಿನವುಗಳಿಗೆ ಸಂಬಂಧಿಸಿದ ಸಮಸ್ಯೆಗಳನ್ನು ಸುಲಭವಾಗಿ ವರದಿ ಮಾಡಿ",
    hi: "बिजली, पानी, सड़कों, कचरे और अन्य से संबंधित मुद्दों की आसानी से रिपोर्ट करें",
    ta: "மின்சாரம், நீர், சாலைகள், கழிவுகள் மற்றும் பல தொடர்பான சிக்கல்களை எளிதாக புகாரளிக்கவும்",
  },
  "landing.feature.track": {
    en: "Track Status",
    kn: "ಸ್ಥಿತಿ ಟ್ರ್ಯಾಕ್ ಮಾಡಿ",
    hi: "स्थिति ट्रैक करें",
    ta: "நிலையைக் கண்காணிக்க",
  },
  "landing.feature.track.desc": {
    en: "Monitor your complaint progress with real-time status updates",
    kn: "ನೈಜ-ಸಮಯ ಸ್ಥಿತಿ ನವೀಕರಣಗಳೊಂದಿಗೆ ನಿಮ್ಮ ದೂರು ಪ್ರಗತಿಯನ್ನು ಮೇಲ್ವಿಚಾರಣೆ ಮಾಡಿ",
    hi: "वास्तविक समय स्थिति अपडेट के साथ अपनी शिकायत की प्रगति पर नजर रखें",
    ta: "நேரடி நிலை புதுப்பிப்புகளுடன் உங்கள் புகார் முன்னேற்றத்தைக் கண்காணிக்கவும்",
  },
  "landing.feature.resolve": {
    en: "Quick Resolution",
    kn: "ತ್ವರಿತ ಪರಿಹಾರ",
    hi: "त्वरित समाधान",
    ta: "விரைவான தீர்வு",
  },
  "landing.feature.resolve.desc": {
    en: "Dedicated officers ensure timely resolution of your complaints",
    kn: "ಮೀಸಲಾದ ಅಧಿಕಾರಿಗಳು ನಿಮ್ಮ ದೂರುಗಳ ಸಮಯೋಚಿತ ಪರಿಹಾರವನ್ನು ಖಚಿತಪಡಿಸುತ್ತಾರೆ",
    hi: "समर्पित अधिकारी आपकी शिकायतों का समय पर समाधान सुनिश्चित करते हैं",
    ta: "அர்ப்பணிப்புள்ள அதிகாரிகள் உங்கள் புகார்களுக்கு சரியான நேரத்தில் தீர்வை உறுதி செய்கிறார்கள்",
  },

  // Auth
  "auth.login": {
    en: "Login",
    kn: "ಲಾಗಿನ್",
    hi: "लॉगिन",
    ta: "உள்நுழை",
  },
  "auth.register": {
    en: "Register",
    kn: "ನೋಂದಣಿ",
    hi: "रजिस्टर",
    ta: "பதிவு செய்யுங்கள்",
  },
  "auth.username": {
    en: "Username",
    kn: "ಬಳಕೆದಾರ ಹೆಸರು",
    hi: "उपयोगकर्ता नाम",
    ta: "பயனர் பெயர்",
  },
  "auth.password": {
    en: "Password",
    kn: "ಪಾಸ್‌ವರ್ಡ್",
    hi: "पासवर्ड",
    ta: "கடவுச்சொல்",
  },
  "auth.name": {
    en: "Full Name",
    kn: "ಪೂರ್ಣ ಹೆಸರು",
    hi: "पूरा नाम",
    ta: "முழு பெயர்",
  },
  "auth.email": {
    en: "Email",
    kn: "ಇಮೇಲ್",
    hi: "ईमेल",
    ta: "மின்னஞ்சல்",
  },
  "auth.phone": {
    en: "Phone Number",
    kn: "ಫೋನ್ ಸಂಖ್ಯೆ",
    hi: "फ़ोन नंबर",
    ta: "தொலைபேசி எண்",
  },
  "auth.address": {
    en: "Address",
    kn: "ವಿಳಾಸ",
    hi: "पता",
    ta: "முகவரி",
  },
  "auth.newUser": {
    en: "New user?",
    kn: "ಹೊಸ ಬಳಕೆದಾರ?",
    hi: "नए उपयोगकर्ता?",
    ta: "புதிய பயனரா?",
  },
  "auth.existingUser": {
    en: "Already registered?",
    kn: "ಈಗಾಗಲೇ ನೋಂದಾಯಿಸಲಾಗಿದೆಯೇ?",
    hi: "पहले से पंजीकृत?",
    ta: "ஏற்கனவே பதிவு செய்துள்ளீர்களா?",
  },
  "auth.citizen.title": {
    en: "Citizen Portal",
    kn: "ನಾಗರಿಕ ಪೋರ್ಟಲ್",
    hi: "नागरिक पोर्टल",
    ta: "குடிமக்கள் போர்டல்",
  },
  "auth.officer.title": {
    en: "Officer Portal",
    kn: "ಅಧಿಕಾರಿ ಪೋರ್ಟಲ್",
    hi: "अधिकारी पोर्टल",
    ta: "அதிகாரி போர்டல்",
  },
  "auth.citizen.desc": {
    en: "Submit complaints and track their status",
    kn: "ದೂರುಗಳನ್ನು ಸಲ್ಲಿಸಿ ಮತ್ತು ಅವುಗಳ ಸ್ಥಿತಿಯನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ",
    hi: "शिकायतें दर्ज करें और उनकी स्थिति ट्रैक करें",
    ta: "புகார்களை சமர்ப்பித்து அவற்றின் நிலையைக் கண்காணிக்கவும்",
  },
  "auth.officer.desc": {
    en: "Manage and resolve citizen complaints",
    kn: "ನಾಗರಿಕ ದೂರುಗಳನ್ನು ನಿರ್ವಹಿಸಿ ಮತ್ತು ಪರಿಹರಿಸಿ",
    hi: "नागरिक शिकायतों का प्रबंधन और समाधान करें",
    ta: "குடிமக்களின் புகார்களை நிர்வகித்து தீர்க்கவும்",
  },

  // Complaints
  "complaint.new": {
    en: "Submit New Complaint",
    kn: "ಹೊಸ ದೂರು ಸಲ್ಲಿಸಿ",
    hi: "नई शिकायत दर्ज करें",
    ta: "புதிய புகார் சமர்ப்பிக்கவும்",
  },
  "complaint.category": {
    en: "Category",
    kn: "ವರ್ಗ",
    hi: "श्रेणी",
    ta: "வகை",
  },
  "complaint.category.electricity": {
    en: "Electricity",
    kn: "ವಿದ್ಯುತ್",
    hi: "बिजली",
    ta: "மின்சாரம்",
  },
  "complaint.category.water": {
    en: "Water",
    kn: "ನೀರು",
    hi: "पानी",
    ta: "நீர்",
  },
  "complaint.category.roads": {
    en: "Roads",
    kn: "ರಸ್ತೆಗಳು",
    hi: "सड़कें",
    ta: "சாலைகள்",
  },
  "complaint.category.waste": {
    en: "Waste Management",
    kn: "ತ್ಯಾಜ್ಯ ನಿರ್ವಹಣೆ",
    hi: "कचरा प्रबंधन",
    ta: "கழிவு மேலாண்மை",
  },
  "complaint.category.other": {
    en: "Other",
    kn: "ಇತರೆ",
    hi: "अन्य",
    ta: "மற்றவை",
  },
  "complaint.location": {
    en: "Location",
    kn: "ಸ್ಥಳ",
    hi: "स्थान",
    ta: "இடம்",
  },
  "complaint.location.placeholder": {
    en: "Enter address or pincode",
    kn: "ವಿಳಾಸ ಅಥವಾ ಪಿನ್‌ಕೋಡ್ ನಮೂದಿಸಿ",
    hi: "पता या पिनकोड दर्ज करें",
    ta: "முகவரி அல்லது அஞ்சல் குறியீட்டை உள்ளிடவும்",
  },
  "complaint.description": {
    en: "Description",
    kn: "ವಿವರಣೆ",
    hi: "विवरण",
    ta: "விளக்கம்",
  },
  "complaint.description.placeholder": {
    en: "Describe your issue in detail...",
    kn: "ನಿಮ್ಮ ಸಮಸ್ಯೆಯನ್ನು ವಿವರವಾಗಿ ವಿವರಿಸಿ...",
    hi: "अपनी समस्या का विस्तार से वर्णन करें...",
    ta: "உங்கள் சிக்கலை விரிவாக விவரிக்கவும்...",
  },
  "complaint.submit": {
    en: "Submit Complaint",
    kn: "ದೂರು ಸಲ್ಲಿಸಿ",
    hi: "शिकायत दर्ज करें",
    ta: "புகார் அளிக்கவும்",
  },
  "complaint.success": {
    en: "Complaint Submitted Successfully",
    kn: "ದೂರು ಯಶಸ್ವಿಯಾಗಿ ಸಲ್ಲಿಸಲಾಗಿದೆ",
    hi: "शिकायत सफलतापूर्वक दर्ज की गई",
    ta: "புகார் வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது",
  },
  "complaint.id": {
    en: "Complaint ID",
    kn: "ದೂರು ಐಡಿ",
    hi: "शिकायत आईडी",
    ta: "புகார் ஐடி",
  },

  // Status
  "status.submitted": {
    en: "Submitted",
    kn: "ಸಲ್ಲಿಸಲಾಗಿದೆ",
    hi: "दर्ज किया गया",
    ta: "சமர்ப்பிக்கப்பட்டது",
  },
  "status.in_progress": {
    en: "In Progress",
    kn: "ಪ್ರಗತಿಯಲ್ಲಿದೆ",
    hi: "प्रगति में",
    ta: "செயலில் உள்ளது",
  },
  "status.resolved": {
    en: "Resolved",
    kn: "ಪರಿಹರಿಸಲಾಗಿದೆ",
    hi: "हल किया गया",
    ta: "தீர்க்கப்பட்டது",
  },

  // Track
  "track.title": {
    en: "Track Your Complaint",
    kn: "ನಿಮ್ಮ ದೂರನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ",
    hi: "अपनी शिकायत ट्रैक करें",
    ta: "உங்கள் புகாரைக் கண்காணிக்கவும்",
  },
  "track.input.placeholder": {
    en: "Enter Complaint ID (e.g., GRP-2024-001)",
    kn: "ದೂರು ಐಡಿ ನಮೂದಿಸಿ (ಉದಾ., GRP-2024-001)",
    hi: "शिकायत आईडी दर्ज करें (उदा., GRP-2024-001)",
    ta: "புகார் ஐடியை உள்ளிடவும் (எ.கா., GRP-2024-001)",
  },
  "track.search": {
    en: "Search",
    kn: "ಹುಡುಕಿ",
    hi: "खोजें",
    ta: "தேடு",
  },
  "track.notFound": {
    en: "Complaint not found",
    kn: "ದೂರು ಕಂಡುಬಂದಿಲ್ಲ",
    hi: "शिकायत नहीं मिली",
    ta: "புகார் கிடைக்கவில்லை",
  },

  // Officer Dashboard
  "officer.dashboard": {
    en: "Officer Dashboard",
    kn: "ಅಧಿಕಾರಿ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    hi: "अधिकारी डैशबोर्ड",
    ta: "அதிகாரி டாஷ்போர்டு",
  },
  "officer.total": {
    en: "Total Complaints",
    kn: "ಒಟ್ಟು ದೂರುಗಳು",
    hi: "कुल शिकायतें",
    ta: "மொத்த புகார்கள்",
  },
  "officer.pending": {
    en: "Pending",
    kn: "ಬಾಕಿ",
    hi: "लंबित",
    ta: "நிலுவையில்",
  },
  "officer.inProgress": {
    en: "In Progress",
    kn: "ಪ್ರಗತಿಯಲ್ಲಿದೆ",
    hi: "प्रगति में",
    ta: "செயலில்",
  },
  "officer.resolved": {
    en: "Resolved",
    kn: "ಪರಿಹರಿಸಲಾಗಿದೆ",
    hi: "हल",
    ta: "தீர்க்கப்பட்டது",
  },
  "officer.addNote": {
    en: "Add Note",
    kn: "ಟಿಪ್ಪಣಿ ಸೇರಿಸಿ",
    hi: "नोट जोड़ें",
    ta: "குறிப்பு சேர்க்க",
  },
  "officer.updateStatus": {
    en: "Update Status",
    kn: "ಸ್ಥಿತಿ ನವೀಕರಿಸಿ",
    hi: "स्थिति अपडेट करें",
    ta: "நிலையை புதுப்பிக்கவும்",
  },

  // General
  "general.loading": {
    en: "Loading...",
    kn: "ಲೋಡ್ ಆಗುತ್ತಿದೆ...",
    hi: "लोड हो रहा है...",
    ta: "ஏற்றுகிறது...",
  },
  "general.error": {
    en: "An error occurred",
    kn: "ದೋಷ ಸಂಭವಿಸಿದೆ",
    hi: "एक त्रुटि हुई",
    ta: "பிழை ஏற்பட்டது",
  },
  "general.noComplaints": {
    en: "No complaints found",
    kn: "ಯಾವುದೇ ದೂರುಗಳು ಕಂಡುಬಂದಿಲ್ಲ",
    hi: "कोई शिकायत नहीं मिली",
    ta: "புகார்கள் எதுவும் கிடைக்கவில்லை",
  },
  "general.myComplaints": {
    en: "My Complaints",
    kn: "ನನ್ನ ದೂರುಗಳು",
    hi: "मेरी शिकायतें",
    ta: "என் புகார்கள்",
  },
};

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("grievance-portal-language");
    return (saved as Language) || "en";
  });

  useEffect(() => {
    localStorage.setItem("grievance-portal-language", language);
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    const translation = translations[key];
    if (!translation) return key;
    return translation[language] || translation.en || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

export const languageOptions = [
  { value: "en", label: "English" },
  { value: "kn", label: "ಕನ್ನಡ" },
  { value: "hi", label: "हिंदी" },
  { value: "ta", label: "தமிழ்" },
];
