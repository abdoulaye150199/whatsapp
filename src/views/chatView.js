// Ajouter cette variable en haut du fichier avec les autres variables globales
let wasCanceled = false;

// Import EmojiPicker
import { EmojiPicker } from '../components/EmojiPicker.js';
import { renderChatOptionsModal } from './chatOptionsModalView.js';
import { MenuIcon, SearchIcon } from '../utils/icons.js';  // Ajoutez l'import des icônes

// Render the chat header with the active chat information
function renderChatHeader(chat) {
  const chatHeader = document.getElementById('chat-header');
  const activeChatName = document.getElementById('active-chat-name');
  const activeChatStatus = document.getElementById('active-chat-status');
  const activeChatAvatar = document.getElementById('active-chat-avatar');
  const headerRight = document.querySelector('.chat-header-right');
  
  chatHeader.classList.remove('hidden');
  activeChatName.textContent = chat.name;
  activeChatStatus.textContent = chat.online ? 'En ligne' : 'Hors ligne';
  activeChatAvatar.src = chat.avatar;

  if (headerRight) {
    headerRight.innerHTML = `
      <button class="search-btn p-2 hover:bg-[#374045] rounded-full">
        <div class="w-5 h-5 text-[#aebac1]">${SearchIcon}</div>
      </button>
      <button id="chat-options-btn" class="chat-options-btn p-2 hover:bg-[#374045] rounded-full">
        <div class="w-5 h-5 text-[#aebac1]">${MenuIcon}</div>
      </button>
    `;

    // Ajouter l'écouteur d'événements pour le bouton d'options
    const optionsBtn = headerRight.querySelector('.chat-options-btn');
    optionsBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const buttonRect = optionsBtn.getBoundingClientRect();
      const position = {
        x: window.innerWidth - buttonRect.right + buttonRect.width + 5,
        y: buttonRect.bottom + 5
      };

      renderChatOptionsModal(position);
    });
  }
}

// Render messages for a specific chat
function renderMessages(messages) {
  const messagesContainer = document.getElementById('messages-container');
  const messagesList = document.getElementById('messages-list');
  
  messagesContainer.classList.remove('hidden');
  messagesList.innerHTML = '';
  
  // Group messages by date (in a real app, you'd group by actual dates)
  const today = new Date().toLocaleDateString();
  
  // Add date separator
  const dateSeparator = document.createElement('div');
  dateSeparator.className = 'flex justify-center my-4';
  
  const dateElement = document.createElement('div');
  dateElement.className = 'bg-[#182229] text-[#8696a0] text-xs px-3 py-1 rounded-md';
  dateElement.textContent = 'AUJOURD\'HUI';
  
  dateSeparator.appendChild(dateElement);
  messagesList.appendChild(dateSeparator);
  
  // Add messages
  messages.forEach(message => {
    const messageElement = createMessageElement(message);
    messagesList.appendChild(messageElement);
  });
  
  // Scroll to bottom
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
  
  // Show message input
  document.getElementById('message-input-container').classList.remove('hidden');
  
  // Hide welcome screen
  document.getElementById('welcome-screen').classList.add('hidden');
}

