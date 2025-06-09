import { getAllContacts, searchContacts } from '../models/chatModel.js';
import { generateInitialsAvatar } from '../utils/avatarGenerator.js';

function renderContacts(contacts, onContactSelect) {
  const contactsList = document.getElementById('contacts-list');
  if (!contactsList) return;

  contactsList.innerHTML = contacts.map(contact => {
    // Générer l'avatar avec les initiales
    const avatarUrl = generateInitialsAvatar(contact.name);
    
    return `
      <div class="contact-item flex items-center p-3 hover:bg-[#202c33] cursor-pointer" data-contact-id="${contact.id}">
        <div class="w-12 h-12 rounded-full bg-[#2a3942] mr-4 overflow-hidden">
          <img 
            src="${avatarUrl}" 
            alt="${contact.name}" 
            class="w-full h-full object-cover"
          />
        </div>
        <div>
          <h3 class="text-white contact-name">${contact.name}</h3>
          <p class="text-gray-400 text-sm">${contact.status || (contact.online ? 'En ligne' : 'Hors ligne')}</p>
        </div>
      </div>
    `;
  }).join('');

  // Ajouter les événements de clic sur les contacts
  const contactItems = contactsList.querySelectorAll('.contact-item');
  contactItems.forEach(item => {
    item.addEventListener('click', () => {
      const contactId = parseInt(item.dataset.contactId);
      const selectedContact = contacts.find(c => c.id === contactId);
      if (selectedContact && onContactSelect) {
        onContactSelect(selectedContact);
        hideNewDiscussionView();
      }
    });
  });
}

export function renderNewDiscussionView(onContactSelect) {
  // Vérifier si un conteneur existe déjà
  const existingContainer = document.getElementById('new-discussion-container');
  if (existingContainer) {
    return;
  }

  // Masquer la liste des chats comme pour les paramètres
  const chatList = document.getElementById('chat-list-container');
  chatList.style.display = 'none';
  
  // Créer le conteneur avec la même largeur que la liste des chats
  const container = document.createElement('div');
  container.id = 'new-discussion-container';
  container.className = 'w-[380px] border-r border-gray-700 flex flex-col bg-[#111b21]';
  
  // En-tête
  const header = document.createElement('div');
  header.className = 'p-4 bg-[#202c33] flex items-center border-b border-gray-700';
  header.innerHTML = `
    <button id="new-discussion-back-btn" class="text-gray-400 hover:text-white mr-4">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M15 18l-6-6 6-6"/>
      </svg>
    </button>
    <h2 class="text-white text-xl font-medium">Nouvelle discussion</h2>
  `;
  
  // Barre de recherche
  const searchContainer = document.createElement('div');
  searchContainer.className = 'p-4 bg-[#111b21]';
  searchContainer.innerHTML = `
    <div class="flex items-center bg-[#2a3942] rounded-lg px-4 py-2">
      <svg class="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        type="text"
        id="contact-search"
        placeholder="Rechercher un contact"
        class="bg-transparent border-none outline-none text-white w-full"
      />
    </div>
  `;
  
  // Liste des contacts
  const contactsList = document.createElement('div');
  contactsList.id = 'contacts-list';
  contactsList.className = 'flex-1 overflow-y-auto';
  
  // Assembler la vue
  container.appendChild(header);
  container.appendChild(searchContainer);
  container.appendChild(contactsList);
  
  // Ajouter à la page au même endroit que les paramètres
  chatList.parentNode.insertBefore(container, chatList);
  
  // Ajouter l'événement de retour sur le bouton
  const backButton = container.querySelector('#new-discussion-back-btn');
  backButton.addEventListener('click', hideNewDiscussionView);
  
  // Initialiser les événements
  initNewDiscussionEvents(onContactSelect);
  
  // Afficher les contacts initiaux avec les avatars générés
  renderContacts(getAllContacts(), onContactSelect);
}

export function hideNewDiscussionView() {
  const container = document.getElementById('new-discussion-container');
  if (container) {
    container.remove();
  }
  // Réafficher la liste des chats
  const chatList = document.getElementById('chat-list-container');
  if (chatList) {
    chatList.style.display = 'flex';
  }
}

// Les autres fonctions restent inchangées...