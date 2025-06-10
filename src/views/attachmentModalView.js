import { 
  DocumentIcon, 
  PhotoIcon, 
  CameraIcon, 
  AudioIcon,
  ContactIcon,
  PollIcon,
  StickerIcon,
  EventIcon 
} from '../utils/icons.js';

// Définir les items du modal d'attachement
const attachmentItems = [
  { 
    icon: DocumentIcon,
    text: 'Document', 
    color: 'bg-[#5851D3]',
    action: 'document'
  },
  { 
    icon: PhotoIcon,
    text: 'Photos et vidéos', 
    color: 'bg-[#007BFC]',
    action: 'media'
  },
  { 
    icon: CameraIcon,
    text: 'Caméra', 
    color: 'bg-[#FF2E74]',
    action: 'camera'
  },
  { 
    icon: AudioIcon,
    text: 'Audio', 
    color: 'bg-[#FF8A2B]',
    action: 'audio'
  },
  { 
    icon: ContactIcon,
    text: 'Contact', 
    color: 'bg-[#0795DC]',
    action: 'contact'
  },
  { 
    icon: PollIcon,
    text: 'Sondage', 
    color: 'bg-[#FFB001]',
    action: 'poll'
  },
  { 
    icon: StickerIcon,
    text: 'Nouveau sticker', 
    color: 'bg-[#02A698]',
    action: 'sticker'
  },
  { 
    icon: EventIcon,
    text: 'Événement', 
    color: 'bg-[#EF426F]',
    action: 'event'
  }
];

export function renderAttachmentModal(position) {
  // Fermer le modal existant s'il y en a un
  const existingModal = document.getElementById('attachment-modal');
  if (existingModal) {
    existingModal.remove();
  }

  // Créer le nouveau modal
  const modal = document.createElement('div');
  modal.id = 'attachment-modal';
  modal.className = 'fixed bg-[#233138] rounded-lg shadow-lg z-50 p-1 grid grid-cols-1 gap-1 w-64';
  
  console.log('Modal element created:', modal);

  // Calculer la position
  const bottomSpace = window.innerHeight - position.y;
  const modalHeight = attachmentItems.length * 60 + 20;
  
  console.log('Position calculations:', {
    bottomSpace,
    modalHeight,
    windowHeight: window.innerHeight,
    positionY: position.y,
    positionX: position.x
  });

  if (bottomSpace < modalHeight) {
    modal.style.bottom = `${window.innerHeight - position.y + 10}px`;
    console.log('Positioning modal at bottom:', modal.style.bottom);
  } else {
    modal.style.top = `${position.y}px`;
    console.log('Positioning modal at top:', modal.style.top);
  }
  
  modal.style.left = `${position.x}px`;
  console.log('Final modal position:', {
    top: modal.style.top,
    bottom: modal.style.bottom,
    left: modal.style.left
  });

  modal.innerHTML = attachmentItems.map(item => `
    <div class="attachment-item flex items-center gap-3 p-2 hover:bg-[#182229] rounded-lg cursor-pointer transition-colors"
         data-action="${item.action}">
      <div class="w-8 h-8 rounded-full flex items-center justify-center text-white">
        <div class="w-5 h-5" style="color: ${getColorFromBgClass(item.color)}"> 
          ${item.icon}
        </div>
      </div>
      <span class="text-gray-200 text-sm">${item.text}</span>
    </div>
  `).join('');

  document.body.appendChild(modal);
  console.log('Modal appended to document body');

  // Ajouter les gestionnaires d'événements pour chaque item
  modal.querySelectorAll('.attachment-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      const action = item.dataset.action;
      handleAttachmentAction(action);
      hideAttachmentModal();
    });
  });

  // Gestionnaire d'événements pour fermer le modal
  setTimeout(() => {
    document.addEventListener('click', closeOnClickOutside);
  }, 100);
}

function handleAttachmentAction(action) {
  console.log('Action sélectionnée:', action);
  
  switch(action) {
    case 'document':
      openFileSelector(['application/pdf', '.doc', '.docx', '.txt', '.rtf']);
      break;
    case 'media':
      openFileSelector(['image/*', 'video/*']);
      break;
    case 'camera':
      openCamera();
      break;
    case 'audio':
      openFileSelector(['audio/*']);
      break;
    case 'contact':
      showContactSelector();
      break;
    case 'poll':
      showPollCreator();
      break;
    case 'sticker':
      showStickerSelector();
      break;
    case 'event':
      showEventCreator();
      break;
    default:
      console.log('Action non implémentée:', action);
  }
}

