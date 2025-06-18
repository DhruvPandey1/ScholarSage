import React, { useEffect, useRef } from 'react';
import ForceGraph2D from 'react-force-graph-2d';

const KnowledgeGraph = ({ data, height = 600 }) => {
  const fgRef = useRef();

  const getNodeColor = (node) => {
    switch (node.type) {
      case 'paper':
        return '#3B82F6'; // Blue
      case 'topic':
        return '#10B981'; // Green
      case 'author':
        return '#8B5CF6'; // Purple
      default:
        return '#6B7280'; // Gray
    }
  };

  const getNodeSize = (node) => {
    return node.size || 8;
  };

  useEffect(() => {
    if (fgRef.current && data.nodes.length > 0) {
      // Auto-zoom to fit all nodes
      fgRef.current.zoomToFit(400);
    }
  }, [data]);

  const paintNode = (node, ctx) => {
    const size = getNodeSize(node);
    const color = getNodeColor(node);
    
    // Draw node circle
    ctx.beginPath();
    ctx.arc(node.x, node.y, size, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
    
    // Add border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw label
    const label = node.label;
    if (label) {
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#374151';
      ctx.font = '12px Inter, sans-serif';
      ctx.fillText(label, node.x, node.y + size + 15);
    }
  };

  const paintLink = (link, ctx) => {
    const { source, target } = link;
    
    // Calculate link strength for line width
    const strength = link.strength || 1;
    const lineWidth = Math.max(1, strength * 2);
    
    ctx.strokeStyle = '#E5E7EB';
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.moveTo(source.x, source.y);
    ctx.lineTo(target.x, target.y);
    ctx.stroke();
  };

  const handleNodeClick = (node) => {
    console.log('Node clicked:', node);
    // TODO: Implement node click actions (show details, filter, etc.)
  };

  if (!data.nodes.length) {
    return (
      <div 
        className="flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300"
        style={{ height }}
      >
        <div className="text-center text-gray-500">
          <div className="text-lg font-medium mb-2">No data to visualize</div>
          <div className="text-sm">Start a research session to see the knowledge graph</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative border rounded-lg overflow-hidden bg-white">
      <ForceGraph2D
        ref={fgRef}
        graphData={data}
        width={undefined}
        height={height}
        nodeCanvasObject={paintNode}
        linkCanvasObject={paintLink}
        onNodeClick={handleNodeClick}
        nodePointerAreaPaint={(node, color, ctx) => {
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(node.x, node.y, getNodeSize(node) + 2, 0, 2 * Math.PI);
          ctx.fill();
        }}
        linkDirectionalParticles={2}
        linkDirectionalParticleSpeed={0.006}
        linkDirectionalParticleWidth={2}
        cooldownTicks={100}
        onEngineStop={() => fgRef.current?.zoomToFit(400)}
        enableNodeDrag={true}
        enableZoomInteraction={true}
        enablePanInteraction={true}
      />
      
      {/* Legend */}
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-4 border">
        <h4 className="font-medium text-sm mb-3">Legend</h4>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-xs">Papers</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-xs">Topics</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
            <span className="text-xs">Authors</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeGraph;
