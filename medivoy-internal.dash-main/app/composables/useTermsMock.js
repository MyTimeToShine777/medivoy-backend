// composables/useTermsMock.js
export const useTermsMock = () => {
  const terms = ref([
    {
      id: 1,
      title: "Terms of Service",
      type: "terms_of_service",
      content: `
# Terms of Service

## 1. Acceptance of Terms
By accessing and using our healthcare services, you agree to be bound by these Terms of Service.

## 2. Services Provided
We provide medical consultation, diagnostic services, and healthcare-related services through our platform.

## 3. User Responsibilities
- Provide accurate medical information
- Follow prescribed treatments
- Pay for services as agreed
- Respect healthcare professionals

## 4. Medical Disclaimer
Our services do not replace emergency medical care. In case of emergency, contact local emergency services.

## 5. Privacy and Confidentiality
We maintain strict confidentiality of medical records as per healthcare regulations.

## 6. Cancellation Policy
Appointments can be cancelled up to 24 hours before scheduled time for full refund.

## 7. Limitation of Liability
Our liability is limited to the cost of services provided.

## 8. Governing Law
These terms are governed by the laws of India.
      `,
      shortDescription:
        "Terms and conditions for using our healthcare services",
      version: "2.1",
      effectiveDate: "2025-10-01",
      lastUpdated: "2025-10-01T08:00:00Z",
      isActive: true,
      isPublic: true,
      category: "legal",
      language: "en",
      applicableFor: ["patients", "visitors", "app_users"],
      approvedBy: "Legal Team",
      approvalDate: "2025-09-30T16:00:00Z",
    },
    {
      id: 2,
      title: "Privacy Policy",
      type: "privacy_policy",
      content: `
# Privacy Policy

## Information We Collect
We collect personal information necessary for providing healthcare services including:
- Personal identification information
- Medical history and records
- Contact information
- Payment information

## How We Use Information
- Providing medical services
- Appointment scheduling
- Communication regarding health
- Billing and payment processing
- Legal compliance

## Information Security
We implement industry-standard security measures to protect your data.

## Sharing of Information
We do not share personal information except as required by law or medical necessity.

## Your Rights
You have the right to access, update, or delete your personal information.

## Contact Us
For privacy-related questions, contact our privacy officer.
      `,
      shortDescription:
        "How we collect, use, and protect your personal information",
      version: "1.8",
      effectiveDate: "2025-09-15",
      lastUpdated: "2025-09-15T10:30:00Z",
      isActive: true,
      isPublic: true,
      category: "privacy",
      language: "en",
      applicableFor: ["patients", "visitors", "app_users", "website_users"],
      approvedBy: "Privacy Officer",
      approvalDate: "2025-09-14T14:00:00Z",
    },
    {
      id: 3,
      title: "Refund and Cancellation Policy",
      type: "refund_policy",
      content: `
# Refund and Cancellation Policy

## Appointment Cancellations
- **24+ hours before**: Full refund
- **12-24 hours before**: 50% refund  
- **Less than 12 hours**: No refund
- **No-show**: No refund

## Service Cancellations
- **Health packages**: Can be cancelled up to 48 hours before for full refund
- **Lab tests**: Can be cancelled up to 2 hours before sample collection
- **Consultations**: Follow appointment cancellation policy

## Refund Process
- Refunds processed within 5-7 business days
- Refunded to original payment method
- Processing fees may apply

## Medical Emergencies
Cancellations due to medical emergencies are handled case-by-case with full refund consideration.

## Contact for Refunds
Contact customer support for refund requests with booking details.
      `,
      shortDescription: "Cancellation and refund policies for our services",
      version: "1.5",
      effectiveDate: "2025-08-01",
      lastUpdated: "2025-08-01T12:00:00Z",
      isActive: true,
      isPublic: true,
      category: "financial",
      language: "en",
      applicableFor: ["patients", "app_users"],
      approvedBy: "Management Team",
      approvalDate: "2025-07-30T11:00:00Z",
    },
    {
      id: 4,
      title: "Medical Records Policy",
      type: "medical_records_policy",
      content: `
# Medical Records Policy

## Record Keeping
We maintain comprehensive medical records for all patients in accordance with medical standards.

## Access to Records
- Patients have right to access their medical records
- Records can be requested through patient portal
- Identity verification required

## Record Security
- Electronic records encrypted and secured
- Physical records stored in locked facilities
- Access limited to authorized personnel

## Record Retention
Medical records retained for minimum 7 years as per legal requirements.

## Sharing Records
Records shared only with:
- Patient's consent
- Legal requirements
- Medical emergency situations
- Insurance claim processing

## Record Corrections
Patients can request corrections to their medical records through formal process.
      `,
      shortDescription:
        "Policy regarding medical record management and patient access",
      version: "1.3",
      effectiveDate: "2025-07-01",
      lastUpdated: "2025-07-01T09:00:00Z",
      isActive: true,
      isPublic: false,
      category: "medical",
      language: "en",
      applicableFor: ["patients"],
      approvedBy: "Medical Director",
      approvalDate: "2025-06-28T15:00:00Z",
    },
    {
      id: 5,
      title: "Telemedicine Terms",
      type: "telemedicine_terms",
      content: `
# Telemedicine Service Terms

## Service Description
Telemedicine consultations conducted via video/audio calls with licensed healthcare providers.

## Technical Requirements
- Stable internet connection
- Compatible device with camera/microphone
- Updated browser or mobile app

## Consultation Guidelines
- Consultations are not suitable for emergency situations
- Physical examination limitations acknowledged
- Follow-up in-person visits may be recommended

## Patient Responsibilities
- Provide accurate medical history
- Ensure privacy during consultation
- Follow prescribed treatments

## Prescription Policy
Controlled substances may not be prescribed via telemedicine as per regulations.

## Technical Support
Technical support available during consultation hours.

## Limitation of Service
Telemedicine has inherent limitations compared to in-person consultations.
      `,
      shortDescription:
        "Terms and conditions specific to telemedicine services",
      version: "2.0",
      effectiveDate: "2025-06-01",
      lastUpdated: "2025-06-01T14:00:00Z",
      isActive: true,
      isPublic: true,
      category: "service_specific",
      language: "en",
      applicableFor: ["telemedicine_users", "app_users"],
      approvedBy: "Medical Director",
      approvalDate: "2025-05-30T10:00:00Z",
    },
    {
      id: 6,
      title: "Cookie Policy",
      type: "cookie_policy",
      content: `
# Cookie Policy

## What Are Cookies
Cookies are small text files stored on your device when you visit our website.

## Types of Cookies We Use
- **Essential Cookies**: Required for website functionality
- **Analytics Cookies**: Help us understand website usage
- **Preference Cookies**: Remember your settings
- **Marketing Cookies**: Deliver relevant advertisements

## Managing Cookies
You can control cookies through your browser settings.

## Third-Party Cookies
We may use third-party services that set cookies (Google Analytics, etc.).

## Cookie Consent
By using our website, you consent to our use of cookies as described.

## Updates to Policy
This policy may be updated periodically.
      `,
      shortDescription: "Information about cookies used on our website",
      version: "1.2",
      effectiveDate: "2025-05-01",
      lastUpdated: "2025-05-01T11:00:00Z",
      isActive: true,
      isPublic: true,
      category: "privacy",
      language: "en",
      applicableFor: ["website_users"],
      approvedBy: "Legal Team",
      approvalDate: "2025-04-28T16:00:00Z",
    },
  ]);

  const termStats = computed(() => {
    const totalTerms = terms.value.length;
    const activeTerms = terms.value.filter((t) => t.isActive).length;
    const publicTerms = terms.value.filter((t) => t.isPublic).length;
    const recentUpdates = terms.value.filter((t) => {
      const updated = new Date(t.lastUpdated);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return updated > thirtyDaysAgo;
    }).length;

    return {
      totalTerms,
      activeTerms,
      publicTerms,
      recentUpdates,
    };
  });

  const categories = computed(() => {
    const cats = [...new Set(terms.value.map((t) => t.category))];
    return cats.map((cat) => ({
      name: cat,
      count: terms.value.filter((t) => t.category === cat).length,
    }));
  });

  const addTerm = (termData) => {
    const newTerm = {
      ...termData,
      id: Math.max(...terms.value.map((t) => t.id)) + 1,
      version: "1.0",
      effectiveDate: new Date().toISOString().split("T")[0],
      lastUpdated: new Date().toISOString(),
      approvalDate: new Date().toISOString(),
    };
    terms.value.unshift(newTerm);
  };

  const updateTerm = (id, termData) => {
    const index = terms.value.findIndex((t) => t.id === id);
    if (index !== -1) {
      const currentVersion = terms.value[index].version;
      const newVersion = incrementVersion(currentVersion);

      terms.value[index] = {
        ...terms.value[index],
        ...termData,
        version: newVersion,
        lastUpdated: new Date().toISOString(),
        approvalDate: new Date().toISOString(),
      };
    }
  };

  const deleteTerm = (id) => {
    terms.value = terms.value.filter((t) => t.id !== id);
  };

  const incrementVersion = (version) => {
    const parts = version.split(".");
    parts[parts.length - 1] = (
      parseInt(parts[parts.length - 1]) + 1
    ).toString();
    return parts.join(".");
  };

  return {
    terms: readonly(terms),
    termStats,
    categories,
    addTerm,
    updateTerm,
    deleteTerm,
  };
};
