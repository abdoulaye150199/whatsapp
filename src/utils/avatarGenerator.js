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
    '#f44336', // rouge
    '#9c27b0', // violet foncé
    '#3f51b5', // indigo
    '#2196f3', // bleu clair
    '#00bcd4', // cyan
    '#009688', // teal
    '#4caf50', // vert clair
    '#8bc34a', // vert lime
    '#cddc39', // lime
    '#ffeb3b', // jaune
    '#ff9800', // orange
    '#ff5722', // rouge orange
    '#795548', // marron
    '#607d8b'  // bleu gris
  ];
  
  // Pick color based on name hash
  const colorIndex = Math.abs(name.split('').reduce((acc, char) => {
    return acc + char.charCodeAt(0);
  }, 0)) % colors.length;
  const bgColor = colors[colorIndex];
  
  // Draw background circle
  ctx.fillStyle = bgColor;
  ctx.beginPath();
  ctx.arc(size/2, size/2, size/2, 0, 2 * Math.PI);
  ctx.fill();
  
  // Get initials
  const initials = name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
  
  // Draw text
  ctx.fillStyle = '#FFFFFF';
  ctx.font = `bold ${size/2.5}px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(initials, size/2, size/2);
  
  return {
    dataUrl: canvas.toDataURL('image/png'),
    backgroundColor: bgColor,
    initials: initials
  };
}

// Version simplifiée qui retourne juste l'URL
function generateInitialsAvatarUrl(name, size = 120) {
  return generateInitialsAvatar(name, size).dataUrl;
}

export { generateInitialsAvatar, generateInitialsAvatarUrl };