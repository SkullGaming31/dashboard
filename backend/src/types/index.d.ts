import 'passport-discord';

declare module 'passport-discord' {
  interface Profile {
    accessToken?: string;
    refreshToken?: string;
  }
}