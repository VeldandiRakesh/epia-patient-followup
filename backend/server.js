require('dotenv').config();
const express = require('express');
const cors = require('cors');
const patientRoutes = require('./routes/patientRoutes');
const messageDraftRoutes = require('./routes/messageDraftRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/patients', patientRoutes);
app.use('/api/message-drafts', messageDraftRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'EPIA Patient Follow-up API is running'
  });
});

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API Health Check: http://localhost:${PORT}/api/health`);
});
