<script setup>
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBVQQ4pX5fOgGUFz3AE7mCOzMdtEiI7ogk",
  authDomain: "solvechain-69cea.firebaseapp.com",
  projectId: "solvechain-69cea",
  storageBucket: "solvechain-69cea.firebasestorage.app",
  messagingSenderId: "922090300240",
  appId: "1:922090300240:web:f2bf8c13d6090f15060255",
  measurementId: "G-01SXF6909Z",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
</script>
