# ImageKit Integration Documentation

## Overview
The Medivoy backend integrates with ImageKit.io for advanced image storage, optimization, and delivery through a global CDN. ImageKit provides real-time image transformations, automatic format conversion, and intelligent compression.

## Features

- **Cloud Storage**: Store images on ImageKit's cloud infrastructure
- **CDN Delivery**: Fast image delivery through global CDN
- **Real-time Transformations**: Resize, crop, and transform images on-the-fly
- **Automatic Optimization**: Intelligent compression and format conversion
- **Image Management**: Upload, delete, list, and organize images
- **Folder Structure**: Organize images in folders
- **Metadata Support**: Add custom metadata to images
- **Cache Management**: Purge cache for updated images

## Configuration

### Environment Variables

```env
# ImageKit Configuration
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key_here
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key_here
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_imagekit_id

# Media Upload Settings
MAX_FILE_SIZE=10485760  # 10MB in bytes
ALLOWED_FILE_TYPES=jpg,jpeg,png,gif,webp,svg,pdf
```

### ImageKit Setup

1. Sign up at [ImageKit.io](https://imagekit.io/)
2. Get your credentials from the Dashboard:
   - Public Key
   - Private Key
   - URL Endpoint
3. Add credentials to your `.env` file

## API Endpoints

### 1. Upload Single File

```bash
POST /api/v1/media/upload
Content-Type: multipart/form-data
Authorization: Bearer <token>

Form Data:
- file: <file>
- folder: /medivoy/hospitals (optional)
- tags: hospital,profile (optional)
- useUniqueFileName: true (optional)
- customMetadata: {"category": "profile"} (optional)

Response:
{
  "success": true,
  "message": "File uploaded successfully",
  "data": {
    "fileId": "abc123xyz",
    "name": "hospital-image.jpg",
    "url": "https://ik.imagekit.io/your_id/medivoy/hospitals/hospital-image.jpg",
    "thumbnailUrl": "https://ik.imagekit.io/your_id/medivoy/hospitals/tr:n-media_library_thumbnail/hospital-image.jpg",
    "fileType": "image",
    "filePath": "/medivoy/hospitals/hospital-image.jpg",
    "size": 245678,
    "width": 1920,
    "height": 1080,
    "tags": ["hospital", "profile"]
  }
}
```

### 2. Upload Multiple Files

```bash
POST /api/v1/media/upload-multiple
Content-Type: multipart/form-data
Authorization: Bearer <token>

Form Data:
- files: <file1>, <file2>, <file3>
- folder: /medivoy/gallery (optional)
- tags: gallery,images (optional)

Response:
{
  "success": true,
  "message": "3 files uploaded successfully, 0 failed",
  "data": [
    {
      "success": true,
      "fileId": "abc123",
      "url": "https://ik.imagekit.io/your_id/medivoy/gallery/image1.jpg"
    },
    // ... more files
  ]
}
```

### 3. Delete File

```bash
DELETE /api/v1/media/:fileId
Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "File deleted successfully"
}
```

### 4. Delete Multiple Files

```bash
POST /api/v1/media/delete-multiple
Content-Type: application/json
Authorization: Bearer <token>

{
  "fileIds": ["abc123", "def456", "ghi789"]
}

Response:
{
  "success": true,
  "message": "2 files deleted successfully, 1 failed",
  "data": [
    {
      "fileId": "abc123",
      "success": true
    },
    {
      "fileId": "def456",
      "success": true
    },
    {
      "fileId": "ghi789",
      "success": false,
      "error": "File not found"
    }
  ]
}
```

### 5. Get File Details

```bash
GET /api/v1/media/:fileId
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "fileId": "abc123",
    "name": "hospital-image.jpg",
    "url": "https://ik.imagekit.io/your_id/medivoy/hospitals/hospital-image.jpg",
    "size": 245678,
    "width": 1920,
    "height": 1080,
    "fileType": "image",
    "tags": ["hospital", "profile"],
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### 6. List Files

```bash
GET /api/v1/media?skip=0&limit=100&path=/medivoy/hospitals&tags=profile
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": [
    {
      "fileId": "abc123",
      "name": "hospital1.jpg",
      "url": "https://ik.imagekit.io/your_id/medivoy/hospitals/hospital1.jpg"
    },
    // ... more files
  ],
  "pagination": {
    "skip": 0,
    "limit": 100,
    "total": 45
  }
}
```

### 7. Update File Details

```bash
PUT /api/v1/media/:fileId
Content-Type: application/json
Authorization: Bearer <token>

