'use strict';

import ImageKit from 'imagekit';
import { environment } from './environment.js';

// ═══════════════════════════════════════════════════════════════════════════════
// IMAGEKIT CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

let imagekit = null;

// Initialize ImageKit only if credentials are provided
if (process.env.IMAGEKIT_PUBLIC_KEY && process.env.IMAGEKIT_PRIVATE_KEY && process.env.IMAGEKIT_URL_ENDPOINT) {
    imagekit = new ImageKit({
        publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
        privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
        urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
    });
} else {
    console.warn('ImageKit not configured in config - ImageKit features will be disabled');
}

export { imagekit };

// ═══════════════════════════════════════════════════════════════════════════════
// IMAGEKIT SERVICE
// ═══════════════════════════════════════════════════════════════════════════════

export class ImageKitService {
    constructor() {
        this.imagekit = imagekit;
    }

    // Upload file
    async uploadFile(file, fileName, tags = []) {
        try {
            const result = await this.imagekit.upload({
                file: file.buffer,
                fileName: fileName,
                tags: tags,
                folder: '/medivoy'
            });

            console.log('✅ File uploaded to ImageKit:', result.url);

            return {
                success: true,
                fileId: result.fileId,
                url: result.url,
                thumbnailUrl: result.thumbnailUrl
            };
        } catch (error) {
            console.error('❌ ImageKit upload error:', error.message);
            return { success: false, error: error.message };
        }
    }

    // Upload multiple files
    async uploadMultipleFiles(files, tags = []) {
        try {
            const uploadPromises = files.map(file =>
                this.uploadFile(file, `${Date.now()}-${file.originalname}`, tags)
            );

            const results = await Promise.all(uploadPromises);

            return {
                success: true,
                files: results.filter(r => r.success),
                failed: results.filter(r => !r.success)
            };
        } catch (error) {
            console.error('❌ Multiple upload error:', error.message);
            return { success: false, error: error.message };
        }
    }

    // Delete file
    async deleteFile(fileId) {
        try {
            await this.imagekit.deleteFile(fileId);
            console.log('✅ File deleted from ImageKit:', fileId);
            return { success: true };
        } catch (error) {
            console.error('❌ ImageKit delete error:', error.message);
            return { success: false, error: error.message };
        }
    }

    // Get file metadata
    async getFileMetadata(fileId) {
        try {
            const result = await this.imagekit.getFileDetails(fileId);
            return { success: true, data: result };
        } catch (error) {
            console.error('❌ ImageKit metadata error:', error.message);
            return { success: false, error: error.message };
        }
    }

    // Get transformation URL
    getTransformationUrl(url, transformations) {
        try {
            return this.imagekit.url({
                path: url,
                transformation: transformations
            });
        } catch (error) {
            console.error('❌ Transformation error:', error.message);
            return null;
        }
    }
}

export const imagekitService = new ImageKitService();

export default imagekit;