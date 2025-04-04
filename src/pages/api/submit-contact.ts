// src/pages/api/contact.ts
import type { APIRoute } from "astro";
import { Resend } from "resend";
import { z } from "zod";

const resend = new Resend(import.meta.env.RESEND_API_KEY);

// Validation schema using Zod
const ContactSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  message: z
    .string()
    .min(10, { message: "Message must be at least 10 characters" }),
});

export const POST: APIRoute = async ({ request }) => {
  try {
    // Parse and validate incoming data
    const data = await request.json();
    const validatedData = ContactSchema.parse(data);
    await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: ["dominguezperezsergio03@gmail.com"],
      subject: "hello world",
      html: "<p>it works!</p>",
    });
    // Example email sending (you'll need to set up your preferred email service)dominguezperezsergio03@gmail.com
    const emailResponse = resend.emails.send({
      from: "Contact Form <onboarding@resend.dev>",
      to: "dominguezperezsergio03@gmail.com", // Your personal email
      subject: "New Contact Form Submission",
      html: `
        <h1>New Contact Form Submission</h1>
        <p><strong>Name:</strong> ${validatedData.name}</p>
        <p><strong>Email:</strong> ${validatedData.email}</p>
        <p><strong>Message:</strong></p>
        <p>${validatedData.message}</p>
      `,
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
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
