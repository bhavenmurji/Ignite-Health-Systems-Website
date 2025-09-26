# Ignite Health Systems API

Backend API for handling waitlist submissions and Clinical Innovation Council applications.

## Setup

1. Install dependencies:
```bash
cd api
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your email credentials
```

3. Run the server:
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

## API Endpoints

### POST /api/submit
Submit a new application to the waitlist.

**Request:** Multipart form data with:
- `fullName` - Doctor's full name
- `email` - Email address
- `specialty` - Medical specialty
- `practice` - Practice name and location
- `practiceModel` - Type of practice (solo, group, hospital, etc.)
- `council` - "yes" or "no" for Clinical Innovation Council interest
- `challenge` - Description of technological challenge
- `cv` - (Optional) PDF file upload

**Response:**
```json
{
  "success": true,
  "message": "Thank you for joining the 10-Minute Revolution!",
  "submissionId": "1234567890"
}
```

### GET /api/stats
Get submission statistics (admin endpoint).

**Response:**
```json
{
  "total": 42,
  "councilInterest": 28,
  "practiceModels": {
    "solo": 12,
    "group": 20,
    "hospital": 10
  },
  "specialties": {
    "Family Medicine": 15,
    "Internal Medicine": 12,
    "Pediatrics": 8,
    "Other": 7
  },
  "recentSubmissions": [...]
}
```

### GET /health
Health check endpoint.

## Email Configuration

The API sends confirmation emails to users and notifications to admins. Configure your SMTP settings in `.env`:

### For Gmail:
1. Enable 2-factor authentication on your Google account
2. Generate an app-specific password at https://myaccount.google.com/apppasswords
3. Use that password for `EMAIL_PASS` in `.env`

### For other email services:
Modify the transporter configuration in `server.js` according to your email provider's requirements.

## Deployment

### Using PM2:
```bash
npm install -g pm2
pm2 start server.js --name ignite-api
pm2 save
pm2 startup
```

### Using Docker:
```bash
docker build -t ignite-api .
docker run -p 3001:3001 --env-file .env ignite-api
```

## Security Notes

- Never commit `.env` file to version control
- Use HTTPS in production
- Consider implementing rate limiting for the submission endpoint
- Add CAPTCHA for production deployment
- Implement proper authentication for admin endpoints

## Data Storage

Currently uses a simple JSON file (`submissions.json`) for data storage. For production, consider:
- PostgreSQL or MySQL for relational data
- MongoDB for document storage
- Cloud storage (AWS S3, Google Cloud Storage) for CV files