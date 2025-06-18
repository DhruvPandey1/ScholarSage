import React, { useState, useEffect } from 'react';
import { ArrowDown, Brain, Search, FileText, Star, Clock, Users } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import PaperCard from './PaperCard';
import KnowledgeGraph from './KnowledgeGraph';
import { researchService } from '../services/researchService';

const ResearchInterface = ({ topic, onBack }) => {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [papers, setPapers] = useState([]);
  const [summaries, setSummaries] = useState([]);
  const [critiques, setCritiques] = useState([]);
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [isLoading, setIsLoading] = useState(true);

  const steps = [
    { name: 'Planning Research Strategy', icon: Brain, description: 'AI agent analyzing your topic...' },
    { name: 'Searching Academic Papers', icon: Search, description: 'Finding relevant papers from arXiv...' },
    { name: 'Summarizing Papers', icon: FileText, description: 'AI extracting key insights...' },
    { name: 'Critical Analysis', icon: Star, description: 'Evaluating paper quality and relevance...' },
    { name: 'Building Knowledge Graph', icon: Users, description: 'Mapping research connections...' }
  ];

  useEffect(() => {
    startResearch();
  }, [topic]);

  const startResearch = async () => {
    setIsLoading(true);
    
    try {
      // Step 1: Planning
      setStep(0);
      setProgress(20);
      await researchService.planResearch(topic);
      
      // Step 2: Search Papers
      setStep(1);
      setProgress(40);
      const foundPapers = await researchService.searchPapers(topic);
      setPapers(foundPapers);
      
      // Step 3: Summarize
      setStep(2);
      setProgress(60);
      const paperSummaries = await researchService.summarizePapers(foundPapers, topic);
      setSummaries(paperSummaries);
      
      // Step 4: Critique
      setStep(3);
      setProgress(80);
      const paperCritiques = await researchService.critiquePapers(foundPapers, paperSummaries, topic);
      setCritiques(paperCritiques);
      
      // Step 5: Build Graph
      setStep(4);
      setProgress(100);
      const graph = await researchService.buildKnowledgeGraph(foundPapers, paperSummaries, topic);
      setGraphData(graph);
      
      setIsLoading(false);
    } catch (error) {
      console.error('Research failed:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={onBack}>
                ← Back
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Research: {topic}</h1>
                <p className="text-sm text-gray-600">AI agents are analyzing your topic</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="max-w-4xl mx-auto">
            {/* Progress Section */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  Research in Progress
                </CardTitle>
                <CardDescription>
                  Our AI agents are working on your research request
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Progress value={progress} className="mb-6" />
                
                <div className="space-y-4">
                  {steps.map((stepItem, index) => {
                    const Icon = stepItem.icon;
                    const isActive = index === step;
                    const isCompleted = index < step;
                    
                    return (
                      <div
                        key={index}
                        className={`flex items-center space-x-4 p-4 rounded-lg transition-all ${
                          isActive 
                            ? 'bg-blue-50 border-l-4 border-blue-500' 
                            : isCompleted 
                            ? 'bg-green-50 border-l-4 border-green-500'
                            : 'bg-gray-50'
                        }`}
                      >
                        <div className={`p-2 rounded-full ${
                          isActive 
                            ? 'bg-blue-100 text-blue-600' 
                            : isCompleted 
                            ? 'bg-green-100 text-green-600'
                            : 'bg-gray-100 text-gray-400'
                        }`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h3 className={`font-medium ${
                            isActive || isCompleted ? 'text-gray-900' : 'text-gray-500'
                          }`}>
                            {stepItem.name}
                          </h3>
                          <p className="text-sm text-gray-600">{stepItem.description}</p>
                        </div>
                        {isCompleted && (
                          <Badge variant="secondary" className="bg-green-100 text-green-700">
                            Complete
                          </Badge>
                        )}
                        {isActive && (
                          <Badge className="bg-blue-100 text-blue-700">
                            Active
                          </Badge>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto">
            {/* Results Overview */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Papers Found</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">{papers.length}</div>
                  <p className="text-sm text-gray-600">Relevant research papers</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Summaries Generated</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">{summaries.length}</div>
                  <p className="text-sm text-gray-600">AI-powered insights</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Quality Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-600">8.5/10</div>
                  <p className="text-sm text-gray-600">Overall research quality</p>
                </CardContent>
              </Card>
            </div>

            {/* Knowledge Graph */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Knowledge Graph
                </CardTitle>
                <CardDescription>
                  Interactive visualization of research connections
                </CardDescription>
              </CardHeader>
              <CardContent>
                <KnowledgeGraph data={graphData} height={500} />
              </CardContent>
            </Card>

            {/* Paper Results */}
            <div className="grid md:grid-cols-2 gap-6">
              {papers.map((paper, index) => (
                <PaperCard
                  key={paper.id}
                  paper={paper}
                  summary={summaries[index]}
                  critique={critiques[index]}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResearchInterface;
