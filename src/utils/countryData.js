// Données des pays avec indicatifs téléphoniques
export const countries = [
  { code: 'SN', name: 'Sénégal', flag: '🇸🇳', dialCode: '+221', format: 'XX XXX XX XX' },
  { code: 'FR', name: 'France', flag: '🇫🇷', dialCode: '+33', format: 'X XX XX XX XX' },
  { code: 'US', name: 'États-Unis', flag: '🇺🇸', dialCode: '+1', format: 'XXX XXX XXXX' },
  { code: 'GB', name: 'Royaume-Uni', flag: '🇬🇧', dialCode: '+44', format: 'XXXX XXX XXX' },
  { code: 'DE', name: 'Allemagne', flag: '🇩🇪', dialCode: '+49', format: 'XXX XXXXXXX' },
  { code: 'ES', name: 'Espagne', flag: '🇪🇸', dialCode: '+34', format: 'XXX XXX XXX' },
  { code: 'IT', name: 'Italie', flag: '🇮🇹', dialCode: '+39', format: 'XXX XXX XXXX' },
  { code: 'MA', name: 'Maroc', flag: '🇲🇦', dialCode: '+212', format: 'XXX XXX XXX' },
  { code: 'DZ', name: 'Algérie', flag: '🇩🇿', dialCode: '+213', format: 'XXX XXX XXX' },
  { code: 'TN', name: 'Tunisie', flag: '🇹🇳', dialCode: '+216', format: 'XX XXX XXX' },
  { code: 'CI', name: 'Côte d\'Ivoire', flag: '🇨🇮', dialCode: '+225', format: 'XX XX XX XX' },
  { code: 'ML', name: 'Mali', flag: '🇲🇱', dialCode: '+223', format: 'XX XX XX XX' },
  { code: 'BF', name: 'Burkina Faso', flag: '🇧🇫', dialCode: '+226', format: 'XX XX XX XX' },
  { code: 'NE', name: 'Niger', flag: '🇳🇪', dialCode: '+227', format: 'XX XX XX XX' },
  { code: 'GN', name: 'Guinée', flag: '🇬🇳', dialCode: '+224', format: 'XXX XXX XXX' },
  { code: 'MR', name: 'Mauritanie', flag: '🇲🇷', dialCode: '+222', format: 'XX XX XX XX' },
  { code: 'GM', name: 'Gambie', flag: '🇬🇲', dialCode: '+220', format: 'XXX XXXX' },
  { code: 'GW', name: 'Guinée-Bissau', flag: '🇬🇼', dialCode: '+245', format: 'XXX XXXX' },
  { code: 'CV', name: 'Cap-Vert', flag: '🇨🇻', dialCode: '+238', format: 'XXX XXXX' },
  { code: 'SL', name: 'Sierra Leone', flag: '🇸🇱', dialCode: '+232', format: 'XX XXXXXX' },
  { code: 'LR', name: 'Libéria', flag: '🇱🇷', dialCode: '+231', format: 'XX XXX XXXX' },
  { code: 'GH', name: 'Ghana', flag: '🇬🇭', dialCode: '+233', format: 'XXX XXX XXX' },
  { code: 'TG', name: 'Togo', flag: '🇹🇬', dialCode: '+228', format: 'XX XX XX XX' },
  { code: 'BJ', name: 'Bénin', flag: '🇧🇯', dialCode: '+229', format: 'XX XX XX XX' },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬', dialCode: '+234', format: 'XXX XXX XXXX' },
  { code: 'CM', name: 'Cameroun', flag: '🇨🇲', dialCode: '+237', format: 'X XX XX XX XX' },
  { code: 'TD', name: 'Tchad', flag: '🇹🇩', dialCode: '+235', format: 'XX XX XX XX' },
  { code: 'CF', name: 'République centrafricaine', flag: '🇨🇫', dialCode: '+236', format: 'XX XX XX XX' },
  { code: 'GQ', name: 'Guinée équatoriale', flag: '🇬🇶', dialCode: '+240', format: 'XXX XXX XXX' },
  { code: 'GA', name: 'Gabon', flag: '🇬🇦', dialCode: '+241', format: 'X XX XX XX' },
  { code: 'CG', name: 'Congo', flag: '🇨🇬', dialCode: '+242', format: 'XX XXX XXXX' },
  { code: 'CD', name: 'République démocratique du Congo', flag: '🇨🇩', dialCode: '+243', format: 'XXX XXX XXX' },
  { code: 'AO', name: 'Angola', flag: '🇦🇴', dialCode: '+244', format: 'XXX XXX XXX' },
  { code: 'ST', name: 'São Tomé-et-Príncipe', flag: '🇸🇹', dialCode: '+239', format: 'XXX XXXX' },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪', dialCode: '+254', format: 'XXX XXXXXX' },
  { code: 'UG', name: 'Ouganda', flag: '🇺🇬', dialCode: '+256', format: 'XXX XXXXXX' },
  { code: 'TZ', name: 'Tanzanie', flag: '🇹🇿', dialCode: '+255', format: 'XXX XXX XXX' },
  { code: 'RW', name: 'Rwanda', flag: '🇷🇼', dialCode: '+250', format: 'XXX XXX XXX' },
  { code: 'BI', name: 'Burundi', flag: '🇧🇮', dialCode: '+257', format: 'XX XX XX XX' },
  { code: 'DJ', name: 'Djibouti', flag: '🇩🇯', dialCode: '+253', format: 'XX XX XX XX' },
  { code: 'SO', name: 'Somalie', flag: '🇸🇴', dialCode: '+252', format: 'XX XXX XXX' },
  { code: 'ET', name: 'Éthiopie', flag: '🇪🇹', dialCode: '+251', format: 'XX XXX XXXX' },
  { code: 'ER', name: 'Érythrée', flag: '🇪🇷', dialCode: '+291', format: 'X XXX XXX' },
  { code: 'SD', name: 'Soudan', flag: '🇸🇩', dialCode: '+249', format: 'XX XXX XXXX' },
  { code: 'SS', name: 'Soudan du Sud', flag: '🇸🇸', dialCode: '+211', format: 'XX XXX XXXX' },
  { code: 'EG', name: 'Égypte', flag: '🇪🇬', dialCode: '+20', format: 'XXX XXX XXXX' },
  { code: 'LY', name: 'Libye', flag: '🇱🇾', dialCode: '+218', format: 'XX XXX XXXX' },
  { code: 'ZA', name: 'Afrique du Sud', flag: '🇿🇦', dialCode: '+27', format: 'XX XXX XXXX' },
  { code: 'ZW', name: 'Zimbabwe', flag: '🇿🇼', dialCode: '+263', format: 'XX XXX XXXX' },
  { code: 'ZM', name: 'Zambie', flag: '🇿🇲', dialCode: '+260', format: 'XX XXX XXXX' },
  { code: 'MW', name: 'Malawi', flag: '🇲🇼', dialCode: '+265', format: 'X XXX XXXX' },
  { code: 'MZ', name: 'Mozambique', flag: '🇲🇿', dialCode: '+258', format: 'XX XXX XXXX' },
  { code: 'MG', name: 'Madagascar', flag: '🇲🇬', dialCode: '+261', format: 'XX XX XXX XX' },
  { code: 'MU', name: 'Maurice', flag: '🇲🇺', dialCode: '+230', format: 'XXXX XXXX' },
  { code: 'SC', name: 'Seychelles', flag: '🇸🇨', dialCode: '+248', format: 'X XX XX XX' },
  { code: 'KM', name: 'Comores', flag: '🇰🇲', dialCode: '+269', format: 'XXX XXXX' },
  { code: 'YT', name: 'Mayotte', flag: '🇾🇹', dialCode: '+262', format: 'XXX XX XX XX' },
  { code: 'RE', name: 'La Réunion', flag: '🇷🇪', dialCode: '+262', format: 'XXX XX XX XX' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', dialCode: '+1', format: 'XXX XXX XXXX' },
  { code: 'MX', name: 'Mexique', flag: '🇲🇽', dialCode: '+52', format: 'XXX XXX XXXX' },
  { code: 'BR', name: 'Brésil', flag: '🇧🇷', dialCode: '+55', format: 'XX XXXXX XXXX' },
  { code: 'AR', name: 'Argentine', flag: '🇦🇷', dialCode: '+54', format: 'XX XXXX XXXX' },
  { code: 'CL', name: 'Chili', flag: '🇨🇱', dialCode: '+56', format: 'X XXXX XXXX' },
  { code: 'CO', name: 'Colombie', flag: '🇨🇴', dialCode: '+57', format: 'XXX XXX XXXX' },
  { code: 'PE', name: 'Pérou', flag: '🇵🇪', dialCode: '+51', format: 'XXX XXX XXX' },
  { code: 'VE', name: 'Venezuela', flag: '🇻🇪', dialCode: '+58', format: 'XXX XXX XXXX' },
  { code: 'EC', name: 'Équateur', flag: '🇪🇨', dialCode: '+593', format: 'XX XXX XXXX' },
  { code: 'BO', name: 'Bolivie', flag: '🇧🇴', dialCode: '+591', format: 'X XXX XXXX' },
  { code: 'PY', name: 'Paraguay', flag: '🇵🇾', dialCode: '+595', format: 'XXX XXX XXX' },
  { code: 'UY', name: 'Uruguay', flag: '🇺🇾', dialCode: '+598', format: 'X XXX XXXX' },
  { code: 'GY', name: 'Guyana', flag: '🇬🇾', dialCode: '+592', format: 'XXX XXXX' },
  { code: 'SR', name: 'Suriname', flag: '🇸🇷', dialCode: '+597', format: 'XXX XXXX' },
  { code: 'GF', name: 'Guyane française', flag: '🇬🇫', dialCode: '+594', format: 'XXX XX XX XX' },
  { code: 'CN', name: 'Chine', flag: '🇨🇳', dialCode: '+86', format: 'XXX XXXX XXXX' },
  { code: 'JP', name: 'Japon', flag: '🇯🇵', dialCode: '+81', format: 'XX XXXX XXXX' },
  { code: 'KR', name: 'Corée du Sud', flag: '🇰🇷', dialCode: '+82', format: 'XX XXXX XXXX' },
  { code: 'IN', name: 'Inde', flag: '🇮🇳', dialCode: '+91', format: 'XXXXX XXXXX' },
  { code: 'PK', name: 'Pakistan', flag: '🇵🇰', dialCode: '+92', format: 'XXX XXX XXXX' },
  { code: 'BD', name: 'Bangladesh', flag: '🇧🇩', dialCode: '+880', format: 'XXXX XXXXXX' },
  { code: 'LK', name: 'Sri Lanka', flag: '🇱🇰', dialCode: '+94', format: 'XX XXX XXXX' },
  { code: 'MM', name: 'Myanmar', flag: '🇲🇲', dialCode: '+95', format: 'XX XXX XXXX' },
  { code: 'TH', name: 'Thaïlande', flag: '🇹🇭', dialCode: '+66', format: 'XX XXX XXXX' },
  { code: 'VN', name: 'Vietnam', flag: '🇻🇳', dialCode: '+84', format: 'XXX XXX XXXX' },
  { code: 'KH', name: 'Cambodge', flag: '🇰🇭', dialCode: '+855', format: 'XX XXX XXXX' },
  { code: 'LA', name: 'Laos', flag: '🇱🇦', dialCode: '+856', format: 'XX XXX XXXX' },
  { code: 'MY', name: 'Malaisie', flag: '🇲🇾', dialCode: '+60', format: 'XX XXXX XXXX' },
  { code: 'SG', name: 'Singapour', flag: '🇸🇬', dialCode: '+65', format: 'XXXX XXXX' },
  { code: 'ID', name: 'Indonésie', flag: '🇮🇩', dialCode: '+62', format: 'XXX XXXX XXXX' },
  { code: 'PH', name: 'Philippines', flag: '🇵🇭', dialCode: '+63', format: 'XXX XXX XXXX' },
  { code: 'AU', name: 'Australie', flag: '🇦🇺', dialCode: '+61', format: 'XXX XXX XXX' },
  { code: 'NZ', name: 'Nouvelle-Zélande', flag: '🇳🇿', dialCode: '+64', format: 'XX XXX XXXX' },
  { code: 'FJ', name: 'Fidji', flag: '🇫🇯', dialCode: '+679', format: 'XXX XXXX' },
  { code: 'PG', name: 'Papouasie-Nouvelle-Guinée', flag: '🇵🇬', dialCode: '+675', format: 'XXX XXXX' },
  { code: 'NC', name: 'Nouvelle-Calédonie', flag: '🇳🇨', dialCode: '+687', format: 'XX XX XX' },
  { code: 'PF', name: 'Polynésie française', flag: '🇵🇫', dialCode: '+689', format: 'XX XX XX XX' },
  { code: 'RU', name: 'Russie', flag: '🇷🇺', dialCode: '+7', format: 'XXX XXX XX XX' },
  { code: 'KZ', name: 'Kazakhstan', flag: '🇰🇿', dialCode: '+7', format: 'XXX XXX XX XX' },
  { code: 'UZ', name: 'Ouzbékistan', flag: '🇺🇿', dialCode: '+998', format: 'XX XXX XX XX' },
  { code: 'KG', name: 'Kirghizistan', flag: '🇰🇬', dialCode: '+996', format: 'XXX XXX XXX' },
  { code: 'TJ', name: 'Tadjikistan', flag: '🇹🇯', dialCode: '+992', format: 'XX XXX XXXX' },
  { code: 'TM', name: 'Turkménistan', flag: '🇹🇲', dialCode: '+993', format: 'XX XXX XXX' },
  { code: 'AF', name: 'Afghanistan', flag: '🇦🇫', dialCode: '+93', format: 'XX XXX XXXX' },
  { code: 'IR', name: 'Iran', flag: '🇮🇷', dialCode: '+98', format: 'XXX XXX XXXX' },
  { code: 'IQ', name: 'Irak', flag: '🇮🇶', dialCode: '+964', format: 'XXX XXX XXXX' },
  { code: 'SA', name: 'Arabie saoudite', flag: '🇸🇦', dialCode: '+966', format: 'XX XXX XXXX' },
  { code: 'AE', name: 'Émirats arabes unis', flag: '🇦🇪', dialCode: '+971', format: 'XX XXX XXXX' },
  { code: 'QA', name: 'Qatar', flag: '🇶🇦', dialCode: '+974', format: 'XXXX XXXX' },
  { code: 'KW', name: 'Koweït', flag: '🇰🇼', dialCode: '+965', format: 'XXXX XXXX' },
  { code: 'BH', name: 'Bahreïn', flag: '🇧🇭', dialCode: '+973', format: 'XXXX XXXX' },
  { code: 'OM', name: 'Oman', flag: '🇴🇲', dialCode: '+968', format: 'XXXX XXXX' },
  { code: 'YE', name: 'Yémen', flag: '🇾🇪', dialCode: '+967', format: 'XXX XXX XXX' },
  { code: 'JO', name: 'Jordanie', flag: '🇯🇴', dialCode: '+962', format: 'X XXXX XXXX' },
  { code: 'LB', name: 'Liban', flag: '🇱🇧', dialCode: '+961', format: 'XX XXX XXX' },
  { code: 'SY', name: 'Syrie', flag: '🇸🇾', dialCode: '+963', format: 'XXX XXX XXX' },
  { code: 'IL', name: 'Israël', flag: '🇮🇱', dialCode: '+972', format: 'XX XXX XXXX' },
  { code: 'PS', name: 'Palestine', flag: '🇵🇸', dialCode: '+970', format: 'XXX XXX XXX' },
  { code: 'TR', name: 'Turquie', flag: '🇹🇷', dialCode: '+90', format: 'XXX XXX XX XX' },
  { code: 'CY', name: 'Chypre', flag: '🇨🇾', dialCode: '+357', format: 'XX XXX XXX' },
  { code: 'GE', name: 'Géorgie', flag: '🇬🇪', dialCode: '+995', format: 'XXX XXX XXX' },
  { code: 'AM', name: 'Arménie', flag: '🇦🇲', dialCode: '+374', format: 'XX XXX XXX' },
  { code: 'AZ', name: 'Azerbaïdjan', flag: '🇦🇿', dialCode: '+994', format: 'XX XXX XX XX' },
  { code: 'NO', name: 'Norvège', flag: '🇳🇴', dialCode: '+47', format: 'XXX XX XXX' },
  { code: 'SE', name: 'Suède', flag: '🇸🇪', dialCode: '+46', format: 'XX XXX XX XX' },
  { code: 'DK', name: 'Danemark', flag: '🇩🇰', dialCode: '+45', format: 'XX XX XX XX' },
  { code: 'FI', name: 'Finlande', flag: '🇫🇮', dialCode: '+358', format: 'XX XXX XXXX' },
  { code: 'IS', name: 'Islande', flag: '🇮🇸', dialCode: '+354', format: 'XXX XXXX' },
  { code: 'IE', name: 'Irlande', flag: '🇮🇪', dialCode: '+353', format: 'XX XXX XXXX' },
  { code: 'NL', name: 'Pays-Bas', flag: '🇳🇱', dialCode: '+31', format: 'XX XXX XXXX' },
  { code: 'BE', name: 'Belgique', flag: '🇧🇪', dialCode: '+32', format: 'XXX XX XX XX' },
  { code: 'LU', name: 'Luxembourg', flag: '🇱🇺', dialCode: '+352', format: 'XXX XXX XXX' },
  { code: 'CH', name: 'Suisse', flag: '🇨🇭', dialCode: '+41', format: 'XX XXX XX XX' },
  { code: 'AT', name: 'Autriche', flag: '🇦🇹', dialCode: '+43', format: 'XXX XXX XXXX' },
  { code: 'CZ', name: 'République tchèque', flag: '🇨🇿', dialCode: '+420', format: 'XXX XXX XXX' },
  { code: 'SK', name: 'Slovaquie', flag: '🇸🇰', dialCode: '+421', format: 'XXX XXX XXX' },
  { code: 'PL', name: 'Pologne', flag: '🇵🇱', dialCode: '+48', format: 'XXX XXX XXX' },
  { code: 'HU', name: 'Hongrie', flag: '🇭🇺', dialCode: '+36', format: 'XX XXX XXXX' },
  { code: 'SI', name: 'Slovénie', flag: '🇸🇮', dialCode: '+386', format: 'XX XXX XXX' },
  { code: 'HR', name: 'Croatie', flag: '🇭🇷', dialCode: '+385', format: 'XX XXX XXXX' },
  { code: 'BA', name: 'Bosnie-Herzégovine', flag: '🇧🇦', dialCode: '+387', format: 'XX XXX XXX' },
  { code: 'RS', name: 'Serbie', flag: '🇷🇸', dialCode: '+381', format: 'XX XXX XXXX' },
  { code: 'ME', name: 'Monténégro', flag: '🇲🇪', dialCode: '+382', format: 'XX XXX XXX' },
  { code: 'MK', name: 'Macédoine du Nord', flag: '🇲🇰', dialCode: '+389', format: 'XX XXX XXX' },
  { code: 'AL', name: 'Albanie', flag: '🇦🇱', dialCode: '+355', format: 'XX XXX XXXX' },
  { code: 'BG', name: 'Bulgarie', flag: '🇧🇬', dialCode: '+359', format: 'XX XXX XXXX' },
  { code: 'RO', name: 'Roumanie', flag: '🇷🇴', dialCode: '+40', format: 'XXX XXX XXX' },
  { code: 'MD', name: 'Moldavie', flag: '🇲🇩', dialCode: '+373', format: 'XX XXX XXX' },
  { code: 'UA', name: 'Ukraine', flag: '🇺🇦', dialCode: '+380', format: 'XX XXX XX XX' },
  { code: 'BY', name: 'Biélorussie', flag: '🇧🇾', dialCode: '+375', format: 'XX XXX XX XX' },
  { code: 'LT', name: 'Lituanie', flag: '🇱🇹', dialCode: '+370', format: 'XXX XXXXX' },
  { code: 'LV', name: 'Lettonie', flag: '🇱🇻', dialCode: '+371', format: 'XX XXX XXX' },
  { code: 'EE', name: 'Estonie', flag: '🇪🇪', dialCode: '+372', format: 'XXX XXXX' },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹', dialCode: '+351', format: 'XXX XXX XXX' },
  { code: 'GR', name: 'Grèce', flag: '🇬🇷', dialCode: '+30', format: 'XXX XXX XXXX' },
  { code: 'MT', name: 'Malte', flag: '🇲🇹', dialCode: '+356', format: 'XXXX XXXX' }
];

export function getCountryByCode(code) {
  return countries.find(country => country.code === code);
}

export function getCountryByDialCode(dialCode) {
  return countries.find(country => country.dialCode === dialCode);
}

export function formatPhoneNumber(phone, countryCode) {
  const country = getCountryByCode(countryCode);
  if (!country) return phone;
  
  // Remove all non-digit characters except +
  const cleanPhone = phone.replace(/[^\d+]/g, '');
  
  // Remove country code if present
  let localNumber = cleanPhone;
  if (cleanPhone.startsWith(country.dialCode)) {
    localNumber = cleanPhone.substring(country.dialCode.length);
  } else if (cleanPhone.startsWith('+')) {
    localNumber = cleanPhone.substring(country.dialCode.length);
  }
  
  // Apply formatting based on country format
  const format = country.format;
  let formatted = country.dialCode + ' ';
  let numberIndex = 0;
  
  for (let i = 0; i < format.length && numberIndex < localNumber.length; i++) {
    if (format[i] === 'X') {
      formatted += localNumber[numberIndex];
      numberIndex++;
    } else {
      formatted += format[i];
    }
  }
  
  return formatted;
}

export function validatePhoneNumber(phone, countryCode) {
  const country = getCountryByCode(countryCode);
  if (!country) return false;
  
  // Nettoyer le numéro (garder uniquement les chiffres)
  let cleanPhone = phone.replace(/[^\d+]/g, '');
  
  // Pour le Sénégal
  if (countryCode === 'SN') {
    // Si le numéro commence par +221, l'enlever
    if (cleanPhone.startsWith('+221')) {
      cleanPhone = cleanPhone.substring(4);
    } else if (cleanPhone.startsWith('221')) {
      cleanPhone = cleanPhone.substring(3);
    }
    
    // Vérifier la longueur (9 chiffres) et le préfixe
    return cleanPhone.length === 9 && 
           ['77', '78', '75', '70', '76'].includes(cleanPhone.substring(0, 2));
  }
  
  return true;
}