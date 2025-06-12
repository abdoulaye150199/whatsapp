// Vue pour les statuts WhatsApp
import { getAllStatuses, getMyStatuses, createStatus, viewStatus, deleteStatus } from '../controllers/statusController.js';
import { generateInitialsAvatar } from '../utils/avatarGenerator.js';

export function renderStatusView() {
  // Vérifier si la vue des statuts existe déjà
  const existingStatus = document.getElementById('status-container');
  if (existingStatus) {
    return;
  }

  // Masquer la liste des chats
  const chatList = document.getElementById('chat-list-container');
  chatList.style.display = 'none';
  
  // Créer le conteneur des statuts
  const container = document.createElement('div');
  container.id = 'status-container';
  container.className = 'w-[380px] border-r border-gray-700 flex flex-col bg-[#111b21]';
  
  // Header
  const header = document.createElement('div');
  header.className = 'p-4 bg-[#202c33] flex items-center justify-between border-b border-gray-700';
  header.innerHTML = `
    <div class="flex items-center">
      <button id="status-back-btn" class="text-gray-400 hover:text-white mr-4">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M15 18l-6-6 6-6"/>
        </svg>
      </button>
      <h2 class="text-white text-xl font-medium">Statuts</h2>
    </div>
    <button id="camera-btn" class="text-gray-400 hover:text-white">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
        <circle cx="12" cy="13" r="4"></circle>
      </svg>
    </button>
  `;
  
  // Mon statut
  const myStatusSection = document.createElement('div');
  myStatusSection.className = 'p-4 border-b border-gray-700';
  myStatusSection.innerHTML = `
    <div class="flex items-center cursor-pointer hover:bg-[#202c33] p-2 rounded-lg transition-colors" id="my-status">
      <div class="relative mr-4">
        <div class="w-14 h-14 rounded-full overflow-hidden border-2 border-gray-600">
          <img src="./src/assets/images/profile.jpeg" alt="Mon statut" class="w-full h-full object-cover">
        </div>
        <div class="absolute bottom-0 right-0 w-6 h-6 bg-[#00a884] rounded-full flex items-center justify-center border-2 border-[#111b21]">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </div>
      </div>
      <div class="flex-1">
        <h3 class="text-white font-medium">Mon statut</h3>
        <p class="text-gray-400 text-sm" id="my-status-text">Appuyez pour ajouter un statut</p>
      </div>
    </div>
  `;
  
  // Section des statuts récents
  const recentSection = document.createElement('div');
  recentSection.className = 'flex-1 overflow-y-auto';
  recentSection.innerHTML = `
    <div class="p-4">
      <h4 class="text-gray-400 text-sm font-medium mb-3">RÉCENTS</h4>
      <div id="recent-statuses">
        <!-- Les statuts récents apparaîtront ici -->
      </div>
    </div>
  `;
  
  // Assembler la vue
  container.appendChild(header);
  container.appendChild(myStatusSection);
  container.appendChild(recentSection);
  
  // Ajouter au DOM
  chatList.parentNode.insertBefore(container, chatList);
  
  // Initialiser les événements
  initStatusEvents();
  
  // Charger et afficher les statuts
  loadAndRenderStatuses();
}

function initStatusEvents() {
  // Bouton retour
  document.getElementById('status-back-btn').addEventListener('click', hideStatusView);
  
  // Bouton caméra
  document.getElementById('camera-btn').addEventListener('click', openCamera);
  
  // Mon statut
  document.getElementById('my-status').addEventListener('click', handleMyStatusClick);
}

function handleMyStatusClick() {
  const myStatuses = getMyStatuses();
  
  if (myStatuses.length > 0) {
    // Afficher mes statuts existants
    showStatusViewer(myStatuses, 0);
  } else {
    // Créer un nouveau statut
    showCreateStatusModal();
  }
}

