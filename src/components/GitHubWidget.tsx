"use client";

import { useState, useEffect } from "react";
import { GitCommit, Star } from "lucide-react";
import { Github } from "@/components/BrandIcons";
import { t as i18n } from "@/lib/i18n";

interface GitHubWidgetProps {
  username: string;
  lang: "es" | "en";
}

export default function GitHubWidget({ 
  username, 
  lang
}: GitHubWidgetProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState({
    repos: 0,
    followers: 0,
    contributions: 0,
    stars: 0,
  });

  const T = i18n(lang);

  useEffect(() => {
    const fetchGitHubData = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await fetch(`/api/github?username=${username}`);

        if (!response.ok) {
          throw new Error(`GitHub API error: ${response.status}`);
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error("Error fetching GitHub data:", err);
        setError(T.githubWidget.error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGitHubData();
  }, [username, T.githubWidget.error]);

  // Resto del componente permanece igual al código original
  if (isLoading) {
    return (
      <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
        <div className="flex items-center justify-center h-40">
          <div className="flex flex-col items-center gap-2">
            <Github className="h-8 w-8 animate-pulse" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {T.githubWidget.loading}
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
        <h3 className="text-lg font-bold">{T.githubWidget.title}</h3>
        <Github className="h-5 w-5" />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <Github className="h-6 w-6 mb-2" />
          <span className="text-2xl font-bold">{data.repos}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {T.githubWidget.repos}
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
            {T.githubWidget.followers}
          </span>
        </div>
        <div className="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <GitCommit className="h-6 w-6 mb-2" />
          <span className="text-2xl font-bold">{data.contributions}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {T.githubWidget.contributions}
          </span>
        </div>
        <div className="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <Star className="h-6 w-6 mb-2" />
          <span className="text-2xl font-bold">{data.stars}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {T.githubWidget.stars}
          </span>
        </div>
      </div>

      <a
        href={`https://github.com/${username}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex w-full items-center justify-center rounded-md bg-gray-900 dark:bg-gray-700 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors"
      >
        {T.githubWidget.viewProfile}
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