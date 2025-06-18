const OpenAI = require('openai');
const FreeAiService = require('../services/freeAiService');

// Planner Agent - Determines research strategy
class PlannerAgent {
    constructor(apiKey) {
        this.openai = new OpenAI({
            apiKey: apiKey
        });
        this.freeAiService = new FreeAiService();
    }

    async planResearch(topic) {
        try {
            const prompt = `You are an expert research planner. Your task is to create a detailed research strategy for the given topic.
            Topic: ${topic}
            
            Consider the following:
            - What are the key areas to investigate?
            - What search terms should be used to find relevant papers?
            - What timeframe should be considered?
            
            Your output should be a JSON object with the following keys:
            - strategy (string): A detailed research strategy.
            - keywords (array of strings): Specific keywords to use for searching papers.
            - timeframe (string): The timeframe to consider (e.g., "2020-2024").`;

            const response = await this.openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: "You are a research planning expert. Always respond with valid JSON."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                max_tokens: 300,
                temperature: 0.7
            });

            const jsonString = response.choices[0].message.content.trim();

            try {
                const plan = JSON.parse(jsonString);
                return plan;
            } catch (error) {
                console.error('Failed to parse JSON:', error);
                console.error('Received string:', jsonString);
                throw new Error('Failed to parse research plan from LLM output.');
            }

        } catch (error) {
            console.error('OpenAI planning failed, using fallback:', error.message);

            // Use free AI service as fallback
            if (['insufficient_quota', 'rate_limit_exceeded', '429'].includes(error.code)) {
                console.error('Using free AI service due to OpenAI quota exhaustion');
                return await this.freeAiService.generateResponse(topic, 'plan');
            }
            
            return await this.freeAiService.generateResponse(topic, 'plan');
        }
    }
}

module.exports = PlannerAgent;
