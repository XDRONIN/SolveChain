<template>
  <div class="max-w-3xl bg-gray-900 text-white rounded-2xl mt-8 ml-11">
    <h2 class="text-3xl font-bold text-center mb-8 mt-20">Add Details</h2>
    <form @submit.prevent="handleSubmit" class="grid grid-cols-2 gap-6">
      <div v-for="(field, index) in fields" :key="index" class="flex flex-col">
        <label
          :for="field.id"
          class="text-sm font-semibold mb-1 text-gray-400"
          >{{ field.label }}</label
        >
        <input
          v-if="field.type !== 'select' && field.type !== 'file'"
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
      </div>
      <div class="col-span-2 flex flex-col gap-4 mt-4">
        <button
          type="submit"
          class="w-full bg-[#9a46a0] text-white py-3 rounded-lg text-lg font-semibold"
        >
          Sign Up
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { auth, db } from "../fireInit";
import { doc, setDoc, getDoc } from "firebase/firestore";
const route = useRoute();
const router = useRouter();
const { uid, firstName, lastName, email } = route.query;

const form = ref({
  firstName: firstName,
  lastName: lastName,
  email: email,
  username: "",
  areaOfInterest: "",
  fieldOfExpertise: "",
});

const fields = ref([
  { id: "username", label: "Username", type: "text" },
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
]);
const handleSubmit = async () => {
  try {
    await setDoc(doc(db, "users", uid), {
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      email: form.value.email,
      username: form.value.username,
      areaOfInterest: form.value.areaOfInterest,
      fieldOfExpertise: form.value.fieldOfExpertise,
      createdAt: new Date(),
    });

    //alert("User registered successfully!");
    getUserData(uid).then((userData) => {
      //console.log(userData); // Logs only the object
      userData.uid = uid;
      console.log(userData);
      initializeUser(uid).then(() => {
        loginUser(userData).then(() => {
          router.push("/dashboard");
        });
      });
    });
  } catch (error) {
    console.log(error);
  }
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
