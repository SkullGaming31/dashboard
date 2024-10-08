// custom.d.ts
import 'passport';

interface GuildInfo {
  id: string;
  name: string;
  icon?: string;
  banner?: string;
  owner: boolean;
  permissions: number;
  features: string[];
}

interface Guild extends GuildInfo {
  permissions_new: string; // Add this property since it's required
}

// Extend the User interface in Express
declare global {
  namespace Express {
    interface User {
      id: string; // Ensure id is included
      username: string;
      avatar: string | null; // Change this line to allow null
      discriminator: string;
      public_flags: number;
      flags: number;
      banner?: string | null;
      accent_color?: number | null;
      global_name?: string | null;
      mfa_enabled: boolean;
      locale: string;
      premium_type: number;
      provider: string;
      accessToken?: string;
      refreshToken?: string;
      guilds: Guild[]; // Ensure this is the Guild type
    }
  }
}