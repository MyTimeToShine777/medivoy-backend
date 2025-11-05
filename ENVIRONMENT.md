# Environment variables (detailed)

This file documents all environment variables used by the Medivoy backend and explains which are required in production vs optional for development.

Usage

- Copy `.env.example` to `.env` and update values for your environment.

Categories

- Core: app runtime
- Databases: PostgreSQL, MongoDB
- Cache & Queues: Redis
- Authentication: JWT, session
- Third-party services: SendGrid, Twilio, Stripe, ImageKit, Firebase, AWS
- Worker & queues: worker settings

Important notes

- Never commit a `.env` with real secrets. Use `.env.example` in git, and keep `.env` out of version control.
- For multiline secrets (e.g., Firebase private key) either store the key as a file and set `GOOGLE_APPLICATION_CREDENTIALS` or escape newlines with `\n` when putting the key in `.env`.
- In production, set `NODE_ENV=production` and ensure secure values for `JWT_SECRET`, database credentials, and third-party API keys.

Selected variables (grouped)

1. Core

- NODE_ENV: development | production (default: development)
- PORT: HTTP port for the app (default: 5000)
- APP_NAME, FRONTEND_URL

2. PostgreSQL (required for primary features)

- POSTGRES_HOST, POSTGRES_PORT, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB
- Note: The app treats PostgreSQL as critical — if it can't connect in production the server will exit.

3. MongoDB (optional secondary DB used for logs/notifications)

- MONGODB_URI

4. Redis (cache and queues)

- REDIS_HOST, REDIS_PORT, REDIS_PASSWORD
- Required for background queues (bull). If Redis is unavailable, the app falls back to in-memory caches but queues will fail to connect.

5. Authentication & security

- JWT_SECRET, JWT_EXPIRE, JWT_REFRESH_SECRET, JWT_REFRESH_EXPIRE
- SESSION_SECRET

6. Email

- SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, EMAIL_FROM
- Or use SENDGRID_API_KEY + SENDGRID_FROM_EMAIL

7. Image & file storage

- IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, IMAGEKIT_URL_ENDPOINT
- Or configure AWS*S3*\* values for S3 usage

8. Payments

- STRIPE_SECRET_KEY, STRIPE_PUBLISHABLE_KEY, STRIPE_WEBHOOK_SECRET
- RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET

9. Third-party services & credentials

- GOOGLE_APPLICATION_CREDENTIALS (path to service account JSON) or GOOGLE_TRANSLATE_API_KEY
- FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL

10. Worker and queue settings

- WORKER_PORT, APP_PORT, ENABLE_WORKER_HEALTH_CHECK

11. Misc / tuning

- RATE_LIMIT_WINDOW_MS, RATE_LIMIT_MAX_REQUESTS
- DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE
- MAX_FILE_SIZE, ALLOWED_FILE_TYPES
- LOG_LEVEL, LOG_FILE_PATH, CACHE_TTL

Runtime checks (recommended)

- In production, fail fast on missing critical variables:
  - POSTGRES_HOST/POSTGRES_USER/POSTGRES_PASSWORD
  - JWT_SECRET
  - SESSION_SECRET
- Consider adding a small startup check that validates these and exits with a clear log message if missing.

Example

- See `.env.example` at the repository root for a complete, ready-to-copy template.
