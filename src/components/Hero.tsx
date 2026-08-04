"use client";

import { useState, useEffect } from "react";
import { Mail, FileText, ArrowRight } from "lucide-react";
import { Github, Linkedin } from "@/components/BrandIcons";
import { t as i18n } from "@/lib/i18n";

interface HeroProps {
  lang: "es" | "en";
}

export default function Hero({ lang }: HeroProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const images = [
    {
      src: "/images/hero2.webp",
      alt: "Sergio Domínguez Pérez",
    },
    {
      src: "/images/hero.jpeg",
      alt: "Sergio Domínguez Pérez",
    },
  ];

  useEffect(() => {
    setIsVisible(true);

    const interval = setInterval(() => {
      setActiveImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const T = i18n(lang);
  const resumeLink =
    lang === "en"
      ? "/resume-sergio-dominguez-en.pdf"
      : "/resume-sergio-dominguez-es.pdf";

  return (
    <section className="relative overflow-hidden py-16 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
          <div
            className={`flex flex-col justify-center space-y-4 transition-opacity duration-700 ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                {T.hero.greeting}{" "}
                <span className="text-primary">Sergio Domínguez</span>
              </h1>
              <p className="text-xl text-gray-500 dark:text-gray-400 md:text-2xl">
                {T.hero.role}
              </p>
              <p className="text-base text-gray-500 dark:text-gray-400">
                {T.hero.location}
              </p>
            </div>
            <p className="max-w-[600px] text-gray-500 dark:text-gray-400 md:text-xl">
              {T.hero.description}
            </p>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <a
                href={`/${lang}/contact`}
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                aria-label={T.hero.contactMe}
              >
                {T.hero.contactMe}
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </a>
              <a
                href={resumeLink}
                download
                className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                aria-label={T.hero.downloadResume}
              >
                {T.hero.downloadResume}
                <FileText className="ml-2 h-4 w-4" aria-hidden="true" />
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
                <Github className="w-5 h-5" aria-hidden="true" />
              </a>
              <a
                href="https://www.linkedin.com/in/sergiodominguezperez/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Linkedin className="w-5 h-5" aria-hidden="true" />
              </a>
              <a
                href="mailto:dominguezperezsergio03@gmail.com"
                aria-label="Email"
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Mail className="w-5 h-5" aria-hidden="true" />
              </a>
            </div>
          </div>
          <div
            className={`flex items-center justify-center transition-all duration-700 delay-200 ${
              isVisible
                ? "opacity-100 transform-none"
                : "opacity-0 translate-y-4"
            }`}
          >
            <div className="relative w-full max-w-sm overflow-hidden rounded-lg shadow-xl aspect-[3/4] md:aspect-square">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-10"></div>
              {images.map((image, index) => (
                <img
                  key={index}
                  src={image.src}
                  alt={image.alt}
                  width={400}
                  height={400}
                  className={`w-full h-full object-cover absolute inset-0 transition-all duration-1000 ease-in-out ${
                    index === activeImageIndex
                      ? "opacity-100 z-10"
                      : "opacity-0 z-0"
                  }`}
                  loading="eager"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
