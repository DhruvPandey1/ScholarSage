const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ResearchService {
  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  // Plan research strategy using Planner Agent
  async planResearch(topic) {
    try {
      const response = await fetch(`${API_BASE_URL}/research/plan`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ topic }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to plan research');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Planning research failed:', error.message);
      // Return mock data for development
      return {
        strategy: `Research strategy for: ${topic}. Focus on recent developments and key findings.`,
        keywords: this.extractKeywords(topic),
        timeframe: '2020-2024'
      };
    }
  }

  // Search papers using arXiv API
  async searchPapers(topic) {
    try {
      const response = await fetch(`${API_BASE_URL}/research/search`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ topic }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to search papers');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Searching papers failed:', error.message);
      // Return mock data for development
      return this.getMockPapers(topic);
    }
  }

  // Summarize papers using Summarizer Agent
  async summarizePapers(papers, topic) {
    try {
      const response = await fetch(`${API_BASE_URL}/research/summarize`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ papers, topic }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to summarize papers');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Summarizing papers failed:', error.message);
      // Return mock data for development
      return papers.map(() => this.getMockSummary());
    }
  }

  // Critique papers using Critic Agent
  async critiquePapers(papers, summaries, topic) {
    try {
      const response = await fetch(`${API_BASE_URL}/research/critique`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ papers, summaries, topic }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to critique papers');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Critiquing papers failed:', error.message);
      // Return mock data for development
      return papers.map(() => this.getMockCritique());
    }
  }

  // Build knowledge graph
  async buildKnowledgeGraph(papers, summaries, topic) {
    try {
      const response = await fetch(`${API_BASE_URL}/research/graph`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ papers, summaries, topic }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to build knowledge graph');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Building knowledge graph failed:', error.message);
      // Return mock data for development
      return this.getMockGraph(topic);
    }
  }

  // Get research history
  async getResearchHistory(topic) {
    try {
      const response = await fetch(`${API_BASE_URL}/research/history/${encodeURIComponent(topic)}`, {
        headers: this.getAuthHeaders()
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to get research history');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Getting research history failed:', error.message);
      throw error;
    }
  }

  // Helper methods for mock data
  extractKeywords(text) {
    const words = text.toLowerCase().split(/\s+/).filter(word => word.length > 3);
    return words.slice(0, 5);
  }

  getMockPapers(topic) {
    return [
      {
        id: 'mock_1',
        title: `Recent Advances in ${topic}: A Comprehensive Survey`,
        authors: ['Dr. John Smith', 'Dr. Jane Doe'],
        abstract: `This paper presents a comprehensive survey of recent advances in ${topic}, covering key methodologies and significant findings.`,
        publishedDate: '2024-01-15',
        arxivUrl: 'https://arxiv.org/abs/mock1',
        categories: [topic, 'Research', 'Analysis']
      },
      {
        id: 'mock_2',
        title: `Novel Approaches to ${topic}: Current State and Future Directions`,
        authors: ['Dr. Alice Johnson', 'Dr. Bob Wilson'],
        abstract: `An analysis of novel approaches to ${topic}, discussing current state-of-the-art methods and future research directions.`,
        publishedDate: '2024-02-10',
        arxivUrl: 'https://arxiv.org/abs/mock2',
        categories: [topic, 'Innovation', 'Future Work']
      }
    ];
  }

  getMockSummary() {
    return {
      keyFindings: [
        'Significant improvements in methodology observed',
        'Novel approaches show promising results',
        'Strong evidence supporting main hypotheses'
      ],
      methodology: 'Systematic review and experimental analysis',
      significance: 'Important contribution to current understanding of the field'
    };
  }

  getMockCritique() {
    return {
      strengths: [
        'Well-designed experimental methodology',
        'Comprehensive data analysis',
        'Clear presentation of results'
      ],
      weaknesses: [
        'Limited sample size in some experiments',
        'Potential for selection bias',
        'Need for longer-term validation studies'
      ],
      score: Math.floor(Math.random() * 3) + 7,
      recommendation: 'This work provides valuable insights and should be considered in future research.'
    };
  }

  getMockGraph(topic) {
    return {
      nodes: [
        { id: 'topic', label: topic, type: 'topic', size: 20 },
        { id: 'paper1', label: 'Survey Paper', type: 'paper', size: 12 },
        { id: 'paper2', label: 'Novel Approaches', type: 'paper', size: 12 },
        { id: 'author1', label: 'Dr. Smith', type: 'author', size: 8 },
        { id: 'author2', label: 'Dr. Johnson', type: 'author', size: 8 }
      ],
      links: [
        { source: 'topic', target: 'paper1', strength: 0.8 },
        { source: 'topic', target: 'paper2', strength: 0.8 },
        { source: 'paper1', target: 'author1', strength: 0.6 },
        { source: 'paper2', target: 'author2', strength: 0.6 }
      ]
    };
  }
}

export const researchService = new ResearchService();
