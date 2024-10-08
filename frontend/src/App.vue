<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { RouterLink, RouterView, useRouter } from 'vue-router';
import axios from 'axios';

const isLoggedIn = ref(false); // Reactive variable to track login status
const router = useRouter(); // Use the router to navigate programmatically

// Function to log in
function login(): void {
  window.location.href = 'http://localhost:3000/api/v1/auth/discord/redirect';
}

// Function to log out
async function logout(): Promise<void> {
  try {
    await axios.get('http://localhost:3000/api/v1/auth/logout', { withCredentials: true });
    isLoggedIn.value = false; // Update login status
    window.location.href = 'http://localhost:5173/'; // Redirect to your frontend root
  } catch (error) {
    console.error('Logout error:', error); // Handle any error
  }
}

// Check if the user is logged in on component mount
onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:3000/dashboard', { withCredentials: true });
    isLoggedIn.value = response.data.manageableGuilds.length > 0; // Adjust based on your user data

    // If not logged in, redirect to the home view
    if (!isLoggedIn.value) {
      router.push('/'); // Redirect to home view
    }
  } catch (error) {
    console.error('Failed to check login status:', error);
    // Redirect to home view on error (optional)
    router.push('/'); // Redirect to home view if there was an error
  }
});
</script>

<template>
  <header>
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <div>
        <h1>Discord Bot Dashboard</h1>
      </div>

      <nav>
        <button v-if="isLoggedIn" @click="logout">Logout</button>
      <button v-else @click="login">Login with Discord</button>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
