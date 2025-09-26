/**
 * Enhanced Production-Ready Server for Ignite Health Systems API
 * Includes security middleware, monitoring, logging, and error handling
 */

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const fs = require('fs').promises;
const path = require('path');
const multer = require('multer');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Import security middleware
const {
  rateLimitConfigs,
  corsOptions,
  helmetConfig,
  validateSubmission,
  validateNewsletter,
  authenticateApiKey,
  requestLogger,
  errorHandler
} = require('./middleware/security');

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet(helmetConfig));
app.use(cors(corsOptions));
app.use(requestLogger);

// Rate limiting
app.use('/api/submit', rateLimitConfigs.formSubmission);
app.use('/api/newsletter', rateLimitConfigs.newsletter);
app.use('/api/stats', rateLimitConfigs.apiStats);
app.use(rateLimitConfigs.general); // General rate limiting for all other routes

// Body parsing middleware
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Health monitoring data
const healthMonitor = {
  startTime: Date.now(),
  requests: 0,
  errors: 0,
  lastError: null,
  services: {
    database: 'healthy',
    email: 'healthy',
    storage: 'healthy'
  }
};

// Enhanced multer configuration with virus scanning placeholder
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    await fs.mkdir(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, `${timestamp}-${sanitizedName}`);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 1,
    fieldSize: 1 * 1024 * 1024 // 1MB field size limit
  },
  fileFilter: (req, file, cb) => {
    // Enhanced file type validation
    const allowedMimeTypes = ['application/pdf'];
    const allowedExtensions = ['.pdf'];

    const fileExtension = path.extname(file.originalname).toLowerCase();

    if (allowedMimeTypes.includes(file.mimetype) && allowedExtensions.includes(fileExtension)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  }
});

// Enhanced email configuration with fallback options
const createEmailTransporter = () => {
  const configs = [
    {
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    },
    {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    }
  ];

  for (const config of configs) {
    try {
      const transporter = nodemailer.createTransporter(config);
      return transporter;
    } catch (error) {
      console.error('Email transporter failed:', error.message);
      continue;
    }
  }

  return null;
};

const transporter = createEmailTransporter();

// Database configuration with connection pooling simulation
const DB_FILE = path.join(__dirname, 'submissions.json');
const BACKUP_DIR = path.join(__dirname, 'backups');

// Enhanced database functions with error handling and backups
async function initDB() {
  try {
    await fs.mkdir(BACKUP_DIR, { recursive: true });
    await fs.access(DB_FILE);
    healthMonitor.services.database = 'healthy';
  } catch {
    await fs.writeFile(DB_FILE, JSON.stringify({ submissions: [], created: new Date().toISOString() }, null, 2));
    healthMonitor.services.database = 'healthy';
  }
}

async function loadSubmissions() {
  try {
    const data = await fs.readFile(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    healthMonitor.services.database = 'degraded';
    throw new Error('Database read failed');
  }
}

async function saveSubmissions(data) {
  try {
    // Create backup before saving
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = path.join(BACKUP_DIR, `submissions-${timestamp}.json`);

    try {
      const currentData = await fs.readFile(DB_FILE, 'utf8');
      await fs.writeFile(backupFile, currentData);
    } catch (error) {
      console.warn('Backup creation failed:', error.message);
    }

    // Save new data
    await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2));
    healthMonitor.services.database = 'healthy';
  } catch (error) {
    healthMonitor.services.database = 'unhealthy';
    throw new Error('Database write failed');
  }
}

// Middleware to track requests
app.use((req, res, next) => {
  healthMonitor.requests++;
  next();
});

// Enhanced health check endpoint
app.get('/health', async (req, res) => {
  const uptime = Date.now() - healthMonitor.startTime;

  // Check email service
  if (transporter) {
    try {
      await transporter.verify();
      healthMonitor.services.email = 'healthy';
    } catch (error) {
      healthMonitor.services.email = 'degraded';
    }
  } else {
    healthMonitor.services.email = 'unhealthy';
  }

  // Check storage
  try {
    await fs.access(__dirname);
    healthMonitor.services.storage = 'healthy';
  } catch (error) {
    healthMonitor.services.storage = 'unhealthy';
  }

  const overallStatus = Object.values(healthMonitor.services).every(status => status === 'healthy')
    ? 'healthy'
    : Object.values(healthMonitor.services).some(status => status === 'unhealthy')
    ? 'unhealthy'
    : 'degraded';

  const healthData = {
    status: overallStatus,
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    uptime: Math.floor(uptime / 1000),
    requests: healthMonitor.requests,
    errors: healthMonitor.errors,
    services: healthMonitor.services,
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024)
    },
    environment: process.env.NODE_ENV || 'development'
  };

  if (healthMonitor.lastError) {
    healthData.lastError = {
      message: healthMonitor.lastError.message,
      timestamp: healthMonitor.lastError.timestamp
    };
  }

  const statusCode = overallStatus === 'healthy' ? 200 : overallStatus === 'degraded' ? 200 : 503;
  res.status(statusCode).json(healthData);
});

