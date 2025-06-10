export function renderChatOptionsModal(position) {
  // Supprimer tout modal existant
  const existingModal = document.getElementById('chat-options-modal');
  if (existingModal) {
    existingModal.remove();
  }

  const modal = document.createElement('div');
  modal.id = 'chat-options-modal';
  modal.className = 'fixed bg-[#233138] rounded-lg shadow-lg z-50 w-64';
  modal.style.top = `${position.y}px`;
  modal.style.right = `${position.x}px`;

  const menuItems = [
    { text: 'Infos du contact', onClick: () => handleOptionClick('contact-info') },
    { text: 'Sélectionner des messages', onClick: () => handleOptionClick('select-messages') },
    { text: 'Mode silencieux', onClick: () => handleOptionClick('mute') },
    { text: 'Messages éphémères', onClick: () => handleOptionClick('ephemeral') },
    { text: 'Ajouter aux Favoris', onClick: () => handleOptionClick('favorite') },
    { text: 'Fermer la discussion', onClick: () => handleOptionClick('close') },
    { text: 'Signaler', onClick: () => handleOptionClick('report') },
    { text: 'Bloquer', onClick: () => handleOptionClick('block') },
    { text: 'Effacer la discussion', onClick: () => handleOptionClick('clear'), className: 'text-red-500' },
    { text: 'Supprimer la discussion', onClick: () => handleOptionClick('delete'), className: 'text-red-500' }
  ];

  modal.innerHTML = menuItems.map(item => `
    <div class="px-4 py-2 hover:bg-[#182229] cursor-pointer ${item.className || 'text-gray-200'}">
      ${item.text}
    </div>
  `).join('');

  document.body.appendChild(modal);

  // Ajouter les écouteurs d'événements
  const menuElements = modal.querySelectorAll('div');
  menuItems.forEach((item, index) => {
    menuElements[index].addEventListener('click', item.onClick);
  });

  // Fermer le modal en cliquant à l'extérieur
  document.addEventListener('click', closeOnClickOutside);
}

function handleOptionClick(action) {
  console.log('Option sélectionnée:', action);
  // Implémenter les actions spécifiques ici
  hideChatOptionsModal();
}

function closeOnClickOutside(e) {
  const modal = document.getElementById('chat-options-modal');
  const optionsBtn = document.getElementById('chat-options-btn');
  
  if (modal && !modal.contains(e.target) && 
      e.target !== optionsBtn && 
      !e.target.closest('#chat-options-btn')) {
    hideChatOptionsModal();
  }
}

export function hideChatOptionsModal() {
  const modal = document.getElementById('chat-options-modal');
  if (modal) {
    modal.remove();
    document.removeEventListener('click', closeOnClickOutside);
  }
}