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

// Store the currently active chat
let activeChat = null;

// Initialize the chat functionality
function initChat() {
  // Render all chats
  const chats = getAllChats();
  renderChatList(chats, handleChatClick);
  
  // Initialize search functionality
  initSearch();
  
  // Initialize message input
  initMessageInput(handleSendMessage);
  
  // Initialize new chat button
  initNewChatButton();
}

// Initialize new chat button
function initNewChatButton() {
  const newChatBtn = document.getElementById('new-chat-btn');
  newChatBtn.addEventListener('click', () => {
    renderNewDiscussionView(handleNewChat);
  });
}

// Handle new chat creation
function handleNewChat(contact) {
  const newChat = createNewChat(contact);
  updateChatInList(newChat);
  hideNewDiscussionView();
  handleChatClick(newChat);
}

// Handle chat click
function handleChatClick(chat) {
  // Mark chat as read
  if (chat.unreadCount > 0) {
    markAsRead(chat.id);
    updateChatInList(getChatById(chat.id));
  }
  
  // Set active chat
  activeChat = chat;
  
  // Render chat header
  renderChatHeader(chat);
  
  // Render messages
  const messages = getMessagesByChatId(chat.id);
  renderMessages(messages);
}

// Handle search functionality
function initSearch() {
  const searchInput = document.getElementById('search-input');
  
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim();
    const filteredChats = searchChats(query);
    renderChatList(filteredChats, handleChatClick);
  });
}

// Handle sending a message
function handleSendMessage(text, isVoice = false, duration = null) {
  if (!activeChat) return;
  
  // Add message to the model
  const newMessage = addMessage(activeChat.id, text, true, isVoice, duration);
  
  // Update the view
  addMessageToChat(newMessage);
  
  // Update chat list with new last message
  const updatedChat = {
    ...activeChat,
    lastMessage: isVoice ? "Message vocal" : text,
    timestamp: newMessage.timestamp
  };
  updateChatInList(updatedChat);
  
  // Simulate a reply after a short delay
  simulateReply(activeChat.id);
}

// Simulate a reply from the other person
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