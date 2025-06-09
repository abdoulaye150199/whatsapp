import { isAuthenticated, login, validateSenegalPhone } from '../utils/auth.js';
document.addEventListener('DOMContentLoaded', () => {
    if (isAuthenticated()) {
        window.location.replace('./index.html');
        return;
    }
    const loginForm = document.getElementById('loginForm');
    const phoneInput = document.getElementById('phone');
    const submitBtn = loginForm?.querySelector('button[type="submit"]') || document.getElementById('submit-btn');
    const phoneError = document.getElementById('phone-error');
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (!loginForm || !phoneInput || !submitBtn || !loadingOverlay) {
        console.error('Éléments manquants dans le DOM');
        return;
    }
    function validatePhone(value) {
        const phoneNumber = value.replace(/\s/g, '');
        if (!phoneNumber.startsWith('+221')) {
            showError('Le numéro doit commencer par +221');
            return false;
        }
        const localNumber = phoneNumber.replace(/^\+221/, '');
        if (localNumber.length === 0) {
            showError('Le numéro de téléphone est requis');
            return false;
        }
        if (localNumber.length !== 9) {
            showError('Le numéro doit contenir 9 chiffres après +221');
            return false;
        }
        const prefix = localNumber.substring(0, 2);
        if (!['77', '78', '75', '70', '76'].includes(prefix)) {
            showError('Le numéro doit commencer par 77, 78, 75, 70 ou 76');
            return false;
        }
        hideError();
        return true;
    }
    function showError(message) {
        const errorDiv = document.getElementById('phone-error');
        const phoneInput = document.getElementById('phone');
        
        errorDiv.textContent = message;
        phoneInput.classList.add('border-red-500');
    }
    function hideError() {
        const errorDiv = document.getElementById('phone-error');
        const phoneInput = document.getElementById('phone');
        
        errorDiv.textContent = '';
        phoneInput.classList.remove('border-red-500');
    }

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

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const phoneNumber = phoneInput.value.replace(/\s/g, '');
        
        if (!validatePhone(phoneNumber)) {
            return;
        }
        
        try {
            if (loadingOverlay) loadingOverlay.classList.remove('hidden');
            if (submitBtn) submitBtn.disabled = true;
            
            const localNumber = phoneNumber.replace(/^\+221/, '');
            
            await new Promise(resolve => setTimeout(resolve, 1500));
            login(localNumber);
            window.location.replace('./index.html');
            
        } catch (error) {
            showError('Une erreur est survenue lors de la connexion');
        } finally {
            if (loadingOverlay) loadingOverlay.classList.add('hidden');
            if (submitBtn) submitBtn.disabled = false;
        }
    });
});