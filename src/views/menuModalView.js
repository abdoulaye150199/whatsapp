import { logout } from '../utils/auth.js';

export function renderMenuModal(position) {
  // Supprimer tout modal existant
  const existingModal = document.getElementById('menu-modal');
  if (existingModal) {
    existingModal.remove();
  }

  const modal = document.createElement('div');
  modal.id = 'menu-modal';
  modal.className = 'absolute bg-[#233138] rounded-md shadow-lg z-50';
  modal.style.top = `${position.y}px`;
  modal.style.right = `${position.x}px`;

  const menuItems = [
    {
      text: 'Nouveau groupe',
      onClick: () => {
        hideMenuModal();
      }
    },
    {
      text: 'Messages importants',
      onClick: () => {
        hideMenuModal();
      }
    },
    {
      text: 'Sélectionner les discussions',
      onClick: () => {
        hideMenuModal();
      }
    },
    {
      text: 'Déconnexion',
      onClick: () => {
        try {
          logout();  // Appel de la fonction de déconnexion
          hideMenuModal();
          window.location.href = 'login.html';
        } catch (error) {
          console.error('Erreur lors de la déconnexion:', error);
          alert('Une erreur est survenue lors de la déconnexion');
        }
      },
      className: 'text-red-500'
    }
  ];

  modal.innerHTML = menuItems.map(item => `
    <div class="px-4 py-2 hover:bg-[#182229] cursor-pointer ${item.className || 'text-gray-200'}">
      ${item.text}
    </div>
  `).join('');

  document.body.appendChild(modal);

  // Ajouter les écouteurs d'événements pour chaque élément du menu
  const menuElements = modal.querySelectorAll('div');
  menuItems.forEach((item, index) => {
    menuElements[index].addEventListener('click', item.onClick);
  });

  // Fermer le modal en cliquant à l'extérieur
  const closeOnClickOutside = (e) => {
    if (!modal.contains(e.target) && e.target.id !== 'menu-btn') {
      hideMenuModal();
    }
  };
  document.addEventListener('click', closeOnClickOutside);
}

export function hideMenuModal() {
  const modal = document.getElementById('menu-modal');
  if (modal) {
    modal.remove();
  }
  document.removeEventListener('click', closeOnClickOutside);
}