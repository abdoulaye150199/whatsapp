export function formatPhoneNumber(phone) {
  let formattedPhone = phone.replace(/\D/g, '');
  if (!formattedPhone.startsWith('221')) {
    formattedPhone = '221' + formattedPhone;
  }
  return '+' + formattedPhone;
}