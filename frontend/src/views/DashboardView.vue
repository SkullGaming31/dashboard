<template>
  <div v-if="user">
    <h2>Welcome, {{ user.username }}!</h2>
    <p>Select a server to manage:</p>
    <ul>
      <li v-for="guild in manageableGuilds" :key="guild.id">
        {{ guild.name }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import axios from 'axios';

interface Guild {
  id: string;
  name: string;
  permissions: string;
}

interface User {
  username: string;
  guilds: Guild[];
}

export default defineComponent({
  setup() {
    const user = ref<User | null>(null);
    const manageableGuilds = ref<Guild[]>([]); // Define a ref for manageable guilds

    onMounted(async () => {
  try {
    console.log('Mounted');
    const response = await axios.get<User>('http://localhost:3000/dashboard', { withCredentials: true });
    user.value = response.data;

    // Filter the guilds to find those without ManageGuild permissions
    if (user.value && user.value.guilds) {
      manageableGuilds.value = user.value.guilds.filter(guild => {
        const permissions = BigInt(guild.permissions_new); // Use permissions_new for filtering
        const MANAGE_GUILD_PERMISSION = BigInt(0x00000020); // Permission bit for ManageGuild

        // Check if the ManageGuild permission is set
        const hasManageGuildPermission = (permissions & MANAGE_GUILD_PERMISSION) === MANAGE_GUILD_PERMISSION;

        // Debug: Log the result of permission check
        console.log(`Guild: ${guild.name}, Has ManageGuild permission: ${hasManageGuildPermission}`);

        return !hasManageGuildPermission; // Exclude guilds where permission is set
      });
    }

    // Debug: Log manageable guilds
    console.log('Manageable Guilds:', manageableGuilds.value);
  } catch (err) {
    console.error('Failed to fetch user data:', err);
  }
});

    return { user, manageableGuilds };
  },
});
</script>