import express from "express";
import { createCanvas } from "canvas";

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

app.use(express.static("public"));

function getColorFromWord(word) {
  const colors = {
    red: '#ff4444', blue: '#4444ff', green: '#44ff44', yellow: '#ffff44',
    orange: '#ff8844', purple: '#aa44ff', pink: '#ff44aa', cyan: '#44ffff',
    black: '#222222', white: '#ffffff', gold: '#ffd700', silver: '#c0c0c0',
    sky: '#87ceeb', ocean: '#006994', forest: '#228b22', sunset: '#ff6347',
    night: '#191970', fire: '#ff4500', ice: '#add8e6', grass: '#7cfc00',
    sun: '#ffdb58', moon: '#f4f6f0', star: '#ffd700', cloud: '#f0f0f0',
    water: '#1ca3ec', earth: '#8b4513', space: '#0c0c2c', rainbow: '#ff6b6b'
  };
  
  const lowerWord = word.toLowerCase();
  for (const [key, value] of Object.entries(colors)) {
    if (lowerWord.includes(key)) return value;
  }
  return null;
}

function generateImage(prompt) {
  const width = 800;
  const height = 450;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  
  const words = prompt.toLowerCase().split(/\s+/);
  
  let bgColor = '#1a1a2e';
  for (const word of words) {
    const color = getColorFromWord(word);
    if (color) {
      bgColor = color;
      break;
    }
  }
  
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, bgColor);
  gradient.addColorStop(1, shiftColor(bgColor, -30));
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  const shapeCount = 5 + Math.floor(Math.random() * 10);
  for (let i = 0; i < shapeCount; i++) {
    drawRandomShape(ctx, width, height, words);
  }
  
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.font = 'bold 28px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
  ctx.shadowBlur = 10;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;
  
  const maxWidth = width - 100;
  const wrappedText = wrapText(ctx, prompt, maxWidth);
  const lineHeight = 35;
  const startY = height / 2 - (wrappedText.length - 1) * lineHeight / 2;
  
  wrappedText.forEach((line, index) => {
    ctx.fillText(line, width / 2, startY + index * lineHeight);
  });
  
  return canvas.toDataURL('image/png');
}

function shiftColor(hex, amount) {
  const num = parseInt(hex.slice(1), 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amount));
  const b = Math.min(255, Math.max(0, (num & 0x0000ff) + amount));
  return `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}`;
}

function drawRandomShape(ctx, width, height, words) {
  const x = Math.random() * width;
  const y = Math.random() * height;
  const size = 20 + Math.random() * 100;
  
  const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dfe6e9', '#a29bfe', '#fd79a8'];
  let color = colors[Math.floor(Math.random() * colors.length)];
  
  for (const word of words) {
    const wordColor = getColorFromWord(word);
    if (wordColor && Math.random() > 0.5) {
      color = wordColor;
      break;
    }
  }
  
  ctx.fillStyle = `${color}${Math.floor(Math.random() * 50 + 20).toString(16).padStart(2, '0')}`;
  ctx.strokeStyle = `${color}88`;
  ctx.lineWidth = 2;
  
  const hasCircle = words.some(w => ['circle', 'round', 'ball', 'sun', 'moon', 'dot', 'orb'].includes(w));
  const hasSquare = words.some(w => ['square', 'box', 'cube', 'block', 'rectangle'].includes(w));
  const hasTriangle = words.some(w => ['triangle', 'pyramid', 'arrow', 'point'].includes(w));
  const hasStar = words.some(w => ['star', 'stars', 'sparkle', 'twinkle'].includes(w));
  
  let shapeType;
  if (hasCircle) shapeType = 0;
  else if (hasSquare) shapeType = 1;
  else if (hasTriangle) shapeType = 2;
  else if (hasStar) shapeType = 3;
  else shapeType = Math.floor(Math.random() * 4);
  
  switch (shapeType) {
    case 0:
      ctx.beginPath();
      ctx.arc(x, y, size / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      break;
    case 1:
      ctx.fillRect(x - size / 2, y - size / 2, size, size);
      ctx.strokeRect(x - size / 2, y - size / 2, size, size);
      break;
    case 2:
      ctx.beginPath();
      ctx.moveTo(x, y - size / 2);
      ctx.lineTo(x + size / 2, y + size / 2);
      ctx.lineTo(x - size / 2, y + size / 2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      break;
    case 3:
      drawStar(ctx, x, y, 5, size / 2, size / 4);
      ctx.fill();
      ctx.stroke();
      break;
  }
}

function drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
  let rot = Math.PI / 2 * 3;
  let step = Math.PI / spikes;
  
  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);
  
  for (let i = 0; i < spikes; i++) {
    ctx.lineTo(cx + Math.cos(rot) * outerRadius, cy + Math.sin(rot) * outerRadius);
    rot += step;
    ctx.lineTo(cx + Math.cos(rot) * innerRadius, cy + Math.sin(rot) * innerRadius);
    rot += step;
  }
  
  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
}

function wrapText(ctx, text, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';
  
  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const metrics = ctx.measureText(testLine);
    
    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  
  if (currentLine) lines.push(currentLine);
  return lines;
}

app.post("/generate", (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.json({ error: "No prompt provided" });
  
  try {
    const imageData = generateImage(prompt);
    res.json({ images: [imageData] });
  } catch (err) {
    console.error(err);
    res.json({ error: "Failed to generate image" });
  }
});

app.listen(5000, "0.0.0.0", () => console.log("Server running on port 5000"));
