// ImageKit Configuration
import ImageKit from 'imagekit';
import logger from '../utils/logger.js';
import config from './index.js';

if (!config.imageKit.publicKey || !config.imageKit.privateKey || !config.imageKit.urlEndpoint) {
    logger.warn('ImageKit credentials not fully configured');
}

const imageKit = new ImageKit({
    publicKey: config.imageKit.publicKey,
    privateKey: config.imageKit.privateKey,
    urlEndpoint: config.imageKit.urlEndpoint,
});

async function testImageKitConnection() {
    try {
        const result = await imageKit.listFiles({
            limit: 1,
        });
        logger.info('✅ ImageKit connection successful');
        return true;
    } catch (error) {
        logger.error('ImageKit connection failed');
        logger.error('Error details:', error.message);
        return false;
    }
}

const uploadFile = async(fileBuffer, fileName, folder) => {
    try {
        if (!fileBuffer) {
            throw new Error('File buffer is required');
        }

        if (!fileName) {
            throw new Error('File name is required');
        }

        const folderPath = folder || config.imageKit.folderPrefix || '/medivoy';

        const response = await imageKit.upload({
            file: fileBuffer,
            fileName: fileName,
            folder: folderPath,
            isPrivateFile: false,
            useUniqueFileName: true,
            overwriteFile: false,
            tags: ['medivoy'],
            customCoordinates: null,
            responseFields: 'isPrivateFile,tags',
        });

        logger.info(`File uploaded successfully: ${fileName}`);
        return {
            success: true,
            fileId: response.fileId,
            name: response.name,
            url: response.url,
            path: response.filePath,
            size: response.size,
            createdAt: response.createdAt,
        };
    } catch (error) {
        logger.error('ImageKit file upload failed');
        logger.error('Error details:', error.message);
        return {
            success: false,
            error: error.message,
        };
    }
};

const deleteFile = async(fileId) => {
    try {
        if (!fileId) {
            throw new Error('File ID is required');
        }

        await imageKit.deleteFile(fileId);
        logger.info(`File deleted successfully: ${fileId}`);
        return {
            success: true,
            message: 'File deleted',
        };
    } catch (error) {
        logger.error('ImageKit file deletion failed');
        logger.error('Error details:', error.message);
        return {
            success: false,
            error: error.message,
        };
    }
};

const getFileUrl = async(fileId) => {
    try {
        if (!fileId) {
            throw new Error('File ID is required');
        }

        const response = await imageKit.getFileDetails(fileId);
        return {
            success: true,
            url: response.url,
            name: response.name,
            size: response.size,
        };
    } catch (error) {
        logger.error('Failed to get file URL');
        logger.error('Error details:', error.message);
        return {
            success: false,
            error: error.message,
        };
    }
};

export {
    imageKit,
    testImageKitConnection,
    uploadFile,
    deleteFile,
    getFileUrl,
};