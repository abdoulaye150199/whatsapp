import { 
  MessageIcon, 
  CallIcon, 
  StatusIcon, 
  ChannelsIcon, 
  CommunitiesIcon, 
  SettingsIcon, 
  SearchIcon, 
  MenuIcon, 
  NewChatIcon, 
  LockIcon, 
  EmojiIcon, 
  AttachIcon, 
  MicIcon,
  SendIcon 
} from './icons.js';
import { generateInitialsAvatar } from './avatarGenerator.js';

// Generate a random avatar URL for a user
function generateRandomAvatar(name = 'User') {
  return generateInitialsAvatar(name);
}

// Format a date for chat
function formatDate(date) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const yesterday = today - 86400000;
  
  const messageDate = new Date(date).getTime();
  
  if (messageDate >= today) {
    return 'Aujourd\'hui';
  } else if (messageDate >= yesterday) {
    return 'Hier';
  } else {
    return new Date(date).toLocaleDateString('fr-FR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: '2-digit' 
    });
  }
}

// Get short time (HH:MM) from date
function formatTime(date) {
  return new Date(date).toLocaleTimeString('fr-FR', { 
    hour: '2-digit', 
    minute: '2-digit'
  });
}

// Function to render icons in the application
export function renderIcons() {
  // Navigation icons
  document.getElementById('status-btn').querySelector('div').innerHTML = StatusIcon;
  document.getElementById('channels-btn').querySelector('div').innerHTML = ChannelsIcon;
  document.getElementById('chats-btn').querySelector('div').innerHTML = MessageIcon;
  document.getElementById('communities-btn').querySelector('div').innerHTML = CommunitiesIcon;
  document.getElementById('settings-btn').querySelector('div').innerHTML = SettingsIcon;
  
  // Header icons
  document.getElementById('new-chat-btn').querySelector('div').innerHTML = NewChatIcon;
  document.getElementById('menu-btn').querySelector('div').innerHTML = MenuIcon;
  
  // Search icon
  document.getElementById('search-container').querySelector('span div').innerHTML = SearchIcon;
  
  // Welcome screen
  document.querySelector('#welcome-screen .w-56').innerHTML = MessageIcon;
  document.querySelector('#welcome-screen .mt-8 span div').innerHTML = LockIcon;
  
  // Chat header (will be visible when chat is selected)
  if (document.getElementById('search-chat-btn')) {
    document.getElementById('search-chat-btn').querySelector('div').innerHTML = SearchIcon;
  }
  if (document.getElementById('chat-menu-btn')) {
    document.getElementById('chat-menu-btn').querySelector('div').innerHTML = MenuIcon;
  }
  
  // Message input icons
  const emojiBtn = document.getElementById('emoji-btn');
  if (emojiBtn) {
    emojiBtn.querySelector('div').innerHTML = EmojiIcon;
  }

  const attachBtn = document.getElementById('attach-btn');
  if (attachBtn) {
    attachBtn.querySelector('div').innerHTML = AttachIcon;
  }

  const voiceBtn = document.getElementById('voice-btn');
  if (voiceBtn) {
    voiceBtn.querySelector('div').innerHTML = MicIcon;
  }
}

export { generateRandomAvatar, formatDate, formatTime };