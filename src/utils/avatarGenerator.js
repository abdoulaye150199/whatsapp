function generateInitialsAvatar(name, size = 120) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  
  const colors = [
    '#7e57c2', // violet
    '#ff7043', // orange
    '#42a5f5', // bleu
    '#66bb6a', // vert
    '#ec407a', // rose
    '#ffa726', // orange clair
    '#8d6e63', // marron
    '#26a69a', // turquoise
  ];
  
  // Pick random color
  const colorIndex = Math.abs(name.split('').reduce((acc, char) => {
    return acc + char.charCodeAt(0);
  }, 0)) % colors.length;
  const bgColor = colors[colorIndex];
  
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