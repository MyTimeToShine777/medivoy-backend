// composables/usePrivacyMock.js
export const usePrivacyMock = () => {
  const privacyPolicies = ref([
    {
      id: 1,
      section: "overview",
      title: "Privacy Policy Overview",
      content:
        "This Privacy Policy describes how we collect, use, and protect your personal information when you use our medical services. We are committed to protecting your privacy and ensuring the security of your personal and medical data in accordance with applicable laws and regulations.",
      isActive: true,
      isRequired: true,
      version: "2.1",
      effectiveDate: "2025-01-01",
      lastReviewDate: "2025-09-15",
      nextReviewDate: "2026-03-15",
      dataTypes: [
        "Personal Identifiers",
        "Contact Information",
        "Medical Records",
      ],
      purposes: [
        "Medical Treatment",
        "Appointment Management",
        "Legal Compliance",
      ],
      legalBases: ["Consent", "Medical Treatment", "Legal Obligation"],
      retentionPeriod: "7 years",
      thirdParties: [
        {
          name: "Insurance Companies",
          purpose: "Claims Processing",
          dataShared: ["Medical Records"],
          safeguards: "Encrypted transmission",
        },
      ],
      userRights: [
        "Right to Access",
        "Right to Rectification",
        "Right to Erasure",
      ],
      complianceFrameworks: [
        "GDPR",
        "HIPAA",
        "Indian Personal Data Protection Bill",
      ],
      consentRequired: true,
      dataProcessingLocation: ["India", "On-premises"],
      securityMeasures: [
        "End-to-end Encryption",
        "Access Controls",
        "Regular Security Audits",
      ],
      changeLog: [
        {
          date: "2025-09-15",
          version: "2.1",
          changes: "Updated data retention policies for compliance",
          author: "Legal Team",
        },
      ],
      priority: "high",
      language: "en",
      lastUpdated: "2025-09-15T10:30:00Z",
    },
    {
      id: 2,
      section: "collection",
      title: "Information We Collect",
      content:
        "We collect various types of information to provide and improve our medical services:\n\n1. Personal Information: Name, date of birth, contact details, government-issued ID\n2. Medical Information: Health records, test results, treatment history, medications\n3. Technical Information: Device information, IP address, usage patterns\n4. Payment Information: Billing details, insurance information",
      isActive: true,
      isRequired: true,
      version: "1.3",
      effectiveDate: "2025-01-01",
      lastReviewDate: "2025-08-20",
      nextReviewDate: "2025-12-20",
      dataTypes: [
        "Personal Identifiers",
        "Medical Records",
        "Financial Information",
        "Device Information",
      ],
      purposes: [
        "Medical Treatment",
        "Payment Processing",
        "Analytics",
        "Security",
      ],
      legalBases: ["Consent", "Contract Performance", "Legitimate Interest"],
      retentionPeriod: "5 years",
      thirdParties: [],
      userRights: [
        "Right to Access",
        "Right to Portability",
        "Right to Object",
      ],
      complianceFrameworks: ["GDPR", "CCPA"],
      consentRequired: true,
      dataProcessingLocation: ["India", "Cloud servers"],
      securityMeasures: ["Data Minimization", "Pseudonymization"],
      changeLog: [
        {
          date: "2025-08-20",
          version: "1.3",
          changes: "Added device information collection details",
          author: "Privacy Officer",
        },
      ],
      priority: "high",
      language: "en",
      lastUpdated: "2025-08-20T14:15:00Z",
    },
    {
      id: 3,
      section: "cookies",
      title: "Cookies and Tracking Technologies",
      content:
        "We use cookies and similar technologies to enhance your experience on our website and mobile applications. This includes:\n\n- Essential cookies for website functionality\n- Analytics cookies to understand usage patterns\n- Performance cookies to optimize our services\n- Marketing cookies for personalized content\n\nYou can control cookie settings through your browser preferences.",
      isActive: true,
      isRequired: false,
      version: "1.1",
      effectiveDate: "2025-01-01",
      lastReviewDate: "2025-07-10",
      nextReviewDate: "2026-01-10",
      dataTypes: ["Device Information", "Usage Data"],
      purposes: ["Analytics", "Marketing", "Security"],
      legalBases: ["Consent", "Legitimate Interest"],
      retentionPeriod: "2 years",
      thirdParties: [
        {
          name: "Google Analytics",
          purpose: "Website Analytics",
          dataShared: ["Usage Data"],
          safeguards: "Data Processing Agreement",
        },
      ],
      userRights: ["Right to Object", "Right to Withdraw Consent"],
      complianceFrameworks: ["GDPR", "ePrivacy Directive"],
      consentRequired: true,
      dataProcessingLocation: ["European Union", "United States"],
      securityMeasures: ["Cookie Encryption", "Secure Transmission"],
      changeLog: [],
      priority: "medium",
      language: "en",
      lastUpdated: "2025-07-10T09:00:00Z",
    },
    {
      id: 4,
      section: "rights",
      title: "Your Privacy Rights",
      content:
        "You have several rights regarding your personal data:\n\n1. Right to Access: Request copies of your personal data\n2. Right to Rectification: Request correction of inaccurate data\n3. Right to Erasure: Request deletion of your data\n4. Right to Portability: Request transfer of your data\n5. Right to Restriction: Request limitation of processing\n6. Right to Object: Object to certain types of processing\n\nTo exercise these rights, please contact our Privacy Officer.",
      isActive: true,
      isRequired: true,
      version: "1.2",
      effectiveDate: "2025-01-01",
      lastReviewDate: "2025-06-30",
      nextReviewDate: "2025-10-30",
      dataTypes: ["All Personal Data"],
      purposes: ["User Rights Management"],
      legalBases: ["Legal Obligation", "Legitimate Interest"],
      retentionPeriod: "As required by law",
      thirdParties: [],
      userRights: [
        "Right to Access",
        "Right to Rectification",
        "Right to Erasure",
        "Right to Portability",
        "Right to Restriction",
        "Right to Object",
      ],
      complianceFrameworks: ["GDPR", "CCPA", "PIPEDA"],
      consentRequired: false,
      dataProcessingLocation: ["India"],
      securityMeasures: ["Identity Verification", "Audit Logging"],
      changeLog: [
        {
          date: "2025-06-30",
          version: "1.2",
          changes: "Clarified data portability procedures",
          author: "Legal Team",
        },
      ],
      priority: "critical",
      language: "en",
      lastUpdated: "2025-06-30T16:45:00Z",
    },
  ]);

  const privacyStats = computed(() => {
    const totalPolicies = privacyPolicies.value.length;
    const activePolicies = privacyPolicies.value.filter(
      (p) => p.isActive
    ).length;
    const consentRequired = privacyPolicies.value.filter(
      (p) => p.consentRequired
    ).length;
    const pendingReview = privacyPolicies.value.filter(
      (p) => new Date(p.nextReviewDate) <= new Date()
    ).length;
    const complianceFrameworks = [
      ...new Set(
        privacyPolicies.value.flatMap((p) => p.complianceFrameworks || [])
      ),
    ].length;
    const latestVersion = Math.max(
      ...privacyPolicies.value.map((p) => parseFloat(p.version) || 1)
    );

    return {
      totalPolicies,
      activePolicies,
      consentRequired,
      pendingReview,
      complianceFrameworks,
      latestVersion: latestVersion.toFixed(1),
    };
  });

  const addPrivacyPolicy = (policyData) => {
    const newPolicy = {
      ...policyData,
      id: Math.max(...privacyPolicies.value.map((p) => p.id)) + 1,
      lastUpdated: new Date().toISOString(),
    };
    privacyPolicies.value.unshift(newPolicy);
  };

  const updatePrivacyPolicy = (id, policyData) => {
    const index = privacyPolicies.value.findIndex((p) => p.id === id);
    if (index !== -1) {
      privacyPolicies.value[index] = {
        ...privacyPolicies.value[index],
        ...policyData,
        lastUpdated: new Date().toISOString(),
      };
    }
  };

  const deletePrivacyPolicy = (id) => {
    privacyPolicies.value = privacyPolicies.value.filter((p) => p.id !== id);
  };

  const publishVersion = (id, newVersion) => {
    const policy = privacyPolicies.value.find((p) => p.id === id);
    if (policy) {
      policy.version = newVersion;
      policy.lastUpdated = new Date().toISOString();
      policy.changeLog = policy.changeLog || [];
      policy.changeLog.unshift({
        date: new Date().toISOString().split("T")[0],
        version: newVersion,
        changes: `Published version ${newVersion}`,
        author: "Admin",
      });
    }
  };

  const trackConsent = (policyId, consent) => {
    console.log(
      `Consent ${consent ? "given" : "withdrawn"} for policy ${policyId}`
    );
  };

  return {
    privacyPolicies,
    privacyStats,
    addPrivacyPolicy,
    updatePrivacyPolicy,
    deletePrivacyPolicy,
    publishVersion,
    trackConsent,
  };
};
