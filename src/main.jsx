import { render } from 'preact'
import './index.css'
import './animations.css'
import { App } from './app.jsx'

import { I18nextProvider } from 'react-i18next'
import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'

import global_en from './locales/en/translate.json'
import global_es from './locales/es/translate.json'
import global_pt from './locales/pt/translate.json'

const options = {
  order: ['navigator', 'localStorage', 'sessionStorage', 'cookie', 'subdomain'],
  lookupLocalStorage: 'lng'
}

const fallaback = localStorage.getItem('lng')

i18next.use(initReactI18next).init({
  detection: options,
  //lng: "en",
  resources: {
    en: { global: global_en },
    es: { global: global_es },
    pt: { global: global_pt }
  },
  interpolation: { escapeValue: false },
  supportedLngs: ['es', 'en', 'zh', 'ja', 'pt'],
  fallbackLng: fallaback || 'en'
})

render(
  <I18nextProvider i18n={i18next}>
    <App />
  </I18nextProvider>,
  document.getElementById('app')
)
