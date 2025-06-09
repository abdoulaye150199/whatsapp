import { generateRandomAvatar } from '../utils/helpers.js';

// Current user information
let currentUser = {
  id: 0,
  name: 'AbdAllah',
  status: 'Salut ! J\'utilise WhatsApp.',
  avatar: './src/assets/images/profile.jpeg',
  phone: '+221 77 123 45 67'
};

export function getCurrentUser() {
  return currentUser;
}

export function updateUserProfile(data) {
  currentUser = { ...currentUser, ...data };
  updateProfileUI();
}

export function updateProfileUI() {
  // Mettre à jour l'avatar dans la barre latérale
  const sidebarAvatar = document.getElementById('current-user-avatar');
  if (sidebarAvatar) {
    sidebarAvatar.src = currentUser.avatar;
  }

  // Mettre à jour l'avatar dans les paramètres si visible
  const settingsAvatar = document.querySelector('#settings-container img');
  if (settingsAvatar) {
    settingsAvatar.src = currentUser.avatar;
  }
}