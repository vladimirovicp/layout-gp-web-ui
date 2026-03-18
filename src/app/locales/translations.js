import en from './en.js';
import ru from './ru.js';

const translations = { en, ru };
let currentLang = 'en';

export function t(key) {
  const keys = key.split('.');
  let value = translations[currentLang];
  
  for (const k of keys) {
    if (value && value[k] !== undefined) {
      value = value[k];
    } else {
      return key; // Ключ не найден
    }
  }
  
  return value;
}

export function setLanguage(lang) {
  if (translations[lang]) {
    currentLang = lang;
  }
}

export function getLanguage() {
  return currentLang;
}