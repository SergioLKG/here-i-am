"use client";

import { useState, useEffect } from "react";
import { ExternalLink, Github } from "lucide-react";

interface ProjectsProps {
  lang: "es" | "en";
}

// This is placeholder data - replace with actual project data
const projects = [
  {
    title: "TierMySpot",
    category: "web",
    description: {
      en: "(Authorization needed in the Spotify API as this project is subject to the free development license) Create tierlists about your favorite Spotify playlists, and share them with your friends. You can see others' lists and vote for the ones you like the most.",
      es: "(Se necesita autorización en la API de Spotify ya que este proyecto esta sujeto a la licencia gratuita de desarrollo) Crea tierlist sobre tus playlists de Spotify favoritas, y compártelas con tus amigos. Puedes ver las listas de los demás y votar por las que más te gusten.",
    },
    image: "/images/projects/tiermyspot/screenshot.jpg",
    technologies: ["NextJS", "React", "Tailwind", "NeonPSQL", "PostsgreSQL", "Spotify API", "Vercel"],
    liveUrl: "https://tiermyspot.vercel.app/",
    githubUrl: "https://github.com/SergioLKG/tiermyspot",
  },
  {
    title: "In progress...",
    category: "web",
    description: {
      en: "Working on a portal for a small company in the primary sector, with management of employees, clients, applications for use at work, mobile application, etc.",
      es: "Trabajando en un portal para una pyme del sector primario, con gestión de empleados, clientes, aplicaciones para el uso en el trabajo, aplicación móvil, etc...",
    },
    image: null,
    technologies: ["Symfony", "React", "MongoDB", "· · ·"],
    liveUrl: null,
    githubUrl: null,
  },
];

export const getProjects = () => projects;

export default function Projects({ lang }: ProjectsProps) {
  const [visibleProjects, setVisibleProjects] = useState(3);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById("projects-section");
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const translations = {
    en: {
      title: "Featured Projects",
      description: "A selection of my recent work",
      viewProject: "View Project",
      viewCode: "View Code",
      loadMore: "Load More",
      viewAll: "View All Projects",
      technologies: "Technologies",
    },
    es: {
      title: "Proyectos Destacados",
      description: "Una selección de mi trabajo reciente",
      viewProject: "Ver Proyecto",
      viewCode: "Ver Código",
      loadMore: "Cargar Más",
      viewAll: "Ver Todos los Proyectos",
      technologies: "Tecnologías",
    },
  };

  const t = translations[lang];

  const loadMore = () => {
    setVisibleProjects((prev) => Math.min(prev + 3, projects.length));
  };

  return (
    <section id="projects-section" className="py-12 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              {t.title}
            </h2>
            <p className="max-w-[900px] text-gray-500 dark:text-gray-400 md:text-xl">
              {t.description}
            </p>
          </div>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {projects.slice(0, visibleProjects).map((project, index) => (
            <div
              key={project.title}
              className={`group relative overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm transition-all duration-300 hover:shadow-md transform hover:-translate-y-1 transition-opacity duration-500 ${
                isVisible ? "opacity-100" : "opacity-0"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="aspect-video w-full overflow-hidden">
                <img
                  src={project.image || "/placeholder.svg?height=600&width=800"}
                  alt={project.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold">{project.title}</h3>
                <p className="mt-2 text-gray-500 dark:text-gray-400">
                  {project.description[lang]}
                </p>
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {t.technologies}:
                  </h4>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-800 px-2.5 py-0.5 text-xs font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-between">
                  {project.liveUrl !== null ? (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm font-medium text-primary hover:underline"
                    >
                      {t.viewProject}
                      <ExternalLink className="ml-1 h-4 w-4" />
                    </a>
                  ) : (
                    ""
                  )}
                  {project.githubUrl !== null ? (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                    >
                      {t.viewCode}
                      <Github className="ml-1 h-4 w-4" />
                    </a>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {visibleProjects < projects.length && (
          <div className="mt-12 text-center">
            <button
              onClick={loadMore}
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              {t.loadMore}
            </button>
          </div>
        )}

        <div className="mt-8 text-center">
          <a
            href={`/${lang}/projects`}
            className="inline-flex items-center text-primary hover:underline"
          >
            {t.viewAll}
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
                d="M9 5l7 7-7 7"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}