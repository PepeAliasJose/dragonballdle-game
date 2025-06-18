import { initializeApp } from 'firebase/app'

export function shuffle (a) {
  if (a != undefined) {
    //console.log('Original: ', a.length)
    let currentIndex = a.length
    while (currentIndex != 0) {
      let randomIndex = Math.floor(Math.random() * currentIndex)
      currentIndex--
      ;[a[currentIndex], a[randomIndex]] = [a[randomIndex], a[currentIndex]]
    }
    //console.log('Shuffle: ', a.length)
    return a
  } else {
    return a
  }
}

const userTimezoneOffset = new Date().getTimezoneOffset() * 60000

export const todayDateValueCalc = Math.floor(
  (new Date().getTime() -
    userTimezoneOffset -
    new Date(2023, 9, 10).getTime()) /
    (1000 * 60 * 60 * 24)
) //Calculo para tener un dia cada 1

export function firebaseApp () {
  const firebaseConfig = {
    apiKey: import.meta.env.VITE_APP_API_KEY,
    authDomain: import.meta.env.VITE_APP_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_APP_PROJECT_ID,
    databaseURL: 'https://xxxxxx.firebaseio.com',
    storageBucket: import.meta.env.VITE_APP_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_APP_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_APP_ID,
    measurementId: import.meta.env.VITE_APP_MEASUREMENT_ID
  }

  // Initialize Firebase
  return initializeApp(firebaseConfig)
}
