import { isAuthenticated, login, validateSenegalPhone } from '../utils/auth.js';

document.addEventListener('DOMContentLoaded', () => {
    // Rediriger vers index.html si déjà connecté
    if (isAuthenticated()) {
        window.location.replace('./index.html');
        return;
    }

    const loginForm = document.getElementById('loginForm');
    const loadingOverlay = document.getElementById('loadingOverlay');

    loginForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const phoneInput = document.getElementById('phone');
        const phoneNumber = phoneInput.value.replace(/\D/g, '');

        if (!validateSenegalPhone(phoneNumber)) {
            alert('Numéro de téléphone invalide. Format: 7X XXX XX XX');
            return;
        }

        try {
            loadingOverlay.classList.remove('hidden');
            
            // Connecter l'utilisateur
            login(phoneNumber);
            
            // Utiliser replace au lieu de href pour éviter l'historique
            window.location.replace('./index.html');
            
        } catch (error) {
            console.error('Erreur de connexion:', error);
            alert('Erreur lors de la connexion. Veuillez réessayer.');
        } finally {
            loadingOverlay.classList.add('hidden');
        }
    });
});