function openFileSelector(acceptedTypes) {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = acceptedTypes.join(',');
  input.multiple = true;
  
  input.onchange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      handleFileSelection(files);
    }
  };
  
  input.click();
}

function handleFileSelection(files) {
  console.log('Fichiers sélectionnés:', files);
  
  files.forEach(file => {
    const fileInfo = {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified
    };
    
    // Créer un aperçu du fichier
    createFilePreview(file, fileInfo);
  });
}

function createFilePreview(file, fileInfo) {
  const previewModal = document.createElement('div');
  previewModal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
  
  const isImage = file.type.startsWith('image/');
  const isVideo = file.type.startsWith('video/');
  
  previewModal.innerHTML = `
    <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold">Aperçu du fichier</h3>
        <button id="closePreview" class="text-gray-500 hover:text-gray-700">
          <i class='bx bx-x text-2xl'></i>
        </button>
      </div>
      
      <div class="mb-4">
        ${isImage ? `<img src="${URL.createObjectURL(file)}" alt="${file.name}" class="w-full h-48 object-cover rounded">` : 
          isVideo ? `<video src="${URL.createObjectURL(file)}" controls class="w-full h-48 rounded"></video>` :
          `<div class="w-full h-48 bg-gray-100 rounded flex items-center justify-center">
            <div class="text-center">
              <i class='bx bx-file text-4xl text-gray-400 mb-2'></i>
              <p class="text-sm text-gray-600">${file.name}</p>
            </div>
          </div>`
        }
      </div>
      
      <div class="text-sm text-gray-600 mb-4">
        <p><strong>Nom:</strong> ${fileInfo.name}</p>
        <p><strong>Taille:</strong> ${formatFileSize(fileInfo.size)}</p>
        <p><strong>Type:</strong> ${fileInfo.type || 'Inconnu'}</p>
      </div>
      
      <div class="flex gap-3 justify-end">
        <button id="cancelFile" class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
          Annuler
        </button>
        <button id="sendFile" class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
          Envoyer
        </button>
      </div>
    </div>
  `;
  
  document.body.appendChild(previewModal);
  
  // Gestionnaires d'événements
  document.getElementById('closePreview').onclick = () => {
    document.body.removeChild(previewModal);
  };
  
  document.getElementById('cancelFile').onclick = () => {
    document.body.removeChild(previewModal);
  };
  
  document.getElementById('sendFile').onclick = () => {
    sendFileMessage(file, fileInfo);
    document.body.removeChild(previewModal);
  };
}

function sendFileMessage(file, fileInfo) {
  // Ici vous pouvez implémenter l'envoi du fichier
  console.log('Envoi du fichier:', fileInfo);
  
  // Simuler l'envoi d'un message avec le fichier
  const messageContent = `📎 ${fileInfo.name} (${formatFileSize(fileInfo.size)})`;
  
  // Vous pouvez intégrer ceci avec votre MessageManager
  if (window.MessageManager) {
    // Ajouter le message avec le fichier
    // MessageManager.sendMessage(messageContent, 'file', fileInfo);
  }
  
  console.log('Fichier envoyé:', messageContent);
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function openCamera() {
  console.log('Ouverture de la caméra...');
  // Implémenter l'accès à la caméra
}

function showContactSelector() {
  console.log('Sélecteur de contact...');
  // Implémenter le sélecteur de contact
}

function showPollCreator() {
  console.log('Créateur de sondage...');
  // Implémenter le créateur de sondage
}

function showStickerSelector() {
  console.log('Sélecteur de stickers...');
  // Implémenter le sélecteur de stickers
}

function showEventCreator() {
  console.log('Créateur d\'événement...');
  // Implémenter le créateur d'événement
}

function closeOnClickOutside(e) {
  const modal = document.getElementById('attachment-modal');
  const attachBtn = document.getElementById('attach-btn');
  
  if (modal && !modal.contains(e.target) && 
      e.target !== attachBtn && 
      !e.target.closest('#attach-btn') &&
      !e.target.closest('#emoji-picker')) {
    hideAttachmentModal();
  }
}

export function hideAttachmentModal() {
  const modal = document.getElementById('attachment-modal');
  if (modal) {
    modal.remove();
    document.removeEventListener('click', closeOnClickOutside);
  }
}

// Ajouter cette fonction auxiliaire dans le même fichier
function getColorFromBgClass(bgClass) {
  // Extraire la couleur hex du bg-[#xxxxx]
  const colorMatch = bgClass.match(/#[0-9A-Fa-f]{6}/);
  return colorMatch ? colorMatch[0] : '#ffffff';
}