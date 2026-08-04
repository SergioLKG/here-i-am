/// <reference path="../.astro/types.d.ts" />
interface ImportMetaEnv {
  readonly GITHUB_API_TOKEN: string;
  readonly GITHUB_API_USER: string;
  readonly GMAIL_USER: string;
  readonly GMAIL_APP_PASSWORD: string;
  readonly GMAIL_TO: string;
  readonly PROD: string;
  readonly SPOTIFY_CLIENT_ID: string;
  readonly SPOTIFY_CLIENT_SECRET: string;
  readonly SPOTIFY_FALLBACK_PLAYLIST: string;
  readonly SPOTIFY_REDIRECT_URL: string;
  readonly THIS_DOMAIN: string;
  readonly VERCEL_OIDC_TOKEN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}