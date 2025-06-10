import { getAllContacts, searchContacts } from '../models/chatModel.js';
import { generateInitialsAvatar } from '../utils/avatarGenerator.js';

function renderContacts(contacts, onContactSelect) {
  const contactsList = document.getElementById('contacts-list');
  if (!contactsList) return;

  contactsList.innerHTML = contacts.map(contact => {
    const avatar = generateInitialsAvatar(contact.name);
    
    return `
      <div class="contact-item flex items-center p-3 hover:bg-[#202c33] cursor-pointer" data-contact-id="${contact.id}">
        <div class="w-12 h-12 rounded-full mr-4 overflow-hidden flex items-center justify-center text-white text-xl font-medium"
             style="background-color: ${avatar.backgroundColor}">
          ${avatar.initials}
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
  header.className = 'p-4 bg-[#202c33] flex items-center justify-between border-b border-gray-700'; // Ajout de justify-between
  header.innerHTML = `
    <div class="flex items-center">
      <button id="new-discussion-back-btn" class="text-gray-400 hover:text-white mr-4">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M15 18l-6-6 6-6"/>
        </svg>
      </button>
      <h2 class="text-white text-xl font-medium">Nouvelle discussion</h2>
    </div>
    <button id="add-contact-btn" class="flex items-center text-[#00a884] hover:text-[#06cf9c] transition-colors">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <line x1="19" y1="8" x2="19" y2="14"></line>
        <line x1="16" y1="11" x2="22" y2="11"></line>
      </svg>
    </button>
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
  
  // Ajouter les options de groupe et communauté après la barre de recherche
  const optionsContainer = document.createElement('div');
  optionsContainer.className = 'border-b border-gray-700';
  optionsContainer.innerHTML = `
    <div class="cursor-pointer hover:bg-[#202c33] p-3 flex items-center">
      <div class="w-12 h-12 rounded-full bg-[#00a884] flex items-center justify-center mr-4">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      </div>
      <span class="text-white">Nouveau groupe</span>
    </div>

    <div class="cursor-pointer hover:bg-[#202c33] p-3 flex items-center">
      <div class="w-12 h-12 rounded-full bg-[#00a884] flex items-center justify-center mr-4">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"></path>
        </svg>
      </div>
      <span class="text-white">Nouvelle communauté</span>
    </div>
  `;

  // Ajout des gestionnaires d'événements pour les nouvelles options
  const [newGroupBtn, newCommunityBtn] = optionsContainer.children;
  
  newGroupBtn.addEventListener('click', () => {
    handleNewGroup();
  });

  newCommunityBtn.addEventListener('click', () => {
    handleNewCommunity();
  });

  // Liste des contacts
  const contactsList = document.createElement('div');
  contactsList.id = 'contacts-list';
  contactsList.className = 'flex-1 overflow-y-auto';
  
  // Assembler la vue
  container.appendChild(header);
  container.appendChild(searchContainer);
  container.appendChild(optionsContainer);
  container.appendChild(contactsList);
  
  // Ajouter à la page au même endroit que les paramètres
  chatList.parentNode.insertBefore(container, chatList);
  
  // Ajouter l'événement de retour sur le bouton
  const backButton = container.querySelector('#new-discussion-back-btn');
  backButton.addEventListener('click', hideNewDiscussionView);
  
  // Ajouter l'événement pour le bouton d'ajout de contact
  const addContactBtn = container.querySelector('#add-contact-btn');
  addContactBtn.addEventListener('click', () => {
    handleAddContact();
  });

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

// Ajouter cette fonction pour gérer l'ajout de contact
function handleAddContact() {
  console.log('Ajouter un nouveau contact');
  // Ici vous pouvez implémenter la logique pour ajouter un nouveau contact
  // Par exemple, ouvrir un modal avec un formulaire d'ajout de contact
}

// Ajouter ces nouvelles fonctions
function handleNewGroup() {
  console.log('Création d\'un nouveau groupe');
  // Implémenter la logique de création de groupe ici
}

function handleNewCommunity() {
  console.log('Création d\'une nouvelle communauté');
  // Implémenter la logique de création de communauté ici
}

// Les autres fonctions restent inchangées...