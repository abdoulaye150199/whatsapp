import { addNewContact, getAllContacts } from '../models/chatModel.js';
import { countries, formatPhoneNumber, validatePhoneNumber } from '../utils/countryData.js';
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
            class="w-full p-3 bg-[#2a3942] text-white rounded-lg outline-none border border-gray-700 focus:border-[#00a884]">
          <div id="contact-name-error" class="text-red-500 text-sm mt-2"></div>
        </div>
        
        <div class="mb-4">
          <select id="contact-country" class="w-full p-3 bg-[#2a3942] text-white rounded-lg outline-none border border-gray-700 focus:border-[#00a884] mb-2">
            <!-- Countries will be populated here -->
          </select>
        </div>
        
        <div class="mb-4">
          <input type="tel" id="contact-phone" 
            placeholder="Numéro de téléphone" required
            class="w-full p-3 bg-[#2a3942] text-white rounded-lg outline-none border border-gray-700 focus:border-[#00a884]">
          <div id="contact-phone-error" class="text-red-500 text-sm mt-2"></div>
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
  const countrySelect = modal.querySelector('#contact-country');
  const phoneInput = modal.querySelector('#contact-phone');
  const nameInput = modal.querySelector('#contact-name');

  // Populate countries
  populateCountries();

  function populateCountries() {
    countrySelect.innerHTML = countries.map(country => 
      `<option value="${country.code}" ${country.code === 'SN' ? 'selected' : ''}>
        ${country.flag} ${country.name} (${country.dialCode})
      </option>`
    ).join('');
    
    // Set initial phone value
    const selectedCountry = countries.find(c => c.code === countrySelect.value);
    phoneInput.value = selectedCountry.dialCode + ' ';
  }

  // Event listeners
  closeBtn.addEventListener('click', hideAddContactModal);
  cancelBtn.addEventListener('click', hideAddContactModal);
  
  countrySelect.addEventListener('change', (e) => {
    const selectedCountry = countries.find(c => c.code === e.target.value);
    phoneInput.value = selectedCountry.dialCode + ' ';
    hideError('contact-phone-error');
  });

  phoneInput.addEventListener('input', (e) => {
    const selectedCountry = countries.find(c => c.code === countrySelect.value);
    let value = e.target.value;
    
    // Ensure it starts with the correct dial code
    if (!value.startsWith(selectedCountry.dialCode)) {
      value = selectedCountry.dialCode + ' ';
    }
    
    // Format the number
    const formatted = formatPhoneNumber(value, selectedCountry.code);
    e.target.value = formatted;
    
    // Validate
    validatePhone(formatted, selectedCountry.code);
  });

  nameInput.addEventListener('input', (e) => {
    validateName(e.target.value);
  });

  form.addEventListener('submit', handleAddContactSubmit);

  // Close on outside click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) hideAddContactModal();
  });

  function validateName(value) {
    if (!value.trim()) {
      showError('contact-name-error', 'Le nom est requis');
      return false;
    }
    if (value.trim().length < 2) {
      showError('contact-name-error', 'Le nom doit contenir au moins 2 caractères');
      return false;
    }
    hideError('contact-name-error');
    return true;
  }

  function validatePhone(value, countryCode) {
    const isValid = validatePhoneNumber(value, countryCode);
    
    if (!isValid) {
      const country = countries.find(c => c.code === countryCode);
      showError('contact-phone-error', `Format invalide pour ${country.name}`);
      return false;
    }
    
    hideError('contact-phone-error');
    return true;
  }

  function showError(errorId, message) {
    const errorDiv = document.getElementById(errorId);
    const inputId = errorId.replace('-error', '');
    const inputElement = document.getElementById(inputId);
    
    if (errorDiv) errorDiv.textContent = message;
    if (inputElement) inputElement.classList.add('border-red-500');
  }

  function hideError(errorId) {
    const errorDiv = document.getElementById(errorId);
    const inputId = errorId.replace('-error', '');
    const inputElement = document.getElementById(inputId);
    
    if (errorDiv) errorDiv.textContent = '';
    if (inputElement) inputElement.classList.remove('border-red-500');
  }
}

function hideAddContactModal() {
  const modal = document.getElementById('add-contact-modal');
  if (modal) modal.remove();
}

async function handleAddContactSubmit(e) {
  e.preventDefault();
  
  const nameInput = document.getElementById('contact-name');
  const phoneInput = document.getElementById('contact-phone');
  const countrySelect = document.getElementById('contact-country');
  const submitButton = e.target.querySelector('button[type="submit"]');

  const name = nameInput.value.trim();
  const phone = phoneInput.value.trim();
  const selectedCountry = countries.find(c => c.code === countrySelect.value);

  // Validate
  const isNameValid = validateName(name);
  const isPhoneValid = validatePhone(phone, selectedCountry.code);

  if (!isNameValid || !isPhoneValid) {
    return;
  }

  // Disable form while submitting
  submitButton.disabled = true;
  submitButton.textContent = 'Ajout en cours...';

  try {
    // Generate avatar
    const avatarData = generateInitialsAvatar(name);
    
    // Create the new contact
    const newContact = {
      id: Date.now(),
      name: name,
      phone: phone,
      status: "Hey! J'utilise WhatsApp",
      online: false,
      avatar: avatarData.dataUrl
    };

    await addNewContact(newContact);
    
    // Refresh contacts list if visible
    const contactsList = document.getElementById('contacts-list');
    if (contactsList) {
      const contacts = await getAllContacts();
      renderContacts(contacts);
    }
    
    hideAddContactModal();
    showNotification('Contact ajouté avec succès!');
    
  } catch (error) {
    if (error.message === 'Ce numéro existe déjà') {
      showError('contact-phone-error', 'Ce numéro de téléphone existe déjà');
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

function validateName(value) {
  if (!value.trim()) {
    showError('contact-name-error', 'Le nom est requis');
    return false;
  }
  if (value.trim().length < 2) {
    showError('contact-name-error', 'Le nom doit contenir au moins 2 caractères');
    return false;
  }
  hideError('contact-name-error');
  return true;
}

function validatePhone(value, countryCode) {
  const isValid = validatePhoneNumber(value, countryCode);
  
  if (!isValid) {
    const country = countries.find(c => c.code === countryCode);
    showError('contact-phone-error', `Format invalide pour ${country.name}`);
    return false;
  }
  
  hideError('contact-phone-error');
  return true;
}

function showError(errorId, message) {
  const errorDiv = document.getElementById(errorId);
  const inputId = errorId.replace('-error', '');
  const inputElement = document.getElementById(inputId);
  
  if (errorDiv) errorDiv.textContent = message;
  if (inputElement) inputElement.classList.add('border-red-500');
}

function hideError(errorId) {
  const errorDiv = document.getElementById(errorId);
  const inputId = errorId.replace('-error', '');
  const inputElement = document.getElementById(inputId);
  
  if (errorDiv) errorDiv.textContent = '';
  if (inputElement) inputElement.classList.remove('border-red-500');
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