const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const ratelimit=require('express-rate-limit');
const db= require('./config/db');
const morgan = require('morgan');
const researchRoutes = require('./routes/research');
const authRoutes = require('./routes/auth');
//Connect to the database
db();
require('dotenv').config();


const app = express();
const port = process.env.PORT || 3001;
//Enable CORS
app.use(cors());

let windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000;
let max = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100;
if (process.env.NODE_ENV === 'test') {
  windowMs = 2000; // 2 seconds
  max = 3;         // 3 requests
}
// Rate limiting
const limiter = ratelimit({
  windowMs: windowMs,
  max: max,
  message: 'Too many requests, please try again later.'
});
app.use(limiter);

//Security 
app.use(helmet());
//Body parser middleware
app.use(express.json());
//logging middleware
app.use(morgan('dev'));

// API routes
app.use('/api/research', researchRoutes);
app.use('/api/auth', authRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});
app.get('/test',(req,res)=>{
  res.status(200).send('OK')
})
//App is listening on the specified port8
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
})

module.exports=app;