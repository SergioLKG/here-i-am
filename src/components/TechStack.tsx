"use client"

import { useState, useEffect, useRef } from "react"

interface TechStackProps {
  lang: "es" | "en"
}

export default function TechStack({ lang }: TechStackProps) {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px 100px 0px" },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const translations = {
    en: {
      title: "Tech Stack",
      description: "Technologies I work with",
    },
    es: {
      title: "Stack Tecnológico",
      description: "Tecnologías con las que trabajo",
    },
  }

  const t = translations[lang]

  // Group technologies by category for better organization
  const technologies = [
    { name: "Symfony", icon: "/icons/symfony.svg", category: "backend" },
    { name: "WordPress", icon: "/icons/wordpress.svg", category: "cms" },
    { name: "Astro", icon: "/icons/astro.svg", category: "frontend" },
    { name: "React", icon: "/icons/react.svg", category: "frontend" },
    { name: "Tailwind CSS", icon: "/icons/tailwind.svg", category: "frontend" },
    { name: "MySQL", icon: "/icons/mysql.svg", category: "database" },
    { name: "TypeScript", icon: "/icons/typescript.svg", category: "language" },
    { name: "Node.js", icon: "/icons/nodejs.svg", category: "backend" },
    { name: "Python", icon: "/icons/python.svg", category: "language" },
    { name: "Java", icon: "/icons/java.svg", category: "language" },
    { name: "Jira", icon: "/icons/jira.svg", category: "tools" },
    { name: "DevOps", icon: "/icons/devops.svg", category: "tools" },
    { name: "GitHub", icon: "/icons/github.svg", category: "tools" },
    { name: "Bitbucket", icon: "/icons/bitbucket.svg", category: "tools" },
  ]

  // Preload images for better performance
  useEffect(() => {
    technologies.forEach((tech) => {
      if (tech.icon) {
        const img = new Image()
        img.src = tech.icon
      }
    })
  }, [])

  return (
    <section id="tech-stack" ref={sectionRef} className="py-12 md:py-16 bg-gray-50 dark:bg-gray-800/50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{t.title}</h2>
            <p className="max-w-[900px] text-gray-500 dark:text-gray-400 md:text-xl">{t.description}</p>
          </div>
        </div>
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {technologies.map((tech, index) => (
            <div
              key={tech.name}
              className="flex flex-col items-center justify-center p-4 bg-white dark:bg-gray-900 rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
              style={{
                transitionDelay: `${index * 50}ms`,
                transform: isVisible ? "translateY(0)" : "translateY(20px)",
                opacity: isVisible ? 1 : 0,
                transition: "transform 0.5s ease, opacity 0.5s ease",
              }}
            >
              <div className="w-12 h-12 mb-2 flex items-center justify-center">
                <img
                  src={tech.icon || "/placeholder.svg"}
                  alt={tech.name}
                  className="max-w-full max-h-full drop-shadow-[#ffffff0f_0px_0px_5px]"
                  loading="lazy"
                  width={48}
                  height={48}
                />
              </div>
              <span className="text-sm font-medium text-center">{tech.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}