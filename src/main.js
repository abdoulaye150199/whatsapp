import './index.css';
import { renderIcons } from './utils/helpers.js';
import { initApp } from './controllers/appController.js';
import { isAuthenticated, requireAuth } from './utils/auth.js';
import { renderAttachmentModal, hideAttachmentModal } from './views/attachmentModalView.js';

// Fonction pour initialiser les gestionnaires d'événements
function initializeEventListeners() {
  const attachButton = document.getElementById('attach-btn');
  
  if (attachButton) {
    attachButton.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const rect = e.currentTarget.getBoundingClientRect();
      const position = {
        x: rect.left,
        y: rect.bottom + 5
      };
      
      renderAttachmentModal(position);
    });
  }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initializeEventListeners();
  
  // Render all icons
  renderIcons();
  
  // Vérifier si on est sur la page de login
  const isLoginPage = window.location.pathname.includes('login.html');
  
  if (isLoginPage) {
    // Si déjà connecté, rediriger vers l'app
    if (isAuthenticated()) {
      window.location.href = 'index.html';
      return;
    }
    
    // Modifier le texte du bouton de connexion
    const btnText = document.getElementById('btnText');
    if (btnText) {
      btnText.textContent = 'Se connecter';
    }
    
    return;
  }

  // Pour toutes les autres pages, vérifier l'authentification
  if (!requireAuth()) {
    // requireAuth redirige déjà vers login.html si non authentifié
    return;
  }

  // Initialize the application only if authenticated
  initApp();
});