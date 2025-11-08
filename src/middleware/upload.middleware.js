// src/middleware/upload.middleware.js
// ESM module — ImageKit primary uploader, Cloudinary fallback.
// Exports:
//  - named: uploadMiddleware (multer instance / helper)
//  - named: handleUploadError (Express error handler for uploads)
//  - named: uploadToImageKit, uploadToCloudinary (helpers)
//  - default: uploadMiddleware
//
// Usage example (route):
// import { uploadMiddleware, handleUploadError } from './middleware/upload.middleware.js';
// router.post('/upload', uploadMiddleware.single('file'), async (req,res,next) => {
//   // req.file is available; file metadata from cloud is placed on req.file.cloud (see code)
//   res.json({ success: true, file: req.file && req.file.cloud });
// }, handleUploadError);

import multer from 'multer';

// Lazy dynamic SDK imports to avoid crashing at import when package missing
let ImageKitSdk = null;
let cloudinary = null;
async function _tryLoadSdks() {
    if (!ImageKitSdk) {
        try { ImageKitSdk = await
            import ('imagekit').then(m => m.default || m); } catch (e) { ImageKitSdk = null; }
    }
    if (!cloudinary) {
        try { cloudinary = await
            import ('cloudinary').then(m => m.v2 || m); } catch (e) { cloudinary = null; }
    }
    return { ImageKitSdk, cloudinary };
}

// Multer memory storage - file buffer available at req.file.buffer
const memoryStorage = multer.memoryStorage();
const multerInstance = multer({
    storage: memoryStorage,
    limits: {
        fileSize: (process.env.UPLOAD_MAX_BYTES && Number(process.env.UPLOAD_MAX_BYTES)) || 10 * 1024 * 1024 // 10MB default
    },
    fileFilter: function(req, file, cb) {
        try {
            // Allow common image types and pdf — adapt to project needs
            const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'];
            if (allowed.indexOf(file.mimetype) !== -1) return cb(null, true);
            // you can accept everything by calling cb(null, true) — but keep checks for safety
            return cb(new Error('Invalid file type'));
        } catch (err) { cb(err); }
    }
});

/* ---------------------------------------
   ImageKit Uploader
   ---------------------------------------
   Returns { url, fileId, response: rawResponse } on success
*/
export async function uploadToImageKit(buffer, filename, options) {
    options = options || {};
    await _tryLoadSdks();
    if (!ImageKitSdk) {
        throw new Error('ImageKit SDK not available (install "imagekit")');
    }

    // configure client
    const ik = new ImageKitSdk({
        publicKey: options.publicKey || process.env.IMAGEKIT_PUBLIC_KEY,
        privateKey: options.privateKey || process.env.IMAGEKIT_PRIVATE_KEY,
        urlEndpoint: options.urlEndpoint || process.env.IMAGEKIT_URL_ENDPOINT
    });

    if (!ik || !ik.upload) {
        throw new Error('ImageKit client not configured properly');
    }

    // imagekit expects base64 or buffer; we'll pass buffer via file parameter (type: 'buffer')
    // build upload params
    const uploadParams = {
        file: buffer, // Buffer is supported by imagekit-js server SDK
        fileName: filename || ('upload-' + Date.now()),
        ...options.uploadOptions // allow passing folder, tags, etc.
    };

    return new Promise((resolve, reject) => {
        try {
            ik.upload(uploadParams, function(err, result) {
                if (err) return reject(err);
                // result has url, fileId, etc.
                return resolve({ url: result.url, fileId: result.fileId, response: result });
            });
        } catch (e) {
            return reject(e);
        }
    });
}

/* ---------------------------------------
   Cloudinary Uploader (fallback)
   ---------------------------------------
   Returns { url, public_id, response }
*/
export async function uploadToCloudinary(buffer, filename, options) {
    options = options || {};
    await _tryLoadSdks();
    if (!cloudinary) {
        throw new Error('Cloudinary SDK not available (install "cloudinary")');
    }

    // Configure cloudinary if environment variables present (cloudinary.v2.config reads CLOUDINARY_URL or env vars)
    try {
        // cloudinary.config may be optional if CLOUDINARY_URL present
        if (options.config) cloudinary.config(options.config || {});
    } catch (_) {}

    // Cloudinary's upload API expects a readable stream or local file; we will use upload_stream
    return new Promise((resolve, reject) => {
        try {
            const streamifier = require('streamifier'); // small helper to convert buffer to stream
            const uploadStream = cloudinary.uploader.upload_stream({ resource_type: 'auto', public_id: filename ? filename.replace(/\.[^/.]+$/, "") : undefined, folder: options.folder || undefined },
                function(err, result) {
                    if (err) return reject(err);
                    resolve({ url: result.secure_url || result.url, public_id: result.public_id, response: result });
                }
            );
            // pipe buffer into uploadStream
            streamifier.createReadStream(buffer).pipe(uploadStream);
        } catch (e) {
            return reject(e);
        }
    });
}

