import React, { useState } from "react";
import { Github, Linkedin, Mail, MapPin } from "lucide-react";

interface ContactProps {
  lang: "en" | "es";
}

export default function Contact({ lang }: ContactProps) {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const translations = {
    en: {
      title: "Get in Touch",
      description:
        "Have a project in mind or want to chat? Feel free to reach out!",
      nameLabel: "Name",
      emailLabel: "Email",
      messageLabel: "Message",
      submitButton: "Send Message",
      submitting: "Sending...",
      successMessage: "Thanks for your message! I'll get back to you soon.",
      errorMessage:
        "There was an error sending your message. Please try again.",
      contactInfo: "Contact Information",
      location: "Madrid, Spain",
      followMe: "Follow Me",
      sendAnother: "Send Another Message",
    },
    es: {
      title: "Ponte en Contacto",
      description:
        "¿Tienes un proyecto en mente o quieres charlar? ¡No dudes en contactarme!",
      nameLabel: "Nombre",
      emailLabel: "Correo Electrónico",
      messageLabel: "Mensaje",
      submitButton: "Enviar Mensaje",
      submitting: "Enviando...",
      successMessage: "¡Gracias por tu mensaje! Te responderé pronto.",
      errorMessage:
        "Hubo un error al enviar tu mensaje. Por favor, inténtalo de nuevo.",
      contactInfo: "Información de Contacto",
      location: "Madrid, España",
      followMe: "Sígueme",
      sendAnother: "Enviar Otro Mensaje",
    },
  };

  const t = translations[lang];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // Replace with actual form submission logic
      const response = await fetch('/api/submit-contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formState),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // Reset form
      setFormState({
        name: "",
        email: "",
        message: "",
      });

      setIsSubmitted(true);
    } catch (err) {
      setError(t.errorMessage);
      console.error('Submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-12 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                {t.title}
              </h2>
              <p className="max-w-[600px] text-gray-500 dark:text-gray-400 md:text-xl">
                {t.description}
              </p>
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
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
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
                    required
                    value={formState.name}
                    onChange={handleChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
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
                    required
                    value={formState.email}
                    onChange={handleChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
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
                    required
                    value={formState.message}
                    onChange={handleChange}
                    rows={5}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
                {error && <div className="text-red-500 text-sm">{error}</div>}
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
  );
}