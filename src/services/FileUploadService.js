// File Upload Service - File handling
// NO optional chaining - Production Ready
import multer from 'multer';
import path from 'path';
import fs from 'fs';

class FileUploadService {
    constructor() {
        this.uploadDir = path.join(process.cwd(), 'uploads');
        this.maxFileSize = 10 * 1024 * 1024; // 10MB

        // Create upload directory if doesn't exist
        if (!fs.existsSync(this.uploadDir)) {
            fs.mkdirSync(this.uploadDir, { recursive: true });
        }

        this.allowedMimeTypes = [
            'image/jpeg',
            'image/png',
            'image/gif',
            'application/pdf',
            'application/msword',
        ];

        this.storage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, this.uploadDir);
            },
            filename: (req, file, cb) => {
                const uniqueName = `${Date.now()}-${file.originalname}`;
                cb(null, uniqueName);
            },
        });

        this.upload = multer({
            storage: this.storage,
            limits: { fileSize: this.maxFileSize },
            fileFilter: (req, file, cb) => {
                if (this.allowedMimeTypes.includes(file.mimetype)) {
                    cb(null, true);
                } else {
                    cb(new Error('Invalid file type'));
                }
            },
        });
    }

    // ========== UPLOAD SINGLE FILE ==========
    uploadSingleFile() {
        return this.upload.single('file');
    }

    // ========== UPLOAD MULTIPLE FILES ==========
    uploadMultipleFiles(maxFiles = 5) {
        return this.upload.array('files', maxFiles);
    }

    // ========== VALIDATE FILE ==========
    validateFile(file) {
        const errors = [];

        if (!file) {
            return { valid: false, error: 'No file provided' };
        }

        if (file.size === 0) {
            errors.push('File is empty');
        }
        if (file.size > this.maxFileSize) {
            errors.push(`File size exceeds ${this.maxFileSize / 1024 / 1024}MB limit`);
        }
        if (!this.allowedMimeTypes.includes(file.mimetype)) {
            errors.push('File type not allowed');
        }

        return {
            valid: errors.length === 0,
            errors: errors.length > 0 ? errors : null,
        };
    }

    // ========== DELETE FILE ==========
    deleteFile(fileName) {
        try {
            const filePath = path.join(this.uploadDir, fileName);

            if (!fs.existsSync(filePath)) {
                return { success: false, error: 'File not found' };
            }

            fs.unlinkSync(filePath);

            return { success: true, message: 'File deleted successfully' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== GET FILE INFO ==========
    getFileInfo(fileName) {
        try {
            const filePath = path.join(this.uploadDir, fileName);

            if (!fs.existsSync(filePath)) {
                return { success: false, error: 'File not found' };
            }

            const stats = fs.statSync(filePath);

            return {
                success: true,
                data: {
                    fileName,
                    size: stats.size,
                    created: stats.birthtime,
                    modified: stats.mtime,
                },
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== LIST FILES ==========
    listFiles() {
        try {
            const files = fs.readdirSync(this.uploadDir);

            const fileList = files.map(fileName => {
                const filePath = path.join(this.uploadDir, fileName);
                const stats = fs.statSync(filePath);

                return {
                    fileName,
                    size: stats.size,
                    created: stats.birthtime,
                };
            });

            return { success: true, data: fileList };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== CLEAN UP OLD FILES ==========
    cleanupOldFiles(daysToKeep = 30) {
        try {
            const files = fs.readdirSync(this.uploadDir);
            let deletedCount = 0;

            files.forEach(file => {
                const filePath = path.join(this.uploadDir, file);
                const fileStats = fs.statSync(filePath);
                const fileAgeInDays = Math.floor((Date.now() - fileStats.mtimeMs) / (1000 * 60 * 60 * 24));

                if (fileAgeInDays > daysToKeep) {
                    fs.unlinkSync(filePath);
                    deletedCount++;
                }
            });

            return {
                success: true,
                message: `Deleted ${deletedCount} old files`,
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

export { FileUploadService };
export default new FileUploadService();