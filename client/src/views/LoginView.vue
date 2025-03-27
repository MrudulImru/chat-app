<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import InputField from "../components/Reusable/form/InputField.vue";
import Button from "../components/Reusable/form/Button.vue";

const username = ref("imru");
const password = ref("12345");
const router = useRouter();
const authStore = useAuthStore();

const handleLogin = async () => {
  try {
    if (username.value.trim()) {
      await authStore.login(username.value, password.value);
      // router.push("/chat");
    }
  } catch (error) {
    console.log(error);
  }
};
</script>

<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center">
    <div class="bg-white p-8 rounded-lg shadow-md w-96">
      <h1 class="text-2xl font-bold mb-6 text-center text-gray-800">
        Chat Login
      </h1>
      <div class="flex flex-col gap-4">
        <input-field v-model="username" label="Username" inputClasses="mb-4" />
        <input-field v-model="password" label="Password" />
        <Button label="Login" @click.stop="handleLogin" />
      </div>
    </div>
  </div>
</template>
