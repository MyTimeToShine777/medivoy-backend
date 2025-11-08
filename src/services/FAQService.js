// FAQ Service - Frequently Asked Questions management
// NO optional chaining - Production Ready
import { Op } from 'sequelize';
import { FAQ, User } from '../models/index.js';

class FAQService {
    // ========== CREATE FAQ ==========
    async createFAQ(faqData) {
        try {
            const faq = await FAQ.create({
                question: faqData.question,
                answer: faqData.answer,
                category: faqData.category,
                tags: faqData.tags || [],
                priority: faqData.priority || 'normal',
                viewCount: 0,
                helpfulCount: 0,
                unhelpfulCount: 0,
                isActive: true,
                isPublished: false,
            });

            return {
                success: true,
                data: faq,
                message: 'FAQ created successfully',
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    }

    // ========== GET FAQ ==========
    async getFAQById(faqId) {
        try {
            const faq = await FAQ.findByPk(faqId);

            if (!faq) {
                return { success: false, error: 'FAQ not found' };
            }

            // Increment view count
            faq.viewCount = (faq.viewCount || 0) + 1;
            await faq.save();

            return { success: true, data: faq };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== GET ALL FAQS ==========
    async getAllFAQs(filters = {}) {
        try {
            const where = { isPublished: true, isActive: true };

            if (filters.category) {
                where.category = filters.category;
            }

            const faqs = await FAQ.findAll({
                where,
                order: [
                    ['priority', 'DESC'],
                    ['viewCount', 'DESC']
                ],
                limit: filters.limit || 50,
                offset: filters.offset || 0,
            });

            const total = await FAQ.count({ where });

            return { success: true, data: faqs, total };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== SEARCH FAQS ==========
    async searchFAQs(searchTerm, filters = {}) {
        try {
            const where = {
                isPublished: true,
                isActive: true,
                [Op.or]: [{
                        question: {
                            [Op.iLike]: `%${searchTerm}%`
                        }
                    },
                    {
                        answer: {
                            [Op.iLike]: `%${searchTerm}%`
                        }
                    },
                    {
                        tags: {
                            [Op.contains]: [searchTerm]
                        }
                    },
                ],
            };

            if (filters.category) {
                where.category = filters.category;
            }

            const faqs = await FAQ.findAll({
                where,
                order: [
                    ['viewCount', 'DESC']
                ],
                limit: filters.limit || 20,
                offset: filters.offset || 0,
            });

            const total = await FAQ.count({ where });

            return { success: true, data: faqs, total };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== GET FAQS BY CATEGORY ==========
    async getFAQsByCategory(category, filters = {}) {
        try {
            const where = {
                category,
                isPublished: true,
                isActive: true,
            };

            const faqs = await FAQ.findAll({
                where,
                order: [
                    ['priority', 'DESC'],
                    ['viewCount', 'DESC']
                ],
                limit: filters.limit || 50,
                offset: filters.offset || 0,
            });

            const total = await FAQ.count({ where });

            return { success: true, data: faqs, total };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== UPDATE FAQ ==========
    async updateFAQ(faqId, updateData) {
        try {
            const faq = await FAQ.findByPk(faqId);

            if (!faq) {
                return { success: false, error: 'FAQ not found' };
            }

            const updated = await faq.update(updateData);

            return {
                success: true,
                data: updated,
                message: 'FAQ updated successfully',
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== PUBLISH FAQ ==========
    async publishFAQ(faqId) {
        try {
            const faq = await FAQ.findByPk(faqId);

            if (!faq) {
                return { success: false, error: 'FAQ not found' };
            }

            faq.isPublished = true;
            faq.publishedAt = new Date();
            await faq.save();

            return { success: true, data: faq, message: 'FAQ published' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== UNPUBLISH FAQ ==========
    async unpublishFAQ(faqId) {
        try {
            const faq = await FAQ.findByPk(faqId);

            if (!faq) {
                return { success: false, error: 'FAQ not found' };
            }

            faq.isPublished = false;
            await faq.save();

            return { success: true, data: faq, message: 'FAQ unpublished' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== MARK AS HELPFUL ==========
    async markAsHelpful(faqId) {
        try {
            const faq = await FAQ.findByPk(faqId);

            if (!faq) {
                return { success: false, error: 'FAQ not found' };
            }

            faq.helpfulCount = (faq.helpfulCount || 0) + 1;
            await faq.save();

            return { success: true, data: faq };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== MARK AS UNHELPFUL ==========
    async markAsUnhelpful(faqId) {
        try {
            const faq = await FAQ.findByPk(faqId);

            if (!faq) {
                return { success: false, error: 'FAQ not found' };
            }

            faq.unhelpfulCount = (faq.unhelpfulCount || 0) + 1;
            await faq.save();

            return { success: true, data: faq };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== DELETE FAQ ==========
    async deleteFAQ(faqId) {
        try {
            const faq = await FAQ.findByPk(faqId);

            if (!faq) {
                return { success: false, error: 'FAQ not found' };
            }

            await faq.destroy();

            return { success: true, message: 'FAQ deleted successfully' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== GET FAQ STATISTICS ==========
    async getFAQStatistics() {
        try {
            const totalFAQs = await FAQ.count();
            const publishedFAQs = await FAQ.count({ where: { isPublished: true } });
            const averageHelpful = await FAQ.avg('helpfulCount');
            const topFAQs = await FAQ.findAll({
                order: [
                    ['viewCount', 'DESC']
                ],
                limit: 10,
            });

            return {
                success: true,
                data: {
                    totalFAQs,
                    publishedFAQs,
                    draftFAQs: totalFAQs - publishedFAQs,
                    averageHelpfulCount: averageHelpful ? averageHelpful.toFixed(2) : 0,
                    topFAQs,
                },
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== GET CATEGORIES ==========
    async getCategories() {
        try {
            const faqs = await FAQ.findAll({
                attributes: ['category'],
                group: ['category'],
                raw: true,
            });

            const categories = faqs.map(f => f.category).filter(Boolean);

            return { success: true, data: categories };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

export default new FAQService();