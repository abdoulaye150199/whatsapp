import './index.css';
import { renderIcons } from './utils/helpers.js';
import { initApp } from './controllers/appController.js';

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Render all icons
  renderIcons();
  
  // Initialize the application
  initApp();
});