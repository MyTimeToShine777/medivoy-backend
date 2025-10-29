# 🌐 Medivoy Backend API - Access Instructions

## ✅ Your API is Now Accessible!

---

## 🔗 Public Access URLs

### Main API Endpoints
- **API Base URL**: https://5000-d3911e85-31b9-4b01-9734-b7792b2ea6a4.proxy.daytona.works
- **API Documentation (Swagger UI)**: https://5000-d3911e85-31b9-4b01-9734-b7792b2ea6a4.proxy.daytona.works/api-docs/
- **Health Check**: https://5000-d3911e85-31b9-4b01-9734-b7792b2ea6a4.proxy.daytona.works/health
- **API Root**: https://5000-d3911e85-31b9-4b01-9734-b7792b2ea6a4.proxy.daytona.works/api/v1/

---

## 🎯 How to Access from Your Windows Machine

### 1. Access API Documentation
Open your browser and go to:
```
https://5000-d3911e85-31b9-4b01-9734-b7792b2ea6a4.proxy.daytona.works/api-docs/
```

### 2. Test Health Endpoint
```
https://5000-d3911e85-31b9-4b01-9734-b7792b2ea6a4.proxy.daytona.works/health
```

### 3. Test API Endpoints
```
https://5000-d3911e85-31b9-4b01-9734-b7792b2ea6a4.proxy.daytona.works/api/v1/faqs
https://5000-d3911e85-31b9-4b01-9734-b7792b2ea6a4.proxy.daytona.works/api/v1/treatments
https://5000-d3911e85-31b9-4b01-9734-b7792b2ea6a4.proxy.daytona.works/api/v1/treatment-categories
```

---

## 🔧 Fixed Issues

### 1. Line Ending Errors (CRLF → LF) ✅
**Problem**: VS Code showing red errors "Expected linebreaks to be 'LF' but found 'CRLF'"

**Solution Applied**:
- Converted all files to use Unix line endings (LF)
- Added `.editorconfig` file to enforce LF line endings
- This will prevent future line ending issues

**To fix in VS Code**:
1. Open VS Code settings (Ctrl+,)
2. Search for "eol"
3. Set "Files: Eol" to "\n" (LF)
4. Or click on "CRLF" in the bottom right corner and select "LF"

### 2. API Docs Access ✅
**Problem**: Could not access `/api-docs` from Windows machine

**Solution Applied**:
- Exposed port 5000 to the public internet
- Generated public URL for access
- API docs are now accessible from anywhere

---

## 📝 Testing Your API

### Using Browser
Simply open the URLs above in your browser.

### Using Postman
1. Import the Swagger documentation from:
   ```
   https://5000-d3911e85-31b9-4b01-9734-b7792b2ea6a4.proxy.daytona.works/api-docs/
   ```
2. Or manually create requests using the base URL

### Using cURL
```bash
# Health check
curl https://5000-d3911e85-31b9-4b01-9734-b7792b2ea6a4.proxy.daytona.works/health

# Get FAQs
curl https://5000-d3911e85-31b9-4b01-9734-b7792b2ea6a4.proxy.daytona.works/api/v1/faqs

# Get Treatments
curl https://5000-d3911e85-31b9-4b01-9734-b7792b2ea6a4.proxy.daytona.works/api/v1/treatments
```

### Using JavaScript/Fetch
```javascript
// Health check
fetch('https://5000-d3911e85-31b9-4b01-9734-b7792b2ea6a4.proxy.daytona.works/health')
  .then(response => response.json())
  .then(data => console.log(data));

// Get FAQs
fetch('https://5000-d3911e85-31b9-4b01-9734-b7792b2ea6a4.proxy.daytona.works/api/v1/faqs')
  .then(response => response.json())
  .then(data => console.log(data));
```

---

## 🔐 Authentication

For protected endpoints, you'll need to:

1. **Register a user** (if registration endpoint is public)
2. **Login** to get a JWT token
3. **Include the token** in your requests:
   ```
   Authorization: Bearer YOUR_JWT_TOKEN
   ```

---

## 📚 Available Public Endpoints

### No Authentication Required
- `GET /health` - Server health check
- `GET /api/v1/` - API information
- `GET /api/v1/faqs` - Get all FAQs
- `GET /api/v1/treatments` - Get all treatments
- `GET /api/v1/treatment-categories` - Get treatment categories
- `GET /api/v1/website-content` - Get website content

### Authentication Required
- `GET /api/v1/hospitals` - Get all hospitals
- `GET /api/v1/doctors` - Get all doctors
- `GET /api/v1/packages` - Get all packages
- `GET /api/v1/users` - Get users
- And 90+ more endpoints...

---

## 🛠️ VS Code Configuration

To prevent line ending issues in the future:

### 1. Update VS Code Settings
Add to your `.vscode/settings.json`:
```json
{
  "files.eol": "\n",
  "editor.formatOnSave": true,
  "prettier.endOfLine": "lf"
}
```

### 2. Git Configuration
Run in your terminal:
```bash
git config core.autocrlf false
git config core.eol lf
```

---

## 🎯 Quick Test

Open this URL in your browser right now:
```
https://5000-d3911e85-31b9-4b01-9734-b7792b2ea6a4.proxy.daytona.works/api-docs/
```

You should see the Swagger UI with all your API endpoints!

---

## ⚠️ Important Notes

1. **Public URL**: The URL provided is publicly accessible. Anyone with the URL can access your API.
2. **Temporary**: This URL is tied to your current sandbox session.
3. **HTTPS**: The URL uses HTTPS, so it's secure.
4. **CORS**: Make sure CORS is configured if you're accessing from a web application.

---

## 🎉 Success!

Your API is now:
- ✅ Accessible from your Windows machine
- ✅ Free from line ending errors
- ✅ Fully documented with Swagger UI
- ✅ Ready to use and test

---

**Need Help?**
- Check the Swagger documentation for endpoint details
- All endpoints are documented with request/response examples
- Use the "Try it out" feature in Swagger UI to test endpoints

---

**Last Updated**: 2025-10-29
**Status**: 🟢 ONLINE AND ACCESSIBLE