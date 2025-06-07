const express = require('express');
const axios = require('axios');
const xml2js = require('xml2js');
const Research = require('../models/Research');
require('dotenv').config();

const router = express.Router();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const ARXIV_API_BASE = process.env.ARXIV_API_KEY;

const CriticAgent = require('../agents/CriticAgent');
const SummarizerAgent = require('../agents/SummarizerAgent');
const PlannerAgent = require('../agents/PlannerAgent');

const plannerAgent = new PlannerAgent(OPENAI_API_KEY);
const summarizerAgent=new SummarizerAgent(OPENAI_API_KEY);
const criticAgent = new CriticAgent(OPENAI_API_KEY);

// Route to plan research
router.post('/plan', async (req, res) => {
  try {
    const { topic } = req.body;
    const plan = await plannerAgent.planResearch(topic);
    res.json(plan);
  } catch (error) {
    console.error('Planning research failed:', error);
    res.status(500).json({ error: 'Failed to plan research' });
  }
});

// Route to search papers on arXiv AND SAVE TO DATABASE
router.post('/search', async (req, res) => {
  try {
    const { topic } = req.body;
    const query = encodeURIComponent(topic);
    const url = `${ARXIV_API_BASE}?search_query=${query}&start=0&max_results=5`;

    const response = await axios.get(url);
    const xml = response.data;

    const parser = new xml2js.Parser({ explicitArray: false });
    const parsed = await parser.parseStringPromise(xml);

    const entries = parsed.feed.entry;
    const papers = Array.isArray(entries) ? entries : [entries];

    const formattedPapers = papers.map(paper => ({
      id: paper.id,
      title: paper.title,
      authors: Array.isArray(paper.author) ? paper.author.map(a => a.name) : [paper.author.name],
      abstract: paper.summary,
      publishedDate: paper.published,
      arxivUrl: paper.id,
      categories: Array.isArray(paper.category) ? paper.category.map(c => c.$.term) : [paper.category.$.term]
    }));

    // SAVE TO DATABASE USING THE MODEL
    const researchDoc = new Research({
      topic: topic,
      papers: formattedPapers
    });
    await researchDoc.save();

    res.json(formattedPapers);
  } catch (error) {
    console.error('Searching papers failed:', error);
    res.status(500).json({ error: 'Failed to search papers' });
  }
});

// Route to summarize papers AND UPDATE DATABASE
router.post('/summarize', async (req, res) => {
  try {
    const { papers, topic } = req.body;
    const summaries = await summarizerAgent.summarizePapers(papers);
    
    // UPDATE DATABASE WITH SUMMARIES
    await Research.findOneAndUpdate(
      { topic: topic },
      { $set: { summaries: summaries.map((summary, index) => ({
        paperId: papers[index].id,
        keyFindings: summary.keyFindings,
        methodology: summary.methodology,
        significance: summary.significance
      })) }}
    );

    res.json(summaries);
  } catch (error) {
    console.error('Summarizing papers failed:', error);
    res.status(500).json({ error: 'Failed to summarize papers' });
  }
});

// Route to critique papers AND UPDATE DATABASE
router.post('/critique', async (req, res) => {
  try {
    const { papers, summaries, topic } = req.body;
    const critiques = await criticAgent.critiquePapers(papers, summaries);
    
    // UPDATE DATABASE WITH CRITIQUES
    await Research.findOneAndUpdate(
      { topic: topic },
      { $set: { critiques: critiques.map((critique, index) => ({
        paperId: papers[index].id,
        strengths: critique.strengths,
        limitations: critique.weaknesses,
        score: critique.relevanceScore,
        recommendation: critique.recommendation || 'No recommendation provided'
      })) }}
    );

    res.json(critiques);
  } catch (error) {
    console.error('Critiquing papers failed:', error);
    res.status(500).json({ error: 'Failed to critique papers' });
  }
});

// Route to build knowledge graph AND SAVE TO DATABASE
router.post('/graph', async (req, res) => {
  try {
    const { papers, summaries, topic } = req.body;

    const nodes = [];
    const links = [];

    papers.forEach(paper => {
      nodes.push({ id: paper.id, label: paper.title, type: 'paper' });
      paper.authors.forEach(author => {
        nodes.push({ id: author, label: author, type: 'author' });
        links.push({ source: paper.id, target: author });
      });
    });

    summaries.forEach((summary, index) => {
      summary.keyFindings.forEach(finding => {
        nodes.push({ id: finding, label: finding, type: 'topic' });
        links.push({ source: papers[index].id, target: finding });
      });
    });

    const graphData = { 
      nodes: [...new Map(nodes.map(item => [item.id, item])).values()], 
      links 
    };

    // SAVE GRAPH DATA TO DATABASE
    await Research.findOneAndUpdate(
      { topic: topic },
      { $set: { graphData: graphData }}
    );

    res.json(graphData);

  } catch (error) {
    console.error('Building knowledge graph failed:', error);
    res.status(500).json({ error: 'Failed to build knowledge graph' });
  }
});

// NEW ROUTE: Get saved research by topic
router.get('/history/:topic', async (req, res) => {
  try {
    const { topic } = req.params;
    const research = await Research.findOne({ topic: topic });
    
    if (!research) {
      return res.status(404).json({ error: 'Research not found' });
    }
    
    res.json(research);
  } catch (error) {
    console.error('Getting research history failed:', error);
    res.status(500).json({ error: 'Failed to get research history' });
  }
});

module.exports = router;