// Create a single message element
function createMessageElement(message) {
  const messageElement = document.createElement('div');
  messageElement.className = `flex ${message.isMe ? 'justify-end' : 'justify-start'} mb-4`;
  
  const messageBubble = document.createElement('div');
  messageBubble.className = `max-w-xs md:max-w-md rounded-lg px-4 py-2 ${
    message.isMe ? 'bg-[#005c4b] rounded-tr-none' : 'bg-[#202c33] rounded-tl-none'
  }`;
  
  if (message.isImage) {
    const imageContainer = document.createElement('div');
    imageContainer.className = 'w-64 h-48 bg-gray-700 rounded overflow-hidden flex items-center justify-center';
    
    const imageIcon = document.createElement('span');
    imageIcon.className = 'text-gray-400';
    imageIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>';
    
    imageContainer.appendChild(imageIcon);
    messageBubble.appendChild(imageContainer);
  } else if (message.isVoice) {
    const voiceContainer = document.createElement('div');
    voiceContainer.className = 'flex items-center gap-2';
    
    const playButton = document.createElement('button');
    playButton.className = 'text-white hover:text-gray-300';
    playButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>';
    
    const waveform = document.createElement('div');
    waveform.className = 'h-8 w-32 bg-[#2a3942] rounded-lg flex items-center justify-center';
    waveform.innerHTML = '<div class="flex gap-1 items-center">' + 
      Array.from({length: 20}, () => '<div class="w-1 bg-gray-400 rounded" style="height: ' + (Math.random() * 20 + 5) + 'px"></div>').join('') +
      '</div>';
    
    const duration = document.createElement('span');
    duration.className = 'text-sm text-gray-400';
    duration.textContent = message.duration || '00:00';

    // Créer un élément audio caché
    const audioElement = document.createElement('audio');
    if (message.audioBlob instanceof Blob) {
      const audioUrl = URL.createObjectURL(message.audioBlob);
      audioElement.src = audioUrl;
      audioElement.preload = 'metadata';
      
      // Nettoyer l'URL lorsque l'élément est supprimé
      messageElement.addEventListener('remove', () => {
        URL.revokeObjectURL(audioUrl);
      });
    }

    let isPlaying = false;

    // Arrêter tous les autres audios avant d'en jouer un nouveau
    playButton.addEventListener('click', () => {
      const allAudioElements = document.querySelectorAll('audio');
      allAudioElements.forEach(audio => {
        if (audio !== audioElement && !audio.paused) {
          audio.pause();
          audio.currentTime = 0;
        }
      });

      // Arrêter tous les autres boutons de lecture
      const allPlayButtons = document.querySelectorAll('.voice-play-btn');
      allPlayButtons.forEach(btn => {
        if (btn !== playButton) {
          btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>';
        }
      });

      if (isPlaying) {
        audioElement.pause();
        audioElement.currentTime = 0;
        playButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>';
        isPlaying = false;
      } else {
        audioElement.play().then(() => {
          playButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>';
          isPlaying = true;
        }).catch(error => {
          console.error('Erreur lors de la lecture audio:', error);
          alert('Impossible de lire l\'audio');
        });
      }
    });

    audioElement.addEventListener('ended', () => {
      isPlaying = false;
      playButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>';
    });

    // Ajouter une classe pour identifier les boutons de lecture
    playButton.classList.add('voice-play-btn');

    voiceContainer.appendChild(playButton);
    voiceContainer.appendChild(waveform);
    voiceContainer.appendChild(duration);
    messageBubble.appendChild(voiceContainer);
  } else {
    const messageText = document.createElement('p');
    messageText.className = 'text-white';
    messageText.textContent = message.text;
    messageBubble.appendChild(messageText);
  }
  
  const timeStamp = document.createElement('span');
  timeStamp.className = 'text-xs text-gray-400 ml-2 self-end';
  timeStamp.textContent = message.timestamp;
  
  messageBubble.appendChild(timeStamp);
  messageElement.appendChild(messageBubble);
  
  return messageElement;
}

