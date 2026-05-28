import type { APIRoute } from "astro";

export const prerender = false;

const GITHUB_TOKEN = import.meta.env.GITHUB_TOKEN;

export const GET: APIRoute = async ({ url }) => {
  const username = url.searchParams.get("username");

  if (!username) {
    return new Response(JSON.stringify({ error: "Username is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const headers: HeadersInit = GITHUB_TOKEN
      ? { Authorization: `token ${GITHUB_TOKEN}` }
      : {};

    const [userResponse, reposResponse, eventsResponse] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`, { headers }),
      fetch(`https://api.github.com/users/${username}/repos?per_page=100`, { headers }),
      fetch(`https://api.github.com/users/${username}/events?per_page=30`, { headers }),
    ]);

    if (!userResponse.ok) {
      return new Response(JSON.stringify({ error: "GitHub user not found" }), {
        status: userResponse.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    const [userData, reposData, eventsData] = await Promise.all([
      userResponse.json(),
      reposResponse.json(),
      eventsResponse.json(),
    ]);

    const totalStars = reposData.reduce(
      (acc: number, repo: { stargazers_count: number }) => acc + repo.stargazers_count,
      0
    );

    const contributions = Array.isArray(eventsData)
      ? eventsData.filter((event: { type: string }) => event.type === "PushEvent").length
      : 0;

    return new Response(
      JSON.stringify({
        repos: userData.public_repos,
        followers: userData.followers,
        contributions,
        stars: totalStars,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("GitHub API error:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch GitHub data" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
