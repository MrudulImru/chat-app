<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import { io } from 'socket.io-client';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();
const messages = ref<{ username: string; text: string; }[]>([]);
const newMessage = ref('');
const socket = io('http://localhost:3000');

const sendMessage = () => {
  if (newMessage.value.trim() && authStore.user) {
    const messageData = {
      username: authStore.user.username,
      text: newMessage.value.trim()
    };
    socket.emit('chat message', messageData);
    newMessage.value = '';
  }
};

const handleLogout = () => {
  authStore.logout();
  router.push('/');
};

onMounted(() => {
  socket.on('chat message', (msg) => {
    messages.value.push(msg);
  });
});

onUnmounted(() => {
  socket.disconnect();
});
</script>

<template>
  <div class="flex flex-col h-screen bg-gray-100">
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <h1 class="text-xl font-semibold text-gray-800">Chat Room</h1>
        <div class="flex items-center gap-4">
          <span class="text-gray-600">{{ authStore.user?.username }}</span>
          <button
            @click="handleLogout"
            class="px-3 py-1 text-sm text-red-600 hover:text-red-700"
          >
            Logout
          </button>
        </div>
      </div>
    </header>

    <main class="flex-1 overflow-y-auto p-4">
      <div class="max-w-3xl mx-auto space-y-4">
        <div
          v-for="(message, index) in messages"
          :key="index"
          class="bg-white rounded-lg shadow p-4"
          :class="{
            'ml-auto max-w-lg': message.username === authStore.user?.username
          }"
        >
          <div class="font-medium text-gray-900">{{ message.username }}</div>
          <div class="mt-1 text-gray-800">{{ message.text }}</div>
        </div>
      </div>
    </main>

    <footer class="bg-white border-t">
      <div class="max-w-3xl mx-auto p-4">
        <form @submit.prevent="sendMessage" class="flex gap-4">
          <input
            v-model="newMessage"
            type="text"
            placeholder="Type a message..."
            class="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
          <button
            type="submit"
            class="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Send
          </button>
        </form>
      </div>
    </footer>
  </div>
</template>