"use client"

import { useState, useEffect } from "react"
import { Calendar, MapPin, Briefcase } from "lucide-react"

interface ExperienceProps {
  lang: "es" | "en"
}

const experiences = [
  {
    active: true,
    title: {
      en: "Full-Stack Developer",
      es: "Desarrollador Full-Stack",
    },
    company: "Lefebvre Inc",
    location: {
      en: "Madrid, Spain",
      es: "Madrid, España",
    },
    period: {
      en: `Mar 2024 - Present (${formatPeriodYearMonth(new Date("2024-03-01"), new Date(), "en")})`,
      es: `Mar 2024 - Actualidad (${formatPeriodYearMonth(new Date("2024-03-01"), new Date(), "es")})`,
    },
    description: {
      en: "Development and maintenance of REST APIs, microservices and product portals, with integration of external systems and optimization of legal platforms. Management of more than ten portals, automation of flows with AI and performance improvement in MySQL. Web development with WordPress and Symfony for internal portals.",
      es: `Desarrollo y mantenimiento de APIs REST, microservicios y portales de producto, con integración de sistemas externos y optimización de plataformas jurídicas. Gestión de más de diez portales, automatización de flujos con IA y mejora del rendimiento en MySQL. Desarrollo web con WordPress y Symfony para portales internos.`,
    },
    responsibilities: {
      en: [
        "Development and maintenance of REST APIs and microservices for integration with external systems.",
        "Development and maintenance of product portals.",
        "Incident management and continuous improvement of legal portals, ensuring stability and security.",
        "Responsible for 10+ portals.",
        "Creation of web applications and custom tools to enhance efficiency in the legal sector.",
        "Implementation of AI-powered services and APIs to automate tasks and optimize workflows.",
        "Database administration and performance optimization in MySQL.",
      ],
      es: [
        "Desarrollo y mantenimiento de APIs REST y microservicios para la integración con sistemas externos.",
        "Desarrollo y mantenimiento de portales de producto.",
        "Atención de incidencias y mejora continua de los portales jurídicos, asegurando estabilidad y seguridad.",
        "10+ portales a cargo.",
        "Creación de aplicaciones web y herramientas personalizadas para mejorar la eficiencia en el sector jurídico. ",
        "Implementación de servicios y APIs con IA para automatizar tareas y optimizar flujos de trabajo.",
        "Administración de bases de datos y optimización del rendimiento en MySQL.",
      ],
    },
    skills: ["Symfony", "React", "TypeScript", "MySQL", "DevOps"],
  },
  {
    active: false,
    title: {
      en: "Computer Technician",
      es: "Técnico Informático",
    },
    company: "Repair Mobile World",
    location: {
      en: "Madrid, Spain",
      es: "Madrid, España",
    },
    period: {
      en: `Mar 2023 - Jun 2023 (${formatPeriodYearMonth(
        new Date("2023-03-01"), // Fecha inicio
        new Date("2023-06-01"), // Fecha fin
        "en",
      )})`,
      es: `Mar 2023 - Jun 2023 (${formatPeriodYearMonth(
        new Date("2023-03-01"), // Fecha inicio
        new Date("2023-06-01"), // Fecha fin
        "es",
      )})`,
    },
    description: {
      en: "Phone, console, and computer repairs were part of my responsibilities at Mundo del Móvil. I also handled various tasks related to their website (CMS). Additionally, I provided customer support, managed shipments and deliveries, and collaborated with the company's Marketing Manager on social media platforms.",
      es: "Reparación de teléfonos, consolas y computadoras eran parte de mis responsabilidades en Mundo del Móvil. También manejé diversas tareas relacionadas con su sitio web (CMS). Además, brindé atención al cliente, gestioné envíos y entregas y colaboré con el Gerente de Marketing de la empresa en las plataformas de redes sociales.",
    },
    responsibilities: {
      en: [],
      es: [],
    },
    skills: ["Presta Shop", "Repairing Skills", "Customer Service", "Photoshop", "Office"],
  },
]

