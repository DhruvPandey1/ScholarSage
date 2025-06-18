const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;

class SummarizerAgent {
  constructor(llmType = 'openai') {
    this.llmType = llmType;
    if (llmType === 'openai' && !OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is required for OpenAI summarization.');
    }
    if (llmType === 'huggingface' && !HUGGINGFACE_API_KEY) {
      throw new Error('HUGGINGFACE_API_KEY is required for Hugging Face summarization.');
    }
  }

  async summarize(paper) {
    if (this.llmType === 'openai') {
      return this.summarizeWithOpenAI(paper);
    } else if (this.llmType === 'huggingface') {
      return this.summarizeWithHuggingFace(paper);
    } else {
      throw new Error(`Unsupported LLM type: ${this.llmType}`);
    }
  }

  async summarizeWithOpenAI(paper) {
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are an expert AI assistant that summarizes academic papers. Provide a concise summary including key findings, methodology, and significance.',
            },
            {
              role: 'user',
              content: `Summarize the following academic paper:\nTitle: ${paper.title}\nAbstract: ${paper.abstract}`,
            },
          ],
          max_tokens: 500,
          temperature: 0.7,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
        }
      );

      if (response.data && response.data.choices && response.data.choices[0].message) {
        const summary = response.data.choices[0].message.content;
        return this.extractSummaryDetails(summary);
      } else {
        throw new Error('Failed to get a valid summary from OpenAI.');
      }
    } catch (error) {
      console.error('Error summarizing with OpenAI:', error);
      throw new Error(`OpenAI summarization failed: ${error.message}`);
    }
  }

  async summarizeWithHuggingFace(paper) {
    try {
      const response = await axios.post(
        'https://api-inference.huggingface.co/models/facebook/bart-large-cnn',
        {
          inputs: `Summarize the following academic paper:\nTitle: ${paper.title}\nAbstract: ${paper.abstract}`,
        },
        {
          headers: {
            Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
          },
        }
      );

      if (response.data && response.data.summary_text) {
        const summary = response.data.summary_text;
        return this.extractSummaryDetails(summary);
      } else {
        throw new Error('Failed to get a valid summary from Hugging Face.');
      }
    } catch (error) {
      console.error('Error summarizing with Hugging Face:', error);
      throw new Error(`Hugging Face summarization failed: ${error.message}`);
    }
  }

  extractSummaryDetails(summary) {
    // Implement logic to extract key findings, methodology, and significance from the summary
    // This is a placeholder - improve this with actual parsing or more advanced NLP techniques
    return {
      keyFindings: [this.extractKeyFindings(summary)],
      methodology: this.extractMethodology(summary),
      significance: this.extractSignificance(summary),
    };
  }

  extractKeyFindings(summary) {
    // Placeholder: Simple keyword extraction
    const keywords = ['key finding', 'result', 'conclusion'];
    for (const keyword of keywords) {
      const index = summary.toLowerCase().indexOf(keyword);
      if (index > -1) {
        return summary.substring(index + keyword.length).split('.')[0].trim();
      }
    }
    return 'Key findings not explicitly mentioned in the summary.';
  }

  extractMethodology(summary) {
    // Placeholder: Look for "method" or "approach"
    const index = summary.toLowerCase().indexOf('methodology');
    if (index > -1) {
      return summary.substring(index + 'methodology'.length).split('.')[0].trim();
    }
    return 'Methodology not explicitly mentioned in the summary.';
  }

  extractSignificance(summary) {
    // Placeholder: Look for "significant" or "important"
    const index = summary.toLowerCase().indexOf('significance');
    if (index > -1) {
      return summary.substring(index + 'significance'.length).split('.')[0].trim();
    }
    return 'Significance not explicitly mentioned in the summary.';
  }
}

module.exports = SummarizerAgent;
