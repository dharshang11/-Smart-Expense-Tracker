// Firebase configuration — Replace with your own Firebase project config
// To get these values:
// 1. Go to https://console.firebase.google.com
// 2. Create a new project or use existing
// 3. Go to Project Settings > General > Your apps > Web app
// 4. Copy the config object

const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
};

export default firebaseConfig;

export function isFirebaseConfigured() {
  return firebaseConfig.apiKey !== "" && firebaseConfig.projectId !== "";
}
