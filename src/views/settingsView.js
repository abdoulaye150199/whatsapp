import { getCurrentUser } from '../models/userModel.js';
import { logout } from '../utils/auth.js';

function renderSettingsView() {
  // Vérifier si un conteneur de paramètres existe déjà
  const existingSettings = document.getElementById('settings-container');
  if (existingSettings) {
    return; // Si le conteneur existe déjà, ne rien faire
  }

  // Au lieu de masquer chat-content, on masque chat-list
  const chatList = document.getElementById('chat-list-container');
  chatList.style.display = 'none';
  
  // Create settings container avec la même largeur que la liste des chats
  const container = document.createElement('div');
  container.id = 'settings-container';
  container.className = 'w-[380px] border-r border-gray-700 flex flex-col bg-[#111b21]';
  
  // Create header
  const header = document.createElement('div');
  header.className = 'p-4 bg-[#202c33] flex items-center border-b border-gray-700';
  header.innerHTML = `
    <button id="settings-back-btn" class="text-gray-400 hover:text-white mr-4">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M15 18l-6-6 6-6"/>
      </svg>
    </button>
    <h2 class="text-white text-xl font-medium">Paramètres</h2>
  `;
  
  // Create search input
  const searchContainer = document.createElement('div');
  searchContainer.className = 'p-4 bg-[#111b21]';
  searchContainer.innerHTML = `
    <div class="flex items-center bg-[#2a3942] rounded-lg px-4 py-2">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400 mr-3">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
      <input
        type="text"
        id="settings-search"
        placeholder="Rechercher dans les paramètres"
        class="bg-transparent border-none outline-none text-white w-full"
      />
    </div>
  `;
  
  // Get current user
  const currentUser = getCurrentUser();
  
  // Create user profile section avec l'image du profil actuel
  const profileSection = document.createElement('div');
  profileSection.className = 'flex items-center p-4 hover:bg-[#202c33] cursor-pointer';
  profileSection.innerHTML = `
    <div class="w-16 h-16 rounded-full overflow-hidden mr-4">
      <img 
        src="./src/assets/images/profile.jpeg" 
        alt="Photo de profil"
        class="w-full h-full object-cover"
        onerror="this.src='https://via.placeholder.com/160?text=U'"
      />
    </div>
    <div>
      <h3 class="text-white text-lg" id="profile-name">AbdAllah</h3>
      <p class="text-gray-400">Salut ! J'utilise WhatsApp.</p>
    </div>
  `;
  
  // Create settings menu
  const settingsMenu = document.createElement('div');
  settingsMenu.className = 'flex-1 overflow-y-auto bg-[#111b21]';
  
  const menuItems = [
    {
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`,
      title: 'Compte',
      color: 'text-gray-300'
    },
    {
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>`,
      title: 'Confidentialité',
      color: 'text-gray-300'
    },
    {
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>`,
      title: 'Discussions',
      color: 'text-[#00a884]'
    },
    {
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>`,
      title: 'Notifications',
      color: 'text-gray-300'
    },
    {
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 12l2 2 4-4"></path><path d="M21 12c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1z"></path><path d="M3 12c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1z"></path><path d="M12 21c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1z"></path><path d="M12 3c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1z"></path></svg>`,
      title: 'Raccourcis clavier',
      color: 'text-gray-300'
    },
    {
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
      title: 'Aide',
      color: 'text-gray-300'
    }
  ];
  
  menuItems.forEach(item => {
    const menuItem = document.createElement('div');
    menuItem.className = 'flex items-center p-4 hover:bg-[#2a3942] cursor-pointer transition-colors border-b border-gray-800';
    menuItem.innerHTML = `
      <div class="${item.color} mr-4">
        ${item.icon}
      </div>
      <span class="text-white text-lg">${item.title}</span>
    `;
    settingsMenu.appendChild(menuItem);
  });
  
  // Create logout section
  const logoutSection = document.createElement('div');
  logoutSection.className = 'p-4 bg-[#111b21] border-t border-gray-700';
  logoutSection.innerHTML = `
    <div class="flex items-center p-3 hover:bg-[#2a3942] cursor-pointer rounded-lg transition-colors">
      <div class="text-red-500 mr-4">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
          <polyline points="16 17 21 12 16 7"></polyline>
          <line x1="21" y1="12" x2="9" y2="12"></line>
        </svg>
      </div>
      <span class="text-red-500 text-lg">Se déconnecter</span>
    </div>
  `;
  
  // Assemble the view
  container.appendChild(header);
  container.appendChild(searchContainer);
  container.appendChild(profileSection);
  container.appendChild(settingsMenu);
  container.appendChild(logoutSection);
  
  // Add to DOM
  chatList.parentNode.insertBefore(container, chatList);
  
  // Initialize event listeners
  initSettingsEvents();
}

function initSettingsEvents() {
  // Back button
  document.getElementById('settings-back-btn').addEventListener('click', hideSettingsView);
  
  // Search functionality
  const searchInput = document.getElementById('settings-search');
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    const menuItems = document.querySelectorAll('#settings-container .flex.items-center.p-4');
    
    menuItems.forEach(item => {
      const text = item.textContent.toLowerCase();
      if (text.includes(query)) {
        item.style.display = 'flex';
      } else {
        item.style.display = 'none';
      }
    });
  });

  // Ajouter l'événement de déconnexion
  const logoutSection = document.querySelector('.text-red-500.text-lg').parentElement;
  logoutSection.addEventListener('click', () => {
    try {
      logout(); // Appeler la fonction logout qui redirige vers login.html
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  });
}

function hideSettingsView() {
  const container = document.getElementById('settings-container');
  if (container) {
    container.remove();
  }
  const chatList = document.getElementById('chat-list-container');
  if (chatList) {
    chatList.style.display = 'flex';
  }
}

export { renderSettingsView, hideSettingsView };