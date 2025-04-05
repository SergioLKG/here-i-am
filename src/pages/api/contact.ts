// src/pages/api/contact.ts
import type { APIRoute } from "astro";
import { Resend } from "resend";
import { z } from "zod";
import { emailTemplate } from "@/templates/contact-form";

// Initialize Resend only if API key exists
const myEmail = import.meta.env.MY_EMAIL;
const resendApiKey = import.meta.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

// Validation schema using Zod
const ContactSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(100),
  email: z.string().email({ message: "Invalid email address" }).max(100),
  message: z
    .string()
    .min(10, { message: "Message must be at least 10 characters" })
    .max(5000),
});

// Simple in-memory rate limiting (should use Redis or similar in production)
const ipRequests = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT = 5; // max requests
const RATE_WINDOW = 60 * 60 * 1000; // 1 hour in ms

export const POST: APIRoute = async ({ request, clientAddress }) => {
  try {
    if (!myEmail) {
      throw new Error("Email service not configured");
    }

    // Rate limiting
    const ip = clientAddress || "unknown";
    const now = Date.now();
    const ipData = ipRequests.get(ip) || { count: 0, timestamp: now };

    // Reset counter if window has passed
    if (now - ipData.timestamp > RATE_WINDOW) {
      ipData.count = 0;
      ipData.timestamp = now;
    }

    // Check if rate limited
    if (ipData.count >= RATE_LIMIT) {
      return new Response(
        JSON.stringify({
          error: "Too many requests",
          details: "Please try again later",
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": "3600",
          },
        }
      );
    }

    // Increment counter
    ipData.count++;
    ipRequests.set(ip, ipData);

    // Parse and validate incoming data
    const data = await request.json();
    const validatedData = ContactSchema.parse(data);

    // Check if Resend is configured
    if (!resend) {
      throw new Error("Email service not configured");
    }

    // Send email
    const emailResponse = await resend.emails.send({
      from: "Contact Form <onboarding@resend.dev>",
      to: myEmail,
      subject: "HereIAm - Contact Form Submission",
      html: emailTemplate(validatedData),
    });

    // Check if email was sent successfully
    if (!emailResponse) {
      throw new Error("Failed to send email");
    }

    // Successful response
    return new Response(
      JSON.stringify({
        success: true,
        message: "Message sent successfully",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({
          error: "Validation failed",
          details: error.errors,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Log the error
    console.error("Submission error:", error);

    // Generic error response
    return new Response(
      JSON.stringify({
        error: "Failed to process submission",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