// Add a new message to the chat
function addMessageToChat(message) {
  const messagesList = document.getElementById('messages-list');
  const messageElement = createMessageElement(message);
  messagesList.appendChild(messageElement);
  
  // Scroll to bottom
  const messagesContainer = document.getElementById('messages-container');
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

let mediaRecorder = null;
let audioChunks = [];
let isRecording = false;
let recordingStartTime = null;
let emojiPicker = null;

// Initialize the message input and voice recording
function initMessageInput(onSendMessage) {
  const messageInput = document.getElementById('message-input');
  const voiceBtn = document.getElementById('voice-btn');
  const emojiBtn = document.getElementById('emoji-btn');
  const messageInputContainer = document.getElementById('message-input-container');
  let recordingTimer = null;

  // Initialize emoji picker
  if (!emojiPicker) {
    emojiPicker = new EmojiPicker();
    const emojiPickerElement = emojiPicker.create();
    document.body.appendChild(emojiPickerElement);
  }

  // Emoji button click handler
  emojiBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    emojiPicker.toggle((emoji) => {
      const currentValue = messageInput.value;
      const cursorPosition = messageInput.selectionStart;
      const newValue = currentValue.slice(0, cursorPosition) + emoji + currentValue.slice(cursorPosition);
      messageInput.value = newValue;
      messageInput.focus();
      messageInput.setSelectionRange(cursorPosition + emoji.length, cursorPosition + emoji.length);
      updateButton(newValue);
    });
  });

  async function handleVoiceRecord(e) {
    try {
        if (!isRecording) {
            // Démarrer l'enregistrement
            const stream = await navigator.mediaDevices.getUserMedia({ 
              audio: {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true,
                sampleRate: 44100
              } 
            });
            
            // Utiliser un format audio plus compatible
            const options = {
              mimeType: 'audio/webm;codecs=opus'
            };
            
            // Fallback si webm n'est pas supporté
            if (!MediaRecorder.isTypeSupported(options.mimeType)) {
              options.mimeType = 'audio/mp4';
              if (!MediaRecorder.isTypeSupported(options.mimeType)) {
                options.mimeType = 'audio/wav';
              }
            }
            
            mediaRecorder = new MediaRecorder(stream, options);
            audioChunks = [];
            isRecording = true;
            recordingStartTime = Date.now();
            wasCanceled = false;

            // Changer l'apparence pendant l'enregistrement
            messageInputContainer.innerHTML = `
              <div class="flex items-center w-full bg-[#2a3942] rounded-lg px-4 py-2">
                <div class="flex-1 flex items-center">
                  <div class="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-3"></div>
                  <span class="text-gray-400" id="recording-timer">0:00</span>
                </div>
                <div class="flex items-center gap-4">
                  <button id="cancel-record" class="text-gray-400 hover:text-red-500">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <button id="send-record" class="text-gray-400 hover:text-green-500">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                </div>
              </div>
            `;

            // Collecter l'audio
            mediaRecorder.addEventListener("dataavailable", (event) => {
              if (event.data.size > 0) {
                audioChunks.push(event.data);
              }
            });

            mediaRecorder.addEventListener("stop", () => {
                const tracks = stream.getTracks();
                tracks.forEach(track => track.stop());

                if (!wasCanceled && audioChunks.length > 0) {
                    const audioBlob = new Blob(audioChunks, { type: mediaRecorder.mimeType });
                    const duration = getDuration(recordingStartTime);
                    onSendMessage("Message vocal", true, duration, audioBlob);
                }

                // Réinitialiser pour permettre un nouvel enregistrement
                resetRecording();
            });

            // Modifier les écouteurs d'événements des boutons
            const cancelBtn = document.getElementById('cancel-record');
            const sendBtn = document.getElementById('send-record');

            cancelBtn.addEventListener('click', () => {
                wasCanceled = true;
                if (mediaRecorder && mediaRecorder.state === 'recording') {
                    mediaRecorder.stop();
                }
            });

            sendBtn.addEventListener('click', () => {
                wasCanceled = false;
                if (mediaRecorder && mediaRecorder.state === 'recording') {
                    mediaRecorder.stop();
                }
            });

            // Démarrer le timer
            let seconds = 0;
            recordingTimer = setInterval(() => {
              seconds++;
              const minutes = Math.floor(seconds / 60);
              const remainingSeconds = seconds % 60;
              const timerElement = document.getElementById('recording-timer');
              if (timerElement) {
                timerElement.textContent = 
                  `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
              }
            }, 1000);

            // Démarrer l'enregistrement
            mediaRecorder.start(100); // Collecter les données toutes les 100ms
        }
    } catch (error) {
        console.error("Erreur d'accès au microphone:", error);
        alert("Impossible d'accéder au microphone. Vérifiez les permissions.");
        resetRecording();
    }
  }

  function attachInputListeners() {
    const messageInput = document.getElementById('message-input');
    const voiceBtn = document.getElementById('voice-btn');
    const emojiBtn = document.getElementById('emoji-btn');

    if (!messageInput || !voiceBtn || !emojiBtn) return;

    // Définir les fonctions de gestion d'événements
    function handleInput() {
      updateButton(messageInput.value);
    }

    function handleKeyPress(event) {
      if (event.key === 'Enter' && messageInput.value.trim() !== '') {
        onSendMessage(messageInput.value);
        messageInput.value = '';
        updateButton('');
      }
    }

    // Ajouter les nouveaux écouteurs d'événements
    messageInput.addEventListener('input', handleInput);
    messageInput.addEventListener('keypress', handleKeyPress);

    // Réattacher l'événement emoji
    emojiBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      emojiPicker.toggle((emoji) => {
        const currentValue = messageInput.value;
        const cursorPosition = messageInput.selectionStart;
        const newValue = currentValue.slice(0, cursorPosition) + emoji + currentValue.slice(cursorPosition);
        messageInput.value = newValue;
        messageInput.focus();
        messageInput.setSelectionRange(cursorPosition + emoji.length, cursorPosition + emoji.length);
        updateButton(newValue);
      });
    });

    // État initial du bouton
    updateButton(messageInput.value);
  }

  function resetRecording() {
    isRecording = false;
    clearInterval(recordingTimer);
    
    // Arrêter le stream audio
    if (mediaRecorder && mediaRecorder.stream) {
        mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }
    
    // Réinitialiser l'interface
    messageInputContainer.innerHTML = originalInputHTML;
    
    // Recréer et réattacher l'emoji picker
    if (emojiPicker) {
      const emojiPickerElement = emojiPicker.create();
      document.body.appendChild(emojiPickerElement);
    }
    
    // Réattacher les écouteurs d'événements
    attachInputListeners();
    
    // Réinitialiser les variables
    mediaRecorder = null;
    audioChunks = [];
    wasCanceled = false;
  }

  // Sauvegarder le HTML original
  const originalInputHTML = messageInputContainer.innerHTML;
  
  // Fonction pour mettre à jour le bouton
  function updateButton(text) {
    const voiceBtn = document.getElementById('voice-btn');
    if (!voiceBtn) return;

    if (text.trim().length > 0) {
      // Changer en icône d'envoi
      voiceBtn.innerHTML = `
        <div class="w-6 h-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </div>
      `;
      
      // Supprimer l'ancien écouteur d'événement
      voiceBtn.removeEventListener('click', handleVoiceRecord);
      
      // Ajouter le nouvel écouteur pour l'envoi
      voiceBtn.onclick = () => {
        const messageInput = document.getElementById('message-input');
        if (messageInput && messageInput.value.trim()) {
          onSendMessage(messageInput.value);
          messageInput.value = '';
          updateButton(''); // Remettre l'icône micro
        }
      };
    } else {
      // Remettre l'icône du microphone
      voiceBtn.innerHTML = `
        <div class="w-6 h-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
            <line x1="12" y1="19" x2="12" y2="23"></line>
            <line x1="8" y1="23" x2="16" y2="23"></line>
          </svg>
        </div>
      `;
      
      // Supprimer l'ancien écouteur onclick
      voiceBtn.onclick = null;
      
      // Ajouter l'écouteur pour l'enregistrement vocal
      voiceBtn.addEventListener('click', handleVoiceRecord);
    }
  }

  // Attacher les écouteurs d'événements initiaux
  attachInputListeners();

  // État initial : icône micro
  updateButton('');
}

// Helper function to get duration
function getDuration(startTime) {
  const duration = Math.floor((Date.now() - startTime) / 1000);
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Export all necessary functions
export {
  renderChatHeader,
  renderMessages,
  createMessageElement,
  addMessageToChat,
  initMessageInput
};