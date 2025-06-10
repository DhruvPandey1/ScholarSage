const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ResearchService {
  // Plan research strategy using Planner Agent
  async planResearch(topic) {
    try {
      const response = await fetch(`${API_BASE_URL}/research/plan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to plan research');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Planning research failed:', error);
      // Return mock data for development
      return {
        strategy: 'Search for recent papers on ' + topic,
        keywords: [topic, 'machine learning', 'AI'],
        timeframe: '2020-2024'
      };
    }
  }

  // Search papers using arXiv API
  async searchPapers(topic) {
    try {
      const response = await fetch(`${API_BASE_URL}/research/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to search papers');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Searching papers failed:', error);
      // Return mock data for development
      return [
        {
          id: '1',
          title: 'Machine Learning Applications in Healthcare: A Comprehensive Survey',
          authors: ['Dr. Jane Smith', 'Dr. John Doe', 'Dr. Alice Johnson'],
          abstract: 'This paper presents a comprehensive survey of machine learning applications in healthcare, covering recent advances in medical imaging, drug discovery, and patient monitoring systems.',
          publishedDate: '2024-01-15',
          arxivUrl: 'https://arxiv.org/abs/2401.00001',
          categories: ['Machine Learning', 'Healthcare', 'Medical Imaging']
        },
        {
          id: '2',
          title: 'Deep Learning for Medical Diagnosis: Current State and Future Directions',
          authors: ['Dr. Michael Brown', 'Dr. Sarah Wilson'],
          abstract: 'An analysis of current deep learning techniques used in medical diagnosis, including CNNs for image analysis and RNNs for sequential medical data processing.',
          publishedDate: '2024-02-10',
          arxivUrl: 'https://arxiv.org/abs/2402.00001',
          categories: ['Deep Learning', 'Medical Diagnosis', 'Neural Networks']
        }
      ];
    }
  }

  // Summarize papers using Summarizer Agent
  async summarizePapers(papers) {
    try {
      const response = await fetch(`${API_BASE_URL}/research/summarize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ papers }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to summarize papers');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Summarizing papers failed:', error);
      // Return mock data for development
      return papers.map(() => ({
        keyFindings: [
          'Machine learning shows significant promise in healthcare applications',
          'Deep learning models achieve high accuracy in medical imaging tasks',
          'Integration challenges remain between AI systems and clinical workflows'
        ],
        methodology: 'Systematic review and meta-analysis of 150+ research papers',
        significance: 'Provides comprehensive overview of ML in healthcare with practical implementation guidelines'
      }));
    }
  }

  // Critique papers using Critic Agent
  async critiquePapers(papers, summaries) {
    try {
      const response = await fetch(`${API_BASE_URL}/research/critique`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ papers, summaries }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to critique papers');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Critiquing papers failed:', error);
      // Return mock data for development
      return papers.map(() => ({
        strengths: [
          'Comprehensive literature review',
          'Strong methodology and statistical analysis',
          'Practical relevance to healthcare practitioners'
        ],
        limitations: [
          'Limited sample size in some studies',
          'Potential bias in data collection methods',
          'Need for longer-term follow-up studies'
        ],
        score: Math.floor(Math.random() * 3) + 7, // Random score between 7-9
        recommendation: 'This paper makes valuable contributions to the field and should be included in future systematic reviews.'
      }));
    }
  }

  // Build knowledge graph
  async buildKnowledgeGraph(papers, summaries) {
    try {
      const response = await fetch(`${API_BASE_URL}/research/graph`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ papers, summaries }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to build knowledge graph');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Building knowledge graph failed:', error);
      // Return mock data for development
      return {
        nodes: [
          { id: 'ml', label: 'Machine Learning', type: 'topic', size: 20 },
          { id: 'healthcare', label: 'Healthcare', type: 'topic', size: 18 },
          { id: 'paper1', label: 'ML in Healthcare Survey', type: 'paper', size: 12 },
          { id: 'paper2', label: 'Deep Learning Diagnosis', type: 'paper', size: 12 },
          { id: 'author1', label: 'Dr. Smith', type: 'author', size: 8 },
          { id: 'author2', label: 'Dr. Brown', type: 'author', size: 8 }
        ],
        links: [
          { source: 'ml', target: 'paper1' },
          { source: 'healthcare', target: 'paper1' },
          { source: 'ml', target: 'paper2' },
          { source: 'paper1', target: 'author1' },
          { source: 'paper2', target: 'author2' }
        ]
      };
    }
  }
}

export const researchService = new ResearchService();
