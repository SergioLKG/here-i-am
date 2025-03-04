// Variables sensibles
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = "http://localhost"; // Spotify permite usar localhost como URI

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error("Error: CLIENT_ID o CLIENT_SECRET no están configurados en .env");
  process.exit(1);
}

// Construir la URL de autorización
const authUrl = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(
  REDIRECT_URI
)}&scope=playlist-read-private%20user-read-playback-state%20user-modify-playback-state`;

console.log("Visita esta URL para autorizar tu aplicación:");
console.log(authUrl);

console.log(
  "\nDespués de autorizar, Spotify te redirigirá a una URL como esta:"
);
console.log("http://localhost/?code=<AUTHORIZATION_CODE>");
console.log("\nCopia el parámetro `code` de la URL y pégalo aquí.");

import readline from "readline";
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Ingresa el código aquí: ", async (code) => {
  if (!code) {
    console.error("No se ingresó un código.");
    rl.close();
    process.exit(1);
  }

  // Intercambiar el código por el refresh token
  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization:
          "Basic " + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64"),
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
      console.error("Error al obtener el token:", data);
      process.exit(1);
    }

    console.log("\nTu refresh_token es:");
    console.log(data.refresh_token);

    rl.close();
  } catch (error) {
    console.error("Error durante la solicitud:", error);
    rl.close();
  }
});
