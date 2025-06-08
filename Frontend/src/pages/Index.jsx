import React, { useState } from 'react';
import { Search, Brain, BookOpen, Users, Zap, ArrowDown } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import ResearchInterface from '../components/ResearchInterface';
import KnowledgeGraph from '../components/KnowledgeGraph';

const Index = () => {
  const [isResearching, setIsResearching] = useState(false);
  const [researchTopic, setResearchTopic] = useState('');

  const handleStartResearch = () => {
    if (researchTopic.trim()) {
      setIsResearching(true);
    }
  };

  if (isResearching) {
    return <ResearchInterface topic={researchTopic} onBack={() => setIsResearching(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">ScholarSage</h1>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-blue-600 transition-colors">How it Works</a>
              <Button variant="outline" size="sm">Sign In</Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 text-center">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              AI-Powered Research
              <span className="block text-blue-600">Made Simple</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Let our autonomous AI agents help you discover, analyze, and understand academic papers. 
              Enter any research topic and watch as our intelligent system builds a comprehensive knowledge graph.
            </p>
            
            {/* Search Interface */}
            <div className="max-w-2xl mx-auto mb-12">
              <div className="flex flex-col sm:flex-row gap-4">
                <Input
                  placeholder="Enter your research topic (e.g., 'machine learning in healthcare')"
                  value={researchTopic}
                  onChange={(e) => setResearchTopic(e.target.value)}
                  className="flex-1 h-12 text-lg"
                  onKeyPress={(e) => e.key === 'Enter' && handleStartResearch()}
                />
                <Button 
                  onClick={handleStartResearch}
                  className="h-12 px-8 bg-blue-600 hover:bg-blue-700"
                  disabled={!researchTopic.trim()}
                >
                  <Search className="h-5 w-5 mr-2" />
                  Start Research
                </Button>
              </div>
            </div>

            {/* Demo Visualization */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-12">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Interactive Knowledge Graph Preview</h3>
              <KnowledgeGraph data={demoGraphData} height={400} />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Intelligent Research Features</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our AI agents work together to provide comprehensive research assistance
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Brain className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>AI Agent System</CardTitle>
                <CardDescription>
                  Three specialized agents: Planner, Summarizer, and Critic work autonomously
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Planner Agent: Research strategy</li>
                  <li>• Summarizer Agent: Paper analysis</li>
                  <li>• Critic Agent: Quality evaluation</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <BookOpen className="h-12 w-12 text-green-600 mb-4" />
                <CardTitle>Academic Search</CardTitle>
                <CardDescription>
                  Direct integration with arXiv and other academic databases
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Real-time paper discovery</li>
                  <li>• Smart relevance filtering</li>
                  <li>• Citation tracking</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Users className="h-12 w-12 text-purple-600 mb-4" />
                <CardTitle>Knowledge Graph</CardTitle>
                <CardDescription>
                  Interactive visualization of research connections and relationships
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Topic clustering</li>
                  <li>• Author networks</li>
                  <li>• Research trends</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How ScholarSage Works</h2>
            <p className="text-xl text-gray-600">
              Four simple steps to comprehensive research insights
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { step: 1, title: "Enter Topic", desc: "Input your research question or topic of interest", icon: Search },
                { step: 2, title: "AI Planning", desc: "Planner agent creates optimal search strategy", icon: Brain },
                { step: 3, title: "Paper Analysis", desc: "Agents fetch, summarize, and critique papers", icon: BookOpen },
                { step: 4, title: "Knowledge Graph", desc: "Interactive visualization of findings", icon: Users }
              ].map((item, index) => (
                <div key={item.step} className="text-center">
                  <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <item.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Step {item.step}: {item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                  {index < 3 && (
                    <ArrowDown className="h-6 w-6 text-gray-400 mx-auto mt-4 hidden lg:block" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Accelerate Your Research?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join researchers worldwide who are using AI to unlock deeper insights faster than ever before.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              placeholder="Enter research topic..."
              value={researchTopic}
              onChange={(e) => setResearchTopic(e.target.value)}
              className="flex-1 bg-white text-gray-900"
            />
            <Button 
              onClick={handleStartResearch}
              className="bg-white text-blue-600 hover:bg-gray-100"
              disabled={!researchTopic.trim()}
            >
              <Zap className="h-5 w-5 mr-2" />
              Get Started
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Brain className="h-6 w-6" />
              <span className="font-semibold">ScholarSage</span>
            </div>
            <p className="text-gray-400 text-sm">
              Built with AI agents for the research community
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Demo data for the knowledge graph preview - fixed type issue
const demoGraphData = {
  nodes: [
    { id: 'ml', label: 'Machine Learning', type: 'topic', size: 20 },
    { id: 'healthcare', label: 'Healthcare', type: 'topic', size: 18 },
    { id: 'paper1', label: 'Deep Learning in Medical Diagnosis', type: 'paper', size: 12 },
    { id: 'paper2', label: 'AI-Powered Drug Discovery', type: 'paper', size: 12 },
    { id: 'paper3', label: 'Neural Networks for Medical Imaging', type: 'paper', size: 12 },
    { id: 'author1', label: 'Dr. Smith', type: 'author', size: 8 },
    { id: 'author2', label: 'Dr. Johnson', type: 'author', size: 8 }
  ],
  links: [
    { source: 'ml', target: 'paper1' },
    { source: 'healthcare', target: 'paper1' },
    { source: 'ml', target: 'paper2' },
    { source: 'healthcare', target: 'paper2' },
    { source: 'ml', target: 'paper3' },
    { source: 'paper1', target: 'author1' },
    { source: 'paper2', target: 'author2' },
    { source: 'paper3', target: 'author1' }
  ]
};

export default Index;
