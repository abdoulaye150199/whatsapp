import { generateRandomAvatar } from '../utils/helpers.js';

// Current user information
const currentUser = {
  id: 0,
  name: "Current User",
  status: "online",
  avatar: generateRandomAvatar(),
  phone: "+221 77 123 45 67"
};

function getCurrentUser() {
  return { ...currentUser };
}

function updateUserStatus(status) {
  currentUser.status = status;
  return currentUser.status;
}

function updateUserAvatar(avatar) {
  currentUser.avatar = avatar;
  return currentUser.avatar;
}

function updateUserName(name) {
  currentUser.name = name;
  return currentUser.name;
}

export { getCurrentUser, updateUserStatus, updateUserAvatar, updateUserName };