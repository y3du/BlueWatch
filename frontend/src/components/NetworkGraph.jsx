import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import './NetworkGraph.css';

const NetworkGraph = ({ tweets }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!tweets || !tweets.length) return;

    // Process data to create nodes and links
    const processData = () => {
      const nodes = [];
      const links = [];
      const emotions = new Set();
      const flaggedWords = new Set();

      // Collect unique emotions and flagged words
      tweets.forEach(tweet => {
        emotions.add(tweet.emotion);
        tweet.flagged_words.forEach(word => flaggedWords.add(word));
      });

      // Create nodes for emotions and flagged words
      emotions.forEach(emotion => {
        nodes.push({ id: emotion, group: 1, type: 'emotion' });
      });

      flaggedWords.forEach(word => {
        nodes.push({ id: word, group: 2, type: 'word' });
      });

      // Create links between emotions and words
      tweets.forEach(tweet => {
        tweet.flagged_words.forEach(word => {
          links.push({
            source: tweet.emotion,
            target: word,
            value: 1
          });
        });
      });

      return { nodes, links };
    };

    const data = processData();

    // Clear previous graph
    d3.select(svgRef.current).selectAll("*").remove();

    // Set up the simulation
    const width = 600;
    const height = 400;

    const simulation = d3.forceSimulation(data.nodes)
      .force("link", d3.forceLink(data.links).id(d => d.id))
      .force("charge", d3.forceManyBody().strength(-100))
      .force("center", d3.forceCenter(width / 2, height / 2));

    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr("viewBox", [0, 0, width, height]);

    // Add links
    const link = svg.append("g")
      .selectAll("line")
      .data(data.links)
      .join("line")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", d => Math.sqrt(d.value));

    // Add nodes
    const node = svg.append("g")
      .selectAll("circle")
      .data(data.nodes)
      .join("circle")
      .attr("r", d => d.type === 'emotion' ? 8 : 6)
      .attr("fill", d => d.type === 'emotion' ? "#ff4081" : "#2196f3")
      .call(drag(simulation));

    // Add labels
    const label = svg.append("g")
      .selectAll("text")
      .data(data.nodes)
      .join("text")
      .text(d => d.id)
      .attr("font-size", "12px")
      .attr("dx", 12)
      .attr("dy", 4);

    // Add title on hover
    node.append("title")
      .text(d => d.id);

    // Update positions
    simulation.on("tick", () => {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

      node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);

      label
        .attr("x", d => d.x)
        .attr("y", d => d.y);
    });

    // Drag functionality
    function drag(simulation) {
      function dragstarted(event) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }

      function dragged(event) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }

      function dragended(event) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      }

      return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
    }

  }, [tweets]);

  return (
    <div className="network-graph">
      <h2>Emotion-Word Network</h2>
      <div className="graph-container">
        <svg ref={svgRef}></svg>
      </div>
      <div className="legend">
        <div className="legend-item">
          <span className="dot emotion"></span>
          <span>Emotions</span>
        </div>
        <div className="legend-item">
          <span className="dot word"></span>
          <span>Flagged Words</span>
        </div>
      </div>
    </div>
  );
};

export default NetworkGraph;