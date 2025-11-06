// File Upload Utility - ImageKit Integration - NO optional chaining
import logger from './logger.js';
import { uploadFile, deleteFile, getFileUrl } from '../config/imagekit.js';

const fileUploadUtil = {
    // Upload insurance document
    uploadInsuranceDocument: async(fileBuffer, fileName, bookingId) => {
        try {
            if (!fileBuffer) {
                throw new Error('File buffer is required');
            }

            if (!fileName) {
                throw new Error('File name is required');
            }

            if (!bookingId) {
                throw new Error('Booking ID is required');
            }

            const folder = process.env.IMAGEKIT_FOLDER_INSURANCE || '/insurance-documents';
            const uniqueFileName = `booking_${bookingId}_${Date.now()}_${fileName}`;

            const result = await uploadFile(fileBuffer, uniqueFileName, folder);

            if (result.success === false) {
                throw new Error(result.error);
            }

            logger.info(`Insurance document uploaded for booking ${bookingId}`);
            return result;
        } catch (error) {
            logger.error('Failed to upload insurance document');
            logger.error('Error details:', error.message);
            throw error;
        }
    },

    // Upload medical document
    uploadMedicalDocument: async(fileBuffer, fileName, bookingId, documentType) => {
        try {
            if (!fileBuffer) {
                throw new Error('File buffer is required');
            }

            if (!fileName) {
                throw new Error('File name is required');
            }

            if (!bookingId) {
                throw new Error('Booking ID is required');
            }

            const folder = process.env.IMAGEKIT_FOLDER_MEDICAL || '/medical-documents';
            const uniqueFileName = `booking_${bookingId}_${documentType}_${Date.now()}_${fileName}`;

            const result = await uploadFile(fileBuffer, uniqueFileName, folder);

            if (result.success === false) {
                throw new Error(result.error);
            }

            logger.info(`Medical document uploaded for booking ${bookingId}`);
            return result;
        } catch (error) {
            logger.error('Failed to upload medical document');
            logger.error('Error details:', error.message);
            throw error;
        }
    },

    // Upload prescription
    uploadPrescription: async(fileBuffer, fileName, patientId) => {
        try {
            if (!fileBuffer) {
                throw new Error('File buffer is required');
            }

            if (!fileName) {
                throw new Error('File name is required');
            }

            if (!patientId) {
                throw new Error('Patient ID is required');
            }

            const folder = process.env.IMAGEKIT_FOLDER_PRESCRIPTIONS || '/prescriptions';
            const uniqueFileName = `patient_${patientId}_${Date.now()}_${fileName}`;

            const result = await uploadFile(fileBuffer, uniqueFileName, folder);

            if (result.success === false) {
                throw new Error(result.error);
            }

            logger.info(`Prescription uploaded for patient ${patientId}`);
            return result;
        } catch (error) {
            logger.error('Failed to upload prescription');
            logger.error('Error details:', error.message);
            throw error;
        }
    },

    // Upload lab report
    uploadLabReport: async(fileBuffer, fileName, labTestId) => {
        try {
            if (!fileBuffer) {
                throw new Error('File buffer is required');
            }

            if (!fileName) {
                throw new Error('File name is required');
            }

            if (!labTestId) {
                throw new Error('Lab Test ID is required');
            }

            const folder = process.env.IMAGEKIT_FOLDER_LAB_REPORTS || '/lab-reports';
            const uniqueFileName = `labtest_${labTestId}_${Date.now()}_${fileName}`;

            const result = await uploadFile(fileBuffer, uniqueFileName, folder);

            if (result.success === false) {
                throw new Error(result.error);
            }

            logger.info(`Lab report uploaded for lab test ${labTestId}`);
            return result;
        } catch (error) {
            logger.error('Failed to upload lab report');
            logger.error('Error details:', error.message);
            throw error;
        }
    },

    // Upload user avatar
    uploadUserAvatar: async(fileBuffer, fileName, userId) => {
        try {
            if (!fileBuffer) {
                throw new Error('File buffer is required');
            }

            if (!fileName) {
                throw new Error('File name is required');
            }

            if (!userId) {
                throw new Error('User ID is required');
            }

            const folder = process.env.IMAGEKIT_FOLDER_USER_AVATARS || '/user-avatars';
            const uniqueFileName = `user_${userId}_avatar_${Date.now()}.jpg`;

            const result = await uploadFile(fileBuffer, uniqueFileName, folder);

            if (result.success === false) {
                throw new Error(result.error);
            }

            logger.info(`Avatar uploaded for user ${userId}`);
            return result;
        } catch (error) {
            logger.error('Failed to upload user avatar');
            logger.error('Error details:', error.message);
            throw error;
        }
    },

    // Upload hospital logo
    uploadHospitalLogo: async(fileBuffer, fileName, hospitalId) => {
        try {
            if (!fileBuffer) {
                throw new Error('File buffer is required');
            }

            if (!fileName) {
                throw new Error('File name is required');
            }

            if (!hospitalId) {
                throw new Error('Hospital ID is required');
            }

            const folder = process.env.IMAGEKIT_FOLDER_HOSPITAL_LOGOS || '/hospital-logos';
            const uniqueFileName = `hospital_${hospitalId}_logo_${Date.now()}.jpg`;

            const result = await uploadFile(fileBuffer, uniqueFileName, folder);

            if (result.success === false) {
                throw new Error(result.error);
            }

            logger.info(`Logo uploaded for hospital ${hospitalId}`);
            return result;
        } catch (error) {
            logger.error('Failed to upload hospital logo');
            logger.error('Error details:', error.message);
            throw error;
        }
    },

    // Delete file
    deleteFile: async(fileId) => {
        try {
            if (!fileId) {
                throw new Error('File ID is required');
            }

            const result = await deleteFile(fileId);

            if (result.success === false) {
                throw new Error(result.error);
            }

            logger.info(`File deleted: ${fileId}`);
            return result;
        } catch (error) {
            logger.error('Failed to delete file');
            logger.error('Error details:', error.message);
            throw error;
        }
    },

    // Get file URL
    getFileUrl: async(fileId) => {
        try {
            if (!fileId) {
                throw new Error('File ID is required');
            }

            const result = await getFileUrl(fileId);

            if (result.success === false) {
                throw new Error(result.error);
            }

            return result;
        } catch (error) {
            logger.error('Failed to get file URL');
            logger.error('Error details:', error.message);
            throw error;
        }
    },

    // Validate file type
    isValidFileType: (fileName, allowedTypes) => {
        if (!fileName || !allowedTypes) {
            return false;
        }

        const fileExtension = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();
        return allowedTypes.includes(fileExtension);
    },

    // Validate file size
    isValidFileSize: (fileSize, maxSize) => {
        if (!fileSize || !maxSize) {
            return false;
        }

        return fileSize <= maxSize;
    },
};

export default fileUploadUtil;