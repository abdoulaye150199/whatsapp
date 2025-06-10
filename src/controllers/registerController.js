import { register, validateSenegalPhone } from '../utils/auth.js';

document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    const phoneInput = document.getElementById('phone');
    const submitBtn = document.getElementById('submit-btn');
    const loadingOverlay = document.getElementById('loadingOverlay');

    if (!registerForm || !firstNameInput || !lastNameInput || !phoneInput || !submitBtn || !loadingOverlay) {
        console.error('Éléments manquants dans le DOM');
        return;
    }

    function validateName(value, fieldName) {
        if (!value.trim()) {
            showError(`${fieldName}-error`, `Le ${fieldName.toLowerCase()} est requis`);
            return false;
        }
        if (value.trim().length < 2) {
            showError(`${fieldName}-error`, `Le ${fieldName.toLowerCase()} doit contenir au moins 2 caractères`);
            return false;
        }
        if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(value.trim())) {
            showError(`${fieldName}-error`, `Le ${fieldName.toLowerCase()} ne doit contenir que des lettres`);
            return false;
        }
        hideError(`${fieldName}-error`);
        return true;
    }

    function validatePhone(value) {
        const phoneNumber = value.replace(/\s/g, '');
        if (!phoneNumber.startsWith('+221')) {
            showError('phone-error', 'Le numéro doit commencer par +221');
            return false;
        }
        const localNumber = phoneNumber.replace(/^\+221/, '');
        if (localNumber.length === 0) {
            showError('phone-error', 'Le numéro de téléphone est requis');
            return false;
        }
        if (localNumber.length !== 9) {
            showError('phone-error', 'Le numéro doit contenir 9 chiffres après +221');
            return false;
        }
        const prefix = localNumber.substring(0, 2);
        if (!['77', '78', '75', '70', '76'].includes(prefix)) {
            showError('phone-error', 'Le numéro doit commencer par 77, 78, 75, 70 ou 76');
            return false;
        }
        hideError('phone-error');
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

    // Validation en temps réel
    firstNameInput.addEventListener('input', (e) => {
        validateName(e.target.value, 'firstName');
    });

    lastNameInput.addEventListener('input', (e) => {
        validateName(e.target.value, 'lastName');
    });

    phoneInput.addEventListener('input', (e) => {
        let value = e.target.value;
        value = value.replace(/[^\d+]/g, '');
        if (!value.startsWith('+')) {
            value = '+' + value;
        }
        if (value.length > 4) { 
            const countryCode = value.slice(0, 4); 
            const localNumber = value.slice(4);
            
            if (localNumber.length > 0) {
                const groups = [];
                let pos = 0;
                
                if (localNumber.length > pos) {
                    groups.push(localNumber.slice(pos, pos + 2));
                    pos += 2;
                }
                if (localNumber.length > pos) {
                    groups.push(localNumber.slice(pos, pos + 3));
                    pos += 3;
                }
                if (localNumber.length > pos) {
                    groups.push(localNumber.slice(pos, pos + 2));
                    pos += 2;
                }
                if (localNumber.length > pos) {
                    groups.push(localNumber.slice(pos, pos + 2));
                }
                
                value = `${countryCode} ${groups.join(' ')}`.trim();
            } else {
                value = countryCode;
            }
        }
        
        e.target.value = value;
        validatePhone(value.replace(/\s/g, ''));
    });

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const firstName = firstNameInput.value.trim();
        const lastName = lastNameInput.value.trim();
        const phoneNumber = phoneInput.value.replace(/\s/g, '');
        
        // Valider tous les champs
        const isFirstNameValid = validateName(firstName, 'firstName');
        const isLastNameValid = validateName(lastName, 'lastName');
        const isPhoneValid = validatePhone(phoneNumber);
        
        if (!isFirstNameValid || !isLastNameValid || !isPhoneValid) {
            return;
        }
        
        try {
            loadingOverlay.classList.remove('hidden');
            submitBtn.disabled = true;
            
            const localNumber = phoneNumber.replace(/^\+221/, '');
            
            // Simuler un délai d'inscription
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Enregistrer l'utilisateur
            register(localNumber, firstName, lastName);
            
            // Rediriger vers l'application
            window.location.replace('./index.html');
            
        } catch (error) {
            console.error('Erreur lors de l\'inscription:', error);
            showError('phone-error', 'Une erreur est survenue lors de l\'inscription');
        } finally {
            loadingOverlay.classList.add('hidden');
            submitBtn.disabled = false;
        }
    });
});