{
  "tags": ["hospital", "featured"],
  "customMetadata": {
    "category": "featured",
    "priority": "high"
  }
}

Response:
{
  "success": true,
  "message": "File details updated successfully",
  "data": {
    "fileId": "abc123",
    "tags": ["hospital", "featured"],
    "customMetadata": {
      "category": "featured",
      "priority": "high"
    }
  }
}
```

### 8. Get Transformed URL

```bash
POST /api/v1/media/transform
Content-Type: application/json
Authorization: Bearer <token>

{
  "path": "/medivoy/hospitals/hospital-image.jpg",
  "transformations": {
    "width": 800,
    "height": 600,
    "crop": "at_max",
    "quality": 80,
    "format": "webp"
  }
}

Response:
{
  "success": true,
  "data": {
    "url": "https://ik.imagekit.io/your_id/medivoy/hospitals/tr:w-800,h-600,c-at_max,q-80,f-webp/hospital-image.jpg"
  }
}
```

### 9. Get Thumbnail URL

```bash
POST /api/v1/media/thumbnail
Content-Type: application/json
Authorization: Bearer <token>

{
  "path": "/medivoy/hospitals/hospital-image.jpg",
  "width": 200,
  "height": 200
}

Response:
{
  "success": true,
  "data": {
    "url": "https://ik.imagekit.io/your_id/medivoy/hospitals/tr:w-200,h-200,c-at_max,q-80/hospital-image.jpg"
  }
}
```

### 10. Get Optimized URL

```bash
POST /api/v1/media/optimize
Content-Type: application/json
Authorization: Bearer <token>

{
  "path": "/medivoy/hospitals/hospital-image.jpg",
  "options": {
    "quality": 80,
    "format": "auto"
  }
}

Response:
{
  "success": true,
  "data": {
    "url": "https://ik.imagekit.io/your_id/medivoy/hospitals/tr:q-80,f-auto/hospital-image.jpg"
  }
}
```

### 11. Purge Cache (Admin Only)

```bash
POST /api/v1/media/purge-cache
Content-Type: application/json
Authorization: Bearer <admin_token>

{
  "url": "https://ik.imagekit.io/your_id/medivoy/hospitals/hospital-image.jpg"
}

Response:
{
  "success": true,
  "message": "Cache purged successfully",
  "data": {
    "requestId": "xyz789"
  }
}
```

### 12. Get Authentication Parameters

```bash
GET /api/v1/media/auth/params
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "token": "unique_token_here",
    "expire": 1640000000,
    "signature": "signature_here"
  }
}
```

### 13. Create Folder

```bash
POST /api/v1/media/folder
Content-Type: application/json
Authorization: Bearer <token>

{
  "folderName": "doctors",
  "parentFolderPath": "/medivoy"
}

Response:
{
  "success": true,
  "message": "Folder created successfully",
  "data": {
    "folderPath": "/medivoy/doctors"
  }
}
```

### 14. Delete Folder (Admin Only)

```bash
DELETE /api/v1/media/folder
Content-Type: application/json
Authorization: Bearer <admin_token>

{
  "folderPath": "/medivoy/doctors"
}

Response:
{
  "success": true,
  "message": "Folder deleted successfully"
}
```

## Image Transformations

ImageKit supports various transformations that can be applied to images on-the-fly:

### Common Transformations

```javascript
// Resize
{
  width: 800,
  height: 600
}

// Crop
{
  width: 800,
  height: 600,
  crop: "at_max"  // Options: at_max, at_least, maintain_ratio, force
}

// Quality
{
  quality: 80  // 1-100
}

// Format
{
  format: "webp"  // Options: auto, jpg, png, webp, avif
}

// Blur
{
  blur: 10  // 1-100
}

// Rotate
{
  rotate: 90  // 0-360
}

// Border
{
  border: "5_FF0000"  // width_color
}

// Overlay
{
  overlay: "logo.png",
  overlayX: 10,
  overlayY: 10
}
```

### Transformation Examples

```javascript
// Responsive thumbnail
imagekitService.getUrl('/path/to/image.jpg', {
  width: 300,
  height: 300,
  crop: 'at_max',
  quality: 80,
  format: 'webp'
});

