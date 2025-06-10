// Utilitaires pour la gestion de l'authentification

/**
 * Vérifie si l'utilisateur est connecté
 * @returns {boolean} true si l'utilisateur est connecté
 */
export function isAuthenticated() {
    return localStorage.getItem('whatsapp_user') !== null;
}

/**
 * Récupère les données de session de l'utilisateur
 * @returns {object|null} Les données de session ou null
 */
export function getSessionData() {
    try {
        const session = sessionStorage.getItem('whatsapp_session');
        return session ? JSON.parse(session) : null;
    } catch (error) {
        console.error('Erreur lors de la récupération des données de session:', error);
        return null;
    }
}

/**
 * Déconnecte l'utilisateur
 */
export function logout() {
  try {
    // Supprimer les données de l'utilisateur
    localStorage.removeItem('whatsapp_user');
    sessionStorage.clear();
    
    // Rediriger vers la page de connexion
    window.location.replace('./login.html');
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
    throw error;
  }
}

/**
 * Vérifie l'authentification et redirige si nécessaire
 * Utilisez cette fonction dans vos pages protégées
 */
export function requireAuth() {
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

/**
 * Redirige vers l'app si déjà connecté
 * Utilisez cette fonction sur la page de login
 */
export function redirectIfAuthenticated() {
    if (isAuthenticated()) {
        window.location.href = 'index.html';
        return true;
    }
    return false;
}

/**
 * Valide un numéro de téléphone sénégalais
 * @param {string} phone - Le numéro de téléphone à valider
 * @returns {boolean} true si le numéro est valide
 */
export function validateSenegalPhone(phone) {
    const phoneNumber = phone.replace(/\D/g, '');
    const phoneRegex = /^(70|75|76|77|78)[0-9]{7}$/;
    return phoneRegex.test(phoneNumber);
}

/**
 * Formate un numéro de téléphone sénégalais
 * @param {string} phone - Le numéro brut
 * @returns {string} Le numéro formaté
 */
export function formatSenegalPhone(phone) {
    const phoneNumber = phone.replace(/\D/g, '');
    
    if (phoneNumber.length !== 9) return phone;
    
    return `${phoneNumber.slice(0, 2)} ${phoneNumber.slice(2, 5)} ${phoneNumber.slice(5, 7)} ${phoneNumber.slice(7, 9)}`;
}

/**
 * Génère un code de vérification à 6 chiffres
 * @returns {string} Code à 6 chiffres
 */
export function generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Simule l'envoi d'un SMS (à remplacer par votre API)
 * @param {string} phone - Numéro de téléphone
 * @param {string} code - Code de vérification
 * @returns {Promise} Promise qui se résout après l'envoi
 */
export function sendSMS(phone, code) {
    return new Promise((resolve, reject) => {
        // Simulation d'un délai d'envoi
        setTimeout(() => {
            console.log(`SMS envoyé à ${phone} avec le code: ${code}`);
            // Simulation d'un taux de succès de 95%
            if (Math.random() > 0.05) {
                resolve({ success: true, message: 'SMS envoyé avec succès' });
            } else {
                reject(new Error('Échec de l\'envoi du SMS'));
            }
        }, 1000 + Math.random() * 2000); // 1-3 secondes
    });
}

/**
 * Valide un code de vérification
 * @param {string} inputCode - Code saisi par l'utilisateur
 * @param {string} expectedCode - Code attendu
 * @returns {boolean} true si le code est correct
 */
export function validateVerificationCode(inputCode, expectedCode) {
    return inputCode === expectedCode;
}

/**
 * Gère l'expiration des codes de vérification
 */
export function isCodeExpired(timestamp, expirationMinutes = 5) {
    const now = new Date().getTime();
    const codeTime = new Date(timestamp).getTime();
    const expirationTime = expirationMinutes * 60 * 1000; // en millisecondes
    
    return (now - codeTime) > expirationTime;
}

/**
 * Stocke temporairement le code de vérification
 * @param {string} phone - Numéro de téléphone
 * @param {string} code - Code de vérification
 */
export function storeVerificationCode(phone, code) {
    const codeData = {
        phone: phone,
        code: code,
        timestamp: new Date().toISOString()
    };
    
    try {
        sessionStorage.setItem('verification_code', JSON.stringify(codeData));
    } catch (error) {
        console.error('Erreur lors du stockage du code:', error);
    }
}

/**
 * Récupère le code de vérification stocké
 * @param {string} phone - Numéro de téléphone
 * @returns {object|null} Données du code ou null
 */
export function getStoredVerificationCode(phone) {
    try {
        const stored = sessionStorage.getItem('verification_code');
        if (!stored) return null;
        
        const codeData = JSON.parse(stored);
        if (codeData.phone !== phone) return null;
        
        // Vérifier l'expiration
        if (isCodeExpired(codeData.timestamp)) {
            sessionStorage.removeItem('verification_code');
            return null;
        }
        
        return codeData;
    } catch (error) {
        console.error('Erreur lors de la récupération du code:', error);
        return null;
    }
}

/**
 * Nettoie les données de vérification
 */
export function clearVerificationData() {
    try {
        sessionStorage.removeItem('verification_code');
    } catch (error) {
        console.error('Erreur lors du nettoyage:', error);
    }
}

/**
 * Fonction d'inscription
 * @param {string} phoneNumber - Numéro de téléphone de l'utilisateur
 * @param {string} firstName - Prénom de l'utilisateur
 * @param {string} lastName - Nom de l'utilisateur
 */
export function register(phoneNumber, firstName, lastName) {
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    
    const user = {
        phone: formatSenegalPhone(cleanNumber),
        firstName: firstName,
        lastName: lastName,
        name: `${firstName} ${lastName}`,
        registeredAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
    };

    localStorage.setItem('whatsapp_user', JSON.stringify(user));
}

/**
 * Fonction de connexion
 * @param {string} phoneNumber - Numéro de téléphone de l'utilisateur
 */
export function login(phoneNumber) {
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    
    // Vérifier si l'utilisateur existe déjà
    const existingUser = localStorage.getItem('whatsapp_user');
    if (existingUser) {
        const userData = JSON.parse(existingUser);
        const userPhone = userData.phone.replace(/\D/g, '');
        
        if (userPhone === cleanNumber) {
            // Mettre à jour la dernière connexion
            userData.lastLogin = new Date().toISOString();
            localStorage.setItem('whatsapp_user', JSON.stringify(userData));
            return;
        }
    }
    
    // Si l'utilisateur n'existe pas, créer un compte basique
    const user = {
        phone: formatSenegalPhone(cleanNumber),
        name: `User-${cleanNumber}`,
        firstName: 'Utilisateur',
        lastName: cleanNumber,
        lastLogin: new Date().toISOString()
    };

    localStorage.setItem('whatsapp_user', JSON.stringify(user));
}

/**
 * Récupère les informations de l'utilisateur connecté
 * @returns {object|null} Les données de l'utilisateur ou null
 */
export function getCurrentUser() {
    try {
        const userData = localStorage.getItem('whatsapp_user');
        return userData ? JSON.parse(userData) : null;
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur:', error);
        return null;
    }
}