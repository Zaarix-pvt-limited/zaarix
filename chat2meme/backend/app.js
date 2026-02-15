const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { connectToDB, checkDBConnection } = require('./Database/DB'); // ✅ assuming you have a DB connection file
const helmet = require("helmet");


const authRoutes = require("./Routes/auth.Route");
const { apiLimiter } = require("./Middleware/rateLimiter.Middleware");
const videoRoutes = require("./Routes/video.Route");


// Allowed origins from env
const allowedOrigins = [
  process.env.ADMIN_URL,
  process.env.FRONTEND_URL,
  process.env.WWW_URL,
];

// Connect to MongoDB
connectToDB();
app.use(helmet());
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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());



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

app.use("/api/auth", apiLimiter, authRoutes);

// Video Demo Routes

app.use("/api/video", videoRoutes);





module.exports = app;