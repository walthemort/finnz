export const attachmentLimits = { count: 4, each: 3 * 1024 * 1024, total: 8 * 1024 * 1024 };
export const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
export const jobTypes = ['Terrasse', 'Afskærmning', 'Havehus', 'Andet'];
export function validateEnquiry(data) {
  const errors = {};
  if (!data.name?.trim() || data.name.length > 100) errors.name = 'Skriv dit navn (højst 100 tegn).';
  if (!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(data.email || '') || data.email.length > 254) errors.email = 'Skriv en gyldig e-mailadresse.';
  if (data.callback && ((data.phone || '').length > 30 || !/^[+\d\s().-]+$/.test(data.phone || ''))) errors.phone = 'Skriv et telefonnummer, vi kan ringe til.';
  if (data.callback && ((data.phone || '').replace(/\D/g, '').length < 7 || (data.phone || '').replace(/\D/g, '').length > 15)) errors.phone = 'Skriv et gyldigt telefonnummer med 7–15 cifre.';
  if (data.jobType && !jobTypes.includes(data.jobType)) errors.jobType = 'Vælg en af opgavetyperne.';
  for (const field of ['length', 'width', 'height']) {
    const value = String(data[field] || '').trim();
    if (value && (!/^\d+(?:[,.]\d{1,2})?$/.test(value) || Number(value.replace(',', '.')) <= 0 || Number(value.replace(',', '.')) > 50000)) errors[field] = 'Skriv et mål mellem 0 og 50.000 cm.';
  }
  if (!data.message?.trim() || data.message.trim().length < 10 || data.message.length > 4000) errors.message = 'Fortæl lidt om din idé (10–4.000 tegn).';
  if (data.material && !['Lys', 'Sort', 'Afklares sammen'].includes(data.material)) errors.material = 'Vælg lys, sort eller lad os finde farven sammen.';
  return errors;
}
export function validateAttachments(files) {
  if (files.length > attachmentLimits.count) return 'Du kan vedhæfte højst 4 filer.';
  if (files.some(file => !allowedTypes.includes(file.type))) return 'Vælg JPG, PNG, WebP eller PDF.';
  if (files.some(file => file.size === 0 || file.size > attachmentLimits.each)) return 'Hver fil skal være mellem 1 byte og 3 MB.';
  if (files.reduce((sum, file) => sum + file.size, 0) > attachmentLimits.total) return 'Filerne må samlet fylde højst 8 MB.';
  return '';
}
export function enquiryText(data) {
  const dimensions = [['Længde', data.length], ['Bredde', data.width], ['Højde', data.height]].filter(([, value]) => value).map(([name, value]) => `${name}: ${value} cm`).join('\n');
  return `Hej Finnz Træ & Design,\n\n${data.message.trim()}\n\nOpgave: ${data.jobType || 'Afklares sammen'}\nFarveønske: ${data.material || 'Afklares sammen'}${dimensions ? '\n' + dimensions : ''}\n${data.callback ? 'Ring mig gerne op på: ' + data.phone : 'Kontakt: E-mail'}\n\nVenlig hilsen\n${data.name.trim()}\n${data.email.trim()}`;
}

export function createRequestId() {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 15) | 64; bytes[8] = (bytes[8] & 63) | 128;
  const hex = [...bytes].map(value => value.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`;
}
