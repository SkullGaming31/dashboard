<template>
  <div>
    <h1>Discord Bot Dashboard</h1>
    <button @click="login">Login with Discord</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  methods: {
    login() {
      window.location.href = 'http://localhost:3000/api/v1/auth/discord/redirect';
    },
  },
});
</script>