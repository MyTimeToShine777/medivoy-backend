// Website Content Service - Website & CMS content management
// NO optional chaining - Production Ready
import prisma from '../config/prisma.js';

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
            const content = await prisma.websiteContent.create({
                data: {
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
                }
            });

            return { success: true, data: content };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== GET CONTENT ==========
    async getContent(page) {
        try {
            const content = await prisma.websiteContent.findFirst({
                where: { page, isPublished: true }
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
            const content = await prisma.websiteContent.findUnique({
                where: { contentId },
                include: { creator: true }
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
            const content = await prisma.websiteContent.findUnique({
                where: { contentId }
            });

            if (!content) {
                return { success: false, error: 'Content not found' };
            }

            const updated = await prisma.websiteContent.update({
                where: { contentId },
                data: {
                    ...updateData,
                    version: (content.version || 1) + 1,
                    updatedAt: new Date(),
                }
            });

            return { success: true, data: updated };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== PUBLISH CONTENT ==========
    async publishContent(contentId) {
        try {
            const content = await prisma.websiteContent.findUnique({
                where: { contentId }
            });

            if (!content) {
                return { success: false, error: 'Content not found' };
            }

            const updated = await prisma.websiteContent.update({
                where: { contentId },
                data: {
                    status: 'published',
                    isPublished: true,
                    publishedAt: new Date()
                }
            });

            return { success: true, data: updated };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== UNPUBLISH CONTENT ==========
    async unpublishContent(contentId) {
        try {
            const content = await prisma.websiteContent.findUnique({
                where: { contentId }
            });

            if (!content) {
                return { success: false, error: 'Content not found' };
            }

            const updated = await prisma.websiteContent.update({
                where: { contentId },
                data: {
                    isPublished: false,
                    status: 'draft'
                }
            });

            return { success: true, data: updated };
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

            const pages = await prisma.websiteContent.findMany({
                where,
                orderBy: {
                    updatedAt: 'desc'
                },
                take: filters.limit || 50,
                skip: filters.offset || 0,
            });

            const total = await prisma.websiteContent.count({ where });

            return { success: true, data: pages, total };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== DELETE CONTENT ==========
    async deleteContent(contentId) {
        try {
            const content = await prisma.websiteContent.findUnique({
                where: { contentId }
            });

            if (!content) {
                return { success: false, error: 'Content not found' };
            }

            await prisma.websiteContent.delete({
                where: { contentId }
            });

            return { success: true, message: 'Content deleted' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== GET CONTENT VERSIONS ==========
    async getContentVersions(page) {
        try {
            const versions = await prisma.websiteContent.findMany({
                where: { page },
                orderBy: {
                    version: 'desc'
                }
            });

            return { success: true, data: versions };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== SEARCH CONTENT ==========
    async searchContent(searchTerm) {
        try {
            const results = await prisma.websiteContent.findMany({
                where: {
                    isPublished: true,
                    OR: [{
                            title: {
                                contains: searchTerm,
                                mode: 'insensitive'
                            }
                        },
                        {
                            content: {
                                contains: searchTerm,
                                mode: 'insensitive'
                            }
                        },
                        {
                            seoKeywords: {
                                has: searchTerm
                            }
                        }
                    ]
                },
                orderBy: {
                    updatedAt: 'desc'
                }
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

export { WebsiteContentService };
export default new WebsiteContentService();