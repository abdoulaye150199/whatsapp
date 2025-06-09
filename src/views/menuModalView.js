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
        // À implémenter
        hideMenuModal();
      }
    },
    {
      text: 'Messages importants',
      onClick: () => {
        // À implémenter
        hideMenuModal();
      }
    },
    {
      text: 'Sélectionner les discussions',
      onClick: () => {
        // À implémenter
        hideMenuModal();
      }
    },
    {
      text: 'Déconnexion',
      onClick: () => {
        // À implémenter
        hideMenuModal();
        window.location.href = 'login.html';
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