import { getAllContacts, addNewContact, searchContacts, getAllChats } from '../models/chatModel.js';
import { renderAddContactModal } from './addContactModalView.js';
import { renderCreateGroupModal } from './createGroupModalView.js';
import { generateInitialsAvatar } from '../utils/avatarGenerator.js';

async function renderContacts(contacts, onContactSelect) {
  const contactsList = document.getElementById('contacts-list');
  if (!contactsList) return;

  const contactsArray = Array.isArray(contacts) ? contacts : [];

  contactsList.innerHTML = contactsArray.map(contact => {
    const avatarData = contact.avatar ? 
      { dataUrl: contact.avatar, initials: '', backgroundColor: '' } : 
      generateInitialsAvatar(contact.name);
    
    return `
      <div class="contact-item flex items-center p-3 hover:bg-[#202c33] cursor-pointer" data-contact-id="${contact.id}">
        <div class="w-12 h-12 rounded-full mr-4 overflow-hidden">
          <img src="${avatarData.dataUrl}" alt="${contact.name}" class="w-full h-full object-cover">
        </div>
        <div>
          <h3 class="text-white contact-name">${contact.name}</h3>
          <p class="text-gray-400 text-sm">${contact.status || (contact.online ? 'En ligne' : 'Hors ligne')}</p>
        </div>
      </div>
    `;
  }).join('');

  // Add click events
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

async function renderGroups(groups, onGroupSelect) {
  const contactsList = document.getElementById('contacts-list');
  if (!contactsList) return;

  // Get existing contacts HTML
  const existingHTML = contactsList.innerHTML;
  
  // Add groups section
  const groupsHTML = groups.length > 0 ? `
    <div class="border-t border-gray-700 mt-2 pt-2">
      <div class="px-3 py-2">
        <h4 class="text-gray-400 text-sm font-medium">GROUPES</h4>
      </div>
      ${groups.map(group => {
        const avatarData = group.avatar ? 
          { dataUrl: group.avatar } : 
          generateInitialsAvatar(group.name);
        
        return `
          <div class="group-item flex items-center p-3 hover:bg-[#202c33] cursor-pointer" data-group-id="${group.id}">
            <div class="w-12 h-12 rounded-full mr-4 overflow-hidden">
              <img src="${avatarData.dataUrl}" alt="${group.name}" class="w-full h-full object-cover">
            </div>
            <div>
              <h3 class="text-white group-name">${group.name}</h3>
              <p class="text-gray-400 text-sm">${group.status || `${group.participants ? group.participants.length + 1 : 1} participants`}</p>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  ` : '';

  contactsList.innerHTML = existingHTML + groupsHTML;

  // Add click events for groups
  const groupItems = contactsList.querySelectorAll('.group-item');
  groupItems.forEach(item => {
    item.addEventListener('click', () => {
      const groupId = parseInt(item.dataset.groupId);
      const selectedGroup = groups.find(g => g.id === groupId);
      if (selectedGroup && onGroupSelect) {
        onGroupSelect(selectedGroup);
        hideNewDiscussionView();
      }
    });
  });
}

export async function renderNewDiscussionView(onContactSelect) {
  const existingContainer = document.getElementById('new-discussion-container');
  if (existingContainer) {
    return;
  }

  const chatList = document.getElementById('chat-list-container');
  chatList.style.display = 'none';
  
  const container = document.createElement('div');
  container.id = 'new-discussion-container';
  container.className = 'w-[380px] border-r border-gray-700 flex flex-col bg-[#111b21]';
  
  // Header
  const header = document.createElement('div');
  header.className = 'p-4 bg-[#202c33] flex items-center justify-between border-b border-gray-700';
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
  
  // Search bar
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
  
  // Options (Group and Community)
  const optionsContainer = document.createElement('div');
  optionsContainer.className = 'border-b border-gray-700';
  optionsContainer.innerHTML = `
    <div id="new-group-btn" class="cursor-pointer hover:bg-[#202c33] p-3 flex items-center transition-colors">
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

    <div id="new-community-btn" class="cursor-pointer hover:bg-[#202c33] p-3 flex items-center transition-colors">
      <div class="w-12 h-12 rounded-full bg-[#00a884] flex items-center justify-center mr-4">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"></path>
        </svg>
      </div>
      <span class="text-white">Nouvelle communauté</span>
    </div>
  `;

  // Contacts list
  const contactsList = document.createElement('div');
  contactsList.id = 'contacts-list';
  contactsList.className = 'flex-1 overflow-y-auto';
  
  // Assemble the view
  container.appendChild(header);
  container.appendChild(searchContainer);
  container.appendChild(optionsContainer);
  container.appendChild(contactsList);
  
  // Add to DOM
  chatList.parentNode.insertBefore(container, chatList);
  
  // Event listeners
  const backButton = container.querySelector('#new-discussion-back-btn');
  backButton.addEventListener('click', hideNewDiscussionView);
  
  const addContactBtn = container.querySelector('#add-contact-btn');
  addContactBtn.addEventListener('click', handleAddContact);

  const newGroupBtn = container.querySelector('#new-group-btn');
  newGroupBtn.addEventListener('click', handleNewGroup);

  const newCommunityBtn = container.querySelector('#new-community-btn');
  newCommunityBtn.addEventListener('click', handleNewCommunity);

  // Listen for group creation events
  document.addEventListener('group-created', async () => {
    await loadAndRenderData(onContactSelect);
  });

  // Initialize events
  initNewDiscussionEvents(onContactSelect);
  
  // Load and render contacts and groups
  await loadAndRenderData(onContactSelect);
}

async function loadAndRenderData(onContactSelect) {
  try {
    // Load contacts
    const contacts = await getAllContacts();
    await renderContacts(contacts, onContactSelect);
    
    // Load and render groups
    const allChats = await getAllChats();
    const groups = allChats.filter(chat => chat.isGroup);
    await renderGroups(groups, onContactSelect);
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error);
  }
}

export function hideNewDiscussionView() {
  const container = document.getElementById('new-discussion-container');
  if (container) {
    container.remove();
  }
  const chatList = document.getElementById('chat-list-container');
  if (chatList) {
    chatList.style.display = 'flex';
  }
}

function handleAddContact() {
  renderAddContactModal();
}

async function handleNewGroup() {
  console.log('Création d\'un nouveau groupe');
  await renderCreateGroupModal();
}

function handleNewCommunity() {
  console.log('Création d\'une nouvelle communauté');
  // TODO: Implement community creation
  showNotification('Fonctionnalité en cours de développement', 'info');
}

async function initNewDiscussionEvents(onContactSelect) {
  const searchInput = document.getElementById('contact-search');
  if (searchInput) {
    searchInput.addEventListener('input', async (e) => {
      const query = e.target.value.trim();
      
      // Search contacts
      const filteredContacts = await searchContacts(query);
      await renderContacts(filteredContacts, onContactSelect);
      
      // Search groups
      const allChats = await getAllChats();
      const groups = allChats.filter(chat => 
        chat.isGroup && 
        chat.name.toLowerCase().includes(query.toLowerCase())
      );
      await renderGroups(groups, onContactSelect);
    });
  }
}

function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.className = `fixed bottom-4 right-4 p-4 rounded-lg ${
    type === 'success' ? 'bg-green-500' : 
    type === 'error' ? 'bg-red-500' : 
    'bg-blue-500'
  } text-white shadow-lg z-50 notification`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

export { renderContacts };