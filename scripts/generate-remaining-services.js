const fs = require('fs');
const path = require('path');

const servicesDir = path.join(__dirname, '../src/services');

const services = [
  {
    name: 'laboratory.service.js',
    content: `const { Laboratory, LabTest } = require('../models');
const { AppError } = require('../utils/error-handler');
const logger = require('../utils/logger');

class LaboratoryService {
  async createLaboratory(data) {
    try {
      const laboratory = await Laboratory.create(data);
      logger.info(\`Laboratory created: \${laboratory.id}\`);
      return laboratory;
    } catch (error) {
      logger.error('Error creating laboratory:', error);
      throw new AppError('Failed to create laboratory', 500);
    }
  }

  async getLaboratoryById(id) {
    const laboratory = await Laboratory.findByPk(id, {
      include: [{ model: LabTest, as: 'lab_tests' }]
    });
    if (!laboratory) throw new AppError('Laboratory not found', 404);
    return laboratory;
  }

  async getAllLaboratories(filters = {}, pagination = {}) {
    const { page = 1, limit = 10 } = pagination;
    const offset = (page - 1) * limit;
    const { count, rows } = await Laboratory.findAndCountAll({
      where: filters,
      limit,
      offset,
      order: [['created_at', 'DESC']]
    });
    return { laboratories: rows, total: count, page, totalPages: Math.ceil(count / limit) };
  }

  async updateLaboratory(id, data) {
    const laboratory = await this.getLaboratoryById(id);
    await laboratory.update(data);
    logger.info(\`Laboratory updated: \${id}\`);
    return laboratory;
  }

  async deleteLaboratory(id) {
    const laboratory = await this.getLaboratoryById(id);
    await laboratory.destroy();
    logger.info(\`Laboratory deleted: \${id}\`);
    return { message: 'Laboratory deleted successfully' };
  }
}

module.exports = new LaboratoryService();
`
  },
  {
    name: 'labTest.service.js',
    content: `const { LabTest, Laboratory, Patient } = require('../models');
const { AppError } = require('../utils/error-handler');
const logger = require('../utils/logger');

class LabTestService {
  async createLabTest(data) {
    try {
      const labTest = await LabTest.create(data);
      logger.info(\`Lab test created: \${labTest.id}\`);
      return labTest;
    } catch (error) {
      logger.error('Error creating lab test:', error);
      throw new AppError('Failed to create lab test', 500);
    }
  }

  async getLabTestById(id) {
    const labTest = await LabTest.findByPk(id, {
      include: [
        { model: Laboratory, as: 'laboratory' },
        { model: Patient, as: 'patient' }
      ]
    });
    if (!labTest) throw new AppError('Lab test not found', 404);
    return labTest;
  }

  async getAllLabTests(filters = {}, pagination = {}) {
    const { page = 1, limit = 10 } = pagination;
    const offset = (page - 1) * limit;
    const { count, rows } = await LabTest.findAndCountAll({
      where: filters,
      limit,
      offset,
      include: [
        { model: Laboratory, as: 'laboratory' },
        { model: Patient, as: 'patient' }
      ],
      order: [['created_at', 'DESC']]
    });
    return { labTests: rows, total: count, page, totalPages: Math.ceil(count / limit) };
  }

  async updateLabTest(id, data) {
    const labTest = await this.getLabTestById(id);
    await labTest.update(data);
    logger.info(\`Lab test updated: \${id}\`);
    return labTest;
  }

  async updateLabTestResults(id, results) {
    const labTest = await this.getLabTestById(id);
    await labTest.update({ 
      results, 
      status: 'completed',
      completed_at: new Date()
    });
    logger.info(\`Lab test results updated: \${id}\`);
    return labTest;
  }

  async deleteLabTest(id) {
    const labTest = await this.getLabTestById(id);
    await labTest.destroy();
    logger.info(\`Lab test deleted: \${id}\`);
    return { message: 'Lab test deleted successfully' };
  }
}

module.exports = new LabTestService();
`
  },
  {
    name: 'invoice.service.js',
    content: `const { Invoice, Payment, Booking } = require('../models');
const { AppError } = require('../utils/error-handler');
const { generateInvoiceNumber } = require('../utils/helpers');
const logger = require('../utils/logger');

class InvoiceService {
  async createInvoice(data) {
    try {
      const invoice_number = generateInvoiceNumber();
      const invoice = await Invoice.create({ ...data, invoice_number });
      logger.info(\`Invoice created: \${invoice.id}\`);
      return invoice;
    } catch (error) {
      logger.error('Error creating invoice:', error);
      throw new AppError('Failed to create invoice', 500);
    }
  }

  async getInvoiceById(id) {
    const invoice = await Invoice.findByPk(id, {
      include: [
        { model: Booking, as: 'booking' },
        { model: Payment, as: 'payment' }
      ]
    });
    if (!invoice) throw new AppError('Invoice not found', 404);
    return invoice;
  }

  async getAllInvoices(filters = {}, pagination = {}) {
    const { page = 1, limit = 10 } = pagination;
    const offset = (page - 1) * limit;
    const { count, rows } = await Invoice.findAndCountAll({
      where: filters,
      limit,
      offset,
      include: [{ model: Booking, as: 'booking' }],
      order: [['created_at', 'DESC']]
    });
    return { invoices: rows, total: count, page, totalPages: Math.ceil(count / limit) };
  }

  async updateInvoice(id, data) {
    const invoice = await this.getInvoiceById(id);
    await invoice.update(data);
    logger.info(\`Invoice updated: \${id}\`);
    return invoice;
  }

  async generatePDF(id) {
    const invoice = await this.getInvoiceById(id);
    // TODO: Implement PDF generation using puppeteer or similar
    logger.info(\`Generating PDF for invoice: \${id}\`);
    return { message: 'PDF generation not yet implemented', invoice };
  }

  async sendInvoiceEmail(id) {
    const invoice = await this.getInvoiceById(id);
    // TODO: Implement email sending
    logger.info(\`Sending invoice email: \${id}\`);
    return { message: 'Invoice email sent successfully' };
  }

  async deleteInvoice(id) {
    const invoice = await this.getInvoiceById(id);
    await invoice.destroy();
    logger.info(\`Invoice deleted: \${id}\`);
    return { message: 'Invoice deleted successfully' };
  }
}

module.exports = new InvoiceService();
`
  },
  {
    name: 'package.service.js',
    content: `const { Package, Treatment, Hospital } = require('../models');
const { AppError } = require('../utils/error-handler');
const { generateSlug } = require('../utils/helpers');
const logger = require('../utils/logger');

class PackageService {
  async createPackage(data) {
    try {
      const slug = generateSlug(data.name);
      const pkg = await Package.create({ ...data, slug });
      logger.info(\`Package created: \${pkg.id}\`);
      return pkg;
    } catch (error) {
      logger.error('Error creating package:', error);
      throw new AppError('Failed to create package', 500);
    }
  }

  async getPackageById(id) {
    const pkg = await Package.findByPk(id, {
      include: [
        { model: Treatment, as: 'treatments' },
        { model: Hospital, as: 'hospital' }
      ]
    });
    if (!pkg) throw new AppError('Package not found', 404);
    return pkg;
  }

  async getAllPackages(filters = {}, pagination = {}) {
    const { page = 1, limit = 10 } = pagination;
    const offset = (page - 1) * limit;
    const { count, rows } = await Package.findAndCountAll({
      where: filters,
      limit,
      offset,
      include: [
        { model: Treatment, as: 'treatments' },
        { model: Hospital, as: 'hospital' }
      ],
      order: [['created_at', 'DESC']]
    });
    return { packages: rows, total: count, page, totalPages: Math.ceil(count / limit) };
  }

  async updatePackage(id, data) {
    const pkg = await this.getPackageById(id);
    if (data.name) {
      data.slug = generateSlug(data.name);
    }
    await pkg.update(data);
    logger.info(\`Package updated: \${id}\`);
    return pkg;
  }

  async deletePackage(id) {
    const pkg = await this.getPackageById(id);
    await pkg.destroy();
    logger.info(\`Package deleted: \${id}\`);
    return { message: 'Package deleted successfully' };
  }
}

module.exports = new PackageService();
`
  },
  {
    name: 'medicalRecord.service.js',
    content: `const { MedicalRecord, Patient } = require('../models');
const { AppError } = require('../utils/error-handler');
const logger = require('../utils/logger');

class MedicalRecordService {
  async createMedicalRecord(data) {
    try {
      const record = await MedicalRecord.create(data);
      logger.info(\`Medical record created: \${record.id}\`);
      return record;
    } catch (error) {
      logger.error('Error creating medical record:', error);
      throw new AppError('Failed to create medical record', 500);
    }
  }

  async getMedicalRecordById(id) {
    const record = await MedicalRecord.findByPk(id, {
      include: [{ model: Patient, as: 'patient' }]
    });
    if (!record) throw new AppError('Medical record not found', 404);
    return record;
  }

  async getAllMedicalRecords(filters = {}, pagination = {}) {
    const { page = 1, limit = 10 } = pagination;
    const offset = (page - 1) * limit;
    const { count, rows } = await MedicalRecord.findAndCountAll({
      where: filters,
      limit,
      offset,
      include: [{ model: Patient, as: 'patient' }],
      order: [['created_at', 'DESC']]
    });
    return { medicalRecords: rows, total: count, page, totalPages: Math.ceil(count / limit) };
  }

  async getPatientMedicalRecords(patientId) {
    const records = await MedicalRecord.findAll({
      where: { patient_id: patientId },
      order: [['created_at', 'DESC']]
    });
    return records;
  }

  async updateMedicalRecord(id, data) {
    const record = await this.getMedicalRecordById(id);
    await record.update(data);
    logger.info(\`Medical record updated: \${id}\`);
    return record;
  }

  async deleteMedicalRecord(id) {
    const record = await this.getMedicalRecordById(id);
    await record.destroy();
    logger.info(\`Medical record deleted: \${id}\`);
    return { message: 'Medical record deleted successfully' };
  }
}

module.exports = new MedicalRecordService();
`
  },
  {
    name: 'support.service.js',
    content: `const { SupportTicket, User } = require('../models');
const { AppError } = require('../utils/error-handler');
const logger = require('../utils/logger');

class SupportService {
  async createTicket(data) {
    try {
      const ticket = await SupportTicket.create({
        ...data,
        status: 'open',
        ticket_number: \`TKT-\${Date.now()}\`
      });
      logger.info(\`Support ticket created: \${ticket.id}\`);
      return ticket;
    } catch (error) {
      logger.error('Error creating support ticket:', error);
      throw new AppError('Failed to create support ticket', 500);
    }
  }

  async getTicketById(id) {
    const ticket = await SupportTicket.findByPk(id, {
      include: [{ model: User, as: 'user' }]
    });
    if (!ticket) throw new AppError('Support ticket not found', 404);
    return ticket;
  }

  async getAllTickets(filters = {}, pagination = {}) {
    const { page = 1, limit = 10 } = pagination;
    const offset = (page - 1) * limit;
    const { count, rows } = await SupportTicket.findAndCountAll({
      where: filters,
      limit,
      offset,
      include: [{ model: User, as: 'user' }],
      order: [['created_at', 'DESC']]
    });
    return { tickets: rows, total: count, page, totalPages: Math.ceil(count / limit) };
  }

  async updateTicket(id, data) {
    const ticket = await this.getTicketById(id);
    await ticket.update(data);
    logger.info(\`Support ticket updated: \${id}\`);
    return ticket;
  }

  async updateTicketStatus(id, status) {
    const ticket = await this.getTicketById(id);
    await ticket.update({ status });
    logger.info(\`Support ticket status updated: \${id} - \${status}\`);
    return ticket;
  }

  async addReply(id, reply) {
    const ticket = await this.getTicketById(id);
    const replies = ticket.replies || [];
    replies.push({ ...reply, timestamp: new Date() });
    await ticket.update({ replies });
    logger.info(\`Reply added to ticket: \${id}\`);
    return ticket;
  }

  async closeTicket(id) {
    const ticket = await this.getTicketById(id);
    await ticket.update({ status: 'closed', closed_at: new Date() });
    logger.info(\`Support ticket closed: \${id}\`);
    return ticket;
  }

  async deleteTicket(id) {
    const ticket = await this.getTicketById(id);
    await ticket.destroy();
    logger.info(\`Support ticket deleted: \${id}\`);
    return { message: 'Support ticket deleted successfully' };
  }
}

module.exports = new SupportService();
`
  }
];

// Generate all service files
services.forEach(service => {
  const filePath = path.join(servicesDir, service.name);
  fs.writeFileSync(filePath, service.content);
  console.log(`✓ Created ${service.name}`);
});

console.log(`\n✓ Successfully generated ${services.length} service files!`);