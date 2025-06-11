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
import { handleFileUpload, formatFileSize } from './chatView2.js';

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
  const existingModal = document.getElementById('attachment-modal');
  if (existingModal) {
    existingModal.remove();
  }

  const modal = document.createElement('div');
  modal.id = 'attachment-modal';
  modal.className = 'fixed bg-[#233138] rounded-lg shadow-lg z-50 p-1 grid grid-cols-1 gap-1 w-64';
  
  const bottomSpace = window.innerHeight - position.y;
  const modalHeight = attachmentItems.length * 60 + 20;

  if (bottomSpace < modalHeight) {
    modal.style.bottom = `${window.innerHeight - position.y + 10}px`;
  } else {
    modal.style.top = `${position.y}px`;
  }
  
  modal.style.left = `${position.x}px`;

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

  modal.querySelectorAll('.attachment-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      const action = item.dataset.action;
      handleAttachmentAction(action);
      hideAttachmentModal();
    });
  });

  setTimeout(() => {
    document.addEventListener('click', closeOnClickOutside);
  }, 100);
}

function handleAttachmentAction(action) {
  console.log('Action sélectionnée:', action);
  
  switch(action) {
    case 'document':
      openFileSelector(['application/pdf', '.doc', '.docx', '.txt', '.rtf', '.xls', '.xlsx', '.ppt', '.pptx']);
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
    createFilePreview(file);
  });
}

function createFilePreview(file) {
  const previewModal = document.createElement('div');
  previewModal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
  previewModal.id = 'file-preview-modal';
  
  const isImage = file.type.startsWith('image/');
  const isVideo = file.type.startsWith('video/');
  const isAudio = file.type.startsWith('audio/');
  
  let previewContent = '';
  
  if (isImage) {
    previewContent = `<img src="${URL.createObjectURL(file)}" alt="${file.name}" class="max-w-full max-h-64 object-contain rounded">`;
  } else if (isVideo) {
    previewContent = `<video src="${URL.createObjectURL(file)}" controls class="max-w-full max-h-64 rounded"></video>`;
  } else if (isAudio) {
    previewContent = `
      <div class="w-full bg-gray-100 rounded-lg p-4 flex items-center justify-center">
        <div class="text-center">
          <svg class="w-16 h-16 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-2v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z"></path>
          </svg>
          <p class="text-sm text-gray-600">${file.name}</p>
          <audio src="${URL.createObjectURL(file)}" controls class="mt-2"></audio>
        </div>
      </div>
    `;
  } else {
    previewContent = `
      <div class="w-full bg-gray-100 rounded-lg p-8 flex items-center justify-center">
        <div class="text-center">
          <svg class="w-16 h-16 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <p class="text-sm text-gray-600">${file.name}</p>
        </div>
      </div>
    `;
  }
  
  previewModal.innerHTML = `
    <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold text-gray-800">Aperçu du fichier</h3>
        <button id="closePreview" class="text-gray-500 hover:text-gray-700">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      
      <div class="mb-4">
        ${previewContent}
      </div>
      
      <div class="text-sm text-gray-600 mb-4 space-y-1">
        <p><strong>Nom:</strong> ${file.name}</p>
        <p><strong>Taille:</strong> ${formatFileSize(file.size)}</p>
        <p><strong>Type:</strong> ${file.type || 'Inconnu'}</p>
      </div>
      
      <div class="mb-4">
        <textarea 
          id="file-caption" 
          placeholder="Ajouter une légende (optionnel)"
          class="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:border-green-500"
          rows="3"
        ></textarea>
      </div>
      
      <div class="flex gap-3 justify-end">
        <button id="cancelFile" class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
          Annuler
        </button>
        <button id="sendFile" class="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
          Envoyer
        </button>
      </div>
    </div>
  `;
  
  document.body.appendChild(previewModal);
  
  // Event listeners
  document.getElementById('closePreview').onclick = () => {
    URL.revokeObjectURL(URL.createObjectURL(file));
    document.body.removeChild(previewModal);
  };
  
  document.getElementById('cancelFile').onclick = () => {
    URL.revokeObjectURL(URL.createObjectURL(file));
    document.body.removeChild(previewModal);
  };
  
  document.getElementById('sendFile').onclick = () => {
    const caption = document.getElementById('file-caption').value.trim();
    sendFileMessage(file, caption);
    URL.revokeObjectURL(URL.createObjectURL(file));
    document.body.removeChild(previewModal);
  };

  // Close on outside click
  previewModal.addEventListener('click', (e) => {
    if (e.target === previewModal) {
      URL.revokeObjectURL(URL.createObjectURL(file));
      document.body.removeChild(previewModal);
    }
  });
}

