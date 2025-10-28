const fs = require('fs');
const path = require('path');

const servicesDir = path.join(__dirname, '../src/services');

const services = [
  {
    name: 'subscription.service.js',
    content: `const { Subscription, SubscriptionPlan, User } = require('../models');
const { AppError } = require('../utils/error-handler');
const logger = require('../utils/logger');

class SubscriptionService {
  async createSubscription(data) {
    try {
      const subscription = await Subscription.create(data);
      logger.info(\`Subscription created: \${subscription.id}\`);
      return subscription;
    } catch (error) {
      logger.error('Error creating subscription:', error);
      throw new AppError('Failed to create subscription', 500);
    }
  }

  async getSubscriptionById(id) {
    const subscription = await Subscription.findByPk(id, {
      include: [
        { model: User, as: 'user' },
        { model: SubscriptionPlan, as: 'plan' }
      ]
    });
    if (!subscription) throw new AppError('Subscription not found', 404);
    return subscription;
  }

  async getAllSubscriptions(filters = {}, pagination = {}) {
    const { page = 1, limit = 10 } = pagination;
    const offset = (page - 1) * limit;
    const { count, rows } = await Subscription.findAndCountAll({
      where: filters,
      limit,
      offset,
      include: [
        { model: User, as: 'user' },
        { model: SubscriptionPlan, as: 'plan' }
      ],
      order: [['created_at', 'DESC']]
    });
    return { subscriptions: rows, total: count, page, totalPages: Math.ceil(count / limit) };
  }

  async updateSubscription(id, data) {
    const subscription = await this.getSubscriptionById(id);
    await subscription.update(data);
    logger.info(\`Subscription updated: \${id}\`);
    return subscription;
  }

  async cancelSubscription(id, reason) {
    const subscription = await this.getSubscriptionById(id);
    await subscription.update({
      status: 'cancelled',
      cancelled_at: new Date(),
      cancellation_reason: reason
    });
    logger.info(\`Subscription cancelled: \${id}\`);
    return subscription;
  }

  async renewSubscription(id) {
    const subscription = await this.getSubscriptionById(id);
    const plan = await SubscriptionPlan.findByPk(subscription.plan_id);
    
    const newEndDate = new Date(subscription.end_date);
    newEndDate.setMonth(newEndDate.getMonth() + plan.duration_months);
    
    await subscription.update({
      status: 'active',
      end_date: newEndDate,
      renewed_at: new Date()
    });
    
    logger.info(\`Subscription renewed: \${id}\`);
    return subscription;
  }

  async deleteSubscription(id) {
    const subscription = await this.getSubscriptionById(id);
    await subscription.destroy();
    logger.info(\`Subscription deleted: \${id}\`);
    return { message: 'Subscription deleted successfully' };
  }
}

module.exports = new SubscriptionService();
`
  },
  {
    name: 'translation.service.js',
    content: `const { Translation } = require('../models');
const { AppError } = require('../utils/error-handler');
const logger = require('../utils/logger');

class TranslationService {
  async createTranslation(data) {
    try {
      const translation = await Translation.create(data);
      logger.info(\`Translation created: \${translation.id}\`);
      return translation;
    } catch (error) {
      logger.error('Error creating translation:', error);
      throw new AppError('Failed to create translation', 500);
    }
  }

  async getTranslationById(id) {
    const translation = await Translation.findByPk(id);
    if (!translation) throw new AppError('Translation not found', 404);
    return translation;
  }

  async getAllTranslations(filters = {}, pagination = {}) {
    const { page = 1, limit = 10 } = pagination;
    const offset = (page - 1) * limit;
    const { count, rows } = await Translation.findAndCountAll({
      where: filters,
      limit,
      offset,
      order: [['created_at', 'DESC']]
    });
    return { translations: rows, total: count, page, totalPages: Math.ceil(count / limit) };
  }

  async getTranslationByKey(key, language) {
    const translation = await Translation.findOne({
      where: { key, language }
    });
    return translation ? translation.value : key;
  }

  async updateTranslation(id, data) {
    const translation = await this.getTranslationById(id);
    await translation.update(data);
    logger.info(\`Translation updated: \${id}\`);
    return translation;
  }

  async deleteTranslation(id) {
    const translation = await this.getTranslationById(id);
    await translation.destroy();
    logger.info(\`Translation deleted: \${id}\`);
    return { message: 'Translation deleted successfully' };
  }

  async bulkCreateTranslations(translations) {
    try {
      const created = await Translation.bulkCreate(translations);
      logger.info(\`Bulk translations created: \${created.length}\`);
      return created;
    } catch (error) {
      logger.error('Error bulk creating translations:', error);
      throw new AppError('Failed to bulk create translations', 500);
    }
  }
}

module.exports = new TranslationService();
`
  },
  {
    name: 'coupon.service.js',
    content: `const { Coupon } = require('../models');
const { AppError } = require('../utils/error-handler');
const logger = require('../utils/logger');

class CouponService {
  async createCoupon(data) {
    try {
      const coupon = await Coupon.create(data);
      logger.info(\`Coupon created: \${coupon.id}\`);
      return coupon;
    } catch (error) {
      logger.error('Error creating coupon:', error);
      throw new AppError('Failed to create coupon', 500);
    }
  }

  async getCouponById(id) {
    const coupon = await Coupon.findByPk(id);
    if (!coupon) throw new AppError('Coupon not found', 404);
    return coupon;
  }

  async getCouponByCode(code) {
    const coupon = await Coupon.findOne({ where: { code } });
    if (!coupon) throw new AppError('Coupon not found', 404);
    return coupon;
  }

  async getAllCoupons(filters = {}, pagination = {}) {
    const { page = 1, limit = 10 } = pagination;
    const offset = (page - 1) * limit;
    const { count, rows } = await Coupon.findAndCountAll({
      where: filters,
      limit,
      offset,
      order: [['created_at', 'DESC']]
    });
    return { coupons: rows, total: count, page, totalPages: Math.ceil(count / limit) };
  }

  async validateCoupon(code, amount) {
    const coupon = await this.getCouponByCode(code);
    
    // Check if coupon is active
    if (!coupon.is_active) {
      throw new AppError('Coupon is not active', 400);
    }
    
    // Check expiry date
    if (coupon.expiry_date && new Date(coupon.expiry_date) < new Date()) {
      throw new AppError('Coupon has expired', 400);
    }
    
    // Check usage limit
    if (coupon.max_uses && coupon.used_count >= coupon.max_uses) {
      throw new AppError('Coupon usage limit reached', 400);
    }
    
    // Check minimum amount
    if (coupon.min_amount && amount < coupon.min_amount) {
      throw new AppError(\`Minimum amount \${coupon.min_amount} required\`, 400);
    }
    
    // Calculate discount
    let discount = 0;
    if (coupon.discount_type === 'percentage') {
      discount = (amount * coupon.discount_value) / 100;
      if (coupon.max_discount && discount > coupon.max_discount) {
        discount = coupon.max_discount;
      }
    } else {
      discount = coupon.discount_value;
    }
    
    return { valid: true, discount, coupon };
  }

  async applyCoupon(code) {
    const coupon = await this.getCouponByCode(code);
    await coupon.increment('used_count');
    logger.info(\`Coupon applied: \${code}\`);
    return coupon;
  }

  async updateCoupon(id, data) {
    const coupon = await this.getCouponById(id);
    await coupon.update(data);
    logger.info(\`Coupon updated: \${id}\`);
    return coupon;
  }

  async deleteCoupon(id) {
    const coupon = await this.getCouponById(id);
    await coupon.destroy();
    logger.info(\`Coupon deleted: \${id}\`);
    return { message: 'Coupon deleted successfully' };
  }
}

module.exports = new CouponService();
`
  },
  {
    name: 'faq.service.js',
    content: `const { FAQ } = require('../models');
const { AppError } = require('../utils/error-handler');
const logger = require('../utils/logger');

class FAQService {
  async createFAQ(data) {
    try {
      const faq = await FAQ.create(data);
      logger.info(\`FAQ created: \${faq.id}\`);
      return faq;
    } catch (error) {
      logger.error('Error creating FAQ:', error);
      throw new AppError('Failed to create FAQ', 500);
    }
  }

  async getFAQById(id) {
    const faq = await FAQ.findByPk(id);
    if (!faq) throw new AppError('FAQ not found', 404);
    return faq;
  }

  async getAllFAQs(filters = {}, pagination = {}) {
    const { page = 1, limit = 10 } = pagination;
    const offset = (page - 1) * limit;
    const { count, rows } = await FAQ.findAndCountAll({
      where: filters,
      limit,
      offset,
      order: [['sort_order', 'ASC'], ['created_at', 'DESC']]
    });
    return { faqs: rows, total: count, page, totalPages: Math.ceil(count / limit) };
  }

  async getFAQsByCategory(category, pagination = {}) {
    const { page = 1, limit = 10 } = pagination;
    const offset = (page - 1) * limit;
    const { count, rows } = await FAQ.findAndCountAll({
      where: { category, is_active: true },
      limit,
      offset,
      order: [['sort_order', 'ASC']]
    });
    return { faqs: rows, total: count, page, totalPages: Math.ceil(count / limit) };
  }

  async updateFAQ(id, data) {
    const faq = await this.getFAQById(id);
    await faq.update(data);
    logger.info(\`FAQ updated: \${id}\`);
    return faq;
  }

  async deleteFAQ(id) {
    const faq = await this.getFAQById(id);
    await faq.destroy();
    logger.info(\`FAQ deleted: \${id}\`);
    return { message: 'FAQ deleted successfully' };
  }

  async reorderFAQs(orders) {
    try {
      for (const order of orders) {
        await FAQ.update(
          { sort_order: order.sort_order },
          { where: { id: order.id } }
        );
      }
      logger.info('FAQs reordered successfully');
      return { message: 'FAQs reordered successfully' };
    } catch (error) {
      logger.error('Error reordering FAQs:', error);
      throw new AppError('Failed to reorder FAQs', 500);
    }
  }
}

module.exports = new FAQService();
`
  },
  {
    name: 'websiteContent.service.js',
    content: `const { WebsiteContent } = require('../models');
const { AppError } = require('../utils/error-handler');
const { generateSlug } = require('../utils/helpers');
const logger = require('../utils/logger');

class WebsiteContentService {
  async createContent(data) {
    try {
      const slug = generateSlug(data.title);
      const content = await WebsiteContent.create({ ...data, slug });
      logger.info(\`Website content created: \${content.id}\`);
      return content;
    } catch (error) {
      logger.error('Error creating website content:', error);
      throw new AppError('Failed to create website content', 500);
    }
  }

  async getContentById(id) {
    const content = await WebsiteContent.findByPk(id);
    if (!content) throw new AppError('Website content not found', 404);
    return content;
  }

  async getContentBySlug(slug) {
    const content = await WebsiteContent.findOne({ where: { slug, is_published: true } });
    if (!content) throw new AppError('Website content not found', 404);
    return content;
  }

  async getAllContent(filters = {}, pagination = {}) {
    const { page = 1, limit = 10 } = pagination;
    const offset = (page - 1) * limit;
    const { count, rows } = await WebsiteContent.findAndCountAll({
      where: filters,
      limit,
      offset,
      order: [['created_at', 'DESC']]
    });
    return { content: rows, total: count, page, totalPages: Math.ceil(count / limit) };
  }

  async getContentByType(type, pagination = {}) {
    const { page = 1, limit = 10 } = pagination;
    const offset = (page - 1) * limit;
    const { count, rows } = await WebsiteContent.findAndCountAll({
      where: { type, is_published: true },
      limit,
      offset,
      order: [['created_at', 'DESC']]
    });
    return { content: rows, total: count, page, totalPages: Math.ceil(count / limit) };
  }

  async updateContent(id, data) {
    const content = await this.getContentById(id);
    if (data.title) {
      data.slug = generateSlug(data.title);
    }
    await content.update(data);
    logger.info(\`Website content updated: \${id}\`);
    return content;
  }

  async publishContent(id) {
    const content = await this.getContentById(id);
    await content.update({ is_published: true, published_at: new Date() });
    logger.info(\`Website content published: \${id}\`);
    return content;
  }

  async unpublishContent(id) {
    const content = await this.getContentById(id);
    await content.update({ is_published: false });
    logger.info(\`Website content unpublished: \${id}\`);
    return content;
  }

  async deleteContent(id) {
    const content = await this.getContentById(id);
    await content.destroy();
    logger.info(\`Website content deleted: \${id}\`);
    return { message: 'Website content deleted successfully' };
  }
}

module.exports = new WebsiteContentService();
`
  },
  {
    name: 'treatmentCategory.service.js',
    content: `const { TreatmentCategory, Treatment } = require('../models');
const { AppError } = require('../utils/error-handler');
const { generateSlug } = require('../utils/helpers');
const logger = require('../utils/logger');

class TreatmentCategoryService {
  async createCategory(data) {
    try {
      const slug = generateSlug(data.name);
      const category = await TreatmentCategory.create({ ...data, slug });
      logger.info(\`Treatment category created: \${category.id}\`);
      return category;
    } catch (error) {
      logger.error('Error creating treatment category:', error);
      throw new AppError('Failed to create treatment category', 500);
    }
  }

  async getCategoryById(id) {
    const category = await TreatmentCategory.findByPk(id, {
      include: [{ model: Treatment, as: 'treatments' }]
    });
    if (!category) throw new AppError('Treatment category not found', 404);
    return category;
  }

  async getAllCategories(filters = {}, pagination = {}) {
    const { page = 1, limit = 10 } = pagination;
    const offset = (page - 1) * limit;
    const { count, rows } = await TreatmentCategory.findAndCountAll({
      where: filters,
      limit,
      offset,
      order: [['sort_order', 'ASC'], ['name', 'ASC']]
    });
    return { categories: rows, total: count, page, totalPages: Math.ceil(count / limit) };
  }

  async updateCategory(id, data) {
    const category = await this.getCategoryById(id);
    if (data.name) {
      data.slug = generateSlug(data.name);
    }
    await category.update(data);
    logger.info(\`Treatment category updated: \${id}\`);
    return category;
  }

  async deleteCategory(id) {
    const category = await this.getCategoryById(id);
    await category.destroy();
    logger.info(\`Treatment category deleted: \${id}\`);
    return { message: 'Treatment category deleted successfully' };
  }
}

module.exports = new TreatmentCategoryService();
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