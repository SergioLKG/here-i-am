import type { APIRoute } from "astro";

// Variables de entorno
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN;


export const get: APIRoute = async () => {
  if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
    return new Response(
      JSON.stringify({ error: "Faltan variables de entorno" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  // Ejemplo: Solicitar un token de acceso usando el refresh token
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64"),
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: REFRESH_TOKEN,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Devuelve el token de acceso como respuesta
  return new Response(JSON.stringify({ access_token: data.access_token }), {
    headers: { "Content-Type": "application/json" },
  });
};