function sendFileMessage(file, caption = '') {
  console.log('Envoi du fichier:', file.name, 'avec légende:', caption);
  
  // Get the active chat ID (you'll need to implement this)
  const activeChatId = getActiveChatId();
  if (!activeChatId) {
    console.error('Aucun chat actif');
    return;
  }

  // Create file message
  const reader = new FileReader();
  reader.onload = (e) => {
    const messageData = {
      id: Date.now(),
      chatId: activeChatId,
      text: caption || file.name,
      timestamp: new Date().toLocaleTimeString('fr-FR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      isMe: true,
      isFile: true,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      fileData: e.target.result
    };

    // Add specific properties based on file type
    if (file.type.startsWith('image/')) {
      messageData.isImage = true;
      messageData.imageData = e.target.result;
    } else if (file.type.startsWith('video/')) {
      messageData.isVideo = true;
      messageData.videoData = e.target.result;
    } else if (file.type.startsWith('audio/')) {
      messageData.isAudio = true;
      messageData.audioData = e.target.result;
    }

    // Send the message (you'll need to implement this)
    sendMessage(messageData);
  };
  
  reader.readAsDataURL(file);
}

function getActiveChatId() {
  // This should return the currently active chat ID
  // You'll need to implement this based on your app structure
  return window.activeChatId || null;
}

function sendMessage(messageData) {
  // This should send the message using your existing message system
  // You'll need to integrate this with your chatController
  console.log('Sending message:', messageData);
  
  // Example integration:
  if (window.chatController && window.chatController.sendMessage) {
    window.chatController.sendMessage(messageData);
  }
}

function openCamera() {
  console.log('Ouverture de la caméra...');
  
  // Create camera modal
  const cameraModal = document.createElement('div');
  cameraModal.className = 'fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50';
  cameraModal.id = 'camera-modal';
  
  cameraModal.innerHTML = `
    <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold">Caméra</h3>
        <button id="closeCameraModal" class="text-gray-500 hover:text-gray-700">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      
      <div class="mb-4">
        <video id="cameraVideo" class="w-full h-64 bg-gray-200 rounded" autoplay></video>
        <canvas id="cameraCanvas" class="hidden"></canvas>
      </div>
      
      <div class="flex gap-3 justify-center">
        <button id="takePicture" class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          Prendre une photo
        </button>
      </div>
    </div>
  `;
  
  document.body.appendChild(cameraModal);
  
  // Initialize camera
  initCamera();
}

async function initCamera() {
  const video = document.getElementById('cameraVideo');
  const canvas = document.getElementById('cameraCanvas');
  const takePictureBtn = document.getElementById('takePicture');
  const closeCameraBtn = document.getElementById('closeCameraModal');
  
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    
    takePictureBtn.addEventListener('click', () => {
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw video frame to canvas
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);
      
      // Convert to blob
      canvas.toBlob((blob) => {
        const file = new File([blob], `photo_${Date.now()}.jpg`, { type: 'image/jpeg' });
        
        // Stop camera stream
        stream.getTracks().forEach(track => track.stop());
        
        // Close camera modal
        document.body.removeChild(document.getElementById('camera-modal'));
        
        // Show file preview
        createFilePreview(file);
      }, 'image/jpeg', 0.9);
    });
    
    closeCameraBtn.addEventListener('click', () => {
      stream.getTracks().forEach(track => track.stop());
      document.body.removeChild(document.getElementById('camera-modal'));
    });
    
  } catch (error) {
    console.error('Erreur d\'accès à la caméra:', error);
    alert('Impossible d\'accéder à la caméra. Vérifiez les permissions.');
    document.body.removeChild(document.getElementById('camera-modal'));
  }
}

function showContactSelector() {
  console.log('Sélecteur de contact...');
  showNotification('Fonctionnalité en cours de développement', 'info');
}

function showPollCreator() {
  console.log('Créateur de sondage...');
  showNotification('Fonctionnalité en cours de développement', 'info');
}

function showStickerSelector() {
  console.log('Sélecteur de stickers...');
  showNotification('Fonctionnalité en cours de développement', 'info');
}

function showEventCreator() {
  console.log('Créateur d\'événement...');
  showNotification('Fonctionnalité en cours de développement', 'info');
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

function getColorFromBgClass(bgClass) {
  const colorMatch = bgClass.match(/#[0-9A-Fa-f]{6}/);
  return colorMatch ? colorMatch[0] : '#ffffff';
}