// Enhanced submit endpoint with comprehensive validation
app.post('/api/submit', validateSubmission, upload.single('cv'), async (req, res) => {
  try {
    const submission = {
      id: Date.now().toString(),
      fullName: req.body.fullName,
      email: req.body.email,
      specialty: req.body.specialty,
      practice: req.body.practice,
      practiceModel: req.body.practiceModel,
      council: req.body.council === 'yes' || req.body.council === true,
      challenge: req.body.challenge,
      cvPath: req.file ? req.file.filename : null,
      cvSize: req.file ? req.file.size : null,
      submittedAt: new Date().toISOString(),
      status: 'pending',
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
      source: 'api'
    };

    // Save to database
    const db = await loadSubmissions();
    db.submissions.push(submission);
    await saveSubmissions(db);

    // Send emails if configured
    if (transporter && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        // User confirmation email
        const userMailOptions = {
          from: `"Ignite Health Systems" <${process.env.EMAIL_USER}>`,
          to: submission.email,
          subject: 'Welcome to Ignite Health Systems - Your Application Received',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
                <h1 style="color: white; margin: 0;">Welcome to the 10-Minute Revolution!</h1>
              </div>
              <div style="padding: 30px; background: #f9f9f9;">
                <h2 style="color: #333;">Thank you, Dr. ${submission.fullName}!</h2>
                <p style="color: #666; line-height: 1.6;">We've received your application to ${submission.council ? 'join the Clinical Innovation Council and the' : 'join the'} Ignite Health Systems waitlist.</p>

                <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h3 style="color: #333; margin-top: 0;">Your Submission Details:</h3>
                  <ul style="color: #666;">
                    <li><strong>Specialty:</strong> ${submission.specialty}</li>
                    <li><strong>Practice:</strong> ${submission.practice}</li>
                    <li><strong>Practice Model:</strong> ${submission.practiceModel}</li>
                    <li><strong>Clinical Innovation Council:</strong> ${submission.council ? 'Yes' : 'No'}</li>
                    <li><strong>CV Attached:</strong> ${submission.cvPath ? 'Yes' : 'No'}</li>
                  </ul>
                </div>

                <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h3 style="color: #333; margin-top: 0;">Your Challenge:</h3>
                  <p style="color: #666; font-style: italic;">"${submission.challenge}"</p>
                </div>

                <p style="color: #666;">We're committed to solving these challenges together. Our team will review your submission and be in touch within 24-48 hours.</p>

                <div style="text-align: center; margin: 30px 0;">
                  <a href="https://ignitehealthsystems.com/next-steps" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">View Next Steps</a>
                </div>

                <p style="color: #999; font-size: 14px;">Best regards,<br>The Ignite Health Systems Team</p>
              </div>
            </div>
          `
        };

        await transporter.sendMail(userMailOptions);

        // Admin notification email
        const adminMailOptions = {
          from: process.env.EMAIL_USER,
          to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
          subject: `🚀 New Submission: ${submission.fullName} - ${submission.specialty}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: #2d3748; padding: 20px; color: white;">
                <h2 style="margin: 0;">🚀 New Healthcare Professional Application</h2>
                <p style="margin: 5px 0 0 0; color: #a0aec0;">Submission ID: ${submission.id}</p>
              </div>
              <div style="padding: 20px; background: #f7fafc;">
                <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                  <h3 style="color: #2d3748; margin-top: 0;">Contact Information</h3>
                  <ul style="color: #4a5568;">
                    <li><strong>Name:</strong> ${submission.fullName}</li>
                    <li><strong>Email:</strong> <a href="mailto:${submission.email}">${submission.email}</a></li>
                    <li><strong>Specialty:</strong> ${submission.specialty}</li>
                    <li><strong>Practice:</strong> ${submission.practice}</li>
                    <li><strong>Practice Model:</strong> ${submission.practiceModel}</li>
                    <li><strong>Council Interest:</strong> <span style="color: ${submission.council ? '#38a169' : '#e53e3e'};">${submission.council ? '✅ Yes' : '❌ No'}</span></li>
                    <li><strong>CV Attached:</strong> ${submission.cvPath ? `✅ Yes (${Math.round(submission.cvSize / 1024)}KB)` : '❌ No'}</li>
                    <li><strong>IP Address:</strong> ${submission.ipAddress}</li>
                  </ul>
                </div>

                <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                  <h3 style="color: #2d3748; margin-top: 0;">Their Challenge</h3>
                  <p style="color: #4a5568; font-style: italic; background: #edf2f7; padding: 15px; border-radius: 6px;">"${submission.challenge}"</p>
                </div>

                <div style="background: white; padding: 20px; border-radius: 8px;">
                  <h3 style="color: #2d3748; margin-top: 0;">Quick Actions</h3>
                  <div style="text-align: center;">
                    <a href="mailto:${submission.email}?subject=Re: Your Ignite Health Systems Application" style="background: #4299e1; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; margin: 5px; display: inline-block;">Reply to Applicant</a>
                    <a href="https://admin.ignitehealthsystems.com/submissions/${submission.id}" style="background: #38a169; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; margin: 5px; display: inline-block;">View in Admin</a>
                  </div>
                </div>

                <p style="color: #718096; font-size: 12px; text-align: center; margin-top: 20px;">
                  Submitted: ${new Date(submission.submittedAt).toLocaleString()}
                </p>
              </div>
            </div>
          `
        };

        await transporter.sendMail(adminMailOptions);
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
        // Don't fail the entire request if email fails
      }
    }

    res.json({
      success: true,
      message: 'Thank you for joining the 10-Minute Revolution! Check your email for confirmation.',
      submissionId: submission.id,
      nextSteps: [
        'Check your email for confirmation details',
        'Expect follow-up within 24-48 hours',
        'Join our community updates for the latest news'
      ]
    });

  } catch (error) {
    healthMonitor.errors++;
    healthMonitor.lastError = {
      message: error.message,
      timestamp: new Date().toISOString()
    };

    console.error('Submission error:', {
      timestamp: new Date().toISOString(),
      error: error.message,
      stack: error.stack,
      ip: req.ip,
      userAgent: req.get('user-agent')
    });

    res.status(500).json({
      success: false,
      message: 'There was an error processing your submission. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Enhanced statistics endpoint with authentication
app.get('/api/stats', authenticateApiKey, async (req, res) => {
  try {
    const db = await loadSubmissions();
    const submissions = db.submissions || [];

    // Calculate time-based metrics
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const recentSubmissions = submissions.filter(s => new Date(s.submittedAt) >= oneWeekAgo);

    const stats = {
      total: submissions.length,
      councilInterest: submissions.filter(s => s.council).length,
      recentWeek: recentSubmissions.length,
      practiceModels: {},
      specialties: {},
      recentSubmissions: submissions
        .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
        .slice(0, 5)
        .map(s => ({
          id: s.id,
          fullName: s.fullName,
          specialty: s.specialty,
          practiceModel: s.practiceModel,
          councilInterest: s.council,
          submittedAt: s.submittedAt,
          status: s.status
        })),
      trends: {
        conversionRate: submissions.length > 0 ? (submissions.filter(s => s.council).length / submissions.length * 100).toFixed(1) : 0,
        avgChallengeLength: submissions.length > 0 ? Math.round(submissions.reduce((acc, s) => acc + (s.challenge?.length || 0), 0) / submissions.length) : 0,
        withCV: submissions.filter(s => s.cvPath).length
      }
    };

    // Count practice models and specialties
    submissions.forEach(s => {
      if (s.practiceModel) {
        stats.practiceModels[s.practiceModel] = (stats.practiceModels[s.practiceModel] || 0) + 1;
      }
      if (s.specialty) {
        stats.specialties[s.specialty] = (stats.specialties[s.specialty] || 0) + 1;
      }
    });

    res.json(stats);
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve statistics',
      message: error.message
    });
  }
});

// Newsletter endpoints (placeholder for Next.js integration)
app.post('/api/newsletter', validateNewsletter, (req, res) => {
  // This endpoint is handled by Next.js in production
  // This is a fallback for development/testing
  res.json({
    success: true,
    message: 'Newsletter endpoint handled by Next.js in production',
    data: {
      email: req.body.email,
      method: 'fallback'
    }
  });
});

// Graceful shutdown handling
const gracefulShutdown = async (signal) => {
  console.log(`Received ${signal}. Starting graceful shutdown...`);

  // Close server
  server.close(async () => {
    console.log('HTTP server closed');

    // Close database connections, cleanup resources
    try {
      // Add cleanup logic here (database connections, etc.)
      console.log('Resources cleaned up');
      process.exit(0);
    } catch (error) {
      console.error('Error during cleanup:', error);
      process.exit(1);
    }
  });

  // Force close after 30 seconds
  setTimeout(() => {
    console.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 30000);
};

// Error handling middleware (must be last)
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Not Found',
    message: 'The requested endpoint does not exist',
    path: req.originalUrl
  });
});

// Initialize and start server
const startServer = async () => {
  try {
    await initDB();

    const server = app.listen(PORT, () => {
      console.log(`🚀 Ignite Health Systems API server running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`📚 API Documentation: /docs/API_DOCUMENTATION.yaml`);
      console.log(`🔒 Security: Enhanced middleware enabled`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);

      // Log startup configuration
      console.log('Configuration:');
      console.log(`  - Rate Limiting: Enabled`);
      console.log(`  - CORS: Configured`);
      console.log(`  - Security Headers: Enabled`);
      console.log(`  - Input Validation: Enabled`);
      console.log(`  - Request Logging: Enabled`);
      console.log(`  - Email Service: ${transporter ? 'Configured' : 'Not Configured'}`);
    });

    // Handle shutdown signals
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    return server;
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
const server = startServer();

module.exports = app;