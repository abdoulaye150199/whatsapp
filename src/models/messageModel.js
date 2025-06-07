// Sample messages for each chat
const messages = {
  1: [
    { id: 1, text: "Salut, comment vas-tu?", timestamp: "20:30", isMe: false },
    { id: 2, text: "Je vais bien, merci! Et toi?", timestamp: "20:31", isMe: true },
    { id: 3, text: "Fallou ya ngui may fenial li lay...", timestamp: "20:35", isMe: true }
  ],
  2: [
    { id: 1, text: "Bonjour Jeanne", timestamp: "21:45", isMe: true },
    { id: 2, text: "Bonjour! Comment ça va aujourd'hui?", timestamp: "21:50", isMe: false },
    { id: 3, text: "Très bien et toi?", timestamp: "21:55", isMe: true },
    { id: 4, text: "Wa ok", timestamp: "22:10", isMe: false }
  ],
  3: [
    { id: 1, text: "Salam Ngom", timestamp: "21:30", isMe: true },
    { id: 2, text: "Salam, comment ça va?", timestamp: "21:40", isMe: false },
    { id: 3, text: "Hamdoulilah et toi?", timestamp: "21:45", isMe: true },
    { id: 4, text: "Thiey dama fateli rek", timestamp: "22:01", isMe: false }
  ],
  4: [
    { id: 1, text: "Salut AbdAllah", timestamp: "13:10", isMe: true },
    { id: 2, text: "Salut, comment vas-tu?", timestamp: "13:15", isMe: false },
    { id: 3, text: "Je vais bien merci", timestamp: "13:18", isMe: true },
    { id: 4, text: "[Image]", timestamp: "14:19", isMe: false, isImage: true }
  ]
};

// For chats without specific messages, create generic ones
for (let i = 5; i <= 8; i++) {
  if (!messages[i]) {
    messages[i] = [
      { id: 1, text: "Bonjour", timestamp: "09:00", isMe: false },
      { id: 2, text: "Salut, comment vas-tu?", timestamp: "09:05", isMe: true },
      { id: 3, text: "Je vais bien, merci! Et toi?", timestamp: "09:10", isMe: false }
    ];
  }
}

function getMessagesByChatId(chatId) {
  return messages[chatId] || [];
}

function addMessage(chatId, text, isMe = true, isVoice = false, duration = null) {
  if (!messages[chatId]) {
    messages[chatId] = [];
  }
  
  const newMessage = {
    id: messages[chatId].length + 1,
    text,
    timestamp: getCurrentTime(),
    isMe,
    isVoice,
    duration
  };
  
  messages[chatId].push(newMessage);
  return newMessage;
}

function getCurrentTime() {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
}

export { getMessagesByChatId, addMessage };