const FreeAiService = require('../services/freeAiService');

// Planner Agent - Uses only free open-source models
class PlannerAgent {
    constructor(apiKey = null) {
        // Always use free AI service regardless of API key availability
        this.freeAiService = new FreeAiService();
        console.log('PlannerAgent initialized with free models only');
    }

    async planResearch(topic) {
        try {
            console.log(`Planning research for topic: ${topic} using free models`);
            
            // Use free AI service directly
            const plan = await this.freeAiService.generateResponse(topic, 'plan');
            
            console.log('Research plan generated successfully using free models');
            return plan;

        } catch (error) {
            console.error('Free AI planning failed, using rule-based fallback:', error.message);
            
            // Always return a valid response
            return this.generateBasicPlan(topic);
        }
    }

    generateBasicPlan(topic) {
        return {
            strategy: `Comprehensive research strategy for "${topic}": 1) Conduct systematic literature search using multiple academic databases, 2) Focus on peer-reviewed publications from the last 5 years, 3) Analyze key methodologies and findings, 4) Identify research gaps and future directions.`,
            keywords: this.extractTopicKeywords(topic),
            timeframe: '2019-2024'
        };
    }

    extractTopicKeywords(topic) {
        // Generate relevant keywords based on the topic
        const baseKeywords = topic.toLowerCase().split(/\s+/).filter(word => word.length > 2);
        const additionalKeywords = ['research', 'analysis', 'study', 'methodology', 'findings'];
        
        return [...baseKeywords, ...additionalKeywords].slice(0, 6);
    }
}

module.exports = PlannerAgent;
