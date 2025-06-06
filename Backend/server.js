const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const db= require('./config/db');

db();
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(helmet());
app.use(express.json());

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});