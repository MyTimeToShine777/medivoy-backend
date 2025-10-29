// composables/useFAQsMock.js
export const useFAQsMock = () => {
  const faqs = ref([
    {
      id: 1,
      question: "How do I book an appointment?",
      answer: `You can book an appointment through multiple ways:
      
**Online Booking:**
1. Visit our website or open our mobile app
2. Select the doctor or service you need
3. Choose your preferred date and time
4. Provide basic details and confirm booking
5. You'll receive a confirmation via SMS and email

**Phone Booking:**
- Call our helpline: +91 1800-123-4567
- Available 24/7 for appointment booking
- Our staff will help you find the best available slot

**Walk-in:**
- Visit our reception desk during working hours
- Subject to availability
- May involve waiting time`,
      category: "appointments",
      subcategory: "booking",
      priority: "high",
      isPublic: true,
      isActive: true,
      isFeatured: true,
      tags: ["booking", "appointment", "online", "phone"],
      targetAudience: ["new_patients", "general_users"],
      relatedFAQs: [2, 3, 4],
      searchKeywords: [
        "book appointment",
        "schedule",
        "doctor appointment",
        "online booking",
      ],
      views: 2847,
      helpful: 2156,
      notHelpful: 89,
      lastUpdated: "2025-10-10T14:30:00Z",
      createdAt: "2025-08-15T10:00:00Z",
      updatedBy: "Customer Support Team",
    },
    {
      id: 2,
      question: "Can I cancel or reschedule my appointment?",
      answer: `Yes, you can cancel or reschedule your appointment:

**Online Cancellation/Rescheduling:**
- Login to your account on website/app
- Go to "My Appointments" section
- Click on the appointment you want to modify
- Choose "Cancel" or "Reschedule" option

**Phone Cancellation:**
- Call our helpline: +91 1800-123-4567
- Provide your appointment reference number
- Our staff will help you cancel or reschedule

**Cancellation Policy:**
- **24+ hours before**: Full refund
- **12-24 hours before**: 50% refund
- **Less than 12 hours**: No refund
- **Medical Emergency**: Case-by-case consideration

**Rescheduling:**
- Can be done up to 2 hours before appointment
- Subject to doctor's availability
- No additional charges for rescheduling`,
      category: "appointments",
      subcategory: "modification",
      priority: "high",
      isPublic: true,
      isActive: true,
      isFeatured: true,
      tags: ["cancel", "reschedule", "modify appointment", "refund"],
      targetAudience: ["existing_patients", "general_users"],
      relatedFAQs: [1, 3, 15],
      searchKeywords: [
        "cancel appointment",
        "reschedule",
        "change appointment",
        "refund",
      ],
      views: 1945,
      helpful: 1723,
      notHelpful: 67,
      lastUpdated: "2025-10-08T11:15:00Z",
      createdAt: "2025-08-15T10:30:00Z",
      updatedBy: "Customer Support Team",
    },
    {
      id: 3,
      question: "What payment methods do you accept?",
      answer: `We accept multiple payment methods for your convenience:

**Online Payments:**
- Credit/Debit Cards (Visa, Mastercard, RuPay)
- Net Banking from all major banks
- UPI (Google Pay, PhonePe, Paytm, etc.)
- Digital Wallets (Paytm, Amazon Pay, etc.)

**Offline Payments:**
- Cash payments at reception
- Card payments at our facility
- Cheque payments (for packages above ₹5000)

**Insurance:**
- Most major insurance providers accepted
- Cashless treatment available
- Insurance claim assistance provided
- Corporate insurance welcome

**Payment Security:**
- All online transactions are encrypted
- PCI DSS compliant payment gateway
- No card details stored on our servers
- Secure 2-factor authentication

**Refund Policy:**
- Refunds processed within 5-7 business days
- Refunded to original payment method
- No processing fees for refunds`,
      category: "payments",
      subcategory: "methods",
      priority: "high",
      isPublic: true,
      isActive: true,
      isFeatured: true,
      tags: ["payment", "methods", "insurance", "refund", "security"],
      targetAudience: ["all_users"],
      relatedFAQs: [2, 14, 16],
      searchKeywords: [
        "payment methods",
        "insurance",
        "refund",
        "credit card",
        "upi",
      ],
      views: 1687,
      helpful: 1523,
      notHelpful: 43,
      lastUpdated: "2025-10-05T16:20:00Z",
      createdAt: "2025-08-15T11:00:00Z",
      updatedBy: "Billing Team",
    },
    {
      id: 4,
      question: "How do I prepare for my lab tests?",
      answer: `Preparation varies by test type. Here are common guidelines:

**Fasting Tests:**
- Fast for 8-12 hours before test
- Only water is allowed during fasting
- Avoid alcohol 24 hours before
- Take regular medications unless advised otherwise

**Common Fasting Tests:**
- Glucose/Blood Sugar tests
- Lipid Profile
- Liver Function Tests
- Some hormone tests

**Non-Fasting Tests:**
- Complete Blood Count (CBC)
- Thyroid Function Tests  
- Most urine tests
- COVID-19 tests

**Special Instructions:**
- **Urine Tests**: Collect first morning sample when possible
- **Stool Tests**: Avoid certain medications as advised
- **Hormone Tests**: May need to be done at specific times

**What to Bring:**
- Doctor's prescription/requisition
- Previous test reports
- Valid ID proof
- Insurance card (if applicable)

**Before Coming:**
- Wear comfortable clothing
- Stay hydrated (unless fasting)
- Get adequate sleep
- Inform about any medications

**Note**: Always follow specific instructions provided by your doctor or our lab team.`,
      category: "lab_tests",
      subcategory: "preparation",
      priority: "medium",
      isPublic: true,
      isActive: true,
      isFeatured: false,
      tags: ["lab tests", "preparation", "fasting", "instructions"],
      targetAudience: ["patients"],
      relatedFAQs: [5, 6],
      searchKeywords: [
        "lab test preparation",
        "fasting",
        "blood test",
        "urine test",
      ],
      views: 1432,
      helpful: 1389,
      notHelpful: 28,
      lastUpdated: "2025-09-28T09:45:00Z",
      createdAt: "2025-08-16T14:00:00Z",
      updatedBy: "Laboratory Team",
    },
    {
      id: 5,
      question: "When will I get my test results?",
      answer: `Test result timing depends on the type of test:

**Same Day Results:**
- Basic blood tests (CBC, Blood Sugar)
- Urine routine examination
- Rapid diagnostic tests
- COVID-19 rapid antigen tests
- Available by evening if done in morning

**24-48 Hour Results:**
- Comprehensive metabolic panels
- Thyroid function tests
- Liver and kidney function tests
- Most routine blood chemistry tests

**3-5 Day Results:**
- Culture tests (blood, urine, stool)
- Hormone tests (some specialized)
- Tumor marker tests
- Genetic tests

**1-2 Week Results:**
- Specialized genetic tests
- Complex pathology tests
- Some rare disease tests
- Detailed analysis tests

**How You'll Receive Results:**
- SMS notification when ready
- Email with downloadable PDF
- Available in patient portal/app
- Physical copy at reception

**Emergency Results:**
Critical values are communicated immediately to your doctor and you via phone call.

**Note**: Timing may vary during weekends and holidays.`,
      category: "lab_tests",
      subcategory: "results",
      priority: "medium",
      isPublic: true,
      isActive: true,
      isFeatured: false,
      tags: ["test results", "timing", "report", "notification"],
      targetAudience: ["patients"],
      relatedFAQs: [4, 6, 7],
      searchKeywords: ["test results", "lab report", "when results ready"],
      views: 1289,
      helpful: 1198,
      notHelpful: 35,
      lastUpdated: "2025-09-25T13:30:00Z",
      createdAt: "2025-08-16T14:30:00Z",
      updatedBy: "Laboratory Team",
    },
    {
      id: 6,
      question: "Do you provide home sample collection?",
      answer: `Yes, we offer convenient home sample collection services:

**Available Services:**
- Blood sample collection
- Urine sample collection
- Basic diagnostic tests
- Health package services

**Service Areas:**
- Within 25 km radius of our main facility
- Major residential areas covered
- Some remote areas on request basis

**Booking Home Collection:**
1. Call our helpline: +91 1800-123-4567
2. Book through website/mobile app
3. WhatsApp booking: +91 98765-43210

**Charges:**
- ₹150 service charge for home visits
- Free for orders above ₹1000
- Additional charges for remote areas

**What We Provide:**
- Trained phlebotomist visit
- All collection equipment
- Safe sample transportation
- Same result delivery timeline

**Requirements:**
- Advance booking required
- Minimum 2-hour notice
- Someone must be present at home
- Valid ID proof required

**Time Slots:**
- Morning: 7:00 AM - 11:00 AM
- Evening: 4:00 PM - 7:00 PM
- Emergency collection available

**Safety Measures:**
- Trained and certified staff
- Proper sanitization protocols
- Contactless payment options
- COVID-19 safety compliance`,
      category: "lab_tests",
      subcategory: "home_service",
      priority: "medium",
      isPublic: true,
      isActive: true,
      isFeatured: true,
      tags: [
        "home collection",
        "phlebotomy",
        "sample collection",
        "convenience",
      ],
      targetAudience: ["patients", "elderly", "families"],
      relatedFAQs: [4, 5],
      searchKeywords: [
        "home collection",
        "sample collection at home",
        "phlebotomist",
      ],
      views: 956,
      helpful: 892,
      notHelpful: 21,
      lastUpdated: "2025-09-20T10:15:00Z",
      createdAt: "2025-08-17T11:00:00Z",
      updatedBy: "Home Service Team",
    },
    {
      id: 7,
      question: "How can I access my medical records?",
      answer: `You can access your medical records through multiple channels:

**Online Access:**
1. **Patient Portal**: 
   - Login to our website with your credentials
   - Navigate to "Medical Records" section
   - View, download, or print records

2. **Mobile App**:
   - Download our official app
   - Login with same credentials
   - Access records on the go

**What's Available Online:**
- Consultation notes and prescriptions
- Lab test results and reports
- Imaging reports (X-ray, ultrasound, etc.)
- Vaccination records
- Treatment history
- Appointment history

**Physical Records:**
- Visit our medical records department
- Bring valid photo ID
- Request form needs to be filled
- Available during working hours (9 AM - 6 PM)

**Record Requests:**
- For insurance claims
- For second opinions
- For specialist referrals
- For legal purposes

**Charges:**
- Online access: Free
- Physical copies: ₹10 per page
- CD/Digital copies: ₹50

**Processing Time:**
- Online: Immediate access
- Physical copies: 24-48 hours
- Bulk requests: 3-5 business days

**Privacy & Security:**
- Secure login required
- Data encrypted and protected
- Access logs maintained
- HIPAA compliant systems`,
      category: "medical_records",
      subcategory: "access",
      priority: "medium",
      isPublic: true,
      isActive: true,
      isFeatured: false,
      tags: ["medical records", "patient portal", "access", "privacy"],
      targetAudience: ["patients"],
      relatedFAQs: [8, 9],
      searchKeywords: [
        "medical records",
        "patient portal",
        "access records",
        "download reports",
      ],
      views: 743,
      helpful: 695,
      notHelpful: 18,
      lastUpdated: "2025-09-15T14:45:00Z",
      createdAt: "2025-08-18T09:30:00Z",
      updatedBy: "IT Support Team",
    },
    {
      id: 8,
      question: "What are your visiting hours?",
      answer: `Our facility operates with the following hours:

**General OPD (Outpatient Department):**
- Monday to Saturday: 8:00 AM - 8:00 PM
- Sunday: 9:00 AM - 6:00 PM
- Public Holidays: 10:00 AM - 4:00 PM

**Emergency Services:**
- 24/7 availability
- Fully staffed round the clock
- Ambulance services available

**Specialist Consultations:**
- Varies by doctor's schedule
- Generally: 9:00 AM - 6:00 PM
- Evening slots available for some specialists

**Laboratory Services:**
- Sample collection: 6:00 AM - 10:00 PM
- Report collection: 8:00 AM - 8:00 PM
- Home collection: 7:00 AM - 7:00 PM

**Pharmacy:**
- Monday to Saturday: 8:00 AM - 10:00 PM
- Sunday: 9:00 AM - 9:00 PM
- Emergency medicines: 24/7

**Administrative Services:**
- Registration: 8:00 AM - 6:00 PM
- Insurance desk: 9:00 AM - 5:00 PM
- Medical records: 9:00 AM - 6:00 PM

**Patient Visiting (for admitted patients):**
- General wards: 11:00 AM - 1:00 PM, 4:00 PM - 7:00 PM
- ICU: 11:00 AM - 12:00 PM, 6:00 PM - 7:00 PM
- Private rooms: 10:00 AM - 8:00 PM

**COVID-19 Adjustments:**
- Limited visitors allowed
- Mandatory mask and sanitization
- Screening at entry points

**Contact Information:**
- Main reception: +91 1800-123-4567
- Emergency: 108 or +91 1800-URGENT`,
      category: "general",
      subcategory: "visiting_hours",
      priority: "high",
      isPublic: true,
      isActive: true,
      isFeatured: true,
      tags: ["visiting hours", "timing", "emergency", "pharmacy"],
      targetAudience: ["all_users", "visitors"],
      relatedFAQs: [1, 9],
      searchKeywords: [
        "visiting hours",
        "hospital timings",
        "emergency hours",
        "pharmacy hours",
      ],
      views: 1876,
      helpful: 1743,
      notHelpful: 52,
      lastUpdated: "2025-10-01T08:00:00Z",
      createdAt: "2025-08-15T08:00:00Z",
      updatedBy: "Administration",
    },
    {
      id: 9,
      question: "Do you accept insurance?",
      answer: `Yes, we work with most major insurance providers:

**Accepted Insurance Companies:**
- Star Health Insurance
- HDFC ERGO Health Insurance  
- ICICI Lombard Health Insurance
- Bajaj Allianz Health Insurance
- New India Assurance
- Oriental Insurance
- United India Insurance
- National Insurance

**Corporate Insurance:**
- Most corporate health plans accepted
- Cashless facility available
- Direct billing arrangements
- Group insurance policies covered

**Government Schemes:**
- Ayushman Bharat (PM-JAY)
- CGHS (Central Government Health Scheme)
- State government health schemes
- ESI (Employee State Insurance)

**How to Use Insurance:**

**For Cashless Treatment:**
1. Inform at registration about insurance
2. Provide insurance card and ID
3. We'll verify coverage and get pre-authorization
4. Treatment proceeds without upfront payment
5. Settlement done directly with insurance company

**For Reimbursement:**
1. Pay for treatment initially
2. Collect all bills and medical reports
3. Submit claim to your insurance company
4. We provide all necessary documentation

**What's Covered:**
- Consultations and procedures
- Diagnostic tests and imaging
- Medications (as per policy)
- Room charges (within limits)
- Surgical procedures

**Documentation Required:**
- Original insurance card
- Valid photo ID (Aadhaar, PAN, etc.)
- Employment ID (for corporate insurance)
- Previous claims history (if any)

**Insurance Desk Hours:**
- Monday to Saturday: 9:00 AM - 5:00 PM
- For queries: +91 1800-123-4567 ext. 456`,
      category: "insurance",
      subcategory: "acceptance",
      priority: "high",
      isPublic: true,
      isActive: true,
      isFeatured: true,
      tags: [
        "insurance",
        "cashless",
        "reimbursement",
        "corporate",
        "government schemes",
      ],
      targetAudience: ["insured_patients", "corporate_employees"],
      relatedFAQs: [3, 10],
      searchKeywords: [
        "insurance accepted",
        "cashless treatment",
        "ayushman bharat",
        "corporate insurance",
      ],
      views: 1654,
      helpful: 1521,
      notHelpful: 41,
      lastUpdated: "2025-09-30T12:00:00Z",
      createdAt: "2025-08-15T12:00:00Z",
      updatedBy: "Insurance Team",
    },
    {
      id: 10,
      question: "How do I get a second opinion?",
      answer: `We encourage and facilitate second opinions for your peace of mind:

**Internal Second Opinion:**
- Consult another specialist in our facility
- No additional consultation fees
- Access to all your existing records
- Coordinated care between doctors

**External Second Opinion:**
- We provide all necessary medical records
- Detailed reports and imaging on CD/email
- Treatment summary and recommendations
- Support letter for the consulting doctor

**How to Request:**

**For Internal Second Opinion:**
1. Inform your current doctor
2. Doctor will recommend appropriate specialist
3. Appointment can be booked immediately
4. All records are available internally

**For External Second Opinion:**
1. Request medical records at reception
2. Fill out release authorization form
3. Specify which documents you need
4. Records provided in 24-48 hours

**What We Provide:**
- Complete medical history
- Diagnostic test results
- Imaging studies (X-rays, CT, MRI)
- Treatment plans and prescriptions
- Surgical reports (if applicable)
- Pathology reports

**Formats Available:**
- Physical copies
- Digital copies on CD/DVD
- Email transmission (encrypted)
- Direct doctor-to-doctor communication

**Charges:**
- Internal second opinion: Free
- Medical records: ₹10 per page
- Digital copies: ₹50
- Express service: ₹100 additional

**Timeline:**
- Internal consultation: Same day possible
- Records preparation: 24-48 hours
- Rush requests: Same day (additional charges)

**Privacy & Confidentiality:**
- Patient consent required for sharing
- Secure transmission methods used
- Records shared only with authorized persons
- Complete confidentiality maintained

**Support:**
- Our team helps coordinate with external doctors
- Clarifications provided if needed
- Follow-up support available`,
      category: "medical_care",
      subcategory: "second_opinion",
      priority: "medium",
      isPublic: true,
      isActive: true,
      isFeatured: false,
      tags: [
        "second opinion",
        "medical records",
        "specialist consultation",
        "external opinion",
      ],
      targetAudience: ["patients", "families"],
      relatedFAQs: [7, 9],
      searchKeywords: [
        "second opinion",
        "another doctor",
        "medical records transfer",
        "specialist consultation",
      ],
      views: 567,
      helpful: 523,
      notHelpful: 15,
      lastUpdated: "2025-09-22T11:30:00Z",
      createdAt: "2025-08-19T10:00:00Z",
      updatedBy: "Medical Team",
    },
    {
      id: 11,
      question: "Do you have telemedicine services?",
      answer: `Yes, we offer comprehensive telemedicine services for your convenience:

**Available Services:**
- Video consultations with doctors
- Follow-up appointments
- Prescription renewals
- Medical advice and guidance
- Health monitoring discussions

**Specialties Available:**
- General Medicine
- Pediatrics
- Gynecology
- Dermatology
- Psychiatry
- Endocrinology
- Cardiology (consultations only)

**How to Book:**
1. **Website/App**: Select "Video Consultation"
2. **Phone**: Call +91 1800-123-4567
3. **WhatsApp**: Message +91 98765-43210

**Technical Requirements:**
- Stable internet connection
- Smartphone/tablet/computer with camera
- Updated browser or our mobile app
- Quiet, well-lit room for consultation

**Consultation Process:**
1. Book appointment and make payment
2. Receive meeting link via SMS/email
3. Join the call at scheduled time
4. Have consultation with doctor
5. Receive prescription via email/app

**What You Can Expect:**
- Professional video consultation
- Detailed discussion of symptoms
- Medical advice and guidance
- Digital prescription (where applicable)
- Follow-up recommendations

**Limitations:**
- Physical examination not possible
- Some conditions require in-person visit
- Emergency situations need immediate care
- Controlled substances may not be prescribed

**Charges:**
- Video consultation: ₹400-₹800 (varies by specialist)
- Follow-up: 50% of original fee
- Technical support: Free

**Payment Methods:**
- Credit/Debit cards
- UPI payments
- Net banking
- Digital wallets

**Prescription Delivery:**
- Digital prescription immediately
- Medicine home delivery available
- Express delivery options
- Insurance coverage (where applicable)

**Privacy & Security:**
- Encrypted video calls
- HIPAA compliant platform
- No recordings stored
- Complete confidentiality maintained

**Technical Support:**
- Available during consultation hours
- Help with app/website issues
- Connection troubleshooting
- Alternative communication methods`,
      category: "telemedicine",
      subcategory: "services",
      priority: "medium",
      isPublic: true,
      isActive: true,
      isFeatured: true,
      tags: [
        "telemedicine",
        "video consultation",
        "online doctor",
        "digital health",
      ],
      targetAudience: ["all_users", "remote_patients"],
      relatedFAQs: [1, 3],
      searchKeywords: [
        "telemedicine",
        "video consultation",
        "online doctor",
        "digital consultation",
      ],
      views: 1123,
      helpful: 987,
      notHelpful: 34,
      lastUpdated: "2025-10-02T15:20:00Z",
      createdAt: "2025-08-20T09:00:00Z",
      updatedBy: "Telemedicine Team",
    },
    {
      id: 12,
      question: "What COVID-19 safety measures do you have?",
      answer: `We have implemented comprehensive COVID-19 safety measures:

**Entry Screening:**
- Temperature checking for all visitors
- Health questionnaire screening
- Contact tracing information collection
- Symptom assessment protocols

**Sanitization Measures:**
- Hand sanitizer stations throughout facility
- Regular disinfection of surfaces
- UV sterilization in critical areas
- Air purification systems installed

**Social Distancing:**
- Reduced seating in waiting areas
- Floor markings for 6-feet distance
- Staggered appointment scheduling
- Limited number of visitors allowed

**Personal Protective Equipment:**
- Mandatory masks for all
- Face shields for high-risk procedures
- Full PPE for healthcare workers
- Gloves available at entry points

**Visitor Restrictions:**
- Limited to one attendant per patient
- No visitors for non-emergency cases
- Separate entry/exit points
- Designated waiting areas

**Testing Services:**
- RT-PCR testing available
- Rapid antigen tests
- Home collection for COVID tests
- Same-day results for rapid tests
- 24-48 hours for RT-PCR results

**Telemedicine Promotion:**
- Video consultations encouraged
- Follow-ups via teleconsultation
- Digital prescriptions provided
- Reduced physical visits

**Staff Safety:**
- Regular health screening of staff
- Mandatory vaccination for all employees
- Proper PPE training and usage
- Isolation protocols for exposed staff

**Special COVID Services:**
- Dedicated COVID consultation hours
- Isolated consultation rooms
- COVID treatment protocols
- Post-COVID rehabilitation services

**Vaccination Support:**
- Vaccination drives organized
- Certificate verification
- Booster dose administration
- Vaccination record maintenance

**Emergency Protocols:**
- COVID emergency response team
- Isolation facilities available  
- Oxygen support capabilities
- Referral network for severe cases

**Updates & Communication:**
- Regular updates on safety measures
- Government guideline compliance
- Staff and patient education
- Continuous protocol improvement

**For COVID Symptoms:**
- Immediate isolation protocols
- Rapid testing facility
- Specialized COVID care team
- Home isolation guidance`,
      category: "covid_safety",
      subcategory: "measures",
      priority: "high",
      isPublic: true,
      isActive: true,
      isFeatured: true,
      tags: [
        "covid safety",
        "sanitization",
        "testing",
        "precautions",
        "vaccination",
      ],
      targetAudience: ["all_users", "visitors", "patients"],
      relatedFAQs: [11, 8],
      searchKeywords: [
        "covid safety",
        "covid testing",
        "sanitization",
        "safety measures",
        "vaccination",
      ],
      views: 2134,
      helpful: 1987,
      notHelpful: 67,
      lastUpdated: "2025-10-05T10:00:00Z",
      createdAt: "2025-08-15T15:00:00Z",
      updatedBy: "Infection Control Team",
    },
  ]);

  const faqStats = computed(() => {
    const totalFAQs = faqs.value.length;
    const activeFAQs = faqs.value.filter((f) => f.isActive).length;
    const featuredFAQs = faqs.value.filter((f) => f.isFeatured).length;
    const totalViews = faqs.value.reduce((sum, f) => sum + f.views, 0);
    const totalHelpful = faqs.value.reduce((sum, f) => sum + f.helpful, 0);
    const helpfulRatio =
      totalHelpful > 0
        ? (
            (totalHelpful /
              (totalHelpful +
                faqs.value.reduce((sum, f) => sum + f.notHelpful, 0))) *
            100
          ).toFixed(1)
        : 0;

    return {
      totalFAQs,
      activeFAQs,
      featuredFAQs,
      totalViews,
      totalHelpful,
      helpfulRatio,
    };
  });

  const categories = computed(() => {
    const cats = [...new Set(faqs.value.map((f) => f.category))];
    return cats.map((cat) => ({
      name: cat.replace("_", " ").toUpperCase(),
      count: faqs.value.filter((f) => f.category === cat).length,
    }));
  });

  const addFAQ = (faqData) => {
    const newFAQ = {
      ...faqData,
      id: Math.max(...faqs.value.map((f) => f.id)) + 1,
      views: 0,
      helpful: 0,
      notHelpful: 0,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      updatedBy: "Admin",
    };
    faqs.value.unshift(newFAQ);
  };

  const updateFAQ = (id, faqData) => {
    const index = faqs.value.findIndex((f) => f.id === id);
    if (index !== -1) {
      faqs.value[index] = {
        ...faqs.value[index],
        ...faqData,
        lastUpdated: new Date().toISOString(),
      };
    }
  };

  const deleteFAQ = (id) => {
    faqs.value = faqs.value.filter((f) => f.id !== id);
  };

  const markHelpful = (id, helpful = true) => {
    const faq = faqs.value.find((f) => f.id === id);
    if (faq) {
      if (helpful) {
        faq.helpful++;
      } else {
        faq.notHelpful++;
      }
    }
  };

  return {
    faqs: readonly(faqs),
    faqStats,
    categories,
    addFAQ,
    updateFAQ,
    deleteFAQ,
    markHelpful,
  };
};
