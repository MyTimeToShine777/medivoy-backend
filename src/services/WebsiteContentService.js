// Website Content Service - Website & CMS content management
// NO optional chaining - Production Ready
import { WebsiteContent, User } from '../models/index.js';
import { Op } from 'sequelize';

class WebsiteContentService {
    constructor() {
        this.defaultContent = {
            homepage: {
                title: 'Welcome to Medivoy',
                description: 'Your trusted medical tourism platform',
                hero_image: '/images/hero.jpg',
            },
            about: {
                title: 'About Medivoy',
                content: 'We are committed to providing...',
            },
            services: {
                title: 'Our Services',
                content: 'We offer comprehensive medical services...',
            },
            contact: {
                title: 'Contact Us',
                email: 'info@medivoy.com',
                phone: '+1-800-MEDIVOY',
            },
        };
    }

    // ========== CREATE CONTENT ==========
    async createContent(contentData) {
        try {
            const content = await WebsiteContent.create({
                page: contentData.page,
                title: contentData.title,
                slug: contentData.slug || this.generateSlug(contentData.title),
                content: contentData.content,
                metadata: contentData.metadata || {},
                seoTitle: contentData.seoTitle,
                seoDescription: contentData.seoDescription,
                seoKeywords: contentData.seoKeywords || [],
                status: 'draft',
                isPublished: false,
                createdBy: contentData.createdBy,
                version: 1,
            });

            return { success: true, data: content };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== GET CONTENT ==========
    async getContent(page) {
        try {
            const content = await WebsiteContent.findOne({
                where: { page, isPublished: true },
            });

            if (!content) {
                return {
                    success: false,
                    error: 'Content not found',
                };
            }

            return { success: true, data: content };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== GET CONTENT BY ID ==========
    async getContentById(contentId) {
        try {
            const content = await WebsiteContent.findByPk(contentId, {
                include: [{ model: User, as: 'creator' }],
            });

            if (!content) {
                return { success: false, error: 'Content not found' };
            }

            return { success: true, data: content };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== UPDATE CONTENT ==========
    async updateContent(contentId, updateData) {
        try {
            const content = await WebsiteContent.findByPk(contentId);

            if (!content) {
                return { success: false, error: 'Content not found' };
            }

            const updated = await content.update({
                ...updateData,
                version: (content.version || 1) + 1,
                updatedAt: new Date(),
            });

            return { success: true, data: updated };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== PUBLISH CONTENT ==========
    async publishContent(contentId) {
        try {
            const content = await WebsiteContent.findByPk(contentId);

            if (!content) {
                return { success: false, error: 'Content not found' };
            }

            content.status = 'published';
            content.isPublished = true;
            content.publishedAt = new Date();
            await content.save();

            return { success: true, data: content };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== UNPUBLISH CONTENT ==========
    async unpublishContent(contentId) {
        try {
            const content = await WebsiteContent.findByPk(contentId);

            if (!content) {
                return { success: false, error: 'Content not found' };
            }

            content.isPublished = false;
            content.status = 'draft';
            await content.save();

            return { success: true, data: content };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== GET ALL PAGES ==========
    async getAllPages(filters = {}) {
        try {
            const where = {};

            if (filters.status) {
                where.status = filters.status;
            }

            if (filters.isPublished !== undefined) {
                where.isPublished = filters.isPublished;
            }

            const pages = await WebsiteContent.findAll({
                where,
                order: [
                    ['updatedAt', 'DESC']
                ],
                limit: filters.limit || 50,
                offset: filters.offset || 0,
            });

            const total = await WebsiteContent.count({ where });

            return { success: true, data: pages, total };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== DELETE CONTENT ==========
    async deleteContent(contentId) {
        try {
            const content = await WebsiteContent.findByPk(contentId);

            if (!content) {
                return { success: false, error: 'Content not found' };
            }

            await content.destroy();

            return { success: true, message: 'Content deleted' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== GET CONTENT VERSIONS ==========
    async getContentVersions(page) {
        try {
            const versions = await WebsiteContent.findAll({
                where: { page },
                order: [
                    ['version', 'DESC']
                ],
            });

            return { success: true, data: versions };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== SEARCH CONTENT ==========
    async searchContent(searchTerm) {
        try {
            const results = await WebsiteContent.findAll({
                where: {
                    isPublished: true,
                    [Op.or]: [{
                            title: {
                                [Op.iLike]: `%${searchTerm}%`
                            }
                        },
                        {
                            content: {
                                [Op.iLike]: `%${searchTerm}%`
                            }
                        },
                        {
                            seoKeywords: {
                                [Op.contains]: [searchTerm]
                            }
                        },
                    ],
                },
                order: [
                    ['updatedAt', 'DESC']
                ],
            });

            return { success: true, data: results };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== HELPER: GENERATE SLUG ==========
    generateSlug(title) {
        return title
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');
    }
}

export default new WebsiteContentService();