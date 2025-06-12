import { generateRandomAvatar } from '../utils/helpers.js';
import { generateInitialsAvatar } from '../utils/avatarGenerator.js';

const API_URL = 'http://localhost:3000';

// Initialiser les tableaux vides
let chats = [];
let contacts = [];

// Charger les chats depuis le localStorage
function loadChats() {
  const savedChats = localStorage.getItem('whatsapp_chats');
  chats = savedChats ? JSON.parse(savedChats) : [];
}

// Sauvegarder les chats dans le localStorage
function saveChats() {
  localStorage.setItem('whatsapp_chats', JSON.stringify(chats));
}

function getAllChats() {
  loadChats(); // Charger les chats à chaque fois
  return [...chats];
}

async function getChatById(id) {
  try {
    // Convertir l'ID en string et number pour couvrir tous les cas
    const idStr = String(id);
    const idNum = Number(id);
    
    // First check localStorage
    loadChats();
    let localChat = chats.find(chat => 
      String(chat.id) === idStr || Number(chat.id) === idNum
    );
    
    // Essayer de récupérer depuis l'API
    try {
      const response = await fetch(`${API_URL}/chats`);
      if (response.ok) {
        const allChats = await response.json();
        const apiChat = allChats.find(chat => 
          String(chat.id) === idStr || Number(chat.id) === idNum
        );
        
        if (apiChat) {
          // Mettre à jour le localStorage avec les données de l'API
          const index = chats.findIndex(chat => 
            String(chat.id) === idStr || Number(chat.id) === idNum
          );
          if (index !== -1) {
            chats[index] = apiChat;
          } else {
            chats.push(apiChat);
          }
          saveChats();
          return apiChat;
        }
      }
    } catch (apiError) {
      console.warn('API get failed, using local data:', apiError);
    }

    // Si trouvé localement mais pas dans l'API, le créer dans l'API
    if (localChat) {
      try {
        const createResponse = await fetch(`${API_URL}/chats`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(localChat)
        });
        
        if (createResponse.ok) {
          const createdChat = await createResponse.json();
          // Mettre à jour localement avec la réponse de l'API
          const index = chats.findIndex(chat => 
            String(chat.id) === idStr || Number(chat.id) === idNum
          );
          if (index !== -1) {
            chats[index] = createdChat;
            saveChats();
          }
          return createdChat;
        }
      } catch (createError) {
        console.warn('Failed to sync chat to API:', createError);
      }
      return localChat;
    }

    // Créer un nouveau chat s'il n'est trouvé nulle part
    const newChat = {
      id: idNum, // Utiliser le nombre comme ID
      name: 'Nouvelle discussion',
      lastMessage: '',
      timestamp: new Date().toLocaleTimeString('fr-FR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      unreadCount: 0,
      avatar: `https://api.dicebear.com/6.x/initials/svg?seed=${id}`,
      online: false,
      status: "Hey! J'utilise WhatsApp",
      messages: []
    };

    // Essayer de sauvegarder dans l'API d'abord
    try {
      const createResponse = await fetch(`${API_URL}/chats`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newChat)
      });

      if (createResponse.ok) {
        const createdChat = await createResponse.json();
        chats.push(createdChat);
        saveChats();
        return createdChat;
      }
    } catch (createError) {
      console.warn('Failed to create chat in API, saving locally:', createError);
    }

    // Fallback vers le localStorage
    chats.push(newChat);
    saveChats();
    return newChat;
  } catch (error) {
    console.error('Error in getChatById:', error);
    return null;
  }
}

function searchChats(query) {
  if (!query) return getAllChats();
  
  return chats.filter(chat => 
    chat.name.toLowerCase().includes(query.toLowerCase()) || 
    chat.lastMessage.toLowerCase().includes(query.toLowerCase())
  );
}

function markAsRead(id) {
  const idStr = String(id);
  const idNum = Number(id);
  const chatIndex = chats.findIndex(chat => 
    String(chat.id) === idStr || Number(chat.id) === idNum
  );
  if (chatIndex !== -1) {
    chats[chatIndex].unreadCount = 0;
    saveChats();
    return true;
  }
  return false;
}

// Modifier la fonction getAllContacts pour utiliser fetch
async function getAllContacts() {
  try {
    const response = await fetch(`${API_URL}/contacts`);
    const contacts = await response.json();
    return contacts;
  } catch (error) {
    console.error('Erreur lors de la récupération des contacts:', error);
    return [];
  }
}

