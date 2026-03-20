"use client";

import type { GraphEdge, GraphNode } from "@/lib/semantic/types";

interface GraphViewProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export function GraphView({ nodes, edges }: GraphViewProps) {
  return (
    <svg viewBox="0 0 1000 620" className="analysis-graph" role="img" aria-label="analysis graph">
      <text x="65" y="36" className="axis-label">
        WESTERN
      </text>
      <text x="830" y="36" className="axis-label">
        EASTERN
      </text>

      {edges.map((edge) => {
        const source = nodes.find((node) => node.id === edge.source);
        const target = nodes.find((node) => node.id === edge.target);
        if (!source || !target) return null;

        return (
          <line
            key={edge.id}
            x1={source.x}
            y1={source.y}
            x2={target.x}
            y2={target.y}
            stroke={edge.color}
            strokeOpacity={Math.max(0.22, edge.weight)}
            strokeWidth={1.2 + edge.weight * 4}
          />
        );
      })}

      {nodes.map((node) => (
        <g key={node.id}>
          <circle
            cx={node.x}
            cy={node.y}
            r={node.kind === "metric" ? 24 + node.weight * 14 : 22 + node.weight * 10}
            fill={node.kind === "metric" ? node.color : node.tradition === "western" ? "#9f5e34" : "#1f7a72"}
            fillOpacity={node.kind === "metric" ? 0.9 : 0.84}
            stroke="white"
            strokeWidth="3"
          />
          <text x={node.x} y={node.y + 44} className="graph-label">
            {node.label}
          </text>
        </g>
      ))}
    </svg>
  );
}
