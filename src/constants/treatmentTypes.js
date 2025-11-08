// Treatment Types - Comprehensive - NO optional chaining
export const TREATMENT_TYPES = {
    KIDNEY: 'kidney',
    HEART: 'heart',
    LIVER: 'liver',
    LUNG: 'lung',
    PANCREAS: 'pancreas',
    BONE_MARROW: 'bone_marrow',
    ORTHOPEDIC: 'orthopedic',
    NEUROLOGY: 'neurology',
    ONCOLOGY: 'oncology',
    CARDIOLOGY: 'cardiology',
    COSMETIC: 'cosmetic',
    DENTAL: 'dental',
    EYE: 'eye',
    IVF: 'ivf',
    BARIATRIC: 'bariatric',
    SPINE: 'spine',
    ENT: 'ent',
    UROLOGY: 'urology',
    GYNECOLOGY: 'gynecology',
    GASTROENTEROLOGY: 'gastroenterology',
};

export const TREATMENT_CATEGORIES = {
    ORGAN_TRANSPLANT: 'organ_transplant',
    SURGERY: 'surgery',
    THERAPY: 'therapy',
    COSMETIC: 'cosmetic',
    WELLNESS: 'wellness',
    SPECIALTY: 'specialty',
    EMERGENCY: 'emergency',
};

export const TREATMENT_LABELS = {
    kidney: 'Kidney Treatment & Transplant',
    heart: 'Heart Treatment & Transplant',
    liver: 'Liver Treatment & Transplant',
    lung: 'Lung Treatment & Transplant',
    pancreas: 'Pancreas Treatment',
    bone_marrow: 'Bone Marrow Transplant',
    orthopedic: 'Orthopedic Surgery',
    neurology: 'Neurological Treatment',
    oncology: 'Cancer Treatment',
    cardiology: 'Cardiac Surgery',
    cosmetic: 'Cosmetic Surgery',
    dental: 'Dental Treatment',
    eye: 'Eye Treatment & Surgery',
    ivf: 'IVF & Fertility Treatment',
    bariatric: 'Bariatric Surgery',
    spine: 'Spine Surgery',
    ent: 'ENT Treatment',
    urology: 'Urological Treatment',
    gynecology: 'Gynecological Surgery',
    gastroenterology: 'Gastrointestinal Treatment',
};

export const TREATMENT_DESCRIPTIONS = {
    kidney: 'Comprehensive kidney disease treatment including dialysis and kidney transplantation',
    heart: 'Advanced cardiac care including bypass surgery, valve replacement, and heart transplant',
    liver: 'Liver disease management and liver transplant procedures',
    lung: 'Pulmonary treatments and lung transplantation services',
    pancreas: 'Pancreatic disease treatment and transplant options',
    bone_marrow: 'Bone marrow and stem cell transplantation for blood disorders',
    orthopedic: 'Joint replacement, fracture repair, and orthopedic reconstructive surgery',
    neurology: 'Brain and nervous system disorder treatments',
    oncology: 'Comprehensive cancer treatment including chemotherapy, radiation, and surgery',
    cardiology: 'Heart disease diagnosis and surgical interventions',
    cosmetic: 'Aesthetic and reconstructive plastic surgery procedures',
    dental: 'Dental implants, orthodontics, and oral surgery',
    eye: 'Vision correction, cataract surgery, and retinal treatments',
    ivf: 'In-vitro fertilization and assisted reproductive technology',
    bariatric: 'Weight loss surgery including gastric bypass and sleeve gastrectomy',
    spine: 'Spinal fusion, disc replacement, and spine deformity correction',
    ent: 'Ear, nose, and throat surgical and medical treatments',
    urology: 'Urinary tract and male reproductive system treatments',
    gynecology: 'Female reproductive health and surgical procedures',
    gastroenterology: 'Digestive system disorders and endoscopic procedures',
};

export const TREATMENT_CATEGORY_MAP = {
    kidney: 'organ_transplant',
    heart: 'organ_transplant',
    liver: 'organ_transplant',
    lung: 'organ_transplant',
    pancreas: 'organ_transplant',
    bone_marrow: 'organ_transplant',
    orthopedic: 'surgery',
    neurology: 'specialty',
    oncology: 'specialty',
    cardiology: 'surgery',
    cosmetic: 'cosmetic',
    dental: 'cosmetic',
    eye: 'specialty',
    ivf: 'wellness',
    bariatric: 'surgery',
    spine: 'surgery',
    ent: 'specialty',
    urology: 'specialty',
    gynecology: 'surgery',
    gastroenterology: 'specialty',
};

export const TREATMENT_URGENCY_LEVELS = {
    EMERGENCY: 'emergency',
    URGENT: 'urgent',
    ELECTIVE: 'elective',
    ROUTINE: 'routine',
};

export const TREATMENT_DURATION_ESTIMATES = {
    kidney: { min: 14, max: 60, unit: 'days' },
    heart: { min: 21, max: 90, unit: 'days' },
    liver: { min: 21, max: 90, unit: 'days' },
    lung: { min: 30, max: 120, unit: 'days' },
    orthopedic: { min: 3, max: 21, unit: 'days' },
    oncology: { min: 30, max: 180, unit: 'days' },
    cosmetic: { min: 1, max: 14, unit: 'days' },
    dental: { min: 1, max: 7, unit: 'days' },
    eye: { min: 1, max: 7, unit: 'days' },
    ivf: { min: 14, max: 45, unit: 'days' },
    bariatric: { min: 3, max: 14, unit: 'days' },
};

export const TREATMENT_RECOVERY_PERIODS = {
    kidney: { min: 30, max: 90, unit: 'days' },
    heart: { min: 60, max: 180, unit: 'days' },
    liver: { min: 60, max: 180, unit: 'days' },
    orthopedic: { min: 14, max: 90, unit: 'days' },
    cosmetic: { min: 7, max: 30, unit: 'days' },
};

// Helper functions
export const getTreatmentCategory = (treatmentType) => {
    return TREATMENT_CATEGORY_MAP[treatmentType] || TREATMENT_CATEGORIES.SPECIALTY;
};

export const isValidTreatmentType = (type) => {
    return Object.values(TREATMENT_TYPES).includes(type);
};

export const getTreatmentLabel = (type) => {
    return TREATMENT_LABELS[type] || type;
};

export const getTreatmentDescription = (type) => {
    return TREATMENT_DESCRIPTIONS[type] || '';
};

export const getTreatmentDuration = (type) => {
    return TREATMENT_DURATION_ESTIMATES[type] || null;
};

export const getTreatmentRecovery = (type) => {
    return TREATMENT_RECOVERY_PERIODS[type] || null;
};

export const getTreatmentsByCategory = (category) => {
    return Object.entries(TREATMENT_CATEGORY_MAP)
        .filter(([_, cat]) => cat === category)
        .map(([type, _]) => type);
};

export const isOrganTransplant = (type) => {
    return getTreatmentCategory(type) === TREATMENT_CATEGORIES.ORGAN_TRANSPLANT;
};

export const requiresLongStay = (type) => {
    const duration = getTreatmentDuration(type);
    return duration && duration.max > 30;
};