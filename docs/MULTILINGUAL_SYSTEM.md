# Multilingual System Documentation

## Overview
The Medivoy backend now supports automatic translation of content into multiple languages using Google Translate API. The system detects the language of incoming data and can automatically translate it to English or any other target language.

## Architecture

### Components

1. **Google Translate Service** (`src/services/googleTranslate.service.js`)
   - Language detection using `franc` library
   - Text translation using Google Translate API
   - Batch translation support
   - Object field translation

2. **Translation Worker** (`src/workers/translation.worker.js`)
   - Background job processing using Bull queue
   - Automatic translation of database records
   - Job status tracking and monitoring
   - Retry logic for failed translations

3. **Multilingual Middleware** (`src/middleware/multilingual.middleware.js`)
   - Language detection on incoming requests
   - Automatic translation queueing
   - Immediate translation support
   - Response translation based on user preference

4. **Translation Controller** (`src/controllers/translation.controller.js`)
   - Manual translation endpoints
   - Job management endpoints
   - Queue statistics and monitoring

## Flow Diagram

```
┌─────────────────┐
│  Create Action  │
└────────┬────────┘
         │
         ▼
┌─────────────────────────┐
│ Language Route Kit      │
│ (en-IN)                 │
└────────┬────────────────┘
         │
         ├─── If other language ───┐
         │                         │
         ▼                         ▼
    ┌────────┐            ┌──────────────┐
    │   DB   │            │ Worker/Trigger│
    └────────┘            │  (translate)  │
         ▲                └───────┬───────┘
         │                        │
         │                        ▼
         │                ┌──────────────┐
         │                │ CRON Job     │
         │                │ (DB backup)  │
         │                └───────┬──────┘
         │                        │
         └────────────────────────┘
                                  │
                                  ▼
                              ┌───────┐
                              │   S3  │
                              └───────┘
```

## Configuration

### Environment Variables

```env
# Google Translate API Configuration
GOOGLE_TRANSLATE_API_KEY=your_google_translate_api_key_here
# OR use service account credentials file
GOOGLE_APPLICATION_CREDENTIALS=/path/to/google-credentials.json

# Redis Configuration (for Bull Queue)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Translation Settings
DEFAULT_LANGUAGE=en
SUPPORTED_LANGUAGES=en,hi,es,fr,de,it,pt,ru,ja,ko,zh,ar
AUTO_TRANSLATE=true
```

### Google Translate API Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Cloud Translation API
4. Create credentials (API Key or Service Account)
5. Add the credentials to your `.env` file

## Usage

### 1. Automatic Translation on Create/Update

Add the multilingual middleware to your routes:

```javascript
const { detectAndTranslate, queueTranslation } = require('../middleware/multilingual.middleware');

// Example: Hospital creation with auto-translation
router.post('/',
  authenticate,
  detectAndTranslate('Hospital', ['name', 'description', 'address']),
  async (req, res) => {
    // Create hospital
    const hospital = await Hospital.create(req.body);
    
    // Store for translation middleware
    req.savedRecord = hospital;
    
    res.status(201).json({ success: true, data: hospital });
  },
  queueTranslation('Hospital')
);
```

### 2. Manual Translation

#### Translate Single Text

```bash
POST /api/v1/translation/translate
Content-Type: application/json

{
  "text": "नमस्ते, मैं डॉक्टर हूं",
  "targetLanguage": "en",
  "sourceLanguage": "hi"  // optional
}

Response:
{
  "success": true,
  "data": {
    "originalText": "नमस्ते, मैं डॉक्टर हूं",
    "translatedText": "Hello, I am a doctor",
    "sourceLanguage": "hi",
    "targetLanguage": "en",
    "isTranslated": true
  }
}
```

#### Translate Batch

```bash
POST /api/v1/translation/translate-batch
Content-Type: application/json

{
  "texts": [
    "नमस्ते",
    "धन्यवाद",
    "अलविदा"
  ],
  "targetLanguage": "en"
}

Response:
{
  "success": true,
  "data": [
    {
      "originalText": "नमस्ते",
      "translatedText": "Hello",
      "sourceLanguage": "hi",
      "targetLanguage": "en",
      "isTranslated": true
    },
    // ... more translations
  ]
}
```

