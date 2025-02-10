<style scoped>
.form-container {
  width: 448px;
  border-radius: 1.05rem;
  background-color: rgba(17, 24, 39, 1);
  padding: 2.8rem;
  color: rgba(243, 244, 246, 1);
}

.title {
  text-align: center;
  font-size: 2.1rem;
  line-height: 2.8rem;
  font-weight: 700;
}

.form {
  margin-top: 2.1rem;
}

.input-group {
  margin-top: 0.35rem;
  font-size: 1.225rem;
  line-height: 1.75rem;
}

.input-group label {
  display: block;
  color: rgba(156, 163, 175, 1);
  margin-bottom: 5.6px;
}

.input-group input {
  width: 100%;
  border-radius: 0.525rem;
  border: 1.4px solid rgba(55, 65, 81, 1);
  outline: 0;
  background-color: rgba(17, 24, 39, 1);
  padding: 1.05rem 1.4rem;
  color: rgba(243, 244, 246, 1);
}

.input-group input:focus {
  border-color: #9a46a0;
}

.forgot {
  display: flex;
  justify-content: flex-end;
  font-size: 1.05rem;
  line-height: 1.4rem;
  color: rgba(156, 163, 175, 1);
  margin: 11.2px 0 19.6px 0;
}

.forgot a,
.signup a {
  color: rgba(243, 244, 246, 1);
  text-decoration: none;
  font-size: 19.6px;
}

.forgot a:hover,
.signup a:hover {
  text-decoration: underline rgba(167, 139, 250, 1);
}

.sign {
  display: block;
  width: 100%;
  background-color: #9a46a0;
  padding: 1.05rem;
  text-align: center;
  color: rgba(17, 24, 39, 1);
  border: none;
  border-radius: 0.525rem;
  font-weight: 600;
}

.social-message {
  display: flex;
  align-items: center;
  padding-top: 1.4rem;
}

.line {
  height: 1.4px;
  flex: 1 1 0%;
  background-color: rgba(55, 65, 81, 1);
}

.social-message .message {
  padding-left: 1.05rem;
  padding-right: 1.05rem;
  font-size: 1.225rem;
  line-height: 1.75rem;
  color: rgba(156, 163, 175, 1);
}

.social-icons {
  display: flex;
  justify-content: center;
}

.social-icons .icon {
  border-radius: 0.175rem;
  padding: 1.05rem;
  border: none;
  background-color: transparent;
  margin-left: 11.2px;
}

.social-icons .icon svg {
  height: 1.75rem;
  width: 1.75rem;
  fill: #fff;
}

.signup {
  text-align: center;
  font-size: 1.05rem;
  line-height: 1.4rem;
  color: rgba(156, 163, 175, 1);
}
</style>
<template>
  <div class="form-container">
    <p class="title">Login</p>
    <form class="form" @submit.prevent="handleClick">
      <div class="input-group">
        <label for="email">Email</label>
        <input type="text" name="email" id="email" v-model="email" />
      </div>
      <div class="input-group">
        <label for="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          v-model="password"
        />
        <div class="forgot">
          <a href="#">Forgot Password?</a>
        </div>
      </div>
      <button type="submit" class="hover:bg-purple-700 sign">Sign in</button>
    </form>
    <div class="social-message">
      <div class="line"></div>
      <p class="message">Login with social accounts</p>
      <div class="line"></div>
    </div>
    <div class="social-icons">
      <button aria-label="Log in with Google" class="icon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          class="w-5 h-5 fill-current"
        >
          <path
            d="M16.318 13.714v5.484h9.078c-0.37 2.354-2.745 6.901-9.078 6.901-5.458 0-9.917-4.521-9.917-10.099s4.458-10.099 9.917-10.099c3.109 0 5.193 1.318 6.38 2.464l4.339-4.182c-2.786-2.599-6.396-4.182-10.719-4.182-8.844 0-16 7.151-16 16s7.156 16 16 16c9.234 0 15.365-6.49 15.365-15.635 0-1.052-0.115-1.854-0.255-2.651z"
          ></path>
        </svg>
      </button>
    </div>
    <p class="signup">
      Don't have an account?
      <a @click="toSignup">Sign up</a>
    </p>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { auth } from "../fireInit";
import { signInWithEmailAndPassword } from "firebase/auth";
import router from "../router";

const email = ref("");
const password = ref("");

const handleClick = async () => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email.value,
      password.value
    );
    console.log("User signed in:", userCredential.user);
    router.push("/dashboard"); // Redirect user after login
  } catch (error) {
    alert("Wrong Credentialls");
  }
};
const toSignup = () => {
  router.push({ path: "/signUp", query: { type: "signup" } });
};
</script>
