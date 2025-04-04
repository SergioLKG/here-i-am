// src/pages/api/spotify-refresh.ts
export const prerender = false

import type { APIRoute } from "astro"

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const { refreshToken } = await request.json()

    if (!refreshToken) {
      return new Response(JSON.stringify({ error: "Refresh token is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Exchange refresh token for new access token
    const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${btoa(`${import.meta.env.SPOTIFY_CLIENT_ID}:${import.meta.env.SPOTIFY_CLIENT_SECRET}`)}`,
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }),
    })

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text()
      console.error("Token refresh error:", errorText)
      return new Response(JSON.stringify({ error: "Failed to refresh token" }), {
        status: tokenResponse.status,
        headers: { "Content-Type": "application/json" },
      })
    }

    const tokenData = await tokenResponse.json()

    // Update cookies
    cookies.set("spotify_access_token", tokenData.access_token, {
      httpOnly: true,
      secure: import.meta.env.PROD,
      path: "/",
      maxAge: tokenData.expires_in,
    })

    // If a new refresh token is provided, update it too
    if (tokenData.refresh_token) {
      cookies.set("spotify_refresh_token", tokenData.refresh_token, {
        httpOnly: true,
        secure: import.meta.env.PROD,
        path: "/",
        maxAge: 30 * 24 * 60 * 60, // 30 days
      })
    }

    return new Response(
      JSON.stringify({
        access_token: tokenData.access_token,
        expires_in: tokenData.expires_in,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    )
  } catch (error) {
    console.error("Spotify token refresh error:", error)
    return new Response(JSON.stringify({ error: "Token refresh failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}