import { renderMenuModal, hideMenuModal } from '../views/menuModalView.js';
import { logout } from '../utils/auth.js';

export function initMenuController() {
  const menuBtn = document.getElementById('menu-btn');
  
  if (menuBtn) {
    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      
      const buttonRect = menuBtn.getBoundingClientRect();
      const position = {
        x: window.innerWidth - buttonRect.right + 5,
        y: buttonRect.bottom + 5
      };
      
      renderMenuModal(position);
    });
  }
}

export function handleMenuAction(action) {
  switch(action) {
    case 'new-group':
      // À implémenter
      break;
    case 'starred-messages':
      // À implémenter
      break;
    case 'select-chats':
      // À implémenter
      break;
    case 'logout':
      logout();
      break;
    default:
      break;
  }
}