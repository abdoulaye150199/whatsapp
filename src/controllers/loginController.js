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
        const isValid = validatePhoneNumber(value, countryCode);
        
        if (!isValid) {
            const country = countries.find(c => c.code === countryCode);
            showError(`Format invalide pour ${country.name}. Format attendu: ${country.dialCode} ${country.format}`);
            return false;
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
            
            // Extract local number
            const localNumber = phoneNumber.replace(selectedCountry.dialCode, '').replace(/\s/g, '');
            
            await new Promise(resolve => setTimeout(resolve, 1500));
            login(localNumber, selectedCountry.code);
            window.location.replace('./index.html');
            
        } catch (error) {
            showError('Une erreur est survenue lors de la connexion');
        } finally {
            loadingOverlay.classList.add('hidden');
            submitBtn.disabled = false;
        }
    });
});