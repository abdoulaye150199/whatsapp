function generateInitialsAvatar(name, size = 120) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  
  // Background colors
  const colors = {
    'e74c3c': '#e74c3c', // red
    '3498db': '#3498db', // blue
    '2ecc71': '#2ecc71', // green
    'f39c12': '#f39c12', // yellow
    '9b59b6': '#9b59b6', // purple
    '1abc9c': '#1abc9c', // turquoise
    'd35400': '#d35400', // orange
    '34495e': '#34495e'  // dark blue
  };
  
  // Pick random color
  const colorKeys = Object.keys(colors);
  const bgColor = colors[colorKeys[Math.floor(Math.random() * colorKeys.length)]];
  
  // Draw background
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, size, size);
  
  // Draw text
  const initials = name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
  
  ctx.fillStyle = '#FFFFFF';
  ctx.font = `${size/2}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(initials, size/2, size/2);
  
  return canvas.toDataURL('image/png');
}

export { generateInitialsAvatar };