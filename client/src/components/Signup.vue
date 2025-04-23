<template>
  <div class="max-w-3xl bg-gray-900 text-white rounded-2xl mt-8 -ml-9">
    <h2 class="text-3xl font-bold text-center mb-8 mt-20">Sign Up</h2>
    <form @submit.prevent="handleSubmit" class="grid grid-cols-2 gap-6">
      <div v-for="(field, index) in fields" :key="index" class="flex flex-col">
        <label
          :for="field.id"
          class="text-sm font-semibold mb-1 text-gray-400"
          >{{ field.label }}</label
        >
        <input
          v-if="
            field.type !== 'select' &&
            field.type !== 'file' &&
            field.type !== 'wallet'
          "
          :type="field.type"
          :id="field.id"
          v-model="form[field.id]"
          required
          class="inpt"
        />
        <select
          v-if="field.type === 'select'"
          :id="field.id"
          v-model="form[field.id]"
          class="inpt"
        >
          <option v-for="option in field.options" :key="option" :value="option">
            {{ option }}
          </option>
        </select>
        <div v-if="field.type === 'wallet'" class="flex gap-2">
          <input
            :id="field.id"
            v-model="form[field.id]"
            type="text"
            readonly
            :placeholder="walletPlaceholder"
            class="inpt flex-grow"
          />
          <button
            type="button"
            @click="connectWallet"
            :disabled="isConnecting"
            class="bg-[#9a46a0] text-white py-2 px-4 rounded-lg"
          >
            {{ isConnected ? "Connected" : "Connect" }}
          </button>
        </div>
      </div>
      <div class="col-span-2 flex flex-col gap-4 mt-4">
        <button
          type="submit"
          class="w-full bg-[#9a46a0] text-white py-3 rounded-lg text-lg font-semibold"
        >
          Sign Up
        </button>
        <button
          type="button"
          @click="signUpWithGoogle"
          class="w-full flex items-center justify-center gap-3 bg-white text-black py-3 rounded-lg text-lg font-semibold"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            width="24"
            height="24"
          >
            <path
              fill="#4285F4"
              d="M24 9.5c3.06 0 5.72 1.05 7.85 2.78l5.79-5.79C33.61 3.12 29.07 1 24 1 14.61 1 6.48 6.46 3.09 14.22l6.72 5.21C11.18 14.11 17.06 9.5 24 9.5z"
            ></path>
            <path
              fill="#34A853"
              d="M46.96 24.5c0-1.5-.12-3-.35-4.5H24v9h13.09c-.59 3.25-2.58 6.01-5.56 7.89l8.56 6.63C44.04 38.49 46.96 32 46.96 24.5z"
            ></path>
            <path
              fill="#FBBC05"
              d="M10.4 28.57C9.52 26.82 9 24.94 9 23c0-1.94.52-3.82 1.4-5.57l-6.72-5.21C1.49 15.03 0 18.33 0 23c0 4.67 1.49 8.97 4.68 12.21l6.72-5.64z"
            ></path>
            <path
              fill="#EA4335"
              d="M24 47c6.47 0 11.87-2.14 15.86-5.81l-8.56-6.63c-2.36 1.54-5.32 2.44-8.41 2.44-6.94 0-12.82-4.61-14.19-10.72l-6.72 5.64C6.48 41.54 14.61 47 24 47z"
            ></path>
          </svg>
          Sign Up with Google
        </button>
        <p class="text-center text-lg">
          Already have an account?
          <a @click="toLogin()" class="text-[#9a46a0] hover:underline">Login</a>
        </p>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import router from "../router";
import { auth, db } from "../fireInit";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import Web3Service from "../services/web3Service"; // Adjust path as needed

const provider = new GoogleAuthProvider();
const isConnecting = ref(false);
const isConnected = ref(false);
const walletPlaceholder = ref("Connect your wallet");

const toLogin = () => {
  router.push({ path: "/signUp", query: { type: "login" } });
};

const form = ref({
  firstName: "",
  lastName: "",
  email: "",
  username: "",
  password: "",
  areaOfInterest: "",
  fieldOfExpertise: "",
  role: "user",
  walletId: "",
});

