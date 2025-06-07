import { getAllContacts, searchContacts } from '../models/chatModel.js';

function renderNewDiscussionView(onContactSelect) {
  // Hide chat content and show new discussion view
  document.getElementById('chat-content').style.display = 'none';
  
  // Create new discussion container
  const container = document.createElement('div');
  container.id = 'new-discussion-container';
  container.className = 'flex-1 flex flex-col bg-[#111b21]';
  
  // Create header
  const header = document.createElement('div');
  header.className = 'p-4 bg-[#202c33] flex items-center';
  header.innerHTML = `
    <button id="back-btn" class="text-gray-400 hover:text-white mr-4">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M15 18l-6-6 6-6"/>
      </svg>
    </button>
    <h2 class="text-white text-xl">Nouvelle discussion</h2>
  `;
  
  // Create search input
  const searchContainer = document.createElement('div');
  searchContainer.className = 'p-2 bg-[#111b21]';
  searchContainer.innerHTML = `
    <div class="flex items-center bg-[#202c33] rounded-lg px-4 py-2">
      <input
        type="text"
        id="contact-search"
        placeholder="Rechercher un contact"
        class="bg-transparent border-none outline-none text-white w-full"
      />
    </div>
  `;
  
  // Create contacts list
  const contactsList = document.createElement('div');
  contactsList.id = 'contacts-list';
  contactsList.className = 'flex-1 overflow-y-auto';
  
  // Assemble the view
  container.appendChild(header);
  container.appendChild(searchContainer);
  container.appendChild(contactsList);
  
  // Add to DOM
  document.getElementById('chat-content').insertAdjacentElement('afterend', container);
  
  // Initialize event listeners
  initNewDiscussionEvents(onContactSelect);
  
  // Render initial contacts
  renderContacts(getAllContacts(), onContactSelect);
}

function initNewDiscussionEvents(onContactSelect) {
  // Back button
  document.getElementById('back-btn').addEventListener('click', hideNewDiscussionView);
  
  // Search input
  const searchInput = document.getElementById('contact-search');
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim();
    const filteredContacts = searchContacts(query);
    renderContacts(filteredContacts, onContactSelect);
  });
}

function renderContacts(contacts, onContactSelect) {
  const contactsList = document.getElementById('contacts-list');
  contactsList.innerHTML = '';
  
  contacts.forEach(contact => {
    const contactElement = document.createElement('div');
    contactElement.className = 'flex items-center p-3 hover:bg-[#202c33] cursor-pointer';
    contactElement.innerHTML = `
      <div class="w-12 h-12 rounded-full overflow-hidden mr-3">
        <img src="${contact.avatar}" alt="${contact.name}" class="w-full h-full object-cover">
      </div>
      <div>
        <h3 class="text-white">${contact.name}</h3>
      </div>
    `;
    
    contactElement.addEventListener('click', () => onContactSelect(contact));
    contactsList.appendChild(contactElement);
  });
}

function hideNewDiscussionView() {
  const container = document.getElementById('new-discussion-container');
  if (container) {
    container.remove();
  }
  document.getElementById('chat-content').style.display = 'flex';
}

export { renderNewDiscussionView, hideNewDiscussionView };