<template>
  <div class="max-w-3xl bg-gray-900 text-white rounded-2xl mt-12">
    <h2 class="text-3xl font-bold text-center mb-6">Sign Up</h2>
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
        <input
          v-if="field.type === 'file'"
          type="file"
          :id="field.id"
          @change="handleFileUpload"
          class="inpt"
        />
      </div>
      <div class="col-span-2 flex flex-col gap-4 mt-4">
        <button
          type="submit"
          class="w-full bg-[#9a46a0] text-white py-3 rounded-lg text-lg font-semibold"
        >
          Sign Up
        </button>
        <button
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
          <a href="/login" class="text-[#9a46a0] hover:underline">Login</a>
        </p>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";

const form = ref({
  firstName: "",
  lastName: "",
  email: "",
  username: "",
  password: "",
  areaOfInterest: "",
  fieldOfExpertise: "",
  verificationDocuments: null,
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
      "Web Development",
      "Cybersecurity",
      "Cloud Computing",
      "Blockchain",
    ],
  },
  {
    id: "fieldOfExpertise",
    label: "Field of Expertise (Optional)",
    type: "text",
  },
  {
    id: "verificationDocuments",
    label: "Verification Documents (Optional)",
    type: "file",
  },
]);

const handleSubmit = () => {
  console.log("Form submitted", form.value);
};

const handleFileUpload = (event) => {
  form.value.verificationDocuments = event.target.files[0];
};

const signUpWithGoogle = () => {
  console.log("Signing up with Google");
};
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