// Profile picture
imagekitService.getUrl('/path/to/profile.jpg', {
  width: 200,
  height: 200,
  crop: 'force',
  radius: 'max',  // Circular
  quality: 90
});

// Banner image
imagekitService.getUrl('/path/to/banner.jpg', {
  width: 1920,
  height: 400,
  crop: 'at_max',
  quality: 85,
  format: 'auto'
});
```

## Usage in Models

### Example: Hospital Model with ImageKit

```javascript
// Before creating/updating hospital
const uploadResult = await imagekitService.uploadFile(req.file, {
  folder: '/medivoy/hospitals',
  tags: ['hospital', 'profile']
});

// Store ImageKit URL in database
const hospital = await Hospital.create({
  name: 'Apollo Hospital',
  imageUrl: uploadResult.url,
  imageFileId: uploadResult.fileId,
  thumbnailUrl: uploadResult.thumbnailUrl
});

// When retrieving hospital, generate optimized URLs
const optimizedImageUrl = imagekitService.getOptimizedUrl(hospital.imageUrl, {
  quality: 80,
  format: 'auto'
});

const thumbnailUrl = imagekitService.getThumbnailUrl(hospital.imageUrl, 200, 200);
```

## Client-Side Upload

For direct client-side uploads, use the authentication parameters:

```javascript
// Frontend code
const authParams = await fetch('/api/v1/media/auth/params', {
  headers: {
    'Authorization': 'Bearer ' + token
  }
}).then(r => r.json());

// Use ImageKit SDK on frontend
const imagekit = new ImageKit({
  publicKey: "your_public_key",
  urlEndpoint: "https://ik.imagekit.io/your_id",
  authenticationEndpoint: "/api/v1/media/auth/params"
});

imagekit.upload({
  file: fileInput.files[0],
  fileName: "hospital-image.jpg",
  folder: "/medivoy/hospitals",
  tags: ["hospital", "profile"]
}, function(err, result) {
  if (err) {
    console.error(err);
  } else {
    console.log(result);
  }
});
```

## Best Practices

1. **Organize with Folders**: Use a clear folder structure (e.g., `/medivoy/hospitals`, `/medivoy/doctors`)
2. **Use Tags**: Tag images for easy filtering and searching
3. **Optimize Images**: Always use transformations to serve optimized images
4. **Cache Management**: Purge cache when images are updated
5. **Lazy Loading**: Use ImageKit's lazy loading features on frontend
6. **Responsive Images**: Generate multiple sizes for different devices
7. **Format Selection**: Use `format: 'auto'` for automatic format selection
8. **Quality Settings**: Balance quality and file size (80-85 is usually optimal)
9. **Metadata**: Store important metadata with images
10. **Error Handling**: Always handle upload/delete errors gracefully

## Performance Tips

1. **Use CDN**: ImageKit's CDN ensures fast delivery worldwide
2. **Automatic Optimization**: Enable automatic format conversion (WebP, AVIF)
3. **Lazy Loading**: Implement lazy loading for images below the fold
4. **Responsive Images**: Serve different sizes based on device
5. **Compression**: Use quality settings between 70-85 for optimal compression
6. **Caching**: Leverage browser and CDN caching
7. **Batch Operations**: Upload/delete multiple files in batches

## Troubleshooting

### Upload Failures

1. Check file size limits (default: 10MB)
2. Verify file format is supported
3. Check ImageKit credentials
4. Review API quota and limits

### Image Not Loading

1. Verify URL is correct
2. Check if file exists in ImageKit
3. Verify CDN is accessible
4. Check CORS settings

### Transformation Issues

1. Verify transformation syntax
2. Check if transformation is supported
3. Review ImageKit documentation for specific transformations

## Security

1. **API Keys**: Keep ImageKit private key secure
2. **Access Control**: Restrict upload endpoints to authenticated users
3. **File Validation**: Validate file types and sizes
4. **Rate Limiting**: Implement rate limiting on upload endpoints
5. **Signed URLs**: Use signed URLs for private images
6. **CORS**: Configure CORS properly for client-side uploads

## Cost Optimization

1. **Storage**: Delete unused images regularly
2. **Bandwidth**: Use appropriate image sizes and quality
3. **Transformations**: Cache transformed images
4. **Format**: Use modern formats (WebP, AVIF) for smaller sizes
5. **Monitoring**: Monitor usage and optimize accordingly