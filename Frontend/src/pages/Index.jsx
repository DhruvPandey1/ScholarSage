import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Brain, Search, FileText, Star, Users, LogOut } from "lucide-react";
import ResearchInterface from "../components/ResearchInterface";

const Index = ({ isAuthenticated, onShowAuth, onLogout }) => {
  const [topic, setTopic] = useState("");
  const [isResearching, setIsResearching] = useState(false);

  const handleStartResearch = () => {
    if (!topic.trim()) return;
    setIsResearching(true);
  };

  const handleBackToSearch = () => {
    setIsResearching(false);
    setTopic("");
  };

  if (isResearching) {
    return <ResearchInterface topic={topic} onBack={handleBackToSearch} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">ScholarSage</h1>
            </div>
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <Button variant="outline" onClick={onLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              ) : (
                <>
                  <Button variant="outline" onClick={() => onShowAuth('login')}>
                    Login
                  </Button>
                  <Button className=" bg-black text-white" onClick={() => onShowAuth('signup')}>
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            AI-Powered Research Assistant
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Discover, analyze, and understand academic papers with the power of artificial intelligence.
            Our multi-agent system searches, summarizes, and critiques research for you.
          </p>
          
          {/* Search Box */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="flex space-x-4">
              <Input
                placeholder="Enter your research topic (e.g., 'machine learning in healthcare')"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="text-lg py-6"
                onKeyPress={(e) => e.key === 'Enter' && handleStartResearch()}
              />
              <Button 
                onClick={handleStartResearch} 
                size="lg" 
                className="px-8 bg-gray-700"
                disabled={!topic.trim() || !isAuthenticated}
              >
                <Search className="h-5 w-5 mr-2" />
                Research
              </Button>
            </div>
            {!isAuthenticated && (
              <p className="text-sm text-gray-500 mt-2">
                Please login to start researching
              </p>
            )}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <Card className="text-center">
            <CardHeader>
              <Brain className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Smart Planning</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                AI agent analyzes your topic and creates an optimal research strategy
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Search className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle>Paper Discovery</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Automatically searches arXiv and other databases for relevant research papers
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <FileText className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <CardTitle>AI Summarization</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Extracts key findings, methodology, and insights from complex research papers
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Star className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <CardTitle>Critical Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Evaluates paper quality, relevance, and provides expert-level critiques
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Knowledge Graph Preview */}
        <Card className="mb-16">
          <CardHeader className="text-center">
            <Users className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
            <CardTitle className="text-2xl">Knowledge Graph Visualization</CardTitle>
            <CardDescription>
              See how research papers, authors, and concepts connect in an interactive network
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg p-8">
              <p className="text-gray-600">
                Interactive visualization will appear here after your research is complete
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Index;
