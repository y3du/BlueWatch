import React, { useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import cloud from 'd3-cloud';
import './WordCloud.css';

const WordCloudComponent = ({ tweets }) => {
  const svgRef = useRef();

  // Process tweets to create word cloud data
  const words = useMemo(() => {
    // Combine all LIME explanations and create a word frequency map
    const wordMap = new Map();

    tweets.forEach(tweet => {
      tweet.lime_explanation.forEach(({ word, importance }) => {
        // Skip common words, short words, and unwanted patterns
        if (
          word.length <= 2 || 
          /^(the|and|or|but|in|be|us|we|will|is|on|at|to|a|an|of|for|our|you|your|they|their|this|that|these|those|with|from)$/i.test(word) ||
          /^\d+$/.test(word) // Skip numbers
        ) {
          return;
        }

        const existingWord = wordMap.get(word);
        if (existingWord) {
          existingWord.value += Math.abs(importance) * 100;
          existingWord.sentiment += importance;
          existingWord.occurrences += 1;
        } else {
          wordMap.set(word, {
            text: word,
            value: Math.abs(importance) * 100,
            sentiment: importance,
            occurrences: 1,
            isFlagged: tweet.flagged_words.includes(word)
          });
        }
      });

      // Include flagged words with high importance
      tweet.flagged_words.forEach(word => {
        const existingWord = wordMap.get(word);
        if (existingWord) {
          existingWord.value += 200; // Give extra weight to flagged words
          existingWord.isFlagged = true;
        } else {
          wordMap.set(word, {
            text: word,
            value: 200,
            sentiment: -1,
            occurrences: 1,
            isFlagged: true
          });
        }
      });
    });

    // Convert the map to an array, normalize values, and sort by size
    return Array.from(wordMap.values())
      .map(word => ({
        text: word.text,
        size: Math.round(word.value / word.occurrences), // Normalize by occurrences
        isFlagged: word.isFlagged,
        sentiment: word.sentiment
      }))
      .sort((a, b) => b.size - a.size) // Sort by size descending
      .slice(0, 50); // Limit to top 50 words for better visibility
  }, [tweets]);

  useEffect(() => {
    if (!words.length || !svgRef.current) return;

    // Clear previous content
    d3.select(svgRef.current).selectAll("*").remove();

    // Get container dimensions
    const container = d3.select(svgRef.current.parentNode);
    const width = container.node().getBoundingClientRect().width;
    const height = Math.min(500, window.innerHeight * 0.6);

    // Create layout with more padding and controlled rotations
    const layout = cloud()
      .size([width, height])
      .words(words)
      .padding(10) // Increased padding between words
      .rotate(() => {
        // Only rotate some words, and use specific angles
        const angles = [0, 0, 0, -45, 45]; // More weight to horizontal text
        return angles[Math.floor(Math.random() * angles.length)];
      })
      .fontSize(d => {
        // Enhanced size scaling
        const baseSize = Math.log2(d.size) * 5 + 16;
        const maxSize = 60; // Maximum font size
        const minSize = 12; // Minimum font size
        return Math.min(maxSize, Math.max(minSize, baseSize));
      })
      .spiral('archimedean') // Use archimedean spiral for better spacing
      .on("end", draw);

    layout.start();

    function draw(words) {
      const svg = d3.select(svgRef.current)
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [-width/2, -height/2, width, height]);

      // Add words with transitions
      const text = svg.selectAll("text")
        .data(words)
        .enter().append("text")
        .style("font-size", "0px") // Start with size 0 for animation
        .style("font-family", "Inter, sans-serif")
        .style("font-weight", "bold")
        .style("fill", d => {
          if (d.isFlagged) return '#ff4d4d';
          return d.sentiment > 0 ? '#4ecdc4' : 
                 d.sentiment < 0 ? '#ff8c00' : 
                 '#666666';
        })
        .attr("text-anchor", "middle")
        .attr("transform", d => `translate(${d.x},${d.y})rotate(${d.rotate})`)
        .text(d => d.text)
        .style("opacity", 0); // Start transparent

      // Add hover effects and tooltips
      text.on("mouseover", function(event, d) {
          const tooltip = d3.select("body")
            .append("div")
            .attr("class", "word-cloud-tooltip")
            .style("position", "absolute")
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 10) + "px")
            .html(`
              <strong>${d.text}</strong><br>
              Impact: ${d.size.toFixed(1)}
              ${d.isFlagged ? '<br>⚠️ Flagged Word' : ''}
            `);

          d3.select(this)
            .transition()
            .style("opacity", 0.7)
            .style("cursor", "pointer")
            .style("font-size", d => `${parseFloat(d3.select(this).style("font-size")) * 1.2}px`);
        })
        .on("mouseout", function() {
          d3.selectAll(".word-cloud-tooltip").remove();
          d3.select(this)
            .transition()
            .style("opacity", 1)
            .style("font-size", d => `${d.size}px`);
        });

      // Animate words appearing
      text.transition()
        .duration(600)
        .delay((d, i) => i * 50)
        .style("font-size", d => `${d.size}px`)
        .style("opacity", 1);
    }

    // Handle window resize
    const handleResize = () => {
      layout
        .size([container.node().getBoundingClientRect().width, height])
        .start();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [words]);

  return (
    <div className="word-cloud-container">
      <h2>Word Impact Analysis</h2>
      <div className="word-cloud">
        <svg ref={svgRef}></svg>
      </div>
      <div className="word-cloud-legend">
        <div className="legend-item">
          <span className="color-dot positive"></span>
          <span>Positive Impact</span>
        </div>
        <div className="legend-item">
          <span className="color-dot negative"></span>
          <span>Negative Impact</span>
        </div>
        <div className="legend-item">
          <span className="color-dot flagged"></span>
          <span>Flagged Words</span>
        </div>
      </div>
    </div>
  );
};

export default WordCloudComponent; 