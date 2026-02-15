const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { connectToDB, checkDBConnection } = require('./Database/DB'); // ✅ assuming you have a DB connection file
const helmet = require("helmet");

const chatRoute = require("./Routes/chat.Route");
const audioRoute = require("./Routes/audio.Route");





// Allowed origins from env
const allowedOrigins = [
    process.env.ADMIN_URL,
    process.env.FRONTEND_URL,
    process.env.WWW_URL,
];

// Connect to MongoDB
connectToDB();
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    })
);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

// Serve static files from public directory
const path = require('path');
app.use('/public', express.static(path.join(__dirname, 'public')));




/* ========================================================
   ✅ Health Check Route
   ======================================================== */
app.get('/api/health', async (req, res) => {
    try {
        const dbStatus = await checkDBConnection();
        res.status(200).json({
            status: 'ok',
            service: 'Agent Service',
            database: dbStatus ? 'connected' : 'disconnected',
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error('❌ Health check failed:', error.message);
        res.status(500).json({
            status: 'error',
            message: 'Service not healthy',
            error: error.message,
        });
    }
});

/* ========================================================
   API Routes
   ======================================================== */





app.use("/api/chat", chatRoute); // /api/chat/generate
app.use("/api/audio", audioRoute); // /api/audio/generate






module.exports = app;