import { generateRandomAvatar } from '../utils/helpers.js';

// Mock data for chats
const chats = [
  {
    id: 1,
    name: "Dev web mobile ODC App seul",
    lastMessage: "Vous: Fallou ya ngui may fenial li lay...",
    timestamp: "22:36",
    unreadCount: 0,
    avatar: generateRandomAvatar(),
    online: false
  },
  {
    id: 2,
    name: "Jeanne Young",
    lastMessage: "Wa ok",
    timestamp: "22:10",
    unreadCount: 2,
    avatar: generateRandomAvatar(),
    online: true
  },
  {
    id: 3,
    name: "Ngom Odc",
    lastMessage: "Thiey dama fateli rek",
    timestamp: "22:01",
    unreadCount: 0,
    avatar: generateRandomAvatar(),
    online: false
  },
  {
    id: 4,
    name: "AbdAllah (vous)",
    lastMessage: "Image",
    timestamp: "14:19",
    unreadCount: 0,
    avatar: generateRandomAvatar(),
    online: true
  }
];

// Mock contacts data
const contacts = [
  { id: 5, name: "Mariama Baldé", avatar: generateRandomAvatar(), online: true },
  { id: 6, name: "Ngom Odc", avatar: generateRandomAvatar(), online: false },
  { id: 7, name: "Jeanne Young", avatar: generateRandomAvatar(), online: true },
  { id: 8, name: "Dev web mobile ODC", avatar: generateRandomAvatar(), online: false }
];

function getAllChats() {
  return [...chats];
}

function getChatById(id) {
  return chats.find(chat => chat.id === id);
}

function searchChats(query) {
  if (!query) return getAllChats();
  
  return chats.filter(chat => 
    chat.name.toLowerCase().includes(query.toLowerCase()) || 
    chat.lastMessage.toLowerCase().includes(query.toLowerCase())
  );
}

function markAsRead(id) {
  const chatIndex = chats.findIndex(chat => chat.id === id);
  if (chatIndex !== -1) {
    chats[chatIndex].unreadCount = 0;
    return true;
  }
  return false;
}

function getAllContacts() {
  return [...contacts];
}

function searchContacts(query) {
  if (!query) return getAllContacts();
  
  return contacts.filter(contact => 
    contact.name.toLowerCase().includes(query.toLowerCase())
  );
}

function createNewChat(contact) {
  const newChat = {
    id: contact.id,
    name: contact.name,
    lastMessage: "",
    timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    unreadCount: 0,
    avatar: contact.avatar,
    online: contact.online
  };
  
  chats.unshift(newChat);
  return newChat;
}

export { getAllChats, getChatById, searchChats, markAsRead, getAllContacts, searchContacts, createNewChat };