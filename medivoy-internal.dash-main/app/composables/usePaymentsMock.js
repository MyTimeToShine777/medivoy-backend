// composables/usePaymentsMock.js
export const usePaymentsMock = () => {
  const payments = ref([
    {
      id: 1,
      transactionId: "TXN-2025-001234",
      orderId: "ORD-UAE-240001",
      patientId: "PAT-DXB-001",
      patientName: "Ahmed Al-Rashid",
      patientEmail: "ahmed.rashid@email.com",
      patientPhone: "+971-50-123-4567",
      serviceType: "consultation",
      serviceName: "Cardiology Consultation",
      doctorName: "Dr. Sarah Johnson",
      department: "Cardiology",
      facility: "Dubai Healthcare Center",
      country: "UAE",
      currency: "AED",
      amount: 350.0,
      originalAmount: 350.0,
      discountAmount: 0.0,
      taxAmount: 17.5,
      totalAmount: 367.5,
      paymentMethod: "credit_card",
      paymentGateway: "stripe",
      cardLastFour: "4532",
      cardType: "visa",
      cardExpiry: "12/26",
      paymentStatus: "completed",
      transactionStatus: "success",
      paymentDate: "2025-10-13T09:30:00Z",
      dueDate: "2025-10-13T09:30:00Z",
      completedDate: "2025-10-13T09:32:15Z",
      refundAmount: 0.0,
      refundStatus: null,
      refundDate: null,
      refundReason: null,
      insuranceProvider: null,
      insurancePolicyNumber: null,
      insuranceCoverage: 0.0,
      copayAmount: 0.0,
      appointmentId: "APT-2025-001",
      appointmentDate: "2025-10-15T10:00:00Z",
      platform: "website",
      ipAddress: "185.123.45.67",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      notes: "Payment for cardiac consultation appointment",
      receiptUrl: "/receipts/TXN-2025-001234.pdf",
      invoiceUrl: "/invoices/INV-2025-001234.pdf",
      createdAt: "2025-10-13T09:28:00Z",
      updatedAt: "2025-10-13T09:32:15Z",
      processedBy: "System",
      isRecurring: false,
      recurringInterval: null,
      nextBillingDate: null,
      failureReason: null,
      retryCount: 0,
      tags: ["consultation", "cardiology", "dubai"],
      metadata: {
        source: "online_booking",
        campaignId: null,
        referralCode: null,
      },
    },
    {
      id: 2,
      transactionId: "TXN-2025-001235",
      orderId: "ORD-QAT-240002",
      patientId: "PAT-DOH-002",
      patientName: "Fatima Al-Thani",
      patientEmail: "fatima.thani@email.com",
      patientPhone: "+974-55-234-5678",
      serviceType: "surgery",
      serviceName: "Laparoscopic Cholecystectomy",
      doctorName: "Dr. Michael Chen",
      department: "General Surgery",
      facility: "Doha Medical Complex",
      country: "Qatar",
      currency: "QAR",
      amount: 15000.0,
      originalAmount: 18000.0,
      discountAmount: 3000.0,
      taxAmount: 0.0,
      totalAmount: 15000.0,
      paymentMethod: "insurance",
      paymentGateway: "direct_billing",
      cardLastFour: null,
      cardType: null,
      cardExpiry: null,
      paymentStatus: "pending_approval",
      transactionStatus: "pending",
      paymentDate: "2025-10-13T14:20:00Z",
      dueDate: "2025-10-16T23:59:59Z",
      completedDate: null,
      refundAmount: 0.0,
      refundStatus: null,
      refundDate: null,
      refundReason: null,
      insuranceProvider: "Qatar National Health Insurance",
      insurancePolicyNumber: "QNHI-789456123",
      insuranceCoverage: 15000.0,
      copayAmount: 0.0,
      appointmentId: "APT-2025-002",
      appointmentDate: "2025-10-20T08:00:00Z",
      platform: "mobile_app",
      ipAddress: "192.168.1.45",
      userAgent: "HealthApp/1.2.0 iOS",
      notes: "Insurance pre-authorization pending for surgical procedure",
      receiptUrl: null,
      invoiceUrl: "/invoices/INV-2025-001235.pdf",
      createdAt: "2025-10-13T14:15:00Z",
      updatedAt: "2025-10-13T14:20:00Z",
      processedBy: "Insurance Team",
      isRecurring: false,
      recurringInterval: null,
      nextBillingDate: null,
      failureReason: null,
      retryCount: 0,
      tags: ["surgery", "insurance", "qatar"],
      metadata: {
        source: "mobile_app",
        preAuthNumber: "PA-QAT-2025-001",
        insuranceClaimId: "CLM-789456",
      },
    },
    {
      id: 3,
      transactionId: "TXN-2025-001236",
      orderId: "ORD-SAU-240003",
      patientId: "PAT-RYD-003",
      patientName: "Omar bin Abdullah",
      patientEmail: "omar.abdullah@email.com",
      patientPhone: "+966-50-345-6789",
      serviceType: "emergency",
      serviceName: "Emergency Room Treatment",
      doctorName: "Dr. Aisha Khalil",
      department: "Emergency Medicine",
      facility: "Riyadh Emergency Center",
      country: "Saudi Arabia",
      currency: "SAR",
      amount: 1200.0,
      originalAmount: 1200.0,
      discountAmount: 0.0,
      taxAmount: 180.0,
      totalAmount: 1380.0,
      paymentMethod: "cash",
      paymentGateway: "cash_payment",
      cardLastFour: null,
      cardType: null,
      cardExpiry: null,
      paymentStatus: "completed",
      transactionStatus: "success",
      paymentDate: "2025-10-12T22:45:00Z",
      dueDate: "2025-10-12T22:45:00Z",
      completedDate: "2025-10-12T22:47:30Z",
      refundAmount: 0.0,
      refundStatus: null,
      refundDate: null,
      refundReason: null,
      insuranceProvider: null,
      insurancePolicyNumber: null,
      insuranceCoverage: 0.0,
      copayAmount: 0.0,
      appointmentId: "EMER-2025-003",
      appointmentDate: "2025-10-12T22:30:00Z",
      platform: "walk_in",
      ipAddress: null,
      userAgent: null,
      notes: "Emergency treatment payment - cash received at reception",
      receiptUrl: "/receipts/TXN-2025-001236.pdf",
      invoiceUrl: "/invoices/INV-2025-001236.pdf",
      createdAt: "2025-10-12T22:45:00Z",
      updatedAt: "2025-10-12T22:47:30Z",
      processedBy: "Reception Staff",
      isRecurring: false,
      recurringInterval: null,
      nextBillingDate: null,
      failureReason: null,
      retryCount: 0,
      tags: ["emergency", "cash", "saudi"],
      metadata: {
        source: "walk_in",
        emergencyCode: "EMR-001",
        triage: "urgent",
      },
    },
    {
      id: 4,
      transactionId: "TXN-2025-001237",
      orderId: "ORD-KWT-240004",
      patientId: "PAT-KWT-004",
      patientName: "Nadia Al-Sabah",
      patientEmail: "nadia.sabah@email.com",
      patientPhone: "+965-99-456-7890",
      serviceType: "subscription",
      serviceName: "Annual Health Checkup Package",
      doctorName: "Multiple Specialists",
      department: "Preventive Medicine",
      facility: "Kuwait Wellness Center",
      country: "Kuwait",
      currency: "KWD",
      amount: 250.0,
      originalAmount: 300.0,
      discountAmount: 50.0,
      taxAmount: 0.0,
      totalAmount: 250.0,
      paymentMethod: "bank_transfer",
      paymentGateway: "local_bank",
      cardLastFour: null,
      cardType: null,
      cardExpiry: null,
      paymentStatus: "completed",
      transactionStatus: "success",
      paymentDate: "2025-10-11T11:15:00Z",
      dueDate: "2025-10-11T11:15:00Z",
      completedDate: "2025-10-11T11:18:45Z",
      refundAmount: 0.0,
      refundStatus: null,
      refundDate: null,
      refundReason: null,
      insuranceProvider: null,
      insurancePolicyNumber: null,
      insuranceCoverage: 0.0,
      copayAmount: 0.0,
      appointmentId: null,
      appointmentDate: null,
      platform: "website",
      ipAddress: "213.42.15.89",
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
      notes: "Annual subscription with early bird discount",
      receiptUrl: "/receipts/TXN-2025-001237.pdf",
      invoiceUrl: "/invoices/INV-2025-001237.pdf",
      createdAt: "2025-10-11T11:10:00Z",
      updatedAt: "2025-10-11T11:18:45Z",
      processedBy: "Payment Gateway",
      isRecurring: true,
      recurringInterval: "yearly",
      nextBillingDate: "2026-10-11T11:15:00Z",
      failureReason: null,
      retryCount: 0,
      tags: ["subscription", "wellness", "kuwait", "recurring"],
      metadata: {
        source: "website",
        packageType: "premium",
        discountCode: "EARLY2025",
      },
    },
    {
      id: 5,
      transactionId: "TXN-2025-001238",
      orderId: "ORD-BHR-240005",
      patientId: "PAT-MAN-005",
      patientName: "Khalil Al-Khalifa",
      patientEmail: "khalil.khalifa@email.com",
      patientPhone: "+973-33-567-8901",
      serviceType: "laboratory",
      serviceName: "Comprehensive Blood Panel",
      doctorName: "Lab Technician",
      department: "Pathology",
      facility: "Manama Diagnostic Center",
      country: "Bahrain",
      currency: "BHD",
      amount: 45.0,
      originalAmount: 45.0,
      discountAmount: 0.0,
      taxAmount: 2.25,
      totalAmount: 47.25,
      paymentMethod: "digital_wallet",
      paymentGateway: "benefit_pay",
      cardLastFour: null,
      cardType: "digital",
      cardExpiry: null,
      paymentStatus: "failed",
      transactionStatus: "failed",
      paymentDate: "2025-10-13T16:20:00Z",
      dueDate: "2025-10-13T16:20:00Z",
      completedDate: null,
      refundAmount: 0.0,
      refundStatus: null,
      refundDate: null,
      refundReason: null,
      insuranceProvider: null,
      insurancePolicyNumber: null,
      insuranceCoverage: 0.0,
      copayAmount: 0.0,
      appointmentId: "LAB-2025-005",
      appointmentDate: "2025-10-14T09:00:00Z",
      platform: "mobile_app",
      ipAddress: "94.203.78.91",
      userAgent: "HealthApp/1.2.0 Android",
      notes: "Payment failed - insufficient funds in digital wallet",
      receiptUrl: null,
      invoiceUrl: null,
      createdAt: "2025-10-13T16:18:00Z",
      updatedAt: "2025-10-13T16:22:15Z",
      processedBy: "Payment Gateway",
      isRecurring: false,
      recurringInterval: null,
      nextBillingDate: null,
      failureReason: "insufficient_funds",
      retryCount: 1,
      tags: ["laboratory", "failed", "bahrain"],
      metadata: {
        source: "mobile_app",
        errorCode: "WL_INSUFFICIENT_FUNDS",
        retryScheduled: true,
      },
    },
    {
      id: 6,
      transactionId: "TXN-2025-001239",
      orderId: "ORD-OMN-240006",
      patientId: "PAT-MUS-006",
      patientName: "Amina Al-Busaidi",
      patientEmail: "amina.busaidi@email.com",
      patientPhone: "+968-90-678-9012",
      serviceType: "radiology",
      serviceName: "MRI Brain Scan",
      doctorName: "Dr. Robert Smith",
      department: "Radiology",
      facility: "Muscat Imaging Center",
      country: "Oman",
      currency: "OMR",
      amount: 180.0,
      originalAmount: 180.0,
      discountAmount: 0.0,
      taxAmount: 9.0,
      totalAmount: 189.0,
      paymentMethod: "debit_card",
      paymentGateway: "mastercard",
      cardLastFour: "8765",
      cardType: "mastercard",
      cardExpiry: "08/27",
      paymentStatus: "processing",
      transactionStatus: "pending",
      paymentDate: "2025-10-13T13:45:00Z",
      dueDate: "2025-10-13T13:45:00Z",
      completedDate: null,
      refundAmount: 0.0,
      refundStatus: null,
      refundDate: null,
      refundReason: null,
      insuranceProvider: "Oman Insurance Company",
      insurancePolicyNumber: "OIC-456789012",
      insuranceCoverage: 140.0,
      copayAmount: 49.0,
      appointmentId: "RAD-2025-006",
      appointmentDate: "2025-10-16T14:30:00Z",
      platform: "website",
      ipAddress: "213.75.89.102",
      userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0)",
      notes: "Partial insurance coverage - patient copay required",
      receiptUrl: null,
      invoiceUrl: "/invoices/INV-2025-001239.pdf",
      createdAt: "2025-10-13T13:40:00Z",
      updatedAt: "2025-10-13T13:47:00Z",
      processedBy: "Insurance Coordinator",
      isRecurring: false,
      recurringInterval: null,
      nextBillingDate: null,
      failureReason: null,
      retryCount: 0,
      tags: ["radiology", "insurance", "oman", "copay"],
      metadata: {
        source: "website",
        preAuthRequired: true,
        copayCollected: false,
      },
    },
    {
      id: 7,
      transactionId: "TXN-2025-001240",
      orderId: "ORD-JOR-240007",
      patientId: "PAT-AMM-007",
      patientName: "Mohammad Al-Hussein",
      patientEmail: "mohammad.hussein@email.com",
      patientPhone: "+962-79-789-0123",
      serviceType: "pharmacy",
      serviceName: "Prescription Medications",
      doctorName: "Pharmacist on Duty",
      department: "Pharmacy",
      facility: "Amman Medical Pharmacy",
      country: "Jordan",
      currency: "JOD",
      amount: 85.5,
      originalAmount: 95.0,
      discountAmount: 9.5,
      taxAmount: 0.0,
      totalAmount: 85.5,
      paymentMethod: "credit_card",
      paymentGateway: "cybersource",
      cardLastFour: "1234",
      cardType: "visa",
      cardExpiry: "03/26",
      paymentStatus: "refunded",
      transactionStatus: "refunded",
      paymentDate: "2025-10-10T10:30:00Z",
      dueDate: "2025-10-10T10:30:00Z",
      completedDate: "2025-10-10T10:32:45Z",
      refundAmount: 85.5,
      refundStatus: "completed",
      refundDate: "2025-10-12T14:20:00Z",
      refundReason: "medication_out_of_stock",
      insuranceProvider: null,
      insurancePolicyNumber: null,
      insuranceCoverage: 0.0,
      copayAmount: 0.0,
      appointmentId: null,
      appointmentDate: null,
      platform: "website",
      ipAddress: "195.121.45.78",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      notes: "Full refund processed - medication unavailable",
      receiptUrl: "/receipts/TXN-2025-001240.pdf",
      invoiceUrl: "/invoices/INV-2025-001240.pdf",
      createdAt: "2025-10-10T10:25:00Z",
      updatedAt: "2025-10-12T14:22:30Z",
      processedBy: "Pharmacy Manager",
      isRecurring: false,
      recurringInterval: null,
      nextBillingDate: null,
      failureReason: null,
      retryCount: 0,
      tags: ["pharmacy", "refunded", "jordan"],
      metadata: {
        source: "website",
        medicationCodes: ["MED-001", "MED-002"],
        refundMethod: "original_payment_method",
      },
    },
    {
      id: 8,
      transactionId: "TXN-2025-001241",
      orderId: "ORD-LBN-240008",
      patientId: "PAT-BEI-008",
      patientName: "Layla Hariri",
      patientEmail: "layla.hariri@email.com",
      patientPhone: "+961-71-890-1234",
      serviceType: "telemedicine",
      serviceName: "Online Psychiatric Consultation",
      doctorName: "Dr. Ahmad Nassif",
      department: "Psychiatry",
      facility: "Beirut Mental Health Center",
      country: "Lebanon",
      currency: "LBP",
      amount: 150000.0,
      originalAmount: 150000.0,
      discountAmount: 0.0,
      taxAmount: 0.0,
      totalAmount: 150000.0,
      paymentMethod: "crypto",
      paymentGateway: "coinbase",
      cardLastFour: null,
      cardType: "bitcoin",
      cardExpiry: null,
      paymentStatus: "completed",
      transactionStatus: "success",
      paymentDate: "2025-10-13T19:15:00Z",
      dueDate: "2025-10-13T19:15:00Z",
      completedDate: "2025-10-13T19:18:22Z",
      refundAmount: 0.0,
      refundStatus: null,
      refundDate: null,
      refundReason: null,
      insuranceProvider: null,
      insurancePolicyNumber: null,
      insuranceCoverage: 0.0,
      copayAmount: 0.0,
      appointmentId: "TELE-2025-008",
      appointmentDate: "2025-10-14T16:00:00Z",
      platform: "telemedicine_app",
      ipAddress: "109.189.67.34",
      userAgent: "TeleMed/2.1.0 WebApp",
      notes: "Cryptocurrency payment for telemedicine consultation",
      receiptUrl: "/receipts/TXN-2025-001241.pdf",
      invoiceUrl: "/invoices/INV-2025-001241.pdf",
      createdAt: "2025-10-13T19:10:00Z",
      updatedAt: "2025-10-13T19:20:00Z",
      processedBy: "Crypto Payment Processor",
      isRecurring: false,
      recurringInterval: null,
      nextBillingDate: null,
      failureReason: null,
      retryCount: 0,
      tags: ["telemedicine", "crypto", "lebanon", "online"],
      metadata: {
        source: "telemedicine_app",
        cryptoType: "bitcoin",
        exchangeRate: "42000",
        blockchainTxId: "0x1a2b3c4d5e6f",
      },
    },
    {
      id: 9,
      transactionId: "TXN-2025-001242",
      orderId: "ORD-EGY-240009",
      patientId: "PAT-CAI-009",
      patientName: "Yasmin Abdel Rahman",
      patientEmail: "yasmin.rahman@email.com",
      patientPhone: "+20-10-123-4567",
      serviceType: "physiotherapy",
      serviceName: "Physical Therapy Session Package (10 sessions)",
      doctorName: "Dr. Hany Mostafa",
      department: "Physiotherapy",
      facility: "Cairo Rehabilitation Center",
      country: "Egypt",
      currency: "EGP",
      amount: 2500.0,
      originalAmount: 3000.0,
      discountAmount: 500.0,
      taxAmount: 375.0,
      totalAmount: 2875.0,
      paymentMethod: "installment",
      paymentGateway: "valify",
      cardLastFour: "9876",
      cardType: "visa",
      cardExpiry: "11/25",
      paymentStatus: "partial",
      transactionStatus: "partial",
      paymentDate: "2025-10-13T12:00:00Z",
      dueDate: "2025-11-13T23:59:59Z",
      completedDate: null,
      refundAmount: 0.0,
      refundStatus: null,
      refundDate: null,
      refundReason: null,
      insuranceProvider: "Egyptian Health Insurance",
      insurancePolicyNumber: "EHI-987654321",
      insuranceCoverage: 1000.0,
      copayAmount: 1875.0,
      appointmentId: "PHYSIO-2025-009",
      appointmentDate: "2025-10-15T11:00:00Z",
      platform: "mobile_app",
      ipAddress: "156.219.78.45",
      userAgent: "HealthApp/1.2.0 Android",
      notes: "Installment plan - 3 months, first payment completed",
      receiptUrl: "/receipts/TXN-2025-001242.pdf",
      invoiceUrl: "/invoices/INV-2025-001242.pdf",
      createdAt: "2025-10-13T11:55:00Z",
      updatedAt: "2025-10-13T12:05:00Z",
      processedBy: "Billing Department",
      isRecurring: true,
      recurringInterval: "monthly",
      nextBillingDate: "2025-11-13T12:00:00Z",
      failureReason: null,
      retryCount: 0,
      tags: ["physiotherapy", "installment", "egypt", "partial"],
      metadata: {
        source: "mobile_app",
        installmentPlan: "3_months",
        remainingAmount: 1875.0,
        sessionsRemaining: 10,
      },
    },
    {
      id: 10,
      transactionId: "TXN-2025-001243",
      orderId: "ORD-TUR-240010",
      patientId: "PAT-IST-010",
      patientName: "Mehmet Öztürk",
      patientEmail: "mehmet.ozturk@email.com",
      patientPhone: "+90-532-234-5678",
      serviceType: "dental",
      serviceName: "Dental Implant Surgery",
      doctorName: "Dr. Elif Demir",
      department: "Dental Surgery",
      facility: "Istanbul Dental Excellence",
      country: "Turkey",
      currency: "TRY",
      amount: 12500.0,
      originalAmount: 15000.0,
      discountAmount: 2500.0,
      taxAmount: 2250.0,
      totalAmount: 14750.0,
      paymentMethod: "bank_transfer",
      paymentGateway: "garanti_bank",
      cardLastFour: null,
      cardType: null,
      cardExpiry: null,
      paymentStatus: "pending",
      transactionStatus: "pending",
      paymentDate: "2025-10-13T08:30:00Z",
      dueDate: "2025-10-15T17:00:00Z",
      completedDate: null,
      refundAmount: 0.0,
      refundStatus: null,
      refundDate: null,
      refundReason: null,
      insuranceProvider: "Turkish Health Insurance",
      insurancePolicyNumber: "THI-123456789",
      insuranceCoverage: 5000.0,
      copayAmount: 9750.0,
      appointmentId: "DENTAL-2025-010",
      appointmentDate: "2025-10-18T09:00:00Z",
      platform: "website",
      ipAddress: "85.111.203.45",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      notes: "Bank transfer pending verification - medical tourism patient",
      receiptUrl: null,
      invoiceUrl: "/invoices/INV-2025-001243.pdf",
      createdAt: "2025-10-13T08:25:00Z",
      updatedAt: "2025-10-13T08:35:00Z",
      processedBy: "International Patient Coordinator",
      isRecurring: false,
      recurringInterval: null,
      nextBillingDate: null,
      failureReason: null,
      retryCount: 0,
      tags: ["dental", "surgery", "turkey", "medical_tourism"],
      metadata: {
        source: "website",
        medicalTourism: true,
        packageType: "dental_premium",
        accommodation: true,
      },
    },
  ]);

  const paymentStats = computed(() => {
    const total = payments.value.length;
    const completed = payments.value.filter(
      (p) => p.paymentStatus === "completed"
    ).length;
    const pending = payments.value.filter(
      (p) => p.paymentStatus === "pending" || p.paymentStatus === "processing"
    ).length;
    const failed = payments.value.filter(
      (p) => p.paymentStatus === "failed"
    ).length;

    const totalRevenue = payments.value
      .filter((p) => p.paymentStatus === "completed")
      .reduce((sum, p) => sum + p.totalAmount, 0);

    const pendingAmount = payments.value
      .filter(
        (p) => p.paymentStatus === "pending" || p.paymentStatus === "processing"
      )
      .reduce((sum, p) => sum + p.totalAmount, 0);

    const refundedAmount = payments.value
      .filter((p) => p.refundAmount > 0)
      .reduce((sum, p) => sum + p.refundAmount, 0);

    const paymentMethods = payments.value.reduce((acc, p) => {
      acc[p.paymentMethod] = (acc[p.paymentMethod] || 0) + 1;
      return acc;
    }, {});

    const currencies = payments.value.reduce((acc, p) => {
      acc[p.currency] = (acc[p.currency] || 0) + 1;
      return acc;
    }, {});

    const countries = payments.value.reduce((acc, p) => {
      acc[p.country] = (acc[p.country] || 0) + 1;
      return acc;
    }, {});

    return {
      totalPayments: total,
      completedPayments: completed,
      pendingPayments: pending,
      failedPayments: failed,
      totalRevenue,
      pendingAmount,
      refundedAmount,
      paymentMethods,
      currencies,
      countries,
      averageAmount: total > 0 ? totalRevenue / completed || 0 : 0,
      successRate: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  });

  const addPayment = (paymentData) => {
    const newPayment = {
      ...paymentData,
      id: Math.max(...payments.value.map((p) => p.id)) + 1,
      transactionId: `TXN-2025-${String(
        Math.max(
          ...payments.value.map((p) => parseInt(p.transactionId.split("-")[2]))
        ) + 1
      ).padStart(6, "0")}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      retryCount: 0,
    };
    payments.value.unshift(newPayment);
    console.log("Added new payment:", newPayment.transactionId);
  };

  const updatePayment = (id, paymentData) => {
    const index = payments.value.findIndex((p) => p.id === id);
    if (index !== -1) {
      payments.value[index] = {
        ...payments.value[index],
        ...paymentData,
        updatedAt: new Date().toISOString(),
      };
      console.log("Updated payment:", payments.value[index].transactionId);
    }
  };

  const deletePayment = (id) => {
    const index = payments.value.findIndex((p) => p.id === id);
    if (index !== -1) {
      const deletedPayment = payments.value[index];
      payments.value.splice(index, 1);
      console.log("Deleted payment:", deletedPayment.transactionId);
    }
  };

  const processRefund = (id, refundAmount, reason) => {
    const payment = payments.value.find((p) => p.id === id);
    if (payment) {
      payment.refundAmount = refundAmount;
      payment.refundStatus = "completed";
      payment.refundDate = new Date().toISOString();
      payment.refundReason = reason;
      payment.paymentStatus = "refunded";
      payment.updatedAt = new Date().toISOString();
      console.log(
        `Refunded ${refundAmount} for payment:`,
        payment.transactionId
      );
    }
  };

  const retryPayment = (id) => {
    const payment = payments.value.find((p) => p.id === id);
    if (payment && payment.paymentStatus === "failed") {
      payment.retryCount = (payment.retryCount || 0) + 1;
      payment.paymentStatus = "processing";
      payment.transactionStatus = "pending";
      payment.updatedAt = new Date().toISOString();
      payment.failureReason = null;
      console.log("Retrying payment:", payment.transactionId);
    }
  };

  const bulkUpdateStatus = (ids, status) => {
    let updated = 0;
    ids.forEach((id) => {
      const payment = payments.value.find((p) => p.id === id);
      if (payment) {
        payment.paymentStatus = status;
        payment.updatedAt = new Date().toISOString();
        if (status === "completed") {
          payment.completedDate = new Date().toISOString();
        }
        updated++;
      }
    });
    console.log(`Bulk updated ${updated} payments to status: ${status}`);
  };

  const exportPayments = (filters = {}) => {
    let filteredPayments = [...payments.value];

    if (filters.status) {
      filteredPayments = filteredPayments.filter(
        (p) => p.paymentStatus === filters.status
      );
    }
    if (filters.dateRange) {
      // Filter by date range logic
    }

    const csvData = filteredPayments.map((p) => ({
      "Transaction ID": p.transactionId,
      "Patient Name": p.patientName,
      Service: p.serviceName,
      Amount: p.totalAmount,
      Currency: p.currency,
      Status: p.paymentStatus,
      Date: new Date(p.paymentDate).toLocaleDateString(),
      Method: p.paymentMethod,
      Country: p.country,
    }));

    return csvData;
  };

  return {
    payments,
    paymentStats,
    addPayment,
    updatePayment,
    deletePayment,
    processRefund,
    retryPayment,
    bulkUpdateStatus,
    exportPayments,
  };
};
