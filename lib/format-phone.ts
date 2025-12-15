export function formatPhone(phone: string): string {
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format as (XXX) XXX-XXXX
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  // Format as (XXX) XXX-XXXX for 11 digits (removing leading 1)
  if (cleaned.length === 11 && cleaned[0] === '1') {
    return `(${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  
  // Return original if not standard format
  return phone;
}

export function formatPhoneDashed(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  const digits = cleaned.length === 11 && cleaned[0] === '1' ? cleaned.slice(1) : cleaned

  if (digits.length === 10) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`
  }

  return phone
}
