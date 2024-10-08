<script setup lang="ts">
import AuthHandler from '../components/AuthHandler.vue'; // Ensure the .vue extension is included

</script>

<template>
  <div>
    <AuthHandler />
  </div>
</template>


<style scoped>
.guild-item {
  display: flex;
  align-items: center; /* Align items vertically centered */
  margin-bottom: 10px; /* Add some space between guild items */
}

.guild-info {
  display: flex;
  align-items: center; /* Align the icon and name vertically centered */
}

.guild-icon {
  width: 40px; /* Icon size */
  height: 40px; /* Icon size */
  margin-right: 20px; /* Space between the icon and name */
}

.guild-name {
  margin: 0; /* Remove default margin for h2 */
}
</style>