/* ---------------------------------------
   Middleware wrapper: multer + cloud upload
   - After multer populates req.file (or req.files), this middleware uploads and attaches metadata to req.file.cloud
   - If ImageKit upload fails, attempts Cloudinary fallback
   - On failure, calls next(err)
   --------------------------------------- */
export async function _cloudUploadHandler(req, res, next) {
    try {
        // multer stored file(s) in req.file or req.files
        const single = req.file || (req.files && req.files.length === 1 && req.files[0]);
        const files = req.files || (req.file ? [req.file] : []);

        if (!single && (!files || files.length === 0)) {
            // nothing to upload; proceed (some endpoints accept optional file)
            return next();
        }

        // helper to upload a single file object (multer File)
        async function uploadOne(fileObj) {
            if (!fileObj || !fileObj.buffer) throw new Error('No file buffer found for upload');
            const originalName = fileObj.originalname || ('file-' + Date.now());
            // attempt ImageKit
            try {
                const ikRes = await uploadToImageKit(fileObj.buffer, originalName, { uploadOptions: req.imagekitOptions || {}, publicKey: undefined, privateKey: undefined });
                // attach cloud metadata
                fileObj.cloud = { provider: 'imagekit', url: ikRes.url, id: ikRes.fileId, raw: ikRes.response };
                return fileObj;
            } catch (ikErr) {
                // log and try cloudinary
                console.warn('ImageKit upload failed - falling back to Cloudinary:', ikErr && ikErr.message ? ikErr.message : ikErr);
                try {
                    const clRes = await uploadToCloudinary(fileObj.buffer, originalName, { folder: req.cloudinaryFolder || undefined });
                    fileObj.cloud = { provider: 'cloudinary', url: clRes.url, id: clRes.public_id, raw: clRes.response };
                    return fileObj;
                } catch (clErr) {
                    // propagate last error
                    const err = new Error('Upload failed (ImageKit + Cloudinary)');
                    err.details = { imagekitError: (ikErr && ikErr.message) || ikErr, cloudinaryError: (clErr && clErr.message) || clErr };
                    throw err;
                }
            }
        }

        // if multiple files, upload all sequentially (or parallel with Promise.all if you prefer)
        const uploaded = [];
        for (let i = 0; i < files.length; i += 1) {
            const f = files[i];
            const u = await uploadOne(f);
            uploaded.push(u);
        }

        // ensure req.file and req.files reflect cloud metadata
        if (req.file) {
            req.file = uploaded[0] || req.file;
        } else {
            req.files = uploaded;
        }

        return next();
    } catch (err) {
        return next(err);
    }
}

/* ---------------------------------------
   Exports expected by your project:
   - uploadMiddleware (the multer instance helper)
   - handleUploadError (Express error handler)
   - default export -> multer instance (convenience)
   --------------------------------------- */

// multer instance helper export: callers usually use uploadMiddleware.single('field') or .array(...)
export const uploadMiddleware = multerInstance;

// error handler for uploads (MulterError and our wrapper errors)
export function handleUploadError(err, req, res, next) {
    try {
        if (!err) return next();

        // Multer errors
        if (err && err.code && typeof err.code === 'string') {
            // common multer error codes: 'LIMIT_FILE_SIZE', 'LIMIT_FILE_COUNT', etc.
            if (err.code === 'LIMIT_FILE_SIZE') return res.status(400).json({ success: false, message: 'File too large' });
            return res.status(400).json({ success: false, message: err.message || 'Upload error', code: err.code });
        }

        // our combined upload error with details
        if (err && err.details) {
            return res.status(500).json({ success: false, message: 'Upload failed', details: err.details });
        }

        // generic error
        return res.status(500).json({ success: false, message: err.message || 'Upload error' });
    } catch (fatal) {
        console.error('handleUploadError fatal:', fatal && fatal.stack ? fatal.stack : fatal);
        try { return res.status(500).json({ success: false, message: 'Unknown upload error' }); } catch (_) {}
    }
    return;
}

export default uploadMiddleware;