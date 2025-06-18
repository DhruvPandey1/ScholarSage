import React, { useState } from 'react';
import { FileText, Star, Clock, Users, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Separator } from '../components/ui/separator';

const PaperCard = ({ paper, summary, critique }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getScoreColor = (score) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <CardTitle className="text-lg leading-tight mb-2">
              {paper.title}
            </CardTitle>
            <CardDescription className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4" />
                <span>{paper.authors.slice(0, 3).join(', ')}</span>
                {paper.authors.length > 3 && <span>+{paper.authors.length - 3} more</span>}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4" />
                <span>{formatDate(paper.publishedDate)}</span>
              </div>
            </CardDescription>
          </div>
          {critique && (
            <div className="text-right">
              <div className={`text-2xl font-bold ${getScoreColor(critique.score)}`}>
                {critique.score}/10
              </div>
              <div className="text-xs text-gray-500">Quality Score</div>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          {paper.categories.map((category) => (
            <Badge key={category} variant="outline" className="text-xs">
              {category}
            </Badge>
          ))}
        </div>
      </CardHeader>

      <CardContent>
        {/* Abstract Preview */}
        <div className="mb-4">
          <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Abstract
          </h4>
          <p className="text-sm text-gray-600 line-clamp-3">
            {paper.abstract}
          </p>
        </div>

        {/* AI Summary */}
        {summary && (
          <div className="mb-4">
            <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
              <Star className="h-4 w-4 text-blue-600" />
              AI Summary
            </h4>
            <div className="bg-blue-50 rounded-lg p-3">
              <p className="text-sm text-gray-700 mb-2">
                <strong>Significance:</strong> {summary.significance}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Methodology:</strong> {summary.methodology}
              </p>
            </div>
          </div>
        )}

        {/* Expandable Detailed Analysis */}
        {(summary || critique) && (
          <div>
            <Button
              variant="ghost"
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full justify-between p-0 h-auto font-normal"
            >
              <span className="text-sm font-medium">Detailed Analysis</span>
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>

            {isExpanded && (
              <div className="mt-4 space-y-4">
                {summary && (
                  <>
                    <div>
                      <h5 className="font-medium text-sm mb-2">Key Findings</h5>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {summary.keyFindings.map((finding, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-blue-600 font-bold">•</span>
                            <span>{finding}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Separator />
                  </>
                )}

                {critique && (
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium text-sm mb-2 text-green-700">Strengths</h5>
                      <ul className="text-sm space-y-1">
                        {critique.strengths.map((strength, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-green-600 font-bold">+</span>
                            <span className="text-gray-700">{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h5 className="font-medium text-sm mb-2 text-red-700">Limitations</h5>
                      <ul className="text-sm space-y-1">
                        {critique.limitations.map((limitation, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-red-600 font-bold">-</span>
                            <span className="text-gray-700">{limitation}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {critique?.recommendation && (
                  <>
                    <Separator />
                    <div>
                      <h5 className="font-medium text-sm mb-2">Recommendation</h5>
                      <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">
                        {critique.recommendation}
                      </p>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 mt-4">
          <Button asChild variant="outline" size="sm">
            <a href={paper.arxivUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              View Paper
            </a>
          </Button>
          <Button variant="outline" size="sm">
            Save to Collection
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaperCard;
