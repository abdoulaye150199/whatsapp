import { addNewContact, getAllContacts } from '../models/chatModel.js';
import { formatPhoneNumber } from '../utils/phoneFormatter.js';
import { generateInitialsAvatar } from '../utils/avatarGenerator.js';
import { renderContacts } from './newDiscussionView.js';

export function renderAddContactModal() {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
  modal.id = 'add-contact-modal';
  
  modal.innerHTML = `
    <div class="bg-[#111b21] rounded-lg w-[400px] shadow-xl">
      <div class="p-4 border-b border-gray-700 flex justify-between items-center">
        <h2 class="text-white text-xl">Nouveau contact</h2>
        <button id="close-modal" class="text-gray-400 hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>
      
      <form id="add-contact-form" class="p-4">
        <div class="mb-4">
          <input type="text" id="contact-name" 
            placeholder="Nom du contact" required
            class="w-full p-2 bg-[#2a3942] text-white rounded-lg outline-none border border-gray-700 focus:border-[#00a884]">
        </div>
        
        <div class="mb-4">
          <input type="tel" id="contact-phone" 
            placeholder="Numéro de téléphone" required
            value="+221"
            class="w-full p-2 bg-[#2a3942] text-white rounded-lg outline-none border border-gray-700 focus:border-[#00a884]">
        </div>

        <div class="flex justify-end gap-2">
          <button type="button" id="cancel-contact" 
            class="px-4 py-2 text-gray-400 hover:text-white">
            Annuler
          </button>
          <button type="submit" 
            class="px-4 py-2 bg-[#00a884] text-white rounded-lg hover:bg-[#06cf9c]">
            Ajouter
          </button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(modal);

  const form = modal.querySelector('#add-contact-form');
  const closeBtn = modal.querySelector('#close-modal');
  const cancelBtn = modal.querySelector('#cancel-contact');

  closeBtn.addEventListener('click', hideAddContactModal);
  cancelBtn.addEventListener('click', hideAddContactModal);
  form.addEventListener('submit', handleAddContactSubmit);

  // Fermer en cliquant en dehors du modal
  modal.addEventListener('click', (e) => {
    if (e.target === modal) hideAddContactModal();
  });
}

function hideAddContactModal() {
  const modal = document.getElementById('add-contact-modal');
  if (modal) modal.remove();
}

async function handleAddContactSubmit(e) {
  e.preventDefault();
  
  const nameInput = document.getElementById('contact-name');
  const phoneInput = document.getElementById('contact-phone');
  const submitButton = e.target.querySelector('button[type="submit"]');

  const name = nameInput.value.trim();
  const phone = phoneInput.value.trim();

  if (!name || !phone) {
    showNotification('Veuillez remplir tous les champs', 'error');
    return;
  }

  // Disable form while submitting
  submitButton.disabled = true;
  submitButton.textContent = 'Ajout en cours...';

  try {
    const formattedPhone = formatPhoneNumber(phone);
    
    // Créer le nouveau contact avec ID unique
    const newContact = {
      id: Date.now(),
      name: name,
      phone: formattedPhone,
      status: "Hey! J'utilise WhatsApp",
      online: false
    };

    await addNewContact(newContact);
    
    // Actualiser la liste des contacts si elle est visible
    const contactsList = document.getElementById('contacts-list');
    if (contactsList) {
      const contacts = await getAllContacts();
      renderContacts(contacts);
    }
    
    hideAddContactModal();
    showNotification('Contact ajouté avec succès!');
    
    // Reset form
    nameInput.value = '';
    phoneInput.value = '+221';
    
  } catch (error) {
    if (error.message === 'Ce numéro existe déjà') {
      phoneInput.classList.add('border-red-500');
      showNotification('Ce numéro de téléphone existe déjà', 'error');
      
      // Remove error highlight after 3 seconds
      setTimeout(() => {
        phoneInput.classList.remove('border-red-500');
      }, 3000);
    } else {
      console.error('Erreur lors de l\'ajout du contact:', error);
      showNotification('Une erreur est survenue lors de l\'ajout du contact', 'error');
    }
  } finally {
    // Re-enable form
    submitButton.disabled = false;
    submitButton.textContent = 'Ajouter';
  }
}

function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.className = `fixed bottom-4 right-4 p-4 rounded-lg ${
    type === 'success' ? 'bg-green-500' : 'bg-red-500'
  } text-white shadow-lg z-50 notification`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 3000);
}