#### Detect Language

```bash
POST /api/v1/translation/detect
Content-Type: application/json

{
  "text": "Bonjour, comment allez-vous?"
}

Response:
{
  "success": true,
  "data": {
    "language": "fr"
  }
}
```

### 3. Queue Translation Job

```bash
POST /api/v1/translation/queue
Content-Type: application/json

{
  "modelName": "Hospital",
  "recordId": 123,
  "fields": ["name", "description", "address"],
  "targetLanguage": "en"
}

Response:
{
  "success": true,
  "message": "Translation job queued successfully",
  "data": {
    "jobId": "1234567890",
    "modelName": "Hospital",
    "recordId": 123,
    "fields": ["name", "description", "address"],
    "targetLanguage": "en"
  }
}
```

### 4. Check Job Status

```bash
GET /api/v1/translation/job/:jobId

Response:
{
  "success": true,
  "data": {
    "jobId": "1234567890",
    "state": "completed",
    "progress": 100,
    "data": {
      "modelName": "Hospital",
      "recordId": 123
    },
    "returnvalue": {
      "success": true,
      "fieldsTranslated": 3
    }
  }
}
```

### 5. Queue Statistics (Admin Only)

```bash
GET /api/v1/translation/queue/stats

Response:
{
  "success": true,
  "data": {
    "waiting": 5,
    "active": 2,
    "completed": 150,
    "failed": 3,
    "delayed": 0,
    "total": 160
  }
}
```

## Database Schema Updates

### Adding Multilingual Support to Models

To support multilingual content, add these fields to your models:

```javascript
// Example: Hospital model
{
  name: DataTypes.STRING,
  name_original: DataTypes.STRING,  // Original text before translation
  name_language: DataTypes.STRING,  // Detected language code
  
  description: DataTypes.TEXT,
  description_original: DataTypes.TEXT,
  description_language: DataTypes.STRING,
  
  translatedFrom: DataTypes.STRING,  // Source language
  translatedTo: DataTypes.STRING,    // Target language
  translatedAt: DataTypes.DATE       // Translation timestamp
}
```

## Supported Languages

The system supports the following languages:

- English (en)
- Hindi (hi)
- Spanish (es)
- French (fr)
- German (de)
- Italian (it)
- Portuguese (pt)
- Russian (ru)
- Japanese (ja)
- Korean (ko)
- Chinese (zh)
- Arabic (ar)

## Best Practices

1. **Use Batch Translation**: When translating multiple texts, use batch translation for better performance
2. **Cache Translations**: Store translated content in the database to avoid repeated API calls
3. **Language Detection**: Let the system detect the language automatically for better accuracy
4. **Queue Long Operations**: Use the queue system for translating large datasets
5. **Monitor Queue**: Regularly check queue statistics to ensure smooth operation
6. **Error Handling**: Implement proper error handling for translation failures
7. **Rate Limiting**: Be aware of Google Translate API rate limits and quotas

## Troubleshooting

### Translation Not Working

1. Check if Google Translate API credentials are configured correctly
2. Verify Redis is running (required for queue system)
3. Check API quota and rate limits
4. Review logs for error messages

### Queue Jobs Stuck

1. Check Redis connection
2. Verify worker process is running
3. Check for failed jobs and retry them
4. Clean old completed/failed jobs

### Language Detection Issues

1. Ensure text has sufficient length (minimum 3 characters)
2. Check if the language is supported
3. Try specifying source language manually

## Performance Considerations

1. **API Costs**: Google Translate API charges per character translated
2. **Rate Limits**: Be aware of API rate limits (default: 500,000 characters/day)
3. **Queue Processing**: Monitor queue size and processing time
4. **Caching**: Implement caching to reduce API calls
5. **Batch Operations**: Use batch translation for better efficiency

## Security

1. **API Keys**: Keep Google Translate API keys secure
2. **Access Control**: Restrict translation endpoints to authenticated users
3. **Input Validation**: Validate all input before translation
4. **Rate Limiting**: Implement rate limiting on translation endpoints
5. **Audit Logging**: Log all translation operations for audit purposes