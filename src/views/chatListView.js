// Function to render the chat list
function renderChatList(chats = [], onChatClick) {
  const chatListElement = document.getElementById('chat-list');
  if (!chatListElement) return;
  
  chatListElement.innerHTML = '';
  
  // Add null check for chats
  if (Array.isArray(chats)) {
    chats.forEach(chat => {
      const chatElement = createChatElement(chat);
      chatElement.addEventListener('click', () => onChatClick(chat));
      chatListElement.appendChild(chatElement);
    });
  }
}

// Create a single chat element
function createChatElement(chat) {
  const chatElement = document.createElement('div');
  chatElement.className = 'flex items-center p-3 border-b border-gray-700 hover:bg-[#202c33] cursor-pointer';
  chatElement.dataset.chatId = chat.id;
  
  // Create the avatar with online indicator if needed
  const avatarContainer = document.createElement('div');
  avatarContainer.className = 'relative mr-3';
  
  const avatar = document.createElement('div');
  avatar.className = 'w-12 h-12 rounded-full overflow-hidden';
  
  const avatarImg = document.createElement('img');
  avatarImg.src = chat.avatar;
  avatarImg.alt = chat.name;
  avatarImg.className = 'w-full h-full object-cover';
  avatarImg.onerror = () => {
    // Fallback to generated avatar if loading fails
    avatarImg.src = generateRandomAvatar(chat.name);
  };
  
  avatar.appendChild(avatarImg);
  avatarContainer.appendChild(avatar);
  
  // Add online indicator if the user is online
  if (chat.online) {
    const onlineIndicator = document.createElement('div');
    onlineIndicator.className = 'absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#111b21]';
    avatarContainer.appendChild(onlineIndicator);
  }
  
  // Create the chat info
  const chatInfo = document.createElement('div');
  chatInfo.className = 'flex-1 min-w-0';
  
  const headerRow = document.createElement('div');
  headerRow.className = 'flex justify-between items-center';
  
  const chatName = document.createElement('h3');
  chatName.className = 'font-medium truncate';
  chatName.textContent = chat.name;
  
  const timestamp = document.createElement('span');
  timestamp.className = `text-xs ${chat.unreadCount > 0 ? 'text-green-500 font-bold' : 'text-gray-400'}`;
  timestamp.textContent = chat.timestamp;
  
  headerRow.appendChild(chatName);
  headerRow.appendChild(timestamp);
  
  const messageRow = document.createElement('div');
  messageRow.className = 'flex justify-between items-center mt-1';
  
  const lastMessage = document.createElement('p');
  lastMessage.className = 'text-sm text-gray-400 truncate';
  lastMessage.textContent = chat.lastMessage;
  
  messageRow.appendChild(lastMessage);
  
  // Add unread count badge if there are unread messages
  if (chat.unreadCount > 0) {
    const unreadBadge = document.createElement('div');
    unreadBadge.className = 'bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center';
    unreadBadge.textContent = chat.unreadCount;
    messageRow.appendChild(unreadBadge);
  }
  
  chatInfo.appendChild(headerRow);
  chatInfo.appendChild(messageRow);
  
  // Assemble the chat element
  chatElement.appendChild(avatarContainer);
  chatElement.appendChild(chatInfo);
  
  return chatElement;
}

// Update a specific chat in the list
function updateChatInList(chat) {
  const chatElement = document.querySelector(`[data-chat-id="${chat.id}"]`);
  if (chatElement) {
    const newChatElement = createChatElement(chat);
    chatElement.replaceWith(newChatElement);
    
    // Re-add the event listener
    newChatElement.addEventListener('click', () => {
      const event = new CustomEvent('chat-clicked', { detail: chat });
      document.dispatchEvent(event);
    });
  }
}

export { renderChatList, updateChatInList };