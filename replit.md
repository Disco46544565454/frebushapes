# Frebu - Canvas Image Generator

## Overview
A creative image generator that creates graphics with text and shapes based on prompts. No external APIs needed - all generation happens locally using HTML5 Canvas.

## Recent Changes
- 2025-11-30: Switched from Replicate API to local canvas-based generation
- Removed external API dependencies
- Added shape and color recognition from prompts

## Project Structure
```
.
├── index.js           # Express server with canvas image generation
├── public/
│   ├── index.html     # Main HTML page
│   ├── style.css      # Stylesheet
│   └── script.js      # Frontend JavaScript
├── package.json       # Node.js configuration
└── replit.md          # Project documentation
```

## Running the Project
The project runs automatically with the configured workflow that executes `node index.js`.
The website is served on port 5000.

## Features
- Type a prompt and click Generate
- Background color changes based on color words (red, blue, sunset, ocean, etc.)
- Shapes are influenced by words (circle, square, star, triangle)
- Your prompt text is displayed on the generated image

## User Preferences
None yet.

## Project Architecture
- Backend: Node.js with Express
- Image Generation: node-canvas (Cairo-backed)
- Frontend: HTML5, CSS3, Vanilla JavaScript
- Port: 5000
