const fs = require('fs');
const path = require('path');

const controllersDir = path.join(__dirname, '../src/controllers');

const controllers = [
  {
    name: 'laboratory.controller.js',
    content: `const laboratoryService = require('../services/laboratory.service');
const { successResponse } = require('../utils/response');

class LaboratoryController {
  async createLaboratory(req, res, next) {
    try {
      const laboratory = await laboratoryService.createLaboratory(req.body);
      return successResponse(res, laboratory, 'Laboratory created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async getLaboratory(req, res, next) {
    try {
      const laboratory = await laboratoryService.getLaboratoryById(req.params.id);
      return successResponse(res, laboratory, 'Laboratory retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getAllLaboratories(req, res, next) {
    try {
      const { page, limit, ...filters } = req.query;
      const result = await laboratoryService.getAllLaboratories(filters, { page, limit });
      return successResponse(res, result, 'Laboratories retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateLaboratory(req, res, next) {
    try {
      const laboratory = await laboratoryService.updateLaboratory(req.params.id, req.body);
      return successResponse(res, laboratory, 'Laboratory updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async deleteLaboratory(req, res, next) {
    try {
      const result = await laboratoryService.deleteLaboratory(req.params.id);
      return successResponse(res, result, 'Laboratory deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new LaboratoryController();
`
  },
  {
    name: 'labTest.controller.js',
    content: `const labTestService = require('../services/labTest.service');
const { successResponse } = require('../utils/response');

class LabTestController {
  async createLabTest(req, res, next) {
    try {
      const labTest = await labTestService.createLabTest(req.body);
      return successResponse(res, labTest, 'Lab test created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async getLabTest(req, res, next) {
    try {
      const labTest = await labTestService.getLabTestById(req.params.id);
      return successResponse(res, labTest, 'Lab test retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getAllLabTests(req, res, next) {
    try {
      const { page, limit, ...filters } = req.query;
      const result = await labTestService.getAllLabTests(filters, { page, limit });
      return successResponse(res, result, 'Lab tests retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateLabTest(req, res, next) {
    try {
      const labTest = await labTestService.updateLabTest(req.params.id, req.body);
      return successResponse(res, labTest, 'Lab test updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateLabTestResults(req, res, next) {
    try {
      const labTest = await labTestService.updateLabTestResults(req.params.id, req.body.results);
      return successResponse(res, labTest, 'Lab test results updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async deleteLabTest(req, res, next) {
    try {
      const result = await labTestService.deleteLabTest(req.params.id);
      return successResponse(res, result, 'Lab test deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new LabTestController();
`
  },
  {
    name: 'invoice.controller.js',
    content: `const invoiceService = require('../services/invoice.service');
const { successResponse } = require('../utils/response');

class InvoiceController {
  async createInvoice(req, res, next) {
    try {
      const invoice = await invoiceService.createInvoice(req.body);
      return successResponse(res, invoice, 'Invoice created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async getInvoice(req, res, next) {
    try {
      const invoice = await invoiceService.getInvoiceById(req.params.id);
      return successResponse(res, invoice, 'Invoice retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getAllInvoices(req, res, next) {
    try {
      const { page, limit, ...filters } = req.query;
      const result = await invoiceService.getAllInvoices(filters, { page, limit });
      return successResponse(res, result, 'Invoices retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateInvoice(req, res, next) {
    try {
      const invoice = await invoiceService.updateInvoice(req.params.id, req.body);
      return successResponse(res, invoice, 'Invoice updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async generatePDF(req, res, next) {
    try {
      const result = await invoiceService.generatePDF(req.params.id);
      return successResponse(res, result, 'Invoice PDF generated successfully');
    } catch (error) {
      next(error);
    }
  }

  async sendInvoiceEmail(req, res, next) {
    try {
      const result = await invoiceService.sendInvoiceEmail(req.params.id);
      return successResponse(res, result, 'Invoice email sent successfully');
    } catch (error) {
      next(error);
    }
  }

  async deleteInvoice(req, res, next) {
    try {
      const result = await invoiceService.deleteInvoice(req.params.id);
      return successResponse(res, result, 'Invoice deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new InvoiceController();
`
  },
  {
    name: 'package.controller.js',
    content: `const packageService = require('../services/package.service');
const { successResponse } = require('../utils/response');

class PackageController {
  async createPackage(req, res, next) {
    try {
      const pkg = await packageService.createPackage(req.body);
      return successResponse(res, pkg, 'Package created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async getPackage(req, res, next) {
    try {
      const pkg = await packageService.getPackageById(req.params.id);
      return successResponse(res, pkg, 'Package retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getAllPackages(req, res, next) {
    try {
      const { page, limit, ...filters } = req.query;
      const result = await packageService.getAllPackages(filters, { page, limit });
      return successResponse(res, result, 'Packages retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async updatePackage(req, res, next) {
    try {
      const pkg = await packageService.updatePackage(req.params.id, req.body);
      return successResponse(res, pkg, 'Package updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async deletePackage(req, res, next) {
    try {
      const result = await packageService.deletePackage(req.params.id);
      return successResponse(res, result, 'Package deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PackageController();
`
  },
  {
    name: 'medicalRecord.controller.js',
    content: `const medicalRecordService = require('../services/medicalRecord.service');
const { successResponse } = require('../utils/response');

class MedicalRecordController {
  async createMedicalRecord(req, res, next) {
    try {
      const record = await medicalRecordService.createMedicalRecord(req.body);
      return successResponse(res, record, 'Medical record created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async getMedicalRecord(req, res, next) {
    try {
      const record = await medicalRecordService.getMedicalRecordById(req.params.id);
      return successResponse(res, record, 'Medical record retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getAllMedicalRecords(req, res, next) {
    try {
      const { page, limit, ...filters } = req.query;
      const result = await medicalRecordService.getAllMedicalRecords(filters, { page, limit });
      return successResponse(res, result, 'Medical records retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getPatientMedicalRecords(req, res, next) {
    try {
      const records = await medicalRecordService.getPatientMedicalRecords(req.params.patientId);
      return successResponse(res, records, 'Patient medical records retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateMedicalRecord(req, res, next) {
    try {
      const record = await medicalRecordService.updateMedicalRecord(req.params.id, req.body);
      return successResponse(res, record, 'Medical record updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async deleteMedicalRecord(req, res, next) {
    try {
      const result = await medicalRecordService.deleteMedicalRecord(req.params.id);
      return successResponse(res, result, 'Medical record deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new MedicalRecordController();
`
  },
  {
    name: 'support.controller.js',
    content: `const supportService = require('../services/support.service');
const { successResponse } = require('../utils/response');

class SupportController {
  async createTicket(req, res, next) {
    try {
      const ticket = await supportService.createTicket(req.body);
      return successResponse(res, ticket, 'Support ticket created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async getTicket(req, res, next) {
    try {
      const ticket = await supportService.getTicketById(req.params.id);
      return successResponse(res, ticket, 'Support ticket retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getAllTickets(req, res, next) {
    try {
      const { page, limit, ...filters } = req.query;
      const result = await supportService.getAllTickets(filters, { page, limit });
      return successResponse(res, result, 'Support tickets retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateTicket(req, res, next) {
    try {
      const ticket = await supportService.updateTicket(req.params.id, req.body);
      return successResponse(res, ticket, 'Support ticket updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateTicketStatus(req, res, next) {
    try {
      const { status } = req.body;
      const ticket = await supportService.updateTicketStatus(req.params.id, status);
      return successResponse(res, ticket, 'Support ticket status updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async addReply(req, res, next) {
    try {
      const ticket = await supportService.addReply(req.params.id, req.body);
      return successResponse(res, ticket, 'Reply added successfully');
    } catch (error) {
      next(error);
    }
  }

  async closeTicket(req, res, next) {
    try {
      const ticket = await supportService.closeTicket(req.params.id);
      return successResponse(res, ticket, 'Support ticket closed successfully');
    } catch (error) {
      next(error);
    }
  }

  async deleteTicket(req, res, next) {
    try {
      const result = await supportService.deleteTicket(req.params.id);
      return successResponse(res, result, 'Support ticket deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new SupportController();
`
  },
  {
    name: 'subscription.controller.js',
    content: `const subscriptionService = require('../services/subscription.service');
const { successResponse } = require('../utils/response');

class SubscriptionController {
  async createSubscription(req, res, next) {
    try {
      const subscription = await subscriptionService.createSubscription(req.body);
      return successResponse(res, subscription, 'Subscription created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async getSubscription(req, res, next) {
    try {
      const subscription = await subscriptionService.getSubscriptionById(req.params.id);
      return successResponse(res, subscription, 'Subscription retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getAllSubscriptions(req, res, next) {
    try {
      const { page, limit, ...filters } = req.query;
      const result = await subscriptionService.getAllSubscriptions(filters, { page, limit });
      return successResponse(res, result, 'Subscriptions retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateSubscription(req, res, next) {
    try {
      const subscription = await subscriptionService.updateSubscription(req.params.id, req.body);
      return successResponse(res, subscription, 'Subscription updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async cancelSubscription(req, res, next) {
    try {
      const { reason } = req.body;
      const subscription = await subscriptionService.cancelSubscription(req.params.id, reason);
      return successResponse(res, subscription, 'Subscription cancelled successfully');
    } catch (error) {
      next(error);
    }
  }

  async renewSubscription(req, res, next) {
    try {
      const subscription = await subscriptionService.renewSubscription(req.params.id);
      return successResponse(res, subscription, 'Subscription renewed successfully');
    } catch (error) {
      next(error);
    }
  }

  async deleteSubscription(req, res, next) {
    try {
      const result = await subscriptionService.deleteSubscription(req.params.id);
      return successResponse(res, result, 'Subscription deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new SubscriptionController();
`
  },
  {
    name: 'translation.controller.js',
    content: `const translationService = require('../services/translation.service');
const { successResponse } = require('../utils/response');

class TranslationController {
  async createTranslation(req, res, next) {
    try {
      const translation = await translationService.createTranslation(req.body);
      return successResponse(res, translation, 'Translation created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async getTranslation(req, res, next) {
    try {
      const translation = await translationService.getTranslationById(req.params.id);
      return successResponse(res, translation, 'Translation retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getAllTranslations(req, res, next) {
    try {
      const { page, limit, ...filters } = req.query;
      const result = await translationService.getAllTranslations(filters, { page, limit });
      return successResponse(res, result, 'Translations retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getTranslationByKey(req, res, next) {
    try {
      const { key, language } = req.query;
      const translation = await translationService.getTranslationByKey(key, language);
      return successResponse(res, { translation }, 'Translation retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateTranslation(req, res, next) {
    try {
      const translation = await translationService.updateTranslation(req.params.id, req.body);
      return successResponse(res, translation, 'Translation updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async deleteTranslation(req, res, next) {
    try {
      const result = await translationService.deleteTranslation(req.params.id);
      return successResponse(res, result, 'Translation deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  async bulkCreateTranslations(req, res, next) {
    try {
      const translations = await translationService.bulkCreateTranslations(req.body.translations);
      return successResponse(res, translations, 'Translations created successfully', 201);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TranslationController();
`
  },
  {
    name: 'coupon.controller.js',
    content: `const couponService = require('../services/coupon.service');
const { successResponse } = require('../utils/response');

class CouponController {
  async createCoupon(req, res, next) {
    try {
      const coupon = await couponService.createCoupon(req.body);
      return successResponse(res, coupon, 'Coupon created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async getCoupon(req, res, next) {
    try {
      const coupon = await couponService.getCouponById(req.params.id);
      return successResponse(res, coupon, 'Coupon retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getAllCoupons(req, res, next) {
    try {
      const { page, limit, ...filters } = req.query;
      const result = await couponService.getAllCoupons(filters, { page, limit });
      return successResponse(res, result, 'Coupons retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async validateCoupon(req, res, next) {
    try {
      const { code, amount } = req.body;
      const result = await couponService.validateCoupon(code, amount);
      return successResponse(res, result, 'Coupon validated successfully');
    } catch (error) {
      next(error);
    }
  }

  async applyCoupon(req, res, next) {
    try {
      const { code } = req.body;
      const coupon = await couponService.applyCoupon(code);
      return successResponse(res, coupon, 'Coupon applied successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateCoupon(req, res, next) {
    try {
      const coupon = await couponService.updateCoupon(req.params.id, req.body);
      return successResponse(res, coupon, 'Coupon updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async deleteCoupon(req, res, next) {
    try {
      const result = await couponService.deleteCoupon(req.params.id);
      return successResponse(res, result, 'Coupon deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CouponController();
`
  },
  {
    name: 'faq.controller.js',
    content: `const faqService = require('../services/faq.service');
const { successResponse } = require('../utils/response');

class FAQController {
  async createFAQ(req, res, next) {
    try {
      const faq = await faqService.createFAQ(req.body);
      return successResponse(res, faq, 'FAQ created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async getFAQ(req, res, next) {
    try {
      const faq = await faqService.getFAQById(req.params.id);
      return successResponse(res, faq, 'FAQ retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getAllFAQs(req, res, next) {
    try {
      const { page, limit, ...filters } = req.query;
      const result = await faqService.getAllFAQs(filters, { page, limit });
      return successResponse(res, result, 'FAQs retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getFAQsByCategory(req, res, next) {
    try {
      const { page, limit } = req.query;
      const result = await faqService.getFAQsByCategory(req.params.category, { page, limit });
      return successResponse(res, result, 'FAQs retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateFAQ(req, res, next) {
    try {
      const faq = await faqService.updateFAQ(req.params.id, req.body);
      return successResponse(res, faq, 'FAQ updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async deleteFAQ(req, res, next) {
    try {
      const result = await faqService.deleteFAQ(req.params.id);
      return successResponse(res, result, 'FAQ deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  async reorderFAQs(req, res, next) {
    try {
      const result = await faqService.reorderFAQs(req.body.orders);
      return successResponse(res, result, 'FAQs reordered successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new FAQController();
`
  },
  {
    name: 'websiteContent.controller.js',
    content: `const websiteContentService = require('../services/websiteContent.service');
const { successResponse } = require('../utils/response');

class WebsiteContentController {
  async createContent(req, res, next) {
    try {
      const content = await websiteContentService.createContent(req.body);
      return successResponse(res, content, 'Website content created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async getContent(req, res, next) {
    try {
      const content = await websiteContentService.getContentById(req.params.id);
      return successResponse(res, content, 'Website content retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getContentBySlug(req, res, next) {
    try {
      const content = await websiteContentService.getContentBySlug(req.params.slug);
      return successResponse(res, content, 'Website content retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getAllContent(req, res, next) {
    try {
      const { page, limit, ...filters } = req.query;
      const result = await websiteContentService.getAllContent(filters, { page, limit });
      return successResponse(res, result, 'Website content retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getContentByType(req, res, next) {
    try {
      const { page, limit } = req.query;
      const result = await websiteContentService.getContentByType(req.params.type, { page, limit });
      return successResponse(res, result, 'Website content retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateContent(req, res, next) {
    try {
      const content = await websiteContentService.updateContent(req.params.id, req.body);
      return successResponse(res, content, 'Website content updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async publishContent(req, res, next) {
    try {
      const content = await websiteContentService.publishContent(req.params.id);
      return successResponse(res, content, 'Website content published successfully');
    } catch (error) {
      next(error);
    }
  }

  async unpublishContent(req, res, next) {
    try {
      const content = await websiteContentService.unpublishContent(req.params.id);
      return successResponse(res, content, 'Website content unpublished successfully');
    } catch (error) {
      next(error);
    }
  }

  async deleteContent(req, res, next) {
    try {
      const result = await websiteContentService.deleteContent(req.params.id);
      return successResponse(res, result, 'Website content deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new WebsiteContentController();
`
  },
  {
    name: 'treatmentCategory.controller.js',
    content: `const treatmentCategoryService = require('../services/treatmentCategory.service');
const { successResponse } = require('../utils/response');

class TreatmentCategoryController {
  async createCategory(req, res, next) {
    try {
      const category = await treatmentCategoryService.createCategory(req.body);
      return successResponse(res, category, 'Treatment category created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async getCategory(req, res, next) {
    try {
      const category = await treatmentCategoryService.getCategoryById(req.params.id);
      return successResponse(res, category, 'Treatment category retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getAllCategories(req, res, next) {
    try {
      const { page, limit, ...filters } = req.query;
      const result = await treatmentCategoryService.getAllCategories(filters, { page, limit });
      return successResponse(res, result, 'Treatment categories retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateCategory(req, res, next) {
    try {
      const category = await treatmentCategoryService.updateCategory(req.params.id, req.body);
      return successResponse(res, category, 'Treatment category updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async deleteCategory(req, res, next) {
    try {
      const result = await treatmentCategoryService.deleteCategory(req.params.id);
      return successResponse(res, result, 'Treatment category deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TreatmentCategoryController();
`
  }
];

// Generate all controller files
controllers.forEach(controller => {
  const filePath = path.join(controllersDir, controller.name);
  fs.writeFileSync(filePath, controller.content);
  console.log(`✓ Created ${controller.name}`);
});

console.log(`\n✓ Successfully generated ${controllers.length} controller files!`);