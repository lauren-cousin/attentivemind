const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3001; // Use Heroku's assigned port or default to 3001 for local development
const attentiveMindServiceUrl = process.env.ATTENTIVE_MIND_BACKEND_URL || 'http://localhost' // Default to localhost for local development

// Import routes
const indexRouter = require('./routes/index');

// Use middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/', indexRouter);

// Start the Express server
app.listen(port, () => {
  console.log(`Express backend running at ${attentiveMindServiceUrl}:${port}`);
});
