<template>
  <div>
    <h1>Edit Settings for Guild: {{ guildId }}</h1>
    <!-- Add your form and settings here -->
  </div>
</template>

<script setup lang="ts">
// Define props directly without importing
const props = defineProps<{ guildId: string }>();
</script>

<style scoped>
/* Add your styles here */
</style>