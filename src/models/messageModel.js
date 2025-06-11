import { updateLastMessage, createNewChat, getAllChats, getChatById } from './chatModel.js';

// Define API_URL constant
const API_URL = 'http://localhost:3000';

// Initialiser un objet vide pour les messages
let messages = {};

// Charger les messages depuis le localStorage
function loadMessages() {
  const savedMessages = localStorage.getItem('whatsapp_messages');
  messages = savedMessages ? JSON.parse(savedMessages) : {};
}

// Sauvegarder les messages dans le localStorage
function saveMessages() {
  localStorage.setItem('whatsapp_messages', JSON.stringify(messages));
}

function getMessagesByChatId(chatId) {
  loadMessages();
  return messages[chatId] || [];
}

async function addMessage(chatId, text, isMe = true, isVoice = false, duration = null, audioBlob = null) {
  if (!chatId) {
    console.error('ChatId is required');
    return null;
  }

  loadMessages();
  
  try {
    let chat = await getChatById(chatId);
    
    if (!chat) {
      // Créer un nouveau chat si nécessaire
      chat = await createNewChat({
        id: chatId,
        name: 'New Chat',
        status: "Hey! J'utilise WhatsApp"
      });
    }

    const newMessage = {
      id: Date.now(),
      chatId,
      text,
      timestamp: new Date().toLocaleTimeString('fr-FR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      isMe,
      isVoice,
      duration,
      audioUrl: audioBlob ? URL.createObjectURL(audioBlob) : null
    };

    if (!messages[chatId]) {
      messages[chatId] = [];
    }
    
    messages[chatId].push(newMessage);
    saveMessages();

    // Mettre à jour le dernier message
    if (chat) {
      await updateLastMessage(chatId, isVoice ? "Message vocal" : text);
    }

    return newMessage;
  } catch (error) {
    console.error('Error adding message:', error);
    // Sauvegarder quand même le message localement
    const newMessage = {
      id: Date.now(),
      chatId,
      text,
      timestamp: new Date().toLocaleTimeString('fr-FR'),
      isMe,
      isVoice,
      duration,
      audioUrl: audioBlob ? URL.createObjectURL(audioBlob) : null
    };

    if (!messages[chatId]) {
      messages[chatId] = [];
    }
    
    messages[chatId].push(newMessage);
    saveMessages();
    
    return newMessage;
  }
}

export {
  getMessagesByChatId,
  addMessage
};