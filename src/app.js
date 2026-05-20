const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const errorHandler = require('./middleware/errorMiddleware');

const conversionRoutes = require('./routes/conversionRoutes');
const calendarRoutes = require('./routes/calendarRoutes');
const holidayRoutes = require('./routes/holidayRoutes');           // NEW
const businessDateRoutes = require('./routes/businessDateRoutes'); // NEW

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());

// Logging
app.use(morgan('combined'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api', limiter);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/conversion', conversionRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/holidays', holidayRoutes);           // NEW
app.use('/api/business', businessDateRoutes);      // NEW

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'Ethiopian Calendar API',
    version: '2.0.0',
    endpoints: {
      conversion: '/api/conversion',
      calendar: '/api/calendar',
      holidays: '/api/holidays',
      business: '/api/business'
    }
  });
});

// Error handling
app.use(errorHandler);

module.exports = app;