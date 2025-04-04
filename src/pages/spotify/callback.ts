// src/pages/spotify/callback.ts
export const prerender = false;

import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ request, cookies, redirect }) => {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return new Response("No authorization code, param: " + code, {
      status: 400,
    });
  }

  try {
    // Intercambio de código por token
    const tokenResponse = await fetch(
      "https://accounts.spotify.com/api/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${btoa(
            `${import.meta.env.SPOTIFY_CLIENT_ID}:${
              import.meta.env.SPOTIFY_CLIENT_SECRET
            }`
          )}`,
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code: code,
          redirect_uri: import.meta.env.SPOTIFY_REDIRECT_URL,
        }),
      }
    );

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error("Token exchange error:", errorText);
      return new Response("Failed to exchange token", {
        status: tokenResponse.status,
      });
    }

    const tokenData = await tokenResponse.json();

    // Obtener información adicional del usuario
    const userResponse = await fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    const userData = await userResponse.json();

    cookies.set("spotify_access_token", tokenData.access_token, {
      httpOnly: true,
      secure: import.meta.env.PROD, // Solo en HTTPS en producción
      path: "/",
      maxAge: tokenData.expires_in, // Tiempo de expiración del token
    });

    cookies.set("spotify_refresh_token", tokenData.refresh_token, {
      httpOnly: true,
      secure: import.meta.env.PROD,
      path: "/",
      maxAge: 30 * 24 * 60 * 60, // 30 días
    });

    cookies.set("spotify_user_id", userData.id, {
      httpOnly: false,
      path: "/",
      maxAge: 30 * 24 * 60 * 60, // 30 días
    });

    // Redirigir a la página principal o a donde quieras
    return redirect("/");
  } catch (error) {
    console.error("Spotify authentication error:", error);

    // Manejar cualquier error durante el proceso
    return new Response("Authentication failed", { status: 500 });
  }
};