const fields = ref([
  { id: "firstName", label: "First Name", type: "text" },
  { id: "lastName", label: "Last Name", type: "text" },
  { id: "email", label: "Email", type: "email" },
  { id: "username", label: "Username", type: "text" },
  { id: "password", label: "Password", type: "password" },
  {
    id: "areaOfInterest",
    label: "Area of Interest",
    type: "select",
    options: [
      "Tech",
      "Mechanical",
      "Electrical",
      "Medical",
      "Law",
      "Everyday Skills",
      "Others",
    ],
  },
  { id: "fieldOfExpertise", label: "Field Of Expertise", type: "text" },
  { id: "walletId", label: "Wallet Address", type: "wallet" },
]);

const connectWallet = async () => {
  try {
    isConnecting.value = true;
    walletPlaceholder.value = "Connecting...";

    const result = await Web3Service.connectWallet();

    if (result.success) {
      form.value.walletId = result.address;
      isConnected.value = true;
      console.log("Wallet connected:", result.address);
    } else {
      console.error("Failed to connect wallet:", result.error);
      walletPlaceholder.value = "Connection failed. Try again.";
    }
  } catch (error) {
    console.error("Error connecting wallet:", error);
    walletPlaceholder.value = "Connection error. Try again.";
  } finally {
    isConnecting.value = false;
  }
};

const handleSubmit = async () => {
  try {
    // Create user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      form.value.email,
      form.value.password
    );
    const user = userCredential.user;
    await setDoc(doc(db, "users", user.uid), {
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      email: form.value.email,
      username: form.value.username,
      areaOfInterest: form.value.areaOfInterest,
      fieldOfExpertise: form.value.fieldOfExpertise,
      role: form.value.role,
      walletId: form.value.walletId, // Save wallet address to Firestore
      createdAt: new Date(),
    });

    // alert("User registered successfully!");
    signInWithEmailAndPassword(auth, form.value.email, form.value.password)
      .then((userCredential) => {
        // Signed in
        console.log("signed in");
        const user = userCredential.user;
        // console.log(user.uid);
        const currUid = user.uid;
        getUserData(currUid).then((userData) => {
          //console.log(userData); // Logs only the object
          userData.uid = currUid;
          console.log(userData);
          initializeUser(currUid);
          loginUser(userData);
          router.push("/dashboard");
        });

        //
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  } catch (error) {
    console.log(error);
  }
};

const signUpWithGoogle = () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      const uid = user.uid;
      const email = user.email;
      const displayName = user.displayName || "";
      const [firstName, lastName] =
        displayName.split(" ").length > 1
          ? displayName.split(" ")
          : [displayName, ""];

      // Redirect with user details in query parameters
      router.push({
        path: "/signUp",
        query: { type: "GSignup", uid, firstName, lastName, email },
      });
    })
    .catch((error) => {
      console.error("Google Sign-In Error:", error);
    });
};

async function getUserData(uid) {
  try {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return userSnap.data(); // Returns the user's document data
    } else {
      console.log("No such user document found!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user document:", error);
    return null;
  }
}

async function loginUser(userData) {
  const response = await fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userData }), // Send full user data
  });

  const result = await response.json();
  console.log(result);
}

async function initializeUser(userId) {
  try {
    const response = await fetch("/api/initializeUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ _id: userId }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log("Success:", data.message);
    } else {
      console.error("Error:", data.error);
    }
  } catch (error) {
    console.error("Request failed:", error);
  }
}

// Check for cached wallet connection on component mount
onMounted(() => {
  if (Web3Service.signer) {
    Web3Service.signer
      .getAddress()
      .then((address) => {
        form.value.walletId = address;
        isConnected.value = true;
      })
      .catch(console.error);
  }
});
</script>

<style scoped>
.inpt {
  width: 100%;
  border-radius: 0.525rem;
  border: 1.4px solid rgba(55, 65, 81, 1);
  outline: 0;
  background-color: rgba(17, 24, 39, 1);
  padding: 1.05rem 1.4rem;
  color: rgba(243, 244, 246, 1);
}
.inpt:focus {
  border-color: #9a46a0;
}
</style>