// Fix the formatPeriodYearMonth function to handle edge cases
function formatPeriodYearMonth(startDate: Date, endDate: Date = new Date(), lang: "en" | "es" = "es"): string {
  // Ensure valid dates
  if (
    !(startDate instanceof Date) ||
    isNaN(startDate.getTime()) ||
    !(endDate instanceof Date) ||
    isNaN(endDate.getTime())
  ) {
    return lang === "es" ? "fecha inválida" : "invalid date"
  }

  let years = endDate.getFullYear() - startDate.getFullYear()
  let months = endDate.getMonth() - startDate.getMonth()

  // Adjust if months are negative
  if (months < 0) {
    years--
    months += 12
  }

  // Adjust if the day of the current month is less than the day of the initial month
  if (endDate.getDate() < startDate.getDate()) {
    months--
    if (months < 0) {
      years--
      months += 12
    }
  }

  // Text according to language
  if (lang === "es") {
    // Spanish - handling plurals
    const yearText = years === 1 ? "año" : "años"
    const monthText = months === 1 ? "mes" : "meses"

    if (years === 0) {
      return months === 0 ? "menos de un mes" : `${months} ${monthText}`
    } else {
      return months === 0 ? `${years} ${yearText}` : `${years} ${yearText} y ${months} ${monthText}`
    }
  } else {
    // English - handling plurals
    const yearText = years === 1 ? "year" : "years"
    const monthText = months === 1 ? "month" : "months"

    if (years === 0) {
      return months === 0 ? "less than a month" : `${months} ${monthText}`
    } else {
      return months === 0 ? `${years} ${yearText}` : `${years} ${yearText} and ${months} ${monthText}`
    }
  }
}

// Funcion publica estatica para devolvere la constante experience
export const getExperiences = () => experiences

export default function Experience({ lang }: ExperienceProps) {
  const [activeExperience, setActiveExperience] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  // Optimize the intersection observer usage
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px 100px 0px" }, // Preload before fully visible
    )

    const element = document.getElementById("experience-section")
    if (element) observer.observe(element)

    return () => observer.disconnect()
  }, [])

  const translations = {
    en: {
      title: "Professional Experience",
      viewAll: "View All Experience",
      present: "Present",
      skills: "Skills",
    },
    es: {
      title: "Experiencia Profesional",
      viewAll: "Ver Toda la Experiencia",
      present: "Actual",
      skills: "Habilidades",
    },
  }

  const t = translations[lang]

  return (
    <section id="experience-section" className="py-12 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{t.title}</h2>
          </div>
        </div>

        <div className="mt-12 grid md:grid-cols-[1fr_2fr] gap-8">
          {/* Timeline navigation */}
          <div className="hidden md:block relative">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-800"></div>
            {experiences.map((exp, index) => (
              <div
                key={index}
                className={`relative pl-10 py-4 mb-4 cursor-pointer transition-all duration-300 ${
                  activeExperience === index
                    ? "text-primary"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                }`}
                onClick={() => setActiveExperience(index)}
              >
                <div
                  className={`absolute left-0 top-5 w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    activeExperience === index
                      ? "border-primary bg-primary text-white"
                      : "border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
                  }`}
                >
                  {index + 1}
                </div>
                <h3 className="font-medium">{exp.title[lang]}</h3>
                <p className="text-sm">{exp.company}</p>
              </div>
            ))}
          </div>

          {/* Mobile timeline selector */}
          <div className="md:hidden flex overflow-x-auto gap-4 pb-4 mb-6">
            {experiences.map((exp, index) => (
              <button
                key={index}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
                  activeExperience === index
                    ? "bg-primary text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                }`}
                onClick={() => setActiveExperience(index)}
              >
                {exp.company}
              </button>
            ))}
          </div>

          {/* Experience details */}
          <div
            className={`bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6 transition-opacity duration-500 ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            <h3 className="text-2xl font-bold">{experiences[activeExperience].title[lang]}</h3>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 mt-2 text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Briefcase className="w-4 h-4" />
                <span>{experiences[activeExperience].company}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{experiences[activeExperience].location[lang]}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{experiences[activeExperience].period[lang]}</span>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-gray-700 dark:text-gray-300">{experiences[activeExperience].description[lang]}</p>
            </div>

            <div className="mt-6">
              <h4 className="font-medium mb-2">{t.skills}:</h4>
              <div className="flex flex-wrap gap-2">
                {experiences[activeExperience].skills.map((skill) => (
                  <span key={skill} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <a href={`/${lang}/experience`} className="inline-flex items-center text-primary hover:underline">
            {t.viewAll}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 ml-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}