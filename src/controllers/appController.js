import { getCurrentUser } from '../models/userModel.js';
import { initChat } from './chatController.js';
import { renderSettingsView } from '../views/settingsView.js';
import { initMenuController } from './menuController.js';

// Initialize the application
function initApp() {
  // Set current user avatar
  setCurrentUserAvatar();
  
  // Initialize chat functionality
  initChat();
  
  // Initialiser le contrôleur de menu
  initMenuController();
  
  // Add event listeners for navigation buttons
  initNavigation();
}

// Set the current user's avatar
function setCurrentUserAvatar() {
  const currentUser = getCurrentUser();
  const avatarElement = document.getElementById('current-user-avatar');
  
  if (avatarElement) {
    avatarElement.src = currentUser.avatar;
  }
}

// Initialize navigation buttons
function initNavigation() {
  const statusBtn = document.getElementById('status-btn');
  const channelsBtn = document.getElementById('channels-btn');
  const chatsBtn = document.getElementById('chats-btn');
  const communitiesBtn = document.getElementById('communities-btn');
  const settingsBtn = document.getElementById('settings-btn');
  
  // Add event listeners to navigation buttons
  statusBtn.addEventListener('click', () => switchTab('status'));
  channelsBtn.addEventListener('click', () => switchTab('channels'));
  chatsBtn.addEventListener('click', () => switchTab('chats'));
  communitiesBtn.addEventListener('click', () => switchTab('communities'));
  settingsBtn.addEventListener('click', () => {
    switchTab('settings');
    renderSettingsView();
  });
}

// Switch between tabs
function switchTab(tabName) {
  // Clear active tab styling
  const allButtons = document.querySelectorAll('#side-nav button');
  allButtons.forEach(button => {
    button.classList.remove('bg-[#00a884]', 'text-white');
    button.classList.add('bg-[#2a3942]', 'text-gray-400');
  });
  
  // Add active styling to selected tab
  const activeButton = document.getElementById(`${tabName}-btn`);
  if (activeButton) {
    activeButton.classList.remove('bg-[#2a3942]', 'text-gray-400');
    activeButton.classList.add('bg-[#00a884]', 'text-white');
  }
  
  // In a real application, we would switch content here
  console.log(`Switched to ${tabName} tab`);
}

export { initApp };