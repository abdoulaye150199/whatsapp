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
  newChatBtn.addEventListener('click', () => {
    renderNewDiscussionView(handleNewChat);
  });
}

function handleNewChat(contact) {
  const newChat = createNewChat(contact);
  updateChatInList(newChat);
  hideNewDiscussionView();
  handleChatClick(newChat);
}
function handleChatClick(chat) {
  if (chat.unreadCount > 0) {
    markAsRead(chat.id);
    updateChatInList(getChatById(chat.id));
  }

  activeChat = chat;
  renderChatHeader(chat);

  const messages = getMessagesByChatId(chat.id);
  renderMessages(messages);
}

function initSearch() {
  const searchInput = document.getElementById('search-input');
  
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim();
    const filteredChats = searchChats(query);
    renderChatList(filteredChats, handleChatClick);
  });
}

function handleSendMessage(text, isVoice = false, duration = null, audioBlob = null) {
  if (!activeChat) return;
  
  const newMessage = addMessage(activeChat.id, text, true, isVoice, duration, audioBlob);
  
  addMessageToChat(newMessage);

  const updatedChat = {
    ...activeChat,
    lastMessage: isVoice ? "Message vocal" : text,
    timestamp: newMessage.timestamp
  };
  updateChatInList(updatedChat);

  simulateReply(activeChat.id);
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