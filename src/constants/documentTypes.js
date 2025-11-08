// Document Types - Comprehensive - NO optional chaining
export const DOCUMENT_TYPES = {
    PASSPORT: 'passport',
    VISA: 'visa',
    MEDICAL_REPORT: 'medical_report',
    PRESCRIPTION: 'prescription',
    LAB_REPORT: 'lab_report',
    INSURANCE_CARD: 'insurance_card',
    INSURANCE_POLICY: 'insurance_policy',
    ID_PROOF: 'id_proof',
    PHOTO: 'photo',
    VACCINATION_CERTIFICATE: 'vaccination_certificate',
    DISCHARGE_SUMMARY: 'discharge_summary',
    INVOICE: 'invoice',
    RECEIPT: 'receipt',
    CONSENT_FORM: 'consent_form',
    OTHER: 'other',
};

export const DOCUMENT_TYPE_LABELS = {
    passport: 'Passport',
    visa: 'Visa',
    medical_report: 'Medical Report',
    prescription: 'Prescription',
    lab_report: 'Lab Report',
    insurance_card: 'Insurance Card',
    insurance_policy: 'Insurance Policy Document',
    id_proof: 'ID Proof',
    photo: 'Photograph',
    vaccination_certificate: 'Vaccination Certificate',
    discharge_summary: 'Discharge Summary',
    invoice: 'Invoice',
    receipt: 'Payment Receipt',
    consent_form: 'Consent Form',
    other: 'Other Document',
};

export const REQUIRED_DOCUMENTS = [
    'passport',
    'id_proof',
    'medical_report',
];

export const DOCUMENT_MAX_SIZE_MB = {
    passport: 5,
    visa: 5,
    medical_report: 10,
    prescription: 5,
    lab_report: 10,
    insurance_card: 5,
    insurance_policy: 10,
    id_proof: 5,
    photo: 2,
    vaccination_certificate: 5,
    discharge_summary: 10,
    invoice: 5,
    receipt: 5,
    consent_form: 10,
    other: 10,
};

export const ALLOWED_FILE_TYPES = {
    passport: ['image/jpeg', 'image/png', 'application/pdf'],
    medical_report: ['application/pdf', 'image/jpeg', 'image/png'],
    lab_report: ['application/pdf', 'image/jpeg', 'image/png'],
    photo: ['image/jpeg', 'image/png'],
    default: ['application/pdf', 'image/jpeg', 'image/png'],
};

// Helper functions
export const isValidDocumentType = (type) => {
    return Object.values(DOCUMENT_TYPES).includes(type);
};

export const getDocumentLabel = (type) => {
    return DOCUMENT_TYPE_LABELS[type] || type;
};

export const isRequiredDocument = (type) => {
    return REQUIRED_DOCUMENTS.includes(type);
};

export const getMaxFileSize = (type) => {
    return DOCUMENT_MAX_SIZE_MB[type] || 10;
};

export const getAllowedFileTypes = (type) => {
    return ALLOWED_FILE_TYPES[type] || ALLOWED_FILE_TYPES.default;
};