import { getAllContacts, createNewGroup } from '../models/chatModel.js';
import { generateInitialsAvatar } from '../utils/avatarGenerator.js';
import { getCurrentUser } from '../utils/auth.js';

export async function renderCreateGroupModal() {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
  modal.id = 'create-group-modal';
  
  modal.innerHTML = `
    <div class="bg-[#111b21] rounded-lg w-[500px] max-h-[80vh] shadow-xl flex flex-col">
      <div class="p-4 border-b border-gray-700 flex justify-between items-center">
        <h2 class="text-white text-xl">Nouveau groupe</h2>
        <button id="close-group-modal" class="text-gray-400 hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>
      
      <div class="p-4 border-b border-gray-700">
        <div class="flex items-center gap-4 mb-4">
          <div class="w-16 h-16 bg-[#2a3942] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#374045] transition-colors" id="group-avatar-container">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
              <circle cx="12" cy="13" r="4"></circle>
            </svg>
          </div>
          <div class="flex-1">
            <input type="text" id="group-name" 
              placeholder="Nom du groupe" required
              class="w-full p-3 bg-[#2a3942] text-white rounded-lg outline-none border border-gray-700 focus:border-[#00a884]">
            <div id="group-name-error" class="text-red-500 text-sm mt-2"></div>
          </div>
        </div>
        
        <div class="mb-4">
          <textarea id="group-description" 
            placeholder="Description du groupe (optionnel)"
            rows="3"
            class="w-full p-3 bg-[#2a3942] text-white rounded-lg outline-none border border-gray-700 focus:border-[#00a884] resize-none"></textarea>
        </div>
      </div>
      
      <div class="p-4 border-b border-gray-700">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-white font-medium">Ajouter des participants</h3>
          <span id="selected-count" class="text-gray-400 text-sm">0 sélectionné(s)</span>
        </div>
        
        <div class="flex items-center bg-[#2a3942] rounded-lg px-4 py-2 mb-4">
          <svg class="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            id="participant-search"
            placeholder="Rechercher des contacts"
            class="bg-transparent border-none outline-none text-white w-full"
          />
        </div>
        
        <div id="selected-participants" class="flex flex-wrap gap-2 mb-4 hidden">
          <!-- Selected participants will appear here -->
        </div>
      </div>
      
      <div class="flex-1 overflow-y-auto" id="contacts-list-group">
        <!-- Contacts will be populated here -->
      </div>
      
      <div class="p-4 border-t border-gray-700 flex justify-end gap-2">
        <button type="button" id="cancel-group" 
          class="px-4 py-2 text-gray-400 hover:text-white">
          Annuler
        </button>
        <button type="button" id="create-group-btn"
          class="px-6 py-2 bg-[#00a884] text-white rounded-lg hover:bg-[#06cf9c] disabled:opacity-50 disabled:cursor-not-allowed"
          disabled>
          Créer le groupe
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Initialize the modal
  await initCreateGroupModal();
}

async function initCreateGroupModal() {
  const modal = document.getElementById('create-group-modal');
  const closeBtn = modal.querySelector('#close-group-modal');
  const cancelBtn = modal.querySelector('#cancel-group');
  const createBtn = modal.querySelector('#create-group-btn');
  const groupNameInput = modal.querySelector('#group-name');
  const groupDescInput = modal.querySelector('#group-description');
  const searchInput = modal.querySelector('#participant-search');
  const contactsList = modal.querySelector('#contacts-list-group');
  const selectedParticipants = modal.querySelector('#selected-participants');
  const selectedCount = modal.querySelector('#selected-count');
  const avatarContainer = modal.querySelector('#group-avatar-container');

  let selectedContacts = [];
  let allContacts = [];

  // Load contacts
  try {
    allContacts = await getAllContacts();
    renderContactsList(allContacts);
  } catch (error) {
    console.error('Erreur lors du chargement des contacts:', error);
  }

  // Event listeners
  closeBtn.addEventListener('click', hideCreateGroupModal);
  cancelBtn.addEventListener('click', hideCreateGroupModal);
  
  groupNameInput.addEventListener('input', validateForm);
  
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    const filteredContacts = allContacts.filter(contact => 
      contact.name.toLowerCase().includes(query)
    );
    renderContactsList(filteredContacts);
  });

  avatarContainer.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = handleAvatarUpload;
    input.click();
  });

  createBtn.addEventListener('click', handleCreateGroup);

  // Close on outside click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) hideCreateGroupModal();
  });

  function renderContactsList(contacts) {
    contactsList.innerHTML = contacts.map(contact => `
      <div class="contact-item flex items-center p-3 hover:bg-[#202c33] cursor-pointer" data-contact-id="${contact.id}">
        <div class="w-12 h-12 rounded-full mr-4 overflow-hidden">
          <img src="${contact.avatar || generateInitialsAvatar(contact.name).dataUrl}" 
               alt="${contact.name}" 
               class="w-full h-full object-cover">
        </div>
        <div class="flex-1">
          <h3 class="text-white contact-name">${contact.name}</h3>
          <p class="text-gray-400 text-sm">${contact.status || 'Hey! J\'utilise WhatsApp'}</p>
        </div>
        <div class="w-6 h-6 border-2 border-gray-400 rounded-full flex items-center justify-center contact-checkbox" data-contact-id="${contact.id}">
          <div class="w-3 h-3 bg-[#00a884] rounded-full hidden checkmark"></div>
        </div>
      </div>
    `).join('');

    // Add click events
    contactsList.querySelectorAll('.contact-item').forEach(item => {
      item.addEventListener('click', () => {
        const contactId = parseInt(item.dataset.contactId);
        toggleContactSelection(contactId);
      });
    });
  }

  function toggleContactSelection(contactId) {
    const contact = allContacts.find(c => c.id == contactId);
    if (!contact) return;

    const index = selectedContacts.findIndex(c => c.id == contactId);
    const checkbox = document.querySelector(`[data-contact-id="${contactId}"] .contact-checkbox`);
    const checkmark = checkbox.querySelector('.checkmark');

    if (index > -1) {
      // Remove from selection
      selectedContacts.splice(index, 1);
      checkbox.classList.remove('bg-[#00a884]', 'border-[#00a884]');
      checkbox.classList.add('border-gray-400');
      checkmark.classList.add('hidden');
    } else {
      // Add to selection
      selectedContacts.push(contact);
      checkbox.classList.add('bg-[#00a884]', 'border-[#00a884]');
      checkbox.classList.remove('border-gray-400');
      checkmark.classList.remove('hidden');
    }

    updateSelectedParticipants();
    validateForm();
  }

  function updateSelectedParticipants() {
    selectedCount.textContent = `${selectedContacts.length} sélectionné(s)`;

    if (selectedContacts.length > 0) {
      selectedParticipants.classList.remove('hidden');
      selectedParticipants.innerHTML = selectedContacts.map(contact => `
        <div class="flex items-center bg-[#00a884] text-white px-3 py-1 rounded-full text-sm">
          <span>${contact.name}</span>
          <button class="ml-2 hover:bg-[#06cf9c] rounded-full p-1" onclick="removeParticipant(${contact.id})">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>
      `).join('');
    } else {
      selectedParticipants.classList.add('hidden');
    }
  }

  // Make removeParticipant globally accessible
  window.removeParticipant = (contactId) => {
    toggleContactSelection(contactId);
  };

  function validateForm() {
    const groupName = groupNameInput.value.trim();
    const hasParticipants = selectedContacts.length > 0;
    
    createBtn.disabled = !groupName || !hasParticipants;
    
    // Show error messages
    const nameError = modal.querySelector('#group-name-error');
    if (!groupName && groupNameInput.value.length > 0) {
      nameError.textContent = 'Le nom du groupe est requis';
      groupNameInput.classList.add('border-red-500');
    } else {
      nameError.textContent = '';
      groupNameInput.classList.remove('border-red-500');
    }
  }

  function handleAvatarUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      avatarContainer.innerHTML = `
        <img src="${event.target.result}" alt="Avatar du groupe" class="w-full h-full object-cover rounded-full">
      `;
      avatarContainer.dataset.avatar = event.target.result;
    };
    reader.readAsDataURL(file);
  }

  async function handleCreateGroup() {
    const groupName = groupNameInput.value.trim();
    const groupDescription = groupDescInput.value.trim();
    const groupAvatar = avatarContainer.dataset.avatar || generateInitialsAvatar(groupName).dataUrl;
    const currentUser = getCurrentUser();

    if (!groupName || selectedContacts.length === 0) {
      return;
    }

    createBtn.disabled = true;
    createBtn.textContent = 'Création en cours...';

    try {
      // Create the group
      const newGroup = {
        id: Date.now(),
        name: groupName,
        description: groupDescription,
        avatar: groupAvatar,
        isGroup: true,
        participants: selectedContacts,
        admin: currentUser ? currentUser.id : 1,
        createdAt: new Date().toISOString(),
        lastMessage: `Groupe créé par ${currentUser ? currentUser.name : 'Vous'}`,
        timestamp: new Date().toLocaleTimeString('fr-FR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        unreadCount: 0,
        online: false,
        status: `${selectedContacts.length + 1} participants`
      };

      // Save the group
      const savedGroup = await createNewGroup(newGroup);
      
      if (savedGroup) {
        hideCreateGroupModal();
        showNotification('Groupe créé avec succès!');
        
        // Refresh the chat list
        const event = new CustomEvent('group-created', { detail: savedGroup });
        document.dispatchEvent(event);
      }
      
    } catch (error) {
      console.error('Erreur lors de la création du groupe:', error);
      showNotification('Une erreur est survenue lors de la création du groupe', 'error');
    } finally {
      createBtn.disabled = false;
      createBtn.textContent = 'Créer le groupe';
    }
  }
}

function hideCreateGroupModal() {
  const modal = document.getElementById('create-group-modal');
  if (modal) {
    modal.remove();
  }
  // Clean up global function
  if (window.removeParticipant) {
    delete window.removeParticipant;
  }
}

function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.className = `fixed bottom-4 right-4 p-4 rounded-lg ${
    type === 'success' ? 'bg-green-500' : 'bg-red-500'
  } text-white shadow-lg z-50 notification`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

export { hideCreateGroupModal };