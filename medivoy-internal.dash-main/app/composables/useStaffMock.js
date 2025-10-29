// composables/useStaffMock.js
export const useStaffMock = () => {
  const staffMembers = ref([
    {
      id: 1,
      employeeId: "EMP-UAE-001",
      firstName: "Sarah",
      lastName: "Al-Mansouri",
      fullName: "Dr. Sarah Al-Mansouri",
      email: "sarah.mansouri@healthcenter.ae",
      phone: "+971-50-123-4567",
      alternatePhone: "+971-4-567-8901",
      personalEmail: "sarah.personal@gmail.com",
      profileImage: "/staff/sarah-mansouri.jpg",
      dateOfBirth: "1985-03-15",
      gender: "female",
      nationality: "Emirati",
      languages: ["arabic", "english", "french"],
      address: {
        street: "Al Wasl Road, Jumeirah 1",
        city: "Dubai",
        state: "Dubai",
        country: "UAE",
        postalCode: "12345",
      },
      emergencyContact: {
        name: "Ahmad Al-Mansouri",
        relationship: "husband",
        phone: "+971-50-234-5678",
        email: "ahmad.mansouri@email.com",
      },
      position: "Senior Cardiologist",
      department: "Cardiology",
      specialization: "Interventional Cardiology",
      qualifications: [
        "MD - Cardiology",
        "Fellowship - Interventional Cardiology",
        "Board Certified",
      ],
      licenseNumber: "DHA-12345",
      licenseExpiry: "2026-12-31",
      employmentType: "full_time",
      contractType: "permanent",
      joinDate: "2020-01-15",
      probationEndDate: "2020-07-15",
      workSchedule: {
        type: "fixed",
        hoursPerWeek: 40,
        workDays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
        shiftStart: "08:00",
        shiftEnd: "17:00",
      },
      salary: {
        currency: "AED",
        amount: 45000,
        type: "monthly",
        effectiveDate: "2024-01-01",
      },
      benefits: [
        "health_insurance",
        "life_insurance",
        "dental",
        "annual_leave",
        "sick_leave",
        "maternity_leave",
      ],
      facilityAccess: ["Dubai Healthcare Center", "Dubai Cardiac Center"],
      systemAccess: ["EHR", "PACS", "Lab System", "Pharmacy"],
      permissions: [
        "patient_management",
        "prescription",
        "lab_orders",
        "radiology_orders",
        "surgery_scheduling",
      ],
      status: "active",
      performance: {
        lastReviewDate: "2024-12-01",
        nextReviewDate: "2025-12-01",
        rating: 4.8,
        goals: ["Increase patient satisfaction", "Complete advanced training"],
        achievements: ["Best Doctor Award 2024", "Published 5 research papers"],
      },
      attendance: {
        totalDays: 240,
        presentDays: 235,
        absentDays: 5,
        lateArrivals: 2,
        attendanceRate: 97.9,
      },
      certifications: [
        {
          name: "Advanced Cardiac Life Support (ACLS)",
          issuer: "American Heart Association",
          issueDate: "2023-01-15",
          expiryDate: "2025-01-15",
          status: "active",
        },
        {
          name: "Board Certification in Cardiology",
          issuer: "UAE Medical Board",
          issueDate: "2019-06-01",
          expiryDate: "2029-06-01",
          status: "active",
        },
      ],
      documents: [
        {
          type: "passport",
          number: "P123456789",
          expiryDate: "2028-05-20",
          status: "verified",
        },
        {
          type: "visa",
          number: "V987654321",
          expiryDate: "2025-08-15",
          status: "active",
        },
      ],
      medicalInfo: {
        bloodType: "O+",
        allergies: ["Penicillin"],
        chronicConditions: [],
        vaccinationStatus: "complete",
        lastMedicalCheckup: "2024-11-01",
      },
      notes:
        "Excellent performance, highly skilled in interventional procedures, great patient feedback",
      tags: ["senior", "cardiology", "interventional", "research"],
      createdAt: "2020-01-10T10:00:00Z",
      updatedAt: "2025-01-15T14:30:00Z",
      createdBy: "HR Manager",
      lastLoginAt: "2025-10-13T08:30:00Z",
      isOnLeave: false,
      currentLeave: null,
      reportingManager: {
        id: 2,
        name: "Dr. Ahmed Hassan",
        position: "Chief of Cardiology",
      },
    },
    {
      id: 2,
      employeeId: "EMP-QAT-002",
      firstName: "Ahmed",
      lastName: "Hassan",
      fullName: "Dr. Ahmed Hassan",
      email: "ahmed.hassan@healthcenter.qa",
      phone: "+974-55-234-5678",
      alternatePhone: "+974-44-123-456",
      personalEmail: "ahmed.hassan.personal@gmail.com",
      profileImage: "/staff/ahmed-hassan.jpg",
      dateOfBirth: "1978-09-22",
      gender: "male",
      nationality: "Egyptian",
      languages: ["arabic", "english"],
      address: {
        street: "West Bay, Tower 15, Floor 25",
        city: "Doha",
        state: "Doha",
        country: "Qatar",
        postalCode: "12345",
      },
      emergencyContact: {
        name: "Fatima Hassan",
        relationship: "wife",
        phone: "+974-55-345-6789",
        email: "fatima.hassan@email.com",
      },
      position: "Chief of Cardiology",
      department: "Cardiology",
      specialization: "Cardiac Surgery",
      qualifications: [
        "MD - Cardiac Surgery",
        "PhD - Cardiovascular Medicine",
        "Board Certified",
      ],
      licenseNumber: "MOPH-67890",
      licenseExpiry: "2026-06-30",
      employmentType: "full_time",
      contractType: "permanent",
      joinDate: "2018-03-01",
      probationEndDate: "2018-09-01",
      workSchedule: {
        type: "flexible",
        hoursPerWeek: 45,
        workDays: [
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
        ],
        shiftStart: "07:00",
        shiftEnd: "16:00",
      },
      salary: {
        currency: "QAR",
        amount: 55000,
        type: "monthly",
        effectiveDate: "2024-01-01",
      },
      benefits: [
        "health_insurance",
        "life_insurance",
        "dental",
        "vision",
        "annual_leave",
        "sick_leave",
        "education_allowance",
      ],
      facilityAccess: ["Doha Medical Complex", "Qatar Cardiac Institute"],
      systemAccess: [
        "EHR",
        "PACS",
        "Lab System",
        "Surgery Management",
        "Admin Portal",
      ],
      permissions: [
        "patient_management",
        "prescription",
        "surgery_approval",
        "staff_management",
        "budget_approval",
      ],
      status: "active",
      performance: {
        lastReviewDate: "2024-11-15",
        nextReviewDate: "2025-11-15",
        rating: 4.9,
        goals: ["Lead cardiac surgery program", "Mentor junior doctors"],
        achievements: [
          "Performed 500+ successful surgeries",
          "Department Head of the Year 2024",
        ],
      },
      attendance: {
        totalDays: 260,
        presentDays: 258,
        absentDays: 2,
        lateArrivals: 0,
        attendanceRate: 99.2,
      },
      certifications: [
        {
          name: "Fellow of the Royal College of Surgeons",
          issuer: "Royal College of Surgeons",
          issueDate: "2015-08-01",
          expiryDate: "2030-08-01",
          status: "active",
        },
      ],
      documents: [
        {
          type: "passport",
          number: "E987654321",
          expiryDate: "2027-12-10",
          status: "verified",
        },
      ],
      medicalInfo: {
        bloodType: "A+",
        allergies: [],
        chronicConditions: [],
        vaccinationStatus: "complete",
        lastMedicalCheckup: "2024-10-15",
      },
      notes:
        "Exceptional leader, excellent surgical skills, great mentor to junior staff",
      tags: ["chief", "surgery", "leadership", "mentor"],
      createdAt: "2018-02-25T09:00:00Z",
      updatedAt: "2024-12-01T16:45:00Z",
      createdBy: "CEO",
      lastLoginAt: "2025-10-13T07:15:00Z",
      isOnLeave: false,
      currentLeave: null,
      reportingManager: {
        id: null,
        name: "CEO",
        position: "Chief Executive Officer",
      },
    },
    {
      id: 3,
      employeeId: "EMP-SAU-003",
      firstName: "Fatima",
      lastName: "Al-Zahra",
      fullName: "Nurse Fatima Al-Zahra",
      email: "fatima.alzahra@healthcenter.sa",
      phone: "+966-50-345-6789",
      alternatePhone: null,
      personalEmail: "fatima.alzahra@hotmail.com",
      profileImage: "/staff/fatima-alzahra.jpg",
      dateOfBirth: "1992-07-10",
      gender: "female",
      nationality: "Saudi Arabian",
      languages: ["arabic", "english"],
      address: {
        street: "King Fahd Road, Al-Olaya District",
        city: "Riyadh",
        state: "Riyadh Province",
        country: "Saudi Arabia",
        postalCode: "11564",
      },
      emergencyContact: {
        name: "Mohammed Al-Zahra",
        relationship: "father",
        phone: "+966-50-456-7890",
        email: "mohammed.alzahra@email.com",
      },
      position: "Senior ICU Nurse",
      department: "Intensive Care Unit",
      specialization: "Critical Care Nursing",
      qualifications: [
        "BSN - Nursing",
        "Critical Care Certification",
        "BLS Certified",
      ],
      licenseNumber: "SCFHS-54321",
      licenseExpiry: "2025-09-30",
      employmentType: "full_time",
      contractType: "permanent",
      joinDate: "2019-06-01",
      probationEndDate: "2019-12-01",
      workSchedule: {
        type: "rotating_shifts",
        hoursPerWeek: 40,
        workDays: ["varies"],
        shiftStart: "varies",
        shiftEnd: "varies",
        shifts: ["day", "evening", "night"],
      },
      salary: {
        currency: "SAR",
        amount: 12000,
        type: "monthly",
        effectiveDate: "2024-01-01",
      },
      benefits: [
        "health_insurance",
        "annual_leave",
        "sick_leave",
        "maternity_leave",
        "housing_allowance",
      ],
      facilityAccess: ["Riyadh Medical Center", "Emergency Department"],
      systemAccess: [
        "EHR",
        "Nursing Documentation",
        "Medication Administration",
      ],
      permissions: [
        "patient_care",
        "medication_administration",
        "documentation",
        "vital_signs",
      ],
      status: "active",
      performance: {
        lastReviewDate: "2024-10-01",
        nextReviewDate: "2025-10-01",
        rating: 4.7,
        goals: ["Complete advanced critical care course", "Mentor new nurses"],
        achievements: [
          "Employee of the Month - August 2024",
          "Perfect attendance 2023",
        ],
      },
      attendance: {
        totalDays: 240,
        presentDays: 240,
        absentDays: 0,
        lateArrivals: 1,
        attendanceRate: 100.0,
      },
      certifications: [
        {
          name: "Basic Life Support (BLS)",
          issuer: "American Heart Association",
          issueDate: "2024-03-01",
          expiryDate: "2026-03-01",
          status: "active",
        },
        {
          name: "Critical Care Registered Nurse (CCRN)",
          issuer: "AACN Certification Corporation",
          issueDate: "2023-01-15",
          expiryDate: "2026-01-15",
          status: "active",
        },
      ],
      documents: [
        {
          type: "national_id",
          number: "1234567890",
          expiryDate: "2030-07-10",
          status: "verified",
        },
      ],
      medicalInfo: {
        bloodType: "B+",
        allergies: ["Latex"],
        chronicConditions: [],
        vaccinationStatus: "complete",
        lastMedicalCheckup: "2024-09-15",
      },
      notes:
        "Dedicated nurse with excellent patient care skills, reliable team member",
      tags: ["icu", "critical care", "senior nurse", "reliable"],
      createdAt: "2019-05-25T14:00:00Z",
      updatedAt: "2024-10-15T11:20:00Z",
      createdBy: "Nursing Manager",
      lastLoginAt: "2025-10-13T06:45:00Z",
      isOnLeave: false,
      currentLeave: null,
      reportingManager: {
        id: 4,
        name: "Maria Rodriguez",
        position: "Nursing Manager",
      },
    },
    {
      id: 4,
      employeeId: "EMP-UAE-004",
      firstName: "Maria",
      lastName: "Rodriguez",
      fullName: "Maria Rodriguez, RN",
      email: "maria.rodriguez@healthcenter.ae",
      phone: "+971-50-456-7890",
      alternatePhone: "+971-4-789-0123",
      personalEmail: "maria.rodriguez.personal@gmail.com",
      profileImage: "/staff/maria-rodriguez.jpg",
      dateOfBirth: "1980-11-18",
      gender: "female",
      nationality: "Filipino",
      languages: ["english", "tagalog", "arabic"],
      address: {
        street: "Discovery Gardens, Building 12",
        city: "Dubai",
        state: "Dubai",
        country: "UAE",
        postalCode: "54321",
      },
      emergencyContact: {
        name: "Carlos Rodriguez",
        relationship: "husband",
        phone: "+971-50-567-8901",
        email: "carlos.rodriguez@email.com",
      },
      position: "Nursing Manager",
      department: "Nursing",
      specialization: "Healthcare Management",
      qualifications: [
        "MSN - Nursing Management",
        "BSN - Nursing",
        "Healthcare Leadership Certificate",
      ],
      licenseNumber: "DHA-67890",
      licenseExpiry: "2025-12-31",
      employmentType: "full_time",
      contractType: "permanent",
      joinDate: "2017-04-01",
      probationEndDate: "2017-10-01",
      workSchedule: {
        type: "fixed",
        hoursPerWeek: 45,
        workDays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
        shiftStart: "08:00",
        shiftEnd: "17:00",
      },
      salary: {
        currency: "AED",
        amount: 22000,
        type: "monthly",
        effectiveDate: "2024-01-01",
      },
      benefits: [
        "health_insurance",
        "life_insurance",
        "dental",
        "annual_leave",
        "sick_leave",
        "education_allowance",
      ],
      facilityAccess: ["Dubai Healthcare Center", "All Nursing Units"],
      systemAccess: [
        "EHR",
        "Staff Management",
        "Scheduling System",
        "HR Portal",
      ],
      permissions: [
        "staff_management",
        "scheduling",
        "performance_review",
        "budget_monitoring",
      ],
      status: "active",
      performance: {
        lastReviewDate: "2024-09-15",
        nextReviewDate: "2025-09-15",
        rating: 4.6,
        goals: ["Improve staff retention", "Implement new training programs"],
        achievements: ["Reduced turnover by 20%", "Excellent team leadership"],
      },
      attendance: {
        totalDays: 250,
        presentDays: 248,
        absentDays: 2,
        lateArrivals: 3,
        attendanceRate: 99.2,
      },
      certifications: [
        {
          name: "Certified Nurse Manager and Leader (CNML)",
          issuer: "American Association of Nurse Assessment Coordination",
          issueDate: "2021-06-01",
          expiryDate: "2026-06-01",
          status: "active",
        },
      ],
      documents: [
        {
          type: "passport",
          number: "P234567890",
          expiryDate: "2028-03-22",
          status: "verified",
        },
        {
          type: "visa",
          number: "V876543210",
          expiryDate: "2025-11-30",
          status: "active",
        },
      ],
      medicalInfo: {
        bloodType: "AB+",
        allergies: [],
        chronicConditions: [],
        vaccinationStatus: "complete",
        lastMedicalCheckup: "2024-08-20",
      },
      notes:
        "Outstanding manager with excellent leadership skills, drives team performance",
      tags: ["manager", "leadership", "nursing", "experienced"],
      createdAt: "2017-03-25T13:00:00Z",
      updatedAt: "2024-11-10T15:30:00Z",
      createdBy: "Chief Nursing Officer",
      lastLoginAt: "2025-10-13T08:00:00Z",
      isOnLeave: false,
      currentLeave: null,
      reportingManager: {
        id: 8,
        name: "Dr. Elena Popov",
        position: "Chief Nursing Officer",
      },
    },
    {
      id: 5,
      employeeId: "EMP-KWT-005",
      firstName: "Omar",
      lastName: "Al-Sabah",
      fullName: "Dr. Omar Al-Sabah",
      email: "omar.alsabah@healthcenter.kw",
      phone: "+965-99-567-8901",
      alternatePhone: null,
      personalEmail: "omar.alsabah@gmail.com",
      profileImage: "/staff/omar-alsabah.jpg",
      dateOfBirth: "1987-04-03",
      gender: "male",
      nationality: "Kuwaiti",
      languages: ["arabic", "english", "german"],
      address: {
        street: "Salmiya, Block 12, Street 5",
        city: "Kuwait City",
        state: "Al Asimah",
        country: "Kuwait",
        postalCode: "22012",
      },
      emergencyContact: {
        name: "Nour Al-Sabah",
        relationship: "sister",
        phone: "+965-99-678-9012",
        email: "nour.alsabah@email.com",
      },
      position: "Orthopedic Surgeon",
      department: "Orthopedics",
      specialization: "Joint Replacement Surgery",
      qualifications: [
        "MD - Orthopedic Surgery",
        "Fellowship - Joint Replacement",
        "Board Certified",
      ],
      licenseNumber: "MOH-KW-11111",
      licenseExpiry: "2026-03-31",
      employmentType: "full_time",
      contractType: "permanent",
      joinDate: "2021-02-01",
      probationEndDate: "2021-08-01",
      workSchedule: {
        type: "fixed",
        hoursPerWeek: 40,
        workDays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
        shiftStart: "08:00",
        shiftEnd: "17:00",
      },
      salary: {
        currency: "KWD",
        amount: 4500,
        type: "monthly",
        effectiveDate: "2024-01-01",
      },
      benefits: [
        "health_insurance",
        "life_insurance",
        "annual_leave",
        "sick_leave",
        "professional_development",
      ],
      facilityAccess: ["Kuwait Medical Center", "Orthopedic Surgery Unit"],
      systemAccess: ["EHR", "PACS", "Surgery Management", "Lab System"],
      permissions: [
        "patient_management",
        "surgery_scheduling",
        "prescription",
        "radiology_orders",
      ],
      status: "active",
      performance: {
        lastReviewDate: "2024-08-01",
        nextReviewDate: "2025-08-01",
        rating: 4.5,
        goals: ["Increase surgical volume", "Research publication"],
        achievements: [
          "100+ successful joint replacements",
          "Patient satisfaction 95%",
        ],
      },
      attendance: {
        totalDays: 230,
        presentDays: 225,
        absentDays: 5,
        lateArrivals: 4,
        attendanceRate: 97.8,
      },
      certifications: [
        {
          name: "Board Certification in Orthopedic Surgery",
          issuer: "Kuwait Medical Board",
          issueDate: "2020-12-01",
          expiryDate: "2025-12-01",
          status: "active",
        },
      ],
      documents: [
        {
          type: "national_id",
          number: "KW123456789",
          expiryDate: "2030-04-03",
          status: "verified",
        },
      ],
      medicalInfo: {
        bloodType: "O-",
        allergies: ["Sulfa drugs"],
        chronicConditions: [],
        vaccinationStatus: "complete",
        lastMedicalCheckup: "2024-07-10",
      },
      notes:
        "Skilled surgeon with growing reputation, good potential for leadership roles",
      tags: ["orthopedic", "surgeon", "joint replacement", "promising"],
      createdAt: "2021-01-25T12:00:00Z",
      updatedAt: "2024-09-20T10:15:00Z",
      createdBy: "Medical Director",
      lastLoginAt: "2025-10-12T16:30:00Z",
      isOnLeave: false,
      currentLeave: null,
      reportingManager: {
        id: 6,
        name: "Dr. Hassan Al-Ahmad",
        position: "Chief of Orthopedics",
      },
    },
    {
      id: 6,
      employeeId: "EMP-BHR-006",
      firstName: "Aisha",
      lastName: "Mahmoud",
      fullName: "Pharmacist Aisha Mahmoud",
      email: "aisha.mahmoud@healthcenter.bh",
      phone: "+973-33-678-9012",
      alternatePhone: "+973-17-123-456",
      personalEmail: "aisha.mahmoud@outlook.com",
      profileImage: "/staff/aisha-mahmoud.jpg",
      dateOfBirth: "1990-12-05",
      gender: "female",
      nationality: "Bahraini",
      languages: ["arabic", "english"],
      address: {
        street: "Adliya, Building 25, Flat 12",
        city: "Manama",
        state: "Capital Governorate",
        country: "Bahrain",
        postalCode: "317",
      },
      emergencyContact: {
        name: "Khalid Mahmoud",
        relationship: "brother",
        phone: "+973-33-789-0123",
        email: "khalid.mahmoud@email.com",
      },
      position: "Clinical Pharmacist",
      department: "Pharmacy",
      specialization: "Clinical Pharmacy",
      qualifications: [
        "PharmD - Doctor of Pharmacy",
        "Clinical Pharmacy Residency",
        "Board Certified",
      ],
      licenseNumber: "NHRA-PH-2345",
      licenseExpiry: "2025-11-30",
      employmentType: "full_time",
      contractType: "permanent",
      joinDate: "2020-09-01",
      probationEndDate: "2021-03-01",
      workSchedule: {
        type: "fixed",
        hoursPerWeek: 40,
        workDays: ["saturday", "sunday", "monday", "tuesday", "wednesday"],
        shiftStart: "08:00",
        shiftEnd: "17:00",
      },
      salary: {
        currency: "BHD",
        amount: 1800,
        type: "monthly",
        effectiveDate: "2024-01-01",
      },
      benefits: [
        "health_insurance",
        "annual_leave",
        "sick_leave",
        "professional_development",
      ],
      facilityAccess: ["Manama Medical Center", "Central Pharmacy", "ICU"],
      systemAccess: [
        "Pharmacy Management System",
        "EHR",
        "Drug Interaction Checker",
      ],
      permissions: [
        "medication_dispensing",
        "clinical_review",
        "drug_information",
        "patient_counseling",
      ],
      status: "active",
      performance: {
        lastReviewDate: "2024-09-01",
        nextReviewDate: "2025-09-01",
        rating: 4.4,
        goals: [
          "Complete board certification",
          "Implement medication therapy management",
        ],
        achievements: [
          "Zero medication errors 2024",
          "Published pharmacy protocol",
        ],
      },
      attendance: {
        totalDays: 245,
        presentDays: 242,
        absentDays: 3,
        lateArrivals: 2,
        attendanceRate: 98.8,
      },
      certifications: [
        {
          name: "Board Certified Pharmacotherapy Specialist (BCPS)",
          issuer: "Board of Pharmacy Specialties",
          issueDate: "2023-05-01",
          expiryDate: "2030-05-01",
          status: "active",
        },
      ],
      documents: [
        {
          type: "national_id",
          number: "BH987654321",
          expiryDate: "2029-12-05",
          status: "verified",
        },
      ],
      medicalInfo: {
        bloodType: "A-",
        allergies: ["Shellfish"],
        chronicConditions: [],
        vaccinationStatus: "complete",
        lastMedicalCheckup: "2024-06-15",
      },
      notes:
        "Knowledgeable pharmacist with strong clinical skills, excellent patient interaction",
      tags: ["pharmacy", "clinical", "board certified", "patient care"],
      createdAt: "2020-08-25T11:00:00Z",
      updatedAt: "2024-10-05T13:45:00Z",
      createdBy: "Pharmacy Manager",
      lastLoginAt: "2025-10-13T07:30:00Z",
      isOnLeave: false,
      currentLeave: null,
      reportingManager: {
        id: 7,
        name: "Dr. Rashid Al-Khalifa",
        position: "Chief Pharmacist",
      },
    },
    {
      id: 7,
      employeeId: "EMP-OMN-007",
      firstName: "Yusuf",
      lastName: "Al-Busaidi",
      fullName: "Lab Technician Yusuf Al-Busaidi",
      email: "yusuf.busaidi@healthcenter.om",
      phone: "+968-90-789-0123",
      alternatePhone: null,
      personalEmail: "yusuf.busaidi@gmail.com",
      profileImage: "/staff/yusuf-busaidi.jpg",
      dateOfBirth: "1993-06-28",
      gender: "male",
      nationality: "Omani",
      languages: ["arabic", "english"],
      address: {
        street: "Al-Khuwair, Street 15, House 45",
        city: "Muscat",
        state: "Muscat Governorate",
        country: "Oman",
        postalCode: "112",
      },
      emergencyContact: {
        name: "Amina Al-Busaidi",
        relationship: "mother",
        phone: "+968-90-890-1234",
        email: "amina.busaidi@email.com",
      },
      position: "Senior Laboratory Technician",
      department: "Laboratory",
      specialization: "Clinical Chemistry",
      qualifications: [
        "BS - Medical Laboratory Science",
        "Clinical Chemistry Certification",
      ],
      licenseNumber: "MOH-OM-7890",
      licenseExpiry: "2025-06-30",
      employmentType: "full_time",
      contractType: "permanent",
      joinDate: "2021-08-15",
      probationEndDate: "2022-02-15",
      workSchedule: {
        type: "rotating_shifts",
        hoursPerWeek: 40,
        workDays: ["varies"],
        shiftStart: "varies",
        shiftEnd: "varies",
        shifts: ["morning", "evening", "night"],
      },
      salary: {
        currency: "OMR",
        amount: 950,
        type: "monthly",
        effectiveDate: "2024-01-01",
      },
      benefits: [
        "health_insurance",
        "annual_leave",
        "sick_leave",
        "shift_allowance",
      ],
      facilityAccess: [
        "Muscat Medical Center",
        "Central Laboratory",
        "Emergency Lab",
      ],
      systemAccess: ["Lab Information System", "EHR", "Quality Control System"],
      permissions: [
        "sample_processing",
        "test_results",
        "quality_control",
        "equipment_maintenance",
      ],
      status: "active",
      performance: {
        lastReviewDate: "2024-08-15",
        nextReviewDate: "2025-08-15",
        rating: 4.3,
        goals: [
          "Complete advanced chemistry training",
          "Reduce turnaround time",
        ],
        achievements: ["99% accuracy rate", "Implemented new testing protocol"],
      },
      attendance: {
        totalDays: 240,
        presentDays: 237,
        absentDays: 3,
        lateArrivals: 1,
        attendanceRate: 98.7,
      },
      certifications: [
        {
          name: "Medical Laboratory Technician Certification",
          issuer: "Oman Medical Association",
          issueDate: "2021-07-01",
          expiryDate: "2026-07-01",
          status: "active",
        },
      ],
      documents: [
        {
          type: "national_id",
          number: "OM123456789",
          expiryDate: "2028-06-28",
          status: "verified",
        },
      ],
      medicalInfo: {
        bloodType: "B-",
        allergies: [],
        chronicConditions: [],
        vaccinationStatus: "complete",
        lastMedicalCheckup: "2024-05-20",
      },
      notes:
        "Reliable technician with good technical skills, consistent performance",
      tags: ["laboratory", "chemistry", "technical", "reliable"],
      createdAt: "2021-08-10T09:00:00Z",
      updatedAt: "2024-08-20T14:20:00Z",
      createdBy: "Lab Manager",
      lastLoginAt: "2025-10-12T22:15:00Z",
      isOnLeave: false,
      currentLeave: null,
      reportingManager: {
        id: 8,
        name: "Dr. Samira Al-Lawati",
        position: "Laboratory Manager",
      },
    },
    {
      id: 8,
      employeeId: "EMP-JOR-008",
      firstName: "Layla",
      lastName: "Mansour",
      fullName: "Dr. Layla Mansour",
      email: "layla.mansour@healthcenter.jo",
      phone: "+962-79-890-1234",
      alternatePhone: "+962-6-123-4567",
      personalEmail: "layla.mansour@yahoo.com",
      profileImage: "/staff/layla-mansour.jpg",
      dateOfBirth: "1983-01-12",
      gender: "female",
      nationality: "Jordanian",
      languages: ["arabic", "english", "french"],
      address: {
        street: "Abdoun, Villa 123",
        city: "Amman",
        state: "Amman Governorate",
        country: "Jordan",
        postalCode: "11183",
      },
      emergencyContact: {
        name: "Tariq Mansour",
        relationship: "husband",
        phone: "+962-79-901-2345",
        email: "tariq.mansour@email.com",
      },
      position: "Radiologist",
      department: "Radiology",
      specialization: "Diagnostic Imaging",
      qualifications: [
        "MD - Radiology",
        "Fellowship - Body Imaging",
        "Board Certified",
      ],
      licenseNumber: "JMC-RAD-4567",
      licenseExpiry: "2026-01-31",
      employmentType: "full_time",
      contractType: "permanent",
      joinDate: "2019-10-01",
      probationEndDate: "2020-04-01",
      workSchedule: {
        type: "fixed",
        hoursPerWeek: 40,
        workDays: ["sunday", "monday", "tuesday", "wednesday", "thursday"],
        shiftStart: "08:00",
        shiftEnd: "17:00",
      },
      salary: {
        currency: "JOD",
        amount: 3200,
        type: "monthly",
        effectiveDate: "2024-01-01",
      },
      benefits: [
        "health_insurance",
        "life_insurance",
        "annual_leave",
        "sick_leave",
        "professional_development",
      ],
      facilityAccess: [
        "Amman Medical Center",
        "Radiology Department",
        "Emergency Imaging",
      ],
      systemAccess: ["PACS", "RIS", "EHR", "Reporting System"],
      permissions: [
        "image_interpretation",
        "report_generation",
        "urgent_reads",
        "consultation",
      ],
      status: "active",
      performance: {
        lastReviewDate: "2024-10-01",
        nextReviewDate: "2025-10-01",
        rating: 4.6,
        goals: ["Reduce reporting time", "Increase accuracy"],
        achievements: [
          "99.2% diagnostic accuracy",
          "Fastest turnaround time in department",
        ],
      },
      attendance: {
        totalDays: 240,
        presentDays: 238,
        absentDays: 2,
        lateArrivals: 0,
        attendanceRate: 99.2,
      },
      certifications: [
        {
          name: "Board Certification in Diagnostic Radiology",
          issuer: "Jordan Medical Council",
          issueDate: "2018-06-01",
          expiryDate: "2028-06-01",
          status: "active",
        },
      ],
      documents: [
        {
          type: "national_id",
          number: "JO987654321",
          expiryDate: "2028-01-12",
          status: "verified",
        },
      ],
      medicalInfo: {
        bloodType: "AB-",
        allergies: ["Contrast agents (iodine-based)"],
        chronicConditions: [],
        vaccinationStatus: "complete",
        lastMedicalCheckup: "2024-04-10",
      },
      notes:
        "Excellent radiologist with high accuracy, quick reporting, good team player",
      tags: ["radiology", "diagnostic", "accurate", "efficient"],
      createdAt: "2019-09-25T12:30:00Z",
      updatedAt: "2024-10-15T09:45:00Z",
      createdBy: "Radiology Director",
      lastLoginAt: "2025-10-13T08:45:00Z",
      isOnLeave: false,
      currentLeave: null,
      reportingManager: {
        id: 9,
        name: "Dr. Ahmad Al-Khouri",
        position: "Chief of Radiology",
      },
    },
  ]);

  const staffStats = computed(() => {
    const total = staffMembers.value.length;
    const active = staffMembers.value.filter(
      (s) => s.status === "active"
    ).length;
    const onLeave = staffMembers.value.filter((s) => s.isOnLeave).length;

    const departments = staffMembers.value.reduce((acc, s) => {
      acc[s.department] = (acc[s.department] || 0) + 1;
      return acc;
    }, {});

    const positions = staffMembers.value.reduce((acc, s) => {
      const role = s.position.includes("Dr.")
        ? "Doctor"
        : s.position.includes("Nurse")
        ? "Nurse"
        : s.position.includes("Technician")
        ? "Technician"
        : s.position.includes("Pharmacist")
        ? "Pharmacist"
        : "Other";
      acc[role] = (acc[role] || 0) + 1;
      return acc;
    }, {});

    const countries = staffMembers.value.reduce((acc, s) => {
      acc[s.address.country] = (acc[s.address.country] || 0) + 1;
      return acc;
    }, {});

    const avgRating =
      staffMembers.value.reduce((sum, s) => sum + s.performance.rating, 0) /
      total;

    return {
      totalStaff: total,
      activeStaff: active,
      onLeaveStaff: onLeave,
      departments,
      positions,
      countries,
      averageRating: Math.round(avgRating * 10) / 10,
    };
  });

  const addStaffMember = (staffData) => {
    const newStaff = {
      ...staffData,
      id: Math.max(...staffMembers.value.map((s) => s.id)) + 1,
      employeeId: `EMP-${staffData.address.country
        .substring(0, 3)
        .toUpperCase()}-${String(
        Math.max(
          ...staffMembers.value.map((s) => parseInt(s.employeeId.split("-")[2]))
        ) + 1
      ).padStart(3, "0")}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastLoginAt: null,
      performance: {
        lastReviewDate: null,
        nextReviewDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        rating: 0,
        goals: [],
        achievements: [],
      },
      attendance: {
        totalDays: 0,
        presentDays: 0,
        absentDays: 0,
        lateArrivals: 0,
        attendanceRate: 0,
      },
    };
    staffMembers.value.unshift(newStaff);
    console.log("Added new staff member:", newStaff.fullName);
  };

  const updateStaffMember = (id, staffData) => {
    const index = staffMembers.value.findIndex((s) => s.id === id);
    if (index !== -1) {
      staffMembers.value[index] = {
        ...staffMembers.value[index],
        ...staffData,
        updatedAt: new Date().toISOString(),
      };
      console.log("Updated staff member:", staffMembers.value[index].fullName);
    }
  };

  const deleteStaffMember = (id) => {
    const index = staffMembers.value.findIndex((s) => s.id === id);
    if (index !== -1) {
      const deletedStaff = staffMembers.value[index];
      staffMembers.value.splice(index, 1);
      console.log("Deleted staff member:", deletedStaff.fullName);
    }
  };

  const bulkUpdateStatus = (ids, status) => {
    let updated = 0;
    ids.forEach((id) => {
      const staff = staffMembers.value.find((s) => s.id === id);
      if (staff) {
        staff.status = status;
        staff.updatedAt = new Date().toISOString();
        updated++;
      }
    });
    console.log(`Bulk updated ${updated} staff members to status: ${status}`);
  };

  const updateAttendance = (id, attendanceData) => {
    const staff = staffMembers.value.find((s) => s.id === id);
    if (staff) {
      staff.attendance = { ...staff.attendance, ...attendanceData };
      staff.updatedAt = new Date().toISOString();
    }
  };

  const updatePerformance = (id, performanceData) => {
    const staff = staffMembers.value.find((s) => s.id === id);
    if (staff) {
      staff.performance = { ...staff.performance, ...performanceData };
      staff.updatedAt = new Date().toISOString();
    }
  };

  return {
    staffMembers,
    staffStats,
    addStaffMember,
    updateStaffMember,
    deleteStaffMember,
    bulkUpdateStatus,
    updateAttendance,
    updatePerformance,
  };
};
