const express = require('express');
const axios = require('axios');
const xml2js = require('xml2js');
require('dotenv').config();

const router = express.Router();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const APXIV_API_KEY = process.env.APXIV_API_KEY;

module.exports = router;