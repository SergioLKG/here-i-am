// src/pages/api/generate-token.ts
import type { APIRoute } from "astro";

const SPOTIFY_CLIENT_ID = import.meta.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = import.meta.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = import.meta.env.SPOTIFY_REDIRECT_URL; // Ajusta el URI según sea necesario

if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
  throw new Error(
    "Faltan variables de entorno: SPOTIFY_CLIENT_ID o SPOTIFY_CLIENT_SECRET."
  );
}

// El manejador de la ruta
export const get: APIRoute = async ({ url }) => {
  // Obtener el código de autorización desde la query
  const code = url.searchParams.get("code");

  if (!code) {
    return new Response(
      JSON.stringify({
        error: "Falta el parámetro 'code' en la solicitud.",
      }),
      { status: 400 }
    );
  }

  try {
    // Intercambiar el código por un refresh_token
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString(
            "base64"
          ),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: REDIRECT_URI,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: data.error || "Error al obtener el token." }),
        { status: 500 }
      );
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message || "Error desconocido." }),
      { status: 500 }
    );
  }
};
