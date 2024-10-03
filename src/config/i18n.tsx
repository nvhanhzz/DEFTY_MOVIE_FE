import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import các file JSON chứa chuỗi dịch
import en from '../locales/en.json';
import vi from '../locales/vi.json';

// Cấu hình i18next
i18n
    .use(LanguageDetector) // Tự động phát hiện ngôn ngữ người dùng
    .use(initReactI18next) // Tích hợp với React
    .init({
        resources: {
            en: { translation: en },
            vi: { translation: vi },
        },
        fallbackLng: 'en', // Sử dụng tiếng Anh nếu không phát hiện được ngôn ngữ phù hợp
        supportedLngs: ['en', 'vi'], // Các ngôn ngữ được hỗ trợ trong ứng dụng
        debug: false, // Bật debug để theo dõi quá trình xử lý ngôn ngữ trong quá trình phát triển
        interpolation: {
            escapeValue: false, // Không cần escape cho các chuỗi trong React
        },
    });

export default i18n;