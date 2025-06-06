const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const db= require('./config/db');
const morgan = require('morgan');
const routes = require('./routes/research');
//Connect to the database
db();
require('dotenv').config();


const app = express();
const port = process.env.PORT || 3001;
//Enable CORS
app.use(cors());
//Security middleware
app.use(helmet());
//Body parser middleware
app.use(express.json());
//logging middleware
app.use(morgan('dev'));

// API routes
app.use('/api/research', routes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

//App is listening on the specified port8
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});