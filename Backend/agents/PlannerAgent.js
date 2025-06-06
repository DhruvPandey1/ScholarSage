// Planner Agent - Determines research strategy
class PlannerAgent {
    constructor(llm){
        this.llm = llm;
    }

    async planResearch(topic) {
        try{
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
            const response = await this.llm.completion({prompt,max_tokens:300});
            const jsonString=response.content.trim();
            try{
                const plan=JSON.parse(jsonString);
                return plan;
            }catch (error) {
                console.error('Failed to parse JSON:', error);
                console.error('Received string:', jsonString);
                throw new Error('Failed to parse research plan from LLM output.');
            }
        }
        catch (error) {
            console.error('Planning research failed:', error);
            throw error;
        }
    }
}

module.exports = PlannerAgent;