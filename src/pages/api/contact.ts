// src/pages/api/contact.ts
import type { APIRoute } from "astro";
import nodemailer from "nodemailer";
import { z } from "zod";
import { emailTemplate } from "@/templates/contact-form";

// Gmail credentials from environment variables
const gmailUser = import.meta.env.GMAIL_USER;
const gmailAppPassword = import.meta.env.GMAIL_APP_PASSWORD;
const recipientEmail = import.meta.env.GMAIL_TO || gmailUser;

// Validation schema using Zod
const ContactSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(100),
  email: z.email({ message: "Invalid email address" }).max(100),
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
    if (!gmailUser || !gmailAppPassword) {
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

    const emailHtml = emailTemplate(validatedData);

    // Create Gmail transport
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: gmailUser,
        pass: gmailAppPassword,
      },
    });

    // Send email
    await transporter.sendMail({
      from: `HereIAm <${gmailUser}>`,
      to: recipientEmail,
      replyTo: validatedData.email,
      subject: `HereIAm - Contact Form Submission from ${validatedData.name}`,
      html: emailHtml,
    });

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
          details: error.issues,
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
