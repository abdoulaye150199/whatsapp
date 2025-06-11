import { getAllChats, getChatById, searchChats, markAsRead, createNewChat } from '../models/chatModel.js';
import { getMessagesByChatId, addMessage } from '../models/messageModel.js';
import { renderChatList, updateChatInList } from '../views/chatListView.js';
import { 
  renderChatHeader, 
  renderMessages, 
  addMessageToChat, 
  initMessageInput 
} from '../views/chatView.js';
import { renderNewDiscussionView, hideNewDiscussionView } from '../views/newDiscussionView.js';

let activeChat = null;

function initChat() {
  const chats = getAllChats();
  renderChatList(chats, handleChatClick);

  initSearch();
  initMessageInput(handleSendMessage);
  
  initNewChatButton();
}

function initNewChatButton() {
  const newChatBtn = document.getElementById('new-chat-btn');
  if (!newChatBtn) return;

  newChatBtn.addEventListener('click', async () => {
    try {
      await renderNewDiscussionView(handleNewChat);
    } catch (error) {
      console.error('Error opening new discussion view:', error);
    }
  });
}

async function handleNewChat(contact) {
  try {
    if (!contact || !contact.id) {
      console.error('Contact invalide');
      return;
    }

    // Créer ou récupérer le chat
    const chat = await createNewChat(contact);
    if (!chat) {
      console.error('Erreur lors de la création du chat');
      return;
    }

    // Masquer la vue des nouvelles discussions
    hideNewDiscussionView();

    // Afficher les éléments de chat
    const messagesContainer = document.getElementById('messages-container');
    const welcomeScreen = document.getElementById('welcome-screen');
    const chatHeader = document.getElementById('chat-header');
    const messageInput = document.getElementById('message-input-container');

    if (messagesContainer && welcomeScreen && chatHeader && messageInput) {
      welcomeScreen.classList.add('hidden');
      messagesContainer.classList.remove('hidden');
      chatHeader.classList.remove('hidden');
      messageInput.classList.remove('hidden');
    }

    // Définir le chat actif
    activeChat = chat;
    window.activeChat = chat;

    // Mettre à jour l'interface
    renderChatHeader(chat);
    renderMessages(chat.messages || []);

    // Mettre à jour la liste des chats
    const chats = getAllChats();
    renderChatList(chats, handleChatClick);

  } catch (error) {
    console.error('Erreur handleNewChat:', error);
  }
}

function handleChatClick(chat) {
  if (!chat || !chat.id) {
    console.error('Invalid chat object');
    return;
  }

  // Afficher les éléments de chat
  const messagesContainer = document.getElementById('messages-container');
  const welcomeScreen = document.getElementById('welcome-screen');
  const chatHeader = document.getElementById('chat-header');
  const messageInput = document.getElementById('message-input-container');

  if (messagesContainer && welcomeScreen && chatHeader && messageInput) {
    welcomeScreen.classList.add('hidden');
    messagesContainer.classList.remove('hidden');
    chatHeader.classList.remove('hidden');
    messageInput.classList.remove('hidden');
  }

  // Gérer les messages non lus
  if (chat.unreadCount > 0) {
    markAsRead(chat.id);
    updateChatInList(getChatById(chat.id));
  }

  // Mettre à jour le chat actif
  activeChat = chat;
  window.activeChat = chat;

  // Mettre à jour l'interface
  renderChatHeader(chat);
  const messages = getMessagesByChatId(chat.id);
  renderMessages(messages || []);
}

function initSearch() {
  const searchInput = document.getElementById('search-input');
  
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim();
    const filteredChats = searchChats(query);
    renderChatList(filteredChats, handleChatClick);
  });
}

async function handleSendMessage(text) {
  if (!activeChat || !activeChat.id) {
    console.error('No active chat or invalid chat ID');
    return;
  }
  
  try {
    const message = await addMessage(activeChat.id, text);
    if (message) {
      addMessageToChat(message);
      const chats = await getAllChats();
      renderChatList(chats, handleChatClick);
      
      // Simuler une réponse
      simulateReply(activeChat.id);
    }
  } catch (error) {
    console.error('Error sending message:', error);
  }
}

function simulateReply(chatId) {
  setTimeout(() => {
    if (activeChat && activeChat.id === chatId) {
      const replies = [
        "D'accord, je comprends.",
        "Merci pour l'information.",
        "Intéressant, dis-m'en plus.",
        "Je suis d'accord avec toi.",
        "On peut en discuter plus tard?",
        "👍",
        "😊",
        "Je vais y réfléchir."
      ];
      
      const randomReply = replies[Math.floor(Math.random() * replies.length)];
      const replyMessage = addMessage(chatId, randomReply, false);
      addMessageToChat(replyMessage);
      
      const updatedChat = getChatById(chatId);
      updateChatInList({
        ...updatedChat,
        lastMessage: randomReply,
        timestamp: replyMessage.timestamp
      });
    }
  }, 2000);
}

export { initChat };