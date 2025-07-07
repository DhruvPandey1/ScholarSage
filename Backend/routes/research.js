const express = require('express');
const axios = require('axios');
const xml2js = require('xml2js');
const dotenv = require('dotenv');
const Research = require('../models/Research');
const auth = require('../middleware/auth');
dotenv.config();

const router = express.Router();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const ARXIV_API_BASE = process.env.ARXIV_API_BASE || 'http://export.arxiv.org/api/query';

// Agents
const PlannerAgent = require('../agents/PlannerAgent');
const SummarizerAgent = require('../agents/SummarizerAgent');
const CriticAgent = require('../agents/CriticAgent');

// Initialize agents with proper OpenAI API key
let plannerAgent, summarizerAgent, criticAgent;

if (OPENAI_API_KEY) {
  plannerAgent = new PlannerAgent(OPENAI_API_KEY);
  summarizerAgent = new SummarizerAgent(OPENAI_API_KEY);
  criticAgent = new CriticAgent(OPENAI_API_KEY);
}

// Route to plan research - with auth protection
router.post('/plan', auth, async (req, res) => {
  try {
    const { topic } = req.body;
    
    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    if (!OPENAI_API_KEY || !plannerAgent) {
      return res.status(500).json({ 
        error: 'OpenAI API key not configured. Please check your environment variables.' 
      });
    }
    
    const plan = await plannerAgent.planResearch(topic);
    res.json(plan);
  } catch (error) {
    console.error('Planning research failed:', error.message);
    if (error.message.includes('insufficient_quota') || error.message.includes('rate_limit_exceeded')) {
      return res.status(429).json({ 
        error: 'OpenAI API quota exceeded. Please try again later or check your billing.' 
      });
    }
    res.status(500).json({ error: 'Failed to plan research' });
  }
});

// Route to search papers on arXiv - with auth protection
router.post('/search', auth, async (req, res) => {
  try {
    const { topic } = req.body;
    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }
    
    const query = encodeURIComponent(topic);
    const url = `${ARXIV_API_BASE}?search_query=all:${query}&start=0&max_results=5`;

    console.log('Fetching papers from arXiv:', url);
    
    const response = await axios.get(url, { timeout: 10000 });
    const xml = response.data;

    const parser = new xml2js.Parser({ explicitArray: false });
    const parsed = await parser.parseStringPromise(xml);

    if (!parsed.feed || !parsed.feed.entry) {
      return res.json([]);
    }

    const entries = Array.isArray(parsed.feed.entry) ? parsed.feed.entry : [parsed.feed.entry];

    const formattedPapers = entries.map((paper, index) => ({
      id: paper.id || `paper_${index}`,
      title: paper.title || 'Untitled Paper',
      authors: paper.author ? 
        (Array.isArray(paper.author) ? paper.author.map(a => a.name || 'Unknown Author') : [paper.author.name || 'Unknown Author']) 
        : ['Unknown Author'],
      abstract: paper.summary || 'No abstract available',
      publishedDate: paper.published || new Date().toISOString(),
      arxivUrl: paper.id || '',
      categories: paper.category ? 
        (Array.isArray(paper.category) ? paper.category.map(c => c.$.term || 'General') : [paper.category.$.term || 'General'])
        : ['General']
    }));

    console.log('Formatted papers:', formattedPapers.length);

    // Save to database with user association
    const researchDoc = new Research({
      title: `Research on ${topic}`,
      topic: topic,
      papers: formattedPapers,
      userId: req.user._id
    });
    await researchDoc.save();
    console.log('Research saved to database');

    res.json(formattedPapers);
  } catch (error) {
    console.error('Searching papers failed:', error.message);
    res.status(500).json({ error: 'Failed to search papers' });
  }
});

// Route to summarize papers - with auth protection
router.post('/summarize', auth, async (req, res) => {
  try {
    const { papers, topic } = req.body;
    

    if (!papers || !Array.isArray(papers)) {
      return res.status(400).json({ error: 'Papers array is required' });
    }
    
    if (!OPENAI_API_KEY || !summarizerAgent) {
      return res.status(500).json({ 
        error: 'OpenAI API key not configured. Please check your environment variables.' 
      });
    }
    
    const summaries = await summarizerAgent.summarizePapers(papers);
    
    // Update database with summaries
    await Research.findOneAndUpdate(
      { topic: topic, userId: req.user._id },
      { $set: { summaries: summaries.map((summary, index) => ({
        paperId: papers[index]?.id || `paper_${index}`,
        keyFindings: summary.keyFindings || [],
        methodology: summary.methodology || 'Not specified',
        significance: summary.significance || 'Not specified'
      })) }}
    );

    res.json(summaries);
  } catch (error) {
    console.error('Summarizing papers failed:', error.message);
    if (error.message.includes('insufficient_quota') || error.message.includes('rate_limit_exceeded')) {
      return res.status(429).json({ 
        error: 'OpenAI API quota exceeded. Please try again later or check your billing.' 
      });
    }
    res.status(500).json({ error: 'Failed to summarize papers' });
  }
});

