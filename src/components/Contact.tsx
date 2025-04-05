"use client"

import type React from "react"
import { useState } from "react"
import { Github, Linkedin, Mail, MapPin } from "lucide-react"

interface ContactProps {
  lang: "en" | "es"
}

type FormErrors = {
  name?: string;
  email?: string;
  message?: string;
  general?: string;
}

export default function Contact({ lang }: ContactProps) {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})

  const translations = {
    en: {
      title: "Get in Touch",
      description: "Have a project in mind or want to chat? Feel free to reach out!",
      nameLabel: "Name",
      emailLabel: "Email",
      messageLabel: "Message",
      submitButton: "Send Message",
      submitting: "Sending...",
      successMessage: "Thanks for your message! I'll get back to you soon.",
      errorMessage: "There was an error sending your message. Please try again.",
      contactInfo: "Contact Information",
      location: "Madrid, Spain",
      followMe: "Follow Me",
      sendAnother: "Send Another Message",
      validation: {
        required: "This field is required",
        email: "Please enter a valid email address",
        nameLength: "Name must be at least 2 characters",
        messageLength: "Message must be at least 10 characters"
      }
    },
    es: {
      title: "Ponte en Contacto",
      description: "¿Tienes un proyecto en mente o quieres charlar? ¡No dudes en contactarme!",
      nameLabel: "Nombre",
      emailLabel: "Correo Electrónico",
      messageLabel: "Mensaje",
      submitButton: "Enviar Mensaje",
      submitting: "Enviando...",
      successMessage: "¡Gracias por tu mensaje! Te responderé pronto.",
      errorMessage: "Hubo un error al enviar tu mensaje. Por favor, inténtalo de nuevo.",
      contactInfo: "Información de Contacto",
      location: "Madrid, España",
      followMe: "Sígueme",
      sendAnother: "Enviar Otro Mensaje",
      validation: {
        required: "Este campo es obligatorio",
        email: "Por favor, introduce un correo electrónico válido",
        nameLength: "El nombre debe tener al menos 2 caracteres",
        messageLength: "El mensaje debe tener al menos 10 caracteres"
      }
    },
  }

  const t = translations[lang]

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    // Validate name
    if (!formState.name.trim()) {
      newErrors.name = t.validation.required;
    } else if (formState.name.trim().length < 2) {
      newErrors.name = t.validation.nameLength;
    }
    
    // Validate email
    if (!formState.email.trim()) {
      newErrors.email = t.validation.required;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formState.email)) {
        newErrors.email = t.validation.email;
      }
    }
    
    // Validate message
    if (!formState.message.trim()) {
      newErrors.message = t.validation.required;
    } else if (formState.message.trim().length < 10) {
      newErrors.message = t.validation.messageLength;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormState(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form before submitting
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setErrors({});

    try {
      // Add timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formState),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (!response.ok) {
        // Handle specific validation errors from the server
        if (response.status === 400 && data.details) {
          const serverErrors: FormErrors = {};
          data.details.forEach((error: any) => {
            const path = error.path[0]; // Get field name from Zod error
            serverErrors[path as keyof FormErrors] = error.message;
          });
          setErrors(serverErrors);
          throw new Error("Validation failed");
        }
        
        if (response.status === 429) {
          throw new Error("Too many requests. Please try again later.");
        }
        
        throw new Error(data.message || "Network response was not ok");
      }

      // Reset form
      setFormState({
        name: "",
        email: "",
        message: "",
      });

      setIsSubmitted(true);
    } catch (err: any) {
      if (err.name === "AbortError") {
        setErrors({ general: t.errorMessage + " (Request timeout)" });
      } else {
        setErrors({ general: err.message || t.errorMessage });
      }
      console.error("Submission error:", err);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="py-12 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{t.title}</h2>
              <p className="max-w-[600px] text-gray-500 dark:text-gray-400 md:text-xl">{t.description}</p>
            </div>

            <div className="space-y-6 mt-6">
              <div>
                <h3 className="text-xl font-bold mb-3">{t.contactInfo}</h3>
                <div className="space-y-3">
                  <a
                    href="mailto:dominguezperezsergio03@gmail.com"
                    className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-primary"
                  >
                    <Mail className="h-5 w-5" />
                    <span>dominguezperezsergio03@gmail.com</span>
                  </a>
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                    <MapPin className="h-5 w-5" />
                    <span>{t.location}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-3">{t.followMe}</h3>
                <div className="flex gap-4">
                  <a
                    href="https://github.com/SergioLKG"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <Github className="w-6 h-6" />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/sergiodominguezperez/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <Linkedin className="w-6 h-6" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-sm">
            {isSubmitted ? (
              <div className="p-6 flex flex-col items-center justify-center min-h-[400px] text-center">
                <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-3 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-green-600 dark:text-green-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">{t.successMessage}</h3>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="mt-4 inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  {t.sendAnother}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {t.nameLabel}
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formState.name}
                    onChange={handleChange}
                    className={`flex h-10 w-full rounded-md border ${
                      errors.name ? 'border-red-500' : 'border-input'
                    } bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {t.emailLabel}
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formState.email}
                    onChange={handleChange}
                    className={`flex h-10 w-full rounded-md border ${
                      errors.email ? 'border-red-500' : 'border-input'
                    } bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="message"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {t.messageLabel}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formState.message}
                    onChange={handleChange}
                    rows={5}
                    className={`flex w-full rounded-md border ${
                      errors.message ? 'border-red-500' : 'border-input'
                    } bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
                  />
                  {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                </div>
                {errors.general && <div className="text-red-500 text-sm">{errors.general}</div>}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                >
                  {isSubmitting ? t.submitting : t.submitButton}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}