"use client";

import { useState, useEffect } from "react";
import { Github, GitCommit, Star } from "lucide-react";

interface GitHubWidgetProps {
  username: string;
  lang: "es" | "en";
  token?: string;
}

export default function GitHubWidget({ 
  username, 
  lang, 
  token 
}: GitHubWidgetProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState({
    repos: 0,
    followers: 0,
    contributions: 0,
    stars: 0,
  });

  const translations = {
    en: {
      title: "GitHub Activity",
      repos: "Repositories",
      followers: "Followers",
      contributions: "Contributions",
      stars: "Stars",
      viewProfile: "View GitHub Profile",
      loading: "Loading GitHub data...",
      error: "Failed to load GitHub data",
    },
    es: {
      title: "Actividad de GitHub",
      repos: "Repositorios",
      followers: "Seguidores",
      contributions: "Contribuciones",
      stars: "Estrellas",
      viewProfile: "Ver Perfil de GitHub",
      loading: "Cargando datos de GitHub...",
      error: "Error al cargar datos de GitHub",
    },
  };

  const t = translations[lang];

  useEffect(() => {
    const fetchGitHubData = async () => {
      try {
        setIsLoading(true);
        setError("");

        const headers: HeadersInit = token 
          ? { 'Authorization': `token ${token}` } 
          : {};

        const userResponse = await fetch(
          `https://api.github.com/users/${username}`, 
          { headers }
        );

        if (!userResponse.ok) {
          throw new Error(`GitHub API error: ${userResponse.status}`);
        }

        const userData = await userResponse.json();

        const reposResponse = await fetch(
          `https://api.github.com/users/${username}/repos`, 
          { headers }
        );
        const reposData = await reposResponse.json();

        const totalStars = reposData.reduce((acc:any, repo:any) => acc + repo.stargazers_count, 0);

        const eventsResponse = await fetch(
          `https://api.github.com/users/${username}/events`, 
          { headers }
        );
        const eventsData = await eventsResponse.json();

        // Count push events as a proxy for contributions
        const contributions = eventsData.filter(
          (event:any) => event.type === 'PushEvent'
        ).length;

        setData({
          repos: userData.public_repos,
          followers: userData.followers,
          contributions,
          stars: totalStars
        });
      } catch (err) {
        console.error("Error fetching GitHub data:", err);
        setError(t.error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGitHubData();
  }, [username, token, t.error]);

  // Resto del componente permanece igual al código original
  if (isLoading) {
    return (
      <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
        <div className="flex items-center justify-center h-40">
          <div className="flex flex-col items-center gap-2">
            <Github className="h-8 w-8 animate-pulse" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t.loading}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
        <div className="flex items-center justify-center h-40">
          <div className="flex flex-col items-center gap-2 text-red-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">{t.title}</h3>
        <Github className="h-5 w-5" />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <Github className="h-6 w-6 mb-2" />
          <span className="text-2xl font-bold">{data.repos}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {t.repos}
          </span>
        </div>
        <div className="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mb-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <span className="text-2xl font-bold">{data.followers}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {t.followers}
          </span>
        </div>
        <div className="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <GitCommit className="h-6 w-6 mb-2" />
          <span className="text-2xl font-bold">{data.contributions}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {t.contributions}
          </span>
        </div>
        <div className="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <Star className="h-6 w-6 mb-2" />
          <span className="text-2xl font-bold">{data.stars}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {t.stars}
          </span>
        </div>
      </div>

      <a
        href={`https://github.com/${username}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex w-full items-center justify-center rounded-md bg-gray-900 dark:bg-gray-700 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors"
      >
        {t.viewProfile}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 ml-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
          />
        </svg>
      </a>
    </div>
  );
}