// Modifier la fonction addNewContact pour utiliser fetch
async function addNewContact(contact) {
  try {
    const contacts = await getAllContacts();
    
    // Nettoyer le numéro de téléphone
    let cleanPhone = contact.phone.replace(/[^\d+]/g, '');
    if (!cleanPhone.startsWith('+')) {
      cleanPhone = '+' + cleanPhone;
    }
    
    // Vérifier si le numéro existe déjà
    if (contacts.some(c => c.phone.replace(/[^\d+]/g, '') === cleanPhone)) {
      throw new Error('Ce numéro existe déjà');
    }
    
    const newContact = {
      id: Date.now().toString(),
      name: contact.name,
      phone: cleanPhone,
      status: contact.status || "Hey! J'utilise WhatsApp",
      online: false,
      avatar: contact.avatar || generateInitialsAvatar(contact.name)
    };
    
    const response = await fetch(`${API_URL}/contacts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newContact)
    });

    if (!response.ok) {
      throw new Error('Erreur lors de l\'ajout du contact');
    }

    return await response.json();
  } catch (error) {
    console.error('Erreur:', error);
    throw error;
  }
}

// Modifier la fonction searchContacts
async function searchContacts(query) {
  try {
    const contacts = await getAllContacts();
    if (!query) return contacts;
    
    return contacts.filter(contact => 
      contact.name.toLowerCase().includes(query.toLowerCase())
    );
  } catch (error) {
    console.error('Erreur lors de la recherche des contacts:', error);
    return [];
  }
}

// Ajouter la fonction createNewChat
async function createNewChat(contact) {
  try {
    loadChats();
    
    // Vérifier si le chat existe déjà
    const existingChat = chats.find(c => String(c.id) === String(contact.id));
    if (existingChat) {
      return existingChat;
    }

    // Créer un nouveau chat
    const newChat = {
      id: contact.id,
      name: contact.name,
      lastMessage: '',
      timestamp: new Date().toLocaleTimeString('fr-FR'),
      unreadCount: 0,
      avatar: contact.avatar || `https://api.dicebear.com/6.x/initials/svg?seed=${contact.name}`,
      online: false,
      status: contact.status || "Hey! J'utilise WhatsApp",
      messages: [],
      isGroup: contact.isGroup || false
    };

    // Sauvegarder en local d'abord
    chats.push(newChat);
    saveChats();

    try {
      // Sauvegarder dans l'API
      const response = await fetch('http://localhost:3000/chats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newChat)
      });

      if (response.ok) {
        const savedChat = await response.json();
        // Mettre à jour le chat local avec les données de l'API
        const index = chats.findIndex(c => String(c.id) === String(contact.id));
        if (index !== -1) {
          chats[index] = savedChat;
          saveChats();
        }
        return savedChat;
      }
    } catch (apiError) {
      console.warn('API error, using local data:', apiError);
    }

    return newChat;
  } catch (error) {
    console.error('Error in createNewChat:', error);
    return null;
  }
}

// Nouvelle fonction pour créer un groupe
async function createNewGroup(groupData) {
  try {
    loadChats();
    
    // Créer le groupe avec un ID unique
    const newGroup = {
      ...groupData,
      id: Date.now(),
      isGroup: true,
      messages: [],
      lastMessage: `Groupe créé`,
      timestamp: new Date().toLocaleTimeString('fr-FR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      unreadCount: 0,
      online: false
    };

    // Sauvegarder en local d'abord
    chats.push(newGroup);
    saveChats();

    try {
      // Sauvegarder dans l'API
      const response = await fetch('http://localhost:3000/chats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newGroup)
      });

      if (response.ok) {
        const savedGroup = await response.json();
        // Mettre à jour le groupe local avec les données de l'API
        const index = chats.findIndex(c => String(c.id) === String(newGroup.id));
        if (index !== -1) {
          chats[index] = savedGroup;
          saveChats();
        }
        return savedGroup;
      }
    } catch (apiError) {
      console.warn('API error, using local data:', apiError);
    }

    return newGroup;
  } catch (error) {
    console.error('Error in createNewGroup:', error);
    return null;
  }
}

// Fonction améliorée pour updateLastMessage
async function updateLastMessage(chatId, message) {
  try {
    const idStr = String(chatId);
    const idNum = Number(chatId);
    
    loadChats();
    let chat = chats.find(c => 
      String(c.id) === idStr || Number(c.id) === idNum
    );
    
    const timestamp = new Date().toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    if (!chat) {
      // Create new chat if it doesn't exist
      chat = {
        id: idNum,
        name: 'Nouvelle discussion',
        lastMessage: message,
        timestamp: timestamp,
        unreadCount: 0,
        avatar: `https://api.dicebear.com/6.x/initials/svg?seed=${chatId}`,
        online: false,
        status: "Hey! J'utilise WhatsApp",
        messages: []
      };
      chats.push(chat);
    } else {
      // Update existing chat
      chat.lastMessage = message;
      chat.timestamp = timestamp;
    }

    // Save locally first
    saveChats();

    try {
      // Try to create/update in API
      const response = await fetch(`${API_URL}/chats`, {
        method: 'POST', // Always use POST to create/update
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(chat)
      });

      if (response.ok) {
        const apiChat = await response.json();
        const index = chats.findIndex(c => 
          String(c.id) === idStr || Number(c.id) === idNum
        );
        if (index !== -1) {
          chats[index] = apiChat;
          saveChats();
        }
        return apiChat;
      }
    } catch (apiError) {
      console.warn('API sync failed for updateLastMessage:', apiError);
    }

    return chat; // Return local chat if API sync fails
  } catch (error) {
    console.error('Error updating last message:', error);
    return null;
  }
}

// Les exports restent les mêmes
export {
  getAllChats,
  getChatById,
  searchChats,
  markAsRead,
  getAllContacts,
  searchContacts,
  createNewChat,
  addNewContact,
  updateLastMessage,
  createNewGroup
};