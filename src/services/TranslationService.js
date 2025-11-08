// Translation Service - Multi-language support
// NO optional chaining - Production Ready

class TranslationService {
    constructor() {
        this.translations = {
            en: {
                welcome: 'Welcome',
                login: 'Login',
                signup: 'Sign Up',
                booking: 'Booking',
                appointment: 'Appointment',
                doctor: 'Doctor',
                hospital: 'Hospital',
                treatment: 'Treatment',
                payment: 'Payment',
                profile: 'Profile',
                logout: 'Logout',
                error: 'Error',
                success: 'Success',
                cancel: 'Cancel',
                delete: 'Delete',
                edit: 'Edit',
                save: 'Save',
            },
            es: {
                welcome: 'Bienvenido',
                login: 'Acceso',
                signup: 'Registrarse',
                booking: 'Reserva',
                appointment: 'Cita',
                doctor: 'Médico',
                hospital: 'Hospital',
                treatment: 'Tratamiento',
                payment: 'Pago',
                profile: 'Perfil',
                logout: 'Cerrar sesión',
                error: 'Error',
                success: 'Éxito',
                cancel: 'Cancelar',
                delete: 'Eliminar',
                edit: 'Editar',
                save: 'Guardar',
            },
            hi: {
                welcome: 'स्वागत है',
                login: 'लॉगिन',
                signup: 'साइन अप',
                booking: 'बुकिंग',
                appointment: 'नियुक्ति',
                doctor: 'डॉक्टर',
                hospital: 'अस्पताल',
                treatment: 'इलाज',
                payment: 'भुगतान',
                profile: 'प्रोफाइल',
                logout: 'लॉग आउट',
                error: 'त्रुटि',
                success: 'सफलता',
                cancel: 'रद्द करें',
                delete: 'हटाएं',
                edit: 'संपादित करें',
                save: 'सहेजें',
            },
            ta: {
                welcome: 'வரவேற்கிறோம்',
                login: 'உள்நுழைக',
                signup: 'பதிவு செய்க',
                booking: 'இடஒதுக்கீடு',
                appointment: 'சந்திப்பு',
                doctor: 'டாக்டர்',
                hospital: 'மருத்துவமனை',
                treatment: 'சிகிச்சை',
                payment: 'கொடுப்பனவு',
                profile: 'சுயவிவரம்',
                logout: 'வெளியேறு',
                error: 'பிழை',
                success: 'வெற்றி',
                cancel: 'ரद்দு செய்க',
                delete: 'நீக்கு',
                edit: 'திருத்து',
                save: 'சேமிக்க',
            },
        };

        this.languageCodes = Object.keys(this.translations);
    }

    // ========== GET TRANSLATION ==========
    getTranslation(key, language = 'en') {
        try {
            if (!key || typeof key !== 'string') {
                return '';
            }

            const lang = this.translations[language];

            if (!lang) {
                return this.translations.en[key] || key;
            }

            return lang[key] || this.translations.en[key] || key;
        } catch (error) {
            console.error('Translation error:', error.message);
            return key;
        }
    }

    // ========== TRANSLATE OBJECT ==========
    translateObject(obj, fieldsToTranslate = [], language = 'en') {
        try {
            if (!obj || typeof obj !== 'object') {
                return {};
            }

            const translated = {...obj };

            fieldsToTranslate.forEach(field => {
                if (obj[field] && typeof obj[field] === 'string') {
                    translated[field] = this.getTranslation(obj[field], language);
                }
            });

            return translated;
        } catch (error) {
            return obj;
        }
    }

    // ========== TRANSLATE ARRAY ==========
    translateArray(arr, language = 'en') {
        try {
            if (!Array.isArray(arr)) {
                return [];
            }

            return arr.map(item => {
                if (typeof item === 'string') {
                    return this.getTranslation(item, language);
                }
                return item;
            });
        } catch (error) {
            return arr;
        }
    }

    // ========== GET AVAILABLE LANGUAGES ==========
    getAvailableLanguages() {
        try {
            return {
                success: true,
                data: this.languageCodes.map(code => ({
                    code,
                    name: this.getLanguageName(code),
                })),
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== ADD TRANSLATION ==========
    addTranslation(language, key, value) {
        try {
            if (!language || !key || !value) {
                return { success: false, error: 'Language, key, and value are required' };
            }

            if (!this.translations[language]) {
                this.translations[language] = {};
            }

            this.translations[language][key] = value;

            return { success: true, message: 'Translation added successfully' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== ADD LANGUAGE ==========
    addLanguage(languageCode, languageName) {
        try {
            if (this.translations[languageCode]) {
                return { success: false, error: 'Language already exists' };
            }

            this.translations[languageCode] = {};
            this.languageCodes.push(languageCode);

            return { success: true, message: `Language ${languageName} added` };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== HELPER: GET LANGUAGE NAME ==========
    getLanguageName(code) {
        const languageNames = {
            en: 'English',
            es: 'Spanish',
            hi: 'Hindi',
            ta: 'Tamil',
            te: 'Telugu',
            ml: 'Malayalam',
        };

        return languageNames[code] || 'Unknown';
    }
}

export default new TranslationService();