"use client";

import { useState, useEffect } from "react";
import { Github, Linkedin, Mail, FileText, ArrowRight } from "lucide-react";

interface HeroProps {
  lang: "es" | "en";
}

export default function Hero({ lang }: HeroProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const translations = {
    en: {
      greeting: "Hi, I'm",
      role: "Full-Stack Developer",
      location: "Based in Madrid, Spain",
      description:
        "I specialize in building modern web applications with a focus on performance, accessibility, and user experience.",
      contactMe: "Contact me",
      downloadResume: "Download Resume",
    },
    es: {
      greeting: "Hola, soy",
      role: "Desarrollador Full-Stack",
      location: "Ubicado en Madrid, España",
      description:
        "Me especializo en construir aplicaciones web modernas con enfoque en rendimiento, accesibilidad y experiencia de usuario.",
      contactMe: "Contáctame",
      downloadResume: "Descargar CV",
    },
  };

  const t = translations[lang];
  const resumeLink =
    lang === "en"
      ? "/resume-sergio-dominguez-en.pdf"
      : "/resume-sergio-dominguez-es.pdf";

  return (
    <section className="relative overflow-hidden py-16 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
          <div
            className={`flex flex-col justify-center space-y-4 transition-opacity duration-1000 ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                {t.greeting}{" "}
                <span className="text-primary">Sergio Domínguez</span>
              </h1>
              <p className="text-xl text-gray-500 dark:text-gray-400 md:text-2xl">
                {t.role}
              </p>
              <p className="text-base text-gray-500 dark:text-gray-400">
                {t.location}
              </p>
            </div>
            <p className="max-w-[600px] text-gray-500 dark:text-gray-400 md:text-xl">
              {t.description}
            </p>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <a
                href={`/${lang}/contact`}
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                {t.contactMe}
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
              <a
                href={resumeLink}
                download
                className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                {t.downloadResume}
                <FileText className="ml-2 h-4 w-4" />
              </a>
            </div>
            <div className="flex items-center gap-4 mt-4">
              <a
                href="https://github.com/SergioLKG"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/sergiodominguezperez/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="mailto:dominguezperezsergio03@gmail.com"
                aria-label="Email"
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
          <div
            className={`flex items-center justify-center transition-opacity duration-1000 delay-300 ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="relative w-full max-w-sm overflow-hidden rounded-lg shadow-xl">
              <img
                src="/images/hero.jpeg"
                alt="Sergio Domínguez Pérez"
                width={400}
                height={400}
                className="w-full h-auto object-cover transition-transform duration-500 hover:scale-105"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