function showCreateStatusModal() {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
  modal.id = 'create-status-modal';
  
  modal.innerHTML = `
    <div class="bg-[#111b21] rounded-lg w-[400px] shadow-xl">
      <div class="p-4 border-b border-gray-700 flex justify-between items-center">
        <h2 class="text-white text-xl">Nouveau statut</h2>
        <button id="close-status-modal" class="text-gray-400 hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>
      
      <div class="p-4">
        <div class="mb-4">
          <div class="flex gap-2 mb-4">
            <button class="status-type-btn flex-1 p-3 bg-[#2a3942] text-white rounded-lg hover:bg-[#374045] transition-colors" data-type="text">
              📝 Texte
            </button>
            <button class="status-type-btn flex-1 p-3 bg-[#2a3942] text-white rounded-lg hover:bg-[#374045] transition-colors" data-type="image">
              📷 Photo
            </button>
          </div>
        </div>
        
        <div id="text-status-form" class="status-form">
          <div class="mb-4">
            <textarea id="status-text" 
              placeholder="Que voulez-vous partager ?" 
              rows="4"
              class="w-full p-3 bg-[#2a3942] text-white rounded-lg outline-none border border-gray-700 focus:border-[#00a884] resize-none"></textarea>
          </div>
          
          <div class="mb-4">
            <label class="block text-gray-400 text-sm mb-2">Couleur de fond</label>
            <div class="flex gap-2">
              <button class="color-btn w-8 h-8 rounded-full bg-[#00a884] border-2 border-transparent" data-color="#00a884"></button>
              <button class="color-btn w-8 h-8 rounded-full bg-[#ff6b6b] border-2 border-transparent" data-color="#ff6b6b"></button>
              <button class="color-btn w-8 h-8 rounded-full bg-[#4ecdc4] border-2 border-transparent" data-color="#4ecdc4"></button>
              <button class="color-btn w-8 h-8 rounded-full bg-[#45b7d1] border-2 border-transparent" data-color="#45b7d1"></button>
              <button class="color-btn w-8 h-8 rounded-full bg-[#f9ca24] border-2 border-transparent" data-color="#f9ca24"></button>
              <button class="color-btn w-8 h-8 rounded-full bg-[#6c5ce7] border-2 border-transparent" data-color="#6c5ce7"></button>
            </div>
          </div>
        </div>
        
        <div id="image-status-form" class="status-form hidden">
          <div class="mb-4">
            <input type="file" id="status-image" accept="image/*" class="hidden">
            <button id="select-image-btn" class="w-full p-4 border-2 border-dashed border-gray-600 rounded-lg text-gray-400 hover:border-[#00a884] hover:text-[#00a884] transition-colors">
              Sélectionner une image
            </button>
            <div id="image-preview" class="mt-4 hidden">
              <img id="preview-img" src="" alt="Aperçu" class="w-full h-48 object-cover rounded-lg">
            </div>
          </div>
        </div>
        
        <div class="flex justify-end gap-2">
          <button id="cancel-status" class="px-4 py-2 text-gray-400 hover:text-white">
            Annuler
          </button>
          <button id="create-status-btn" class="px-6 py-2 bg-[#00a884] text-white rounded-lg hover:bg-[#06cf9c]">
            Publier
          </button>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Initialiser les événements du modal
  initCreateStatusModalEvents();
}

function initCreateStatusModalEvents() {
  const modal = document.getElementById('create-status-modal');
  let selectedColor = '#00a884';
  let selectedImage = null;
  let currentType = 'text';
  
  // Fermer le modal
  document.getElementById('close-status-modal').addEventListener('click', () => {
    modal.remove();
  });
  
  document.getElementById('cancel-status').addEventListener('click', () => {
    modal.remove();
  });
  
  // Type de statut
  document.querySelectorAll('.status-type-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentType = btn.dataset.type;
      
      // Mettre à jour l'interface
      document.querySelectorAll('.status-type-btn').forEach(b => {
        b.classList.remove('bg-[#00a884]');
        b.classList.add('bg-[#2a3942]');
      });
      btn.classList.remove('bg-[#2a3942]');
      btn.classList.add('bg-[#00a884]');
      
      // Afficher/masquer les formulaires
      document.querySelectorAll('.status-form').forEach(form => {
        form.classList.add('hidden');
      });
      document.getElementById(`${currentType}-status-form`).classList.remove('hidden');
    });
  });
  
  // Sélection de couleur
  document.querySelectorAll('.color-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedColor = btn.dataset.color;
      
      // Mettre à jour l'interface
      document.querySelectorAll('.color-btn').forEach(b => {
        b.classList.remove('border-white');
        b.classList.add('border-transparent');
      });
      btn.classList.remove('border-transparent');
      btn.classList.add('border-white');
    });
  });
  
  // Sélection d'image
  document.getElementById('select-image-btn').addEventListener('click', () => {
    document.getElementById('status-image').click();
  });
  
  document.getElementById('status-image').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        selectedImage = event.target.result;
        document.getElementById('preview-img').src = selectedImage;
        document.getElementById('image-preview').classList.remove('hidden');
      };
      reader.readAsDataURL(file);
    }
  });
  
  // Créer le statut
  document.getElementById('create-status-btn').addEventListener('click', () => {
    if (currentType === 'text') {
      const text = document.getElementById('status-text').value.trim();
      if (text) {
        createStatus(text, 'text', selectedColor);
        modal.remove();
        loadAndRenderStatuses();
      }
    } else if (currentType === 'image' && selectedImage) {
      createStatus(selectedImage, 'image');
      modal.remove();
      loadAndRenderStatuses();
    }
  });
  
  // Fermer en cliquant à l'extérieur
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });
}

function loadAndRenderStatuses() {
  const allStatuses = getAllStatuses();
  const myStatuses = getMyStatuses();
  
  // Mettre à jour mon statut
  const myStatusText = document.getElementById('my-status-text');
  if (myStatuses.length > 0) {
    const latestStatus = myStatuses[0];
    const timeAgo = getTimeAgo(latestStatus.createdAt);
    myStatusText.textContent = `${timeAgo}`;
  } else {
    myStatusText.textContent = 'Appuyez pour ajouter un statut';
  }
  
  // Afficher les statuts récents (pour l'instant, on simule avec des données)
  renderRecentStatuses();
}

function renderRecentStatuses() {
  const recentContainer = document.getElementById('recent-statuses');
  
  // Données simulées pour les statuts d'autres utilisateurs
  const mockStatuses = [
    {
      id: 1,
      userName: 'Khouss',
      avatar: generateInitialsAvatar('Khouss').dataUrl,
      timeAgo: 'il y a 2h',
      hasViewed: false
    },
    {
      id: 2,
      userName: 'Moussa',
      avatar: generateInitialsAvatar('Moussa').dataUrl,
      timeAgo: 'il y a 5h',
      hasViewed: true
    }
  ];
  
  recentContainer.innerHTML = mockStatuses.map(status => `
    <div class="flex items-center p-2 hover:bg-[#202c33] rounded-lg cursor-pointer transition-colors status-item" data-status-id="${status.id}">
      <div class="relative mr-4">
        <div class="w-12 h-12 rounded-full overflow-hidden border-2 ${status.hasViewed ? 'border-gray-600' : 'border-[#00a884]'}">
          <img src="${status.avatar}" alt="${status.userName}" class="w-full h-full object-cover">
        </div>
      </div>
      <div class="flex-1">
        <h3 class="text-white font-medium">${status.userName}</h3>
        <p class="text-gray-400 text-sm">${status.timeAgo}</p>
      </div>
    </div>
  `).join('');
  
  // Ajouter les événements de clic
  recentContainer.querySelectorAll('.status-item').forEach(item => {
    item.addEventListener('click', () => {
      const statusId = item.dataset.statusId;
      // Simuler la visualisation d'un statut
      showStatusViewer([{
        id: statusId,
        content: 'Statut de démonstration',
        type: 'text',
        backgroundColor: '#00a884',
        createdAt: new Date().toISOString()
      }], 0);
    });
  });
}

function showStatusViewer(statuses, currentIndex) {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black z-50 flex items-center justify-center';
  modal.id = 'status-viewer';
  
  const status = statuses[currentIndex];
  
  modal.innerHTML = `
    <div class="relative w-full h-full flex flex-col">
      <!-- Header -->
      <div class="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-black/50 to-transparent">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <button id="close-viewer" class="text-white mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
            <div class="w-8 h-8 rounded-full overflow-hidden mr-3">
              <img src="./src/assets/images/profile.jpeg" alt="Profile" class="w-full h-full object-cover">
            </div>
            <div>
              <h3 class="text-white font-medium">Mon statut</h3>
              <p class="text-gray-300 text-sm">${getTimeAgo(status.createdAt)}</p>
            </div>
          </div>
          <button id="delete-status" class="text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
        
        <!-- Progress bars -->
        <div class="flex gap-1 mt-4">
          ${statuses.map((_, index) => `
            <div class="flex-1 h-1 bg-white/30 rounded">
              <div class="h-full bg-white rounded transition-all duration-300 ${index <= currentIndex ? 'w-full' : 'w-0'}"></div>
            </div>
          `).join('')}
        </div>
      </div>
      
      <!-- Content -->
      <div class="flex-1 flex items-center justify-center" style="background-color: ${status.backgroundColor || '#000'}">
        ${status.type === 'text' 
          ? `<div class="text-white text-2xl font-medium text-center p-8">${status.content}</div>`
          : `<img src="${status.content}" alt="Status" class="max-w-full max-h-full object-contain">`
        }
      </div>
      
      <!-- Navigation -->
      <div class="absolute inset-0 flex">
        <div class="flex-1 cursor-pointer" id="prev-status"></div>
        <div class="flex-1 cursor-pointer" id="next-status"></div>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Événements
  document.getElementById('close-viewer').addEventListener('click', () => {
    modal.remove();
  });
  
  document.getElementById('delete-status').addEventListener('click', () => {
    if (confirm('Supprimer ce statut ?')) {
      deleteStatus(status.id);
      modal.remove();
      loadAndRenderStatuses();
    }
  });
  
  document.getElementById('prev-status').addEventListener('click', () => {
    if (currentIndex > 0) {
      modal.remove();
      showStatusViewer(statuses, currentIndex - 1);
    }
  });
  
  document.getElementById('next-status').addEventListener('click', () => {
    if (currentIndex < statuses.length - 1) {
      modal.remove();
      showStatusViewer(statuses, currentIndex + 1);
    } else {
      modal.remove();
    }
  });
  
  // Auto-advance après 5 secondes
  setTimeout(() => {
    if (document.getElementById('status-viewer')) {
      if (currentIndex < statuses.length - 1) {
        modal.remove();
        showStatusViewer(statuses, currentIndex + 1);
      } else {
        modal.remove();
      }
    }
  }, 5000);
}

function openCamera() {
  // Implémenter l'ouverture de la caméra pour les statuts
  console.log('Ouverture de la caméra pour statut');
}

function getTimeAgo(dateString) {
  const now = new Date();
  const date = new Date(dateString);
  const diffInMinutes = Math.floor((now - date) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'À l\'instant';
  if (diffInMinutes < 60) return `il y a ${diffInMinutes}min`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `il y a ${diffInHours}h`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  return `il y a ${diffInDays}j`;
}

export function hideStatusView() {
  const container = document.getElementById('status-container');
  if (container) {
    container.remove();
  }
  const chatList = document.getElementById('chat-list-container');
  if (chatList) {
    chatList.style.display = 'flex';
  }
}