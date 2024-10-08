<template>
  <div>
    <div v-if="isLoggedIn">
      <div v-if="manageableGuilds.length > 0">
        <h3>Your Manageable Guilds</h3>
        <ul class="guild-list">
          <li v-for="guild in manageableGuilds" :key="guild.id">
            <RouterLink :to="{ name: 'EditSettings', params: { guildId: guild.id } }">
              <div class="guild-item">
                <!-- Check if the guild icon exists -->
                <img v-if="guild.icon" :src="`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`" alt="Guild Icon" class="guild-icon" />
                <span>{{ guild.name }}</span>
              </div>
            </RouterLink>
          </li>
        </ul>
      </div>
      <div v-else>
        <p>No manageable guilds found.</p>
      </div>
    </div>
    <div v-else>
      <p>You are logged out. Please log in.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';

const isLoggedIn = ref(false);
const manageableGuilds = ref([]);

// Function to check login status
const checkLoginStatus = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/v1/auth/status', { withCredentials: true });
    isLoggedIn.value = response.data.isLoggedIn;

    if (isLoggedIn.value) {
      const guildResponse = await axios.get('http://localhost:3000/dashboard', { withCredentials: true });
      manageableGuilds.value = guildResponse.data.manageableGuilds;
    }
  } catch (error) {
    // Log the specific error message from the server
    console.error('Failed to check login status:', error.response ? error.response.data : error.message);
    
    // Optionally handle unauthorized case
    if (error.response && error.response.status === 401) {
      isLoggedIn.value = false; // Treat unauthorized as logged out
      manageableGuilds.value = [];
    }
  }
};


// Check if the user is logged in on component mount
onMounted(() => {
  checkLoginStatus();
});

// Watch for changes in isLoggedIn to refresh manageableGuilds
watch(isLoggedIn, (newValue) => {
  if (newValue) {
    checkLoginStatus();
  } else {
    manageableGuilds.value = []; // Clear the guilds if logged out
  }
});
</script>

<style scoped>
.guild-list {
  list-style-type: none; /* Remove default bullet points */
  padding: 0; /* Remove default padding */
  margin: 0; /* Remove default margin */
}

.guild-item {
  display: flex;
  align-items: center; /* Align icon and text vertically */
}

.guild-icon {
  width: 24px; /* Set a suitable width */
  height: 24px; /* Set a suitable height */
  margin-right: 8px; /* Space between icon and text */
}
</style>