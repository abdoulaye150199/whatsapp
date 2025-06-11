import { isAuthenticated, login } from '../utils/auth.js';
import { countries, validatePhoneNumber, formatPhoneNumber } from '../utils/countryData.js';

document.addEventListener('DOMContentLoaded', () => {
    if (isAuthenticated()) {
        window.location.replace('./index.html');
        return;
    }

    const loginForm = document.getElementById('loginForm');
    const phoneInput = document.getElementById('phone');
    const countrySelect = document.getElementById('country');
    const submitBtn = loginForm?.querySelector('button[type="submit"]') || document.getElementById('submit-btn');
    const phoneError = document.getElementById('phone-error');
    const loadingOverlay = document.getElementById('loadingOverlay');

    if (!loginForm || !phoneInput || !submitBtn || !loadingOverlay || !countrySelect) {
        console.error('Éléments manquants dans le DOM');
        return;
    }

    // Populate country select
    populateCountrySelect();

    function populateCountrySelect() {
        countrySelect.innerHTML = countries.map(country => 
            `<option value="${country.code}" ${country.code === 'SN' ? 'selected' : ''}>
                ${country.flag} ${country.name} (${country.dialCode})
            </option>`
        ).join('');
        
        // Set initial phone value
        const selectedCountry = countries.find(c => c.code === countrySelect.value);
        phoneInput.value = selectedCountry.dialCode;
    }

    function validatePhone(value, countryCode) {
        // Enlever les espaces pour la validation
        const cleanPhone = value.replace(/\s+/g, '');
        
        // Vérifier le format Sénégal: +221 XX XXX XX XX
        if (countryCode === 'SN') {
            const regex = /^\+221(70|75|76|77|78)[0-9]{7}$/;
            if (!regex.test(cleanPhone)) {
                showError('Format invalide. Exemple: +221 77 123 45 67');
                return false;
            }
        }
        
        hideError();
        return true;
    }

    function showError(message) {
        phoneError.textContent = message;
        phoneInput.classList.add('border-red-500');
    }

    function hideError() {
        phoneError.textContent = '';
        phoneInput.classList.remove('border-red-500');
    }

    // Country change handler
    countrySelect.addEventListener('change', (e) => {
        const selectedCountry = countries.find(c => c.code === e.target.value);
        phoneInput.value = selectedCountry.dialCode;
        hideError();
    });

    // Phone input handler
    phoneInput.addEventListener('input', (e) => {
        const selectedCountry = countries.find(c => c.code === countrySelect.value);
        let value = e.target.value;
        
        // Ensure it starts with the correct dial code
        if (!value.startsWith(selectedCountry.dialCode)) {
            value = selectedCountry.dialCode;
        }
        
        // Format the number
        const formatted = formatPhoneNumber(value, selectedCountry.code);
        e.target.value = formatted;
        
        // Validate
        validatePhone(formatted, selectedCountry.code);
    });

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const selectedCountry = countries.find(c => c.code === countrySelect.value);
        const phoneNumber = phoneInput.value;
        
        if (!validatePhone(phoneNumber, selectedCountry.code)) {
            return;
        }
        
        try {
            loadingOverlay.classList.remove('hidden');
            submitBtn.disabled = true;
            
            // Formater le numéro correctement
            const formattedPhone = formatPhoneNumber(phoneNumber, selectedCountry.code);
            
            // Tenter la connexion
            await login(formattedPhone, selectedCountry.code);
            
            // Rediriger vers l'app si succès
            window.location.href = 'index.html';
            
        } catch (error) {
            showError(error.message || 'Une erreur est survenue lors de la connexion');
        } finally {
            loadingOverlay.classList.add('hidden');
            submitBtn.disabled = false;
        }
    });
});