const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');
const multer = require('multer');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configure multer for CV uploads
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
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed'));
        }
    }
});

// Email configuration (configure with your SMTP settings)
const transporter = nodemailer.createTransport({
    service: 'gmail', // or your preferred email service
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Database file (simple JSON storage for MVP)
const DB_FILE = path.join(__dirname, 'submissions.json');

// Initialize database
async function initDB() {
    try {
        await fs.access(DB_FILE);
    } catch {
        await fs.writeFile(DB_FILE, JSON.stringify({ submissions: [] }, null, 2));
    }
}

// Load submissions
async function loadSubmissions() {
    const data = await fs.readFile(DB_FILE, 'utf8');
    return JSON.parse(data);
}

// Save submissions
async function saveSubmissions(data) {
    await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2));
}

// Routes
app.get('/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Submit form endpoint
app.post('/api/submit', upload.single('cv'), async (req, res) => {
    try {
        const submission = {
            id: Date.now().toString(),
            fullName: req.body.fullName,
            email: req.body.email,
            specialty: req.body.specialty,
            practice: req.body.practice,
            practiceModel: req.body.practiceModel,
            council: req.body.council === 'yes',
            challenge: req.body.challenge,
            cvPath: req.file ? req.file.filename : null,
            submittedAt: new Date().toISOString(),
            status: 'pending'
        };

        // Save to database
        const db = await loadSubmissions();
        db.submissions.push(submission);
        await saveSubmissions(db);

        // Send confirmation email to user
        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            const userMailOptions = {
                from: process.env.EMAIL_USER,
                to: submission.email,
                subject: 'Welcome to Ignite Health Systems - Your Submission Received',
                html: `
                    <h2>Thank you for joining the 10-Minute Revolution, Dr. ${submission.fullName}!</h2>
                    <p>We've received your application to ${submission.council ? 'join the Clinical Innovation Council and the' : 'join the'} Ignite Health Systems waitlist.</p>
                    <h3>Your Submission Details:</h3>
                    <ul>
                        <li><strong>Specialty:</strong> ${submission.specialty}</li>
                        <li><strong>Practice:</strong> ${submission.practice}</li>
                        <li><strong>Practice Model:</strong> ${submission.practiceModel}</li>
                        <li><strong>Clinical Innovation Council:</strong> ${submission.council ? 'Yes' : 'No'}</li>
                    </ul>
                    <h3>Your Challenge:</h3>
                    <p>${submission.challenge}</p>
                    <p>We're committed to solving these challenges together. Our team will review your submission and be in touch soon.</p>
                    <p>Best regards,<br>The Ignite Health Systems Team</p>
                `
            };

            await transporter.sendMail(userMailOptions);

            // Send notification to admin
            const adminMailOptions = {
                from: process.env.EMAIL_USER,
                to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
                subject: `New Submission: ${submission.fullName} - ${submission.specialty}`,
                html: `
                    <h2>New Submission Received</h2>
                    <h3>Contact Information:</h3>
                    <ul>
                        <li><strong>Name:</strong> ${submission.fullName}</li>
                        <li><strong>Email:</strong> ${submission.email}</li>
                        <li><strong>Specialty:</strong> ${submission.specialty}</li>
                        <li><strong>Practice:</strong> ${submission.practice}</li>
                        <li><strong>Practice Model:</strong> ${submission.practiceModel}</li>
                        <li><strong>Council Interest:</strong> ${submission.council ? 'Yes' : 'No'}</li>
                        <li><strong>CV Attached:</strong> ${submission.cvPath ? 'Yes' : 'No'}</li>
                    </ul>
                    <h3>Their Challenge:</h3>
                    <p>${submission.challenge}</p>
                    <p><strong>Submitted:</strong> ${submission.submittedAt}</p>
                `
            };

            await transporter.sendMail(adminMailOptions);
        }

        res.json({ 
            success: true, 
            message: 'Thank you for joining the 10-Minute Revolution!',
            submissionId: submission.id 
        });

    } catch (error) {
        console.error('Submission error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'There was an error processing your submission. Please try again.' 
        });
    }
});

// Get submission statistics (admin endpoint)
app.get('/api/stats', async (req, res) => {
    try {
        const db = await loadSubmissions();
        const stats = {
            total: db.submissions.length,
            councilInterest: db.submissions.filter(s => s.council).length,
            practiceModels: {},
            specialties: {},
            recentSubmissions: db.submissions.slice(-5).reverse()
        };

        // Count practice models
        db.submissions.forEach(s => {
            stats.practiceModels[s.practiceModel] = (stats.practiceModels[s.practiceModel] || 0) + 1;
            stats.specialties[s.specialty] = (stats.specialties[s.specialty] || 0) + 1;
        });

        res.json(stats);
    } catch (error) {
        console.error('Stats error:', error);
        res.status(500).json({ error: 'Failed to retrieve statistics' });
    }
});

// Initialize and start server
initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Ignite Health Systems API running on port ${PORT}`);
        console.log(`Health check: http://localhost:${PORT}/health`);
    });
}).catch(error => {
    console.error('Failed to initialize database:', error);
    process.exit(1);
});