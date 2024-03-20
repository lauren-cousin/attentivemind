const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;

// Import routes
const indexRouter = require('./routes/index');

// Use middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/', indexRouter);

// Start the Express server
app.listen(port, () => {
  console.log(`Express backend running at http://localhost:${port}`);
});
