const axios = require('axios');
require('dotenv').config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

class CriticAgent {
    constructor(){
        this.apiKey= OPENAI_API_KEY;
    }
    async critiquePaper(paper, summary) {
    try {
      const prompt = this.generateCritiquePrompt(paper, summary);
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiKey}`,
          },
        }
      );

      const critique = this.parseCritiqueResponse(response.data.choices[0].message.content);
      return critique;
    } catch (error) {
      console.error('Critique failed:', error);
      return {
        strengths: ['Could not retrieve strengths due to API error.'],
        limitations: ['Could not retrieve limitations due to API error.'],
        score: 5,
        recommendation: 'Unable to provide a recommendation due to an error.',
      };
    }
  }

  generateCritiquePrompt(paper, summary) {
    return `Given the following research paper and its summary, provide a critical analysis:

    Paper Title: ${paper.title}
    Abstract: ${paper.abstract}
    AI Summary: ${summary.significance} ${summary.methodology}

    Provide the critique in the following format:
    Strengths: [List the strengths of the paper]
    Limitations: [List the limitations of the paper]
    Score: [Assign a quality score out of 10]
    Recommendation: [Give a brief recommendation based on the critique]`;
  }

  parseCritiqueResponse(responseText) {
    const critique = {
      strengths: [],
      limitations: [],
      score: 0,
      recommendation: '',
    };

    try {
      const strengthsMatch = responseText.match(/Strengths:\s*\[(.*?)\]/);
      if (strengthsMatch) {
        critique.strengths = strengthsMatch[1].split(',').map((item) => item.trim());
      }

      const limitationsMatch = responseText.match(/Limitations:\s*\[(.*?)\]/);
      if (limitationsMatch) {
        critique.limitations = limitationsMatch[1].split(',').map((item) => item.trim());
      }

      const scoreMatch = responseText.match(/Score:\s*(\d+(\.\d+)?)/);
      if (scoreMatch) {
        critique.score = parseFloat(scoreMatch[1]);
      }

      const recommendationMatch = responseText.match(/Recommendation:\s*(.*?)$/m);
      if (recommendationMatch) {
        critique.recommendation = recommendationMatch[1].trim();
      }
    } catch (error) {
      console.error('Error parsing critique response:', error);
    }

    return critique;
  }
}

module.exports = new CriticAgent();