// Route to critique papers - with auth protection
router.post('/critique', auth, async (req, res) => {
  try {
    const { papers, summaries, topic } = req.body;

    if (!papers || !Array.isArray(papers)) {
      return res.status(400).json({ error: 'Papers array is required' });
    }
    
    if (!OPENAI_API_KEY || !criticAgent) {
      return res.status(500).json({ 
        error: 'OpenAI API key not configured. Please check your environment variables.' 
      });
    }
    
    const critiques = await criticAgent.critiquePapers(papers, summaries);
    
    // Update database with critiques
    await Research.findOneAndUpdate(
      { topic: topic, userId: req.user._id },
      { $set: { critiques: critiques.map((critique, index) => ({
        paperId: papers[index]?.id || `paper_${index}`,
        strengths: critique.strengths || [],
        limitations: critique.weaknesses || critique.limitations || [],
        score: critique.relevanceScore || 7,
        recommendation: critique.recommendation || 'No recommendation provided'
      })) }}
    );

    res.json(critiques);
  } catch (error) {
    console.error('Critiquing papers failed:', error.message);
    if (error.message.includes('insufficient_quota') || error.message.includes('rate_limit_exceeded')) {
      return res.status(429).json({ 
        error: 'OpenAI API quota exceeded. Please try again later or check your billing.' 
      });
    }
    res.status(500).json({ error: 'Failed to critique papers' });
  }
});

// Route to build knowledge graph - with auth protection
router.post('/graph', auth, async (req, res) => {
  try {
    const { papers, summaries, topic } = req.body;

    if (!papers || !Array.isArray(papers)) {
      return res.status(400).json({ error: 'Papers array is required' });
    }

    const nodes = [];
    const links = [];

    // Add topic node
    nodes.push({ id: 'topic', label: topic, type: 'topic', size: 20 });

    papers.forEach((paper, index) => {
      const paperId = paper.id || `paper_${index}`;
      nodes.push({ 
        id: paperId, 
        label: paper.title?.substring(0, 50) + '...' || 'Untitled', 
        type: 'paper',
        size: 12
      });
      
      links.push({ source: 'topic', target: paperId, strength: 0.8 });

      // Add authors
      if (paper.authors && Array.isArray(paper.authors)) {
        paper.authors.forEach(author => {
          const authorId = author.replace(/\s+/g, '_');
          nodes.push({ id: authorId, label: author, type: 'author', size: 8 });
          links.push({ source: paperId, target: authorId, strength: 0.6 });
        });
      }
    });

    // Add key findings from summaries
    if (summaries && Array.isArray(summaries)) {
      summaries.forEach((summary, index) => {
        if (summary.keyFindings && Array.isArray(summary.keyFindings)) {
          summary.keyFindings.forEach((finding, findingIndex) => {
            const findingId = `finding_${index}_${findingIndex}`;
            nodes.push({ 
              id: findingId, 
              label: finding.substring(0, 30) + '...', 
              type: 'finding',
              size: 6
            });
            
            const paperId = papers[index]?.id || `paper_${index}`;
            links.push({ source: paperId, target: findingId, strength: 0.4 });
          });
        }
      });
    }

    // Remove duplicate nodes
    const uniqueNodes = nodes.filter((node, index, self) => 
      index === self.findIndex(n => n.id === node.id)
    );

    const graphData = { 
      nodes: uniqueNodes, 
      links: links  
    };

    // Save graph data to database
    await Research.findOneAndUpdate(
      { topic: topic, userId: req.user._id },
      { $set: { graphData: graphData }}
    );

    res.json(graphData);

  } catch (error) {
    console.error('Building knowledge graph failed:', error.message);
    res.status(500).json({ error: 'Failed to build knowledge graph' });
  }
});

// Route to get saved research by topic - with auth protection
router.get('/history/:topic', auth, async (req, res) => {
  try {
    const { topic } = req.params;
    const research = await Research.findOne({ topic: topic, userId: req.user._id });
    
    if (!research) {
      return res.status(404).json({ error: 'Research not found' });
    }
    
    res.json(research);
  } catch (error) {
    console.error('Getting research history failed:', error.message);
    res.status(500).json({ error: 'Failed to get research history' });
  }
});

module.exports = router;
