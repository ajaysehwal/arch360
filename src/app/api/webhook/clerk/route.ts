import { prisma } from "@/lib/prisma";
import { UserJSON, WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET!;

if (!webhookSecret) {
  throw new Error("CLERK_WEBHOOK_SECRET is not defined in environment variables.");
}

/**
 * Validates incoming webhook request using Svix
 */
async function validateRequest(request: Request): Promise<WebhookEvent> {
  try {
    const payloadString = await request.text();
    const headerPayload = await headers();

    const svixHeaders = {
      "svix-id": headerPayload.get("svix-id"),
      "svix-timestamp": headerPayload.get("svix-timestamp"),
      "svix-signature": headerPayload.get("svix-signature"),
    };

    // Ensure all required headers are present
    if (!svixHeaders["svix-id"] || !svixHeaders["svix-timestamp"] || !svixHeaders["svix-signature"]) {
      throw new Error("Missing Svix headers");
    }

    const wh = new Webhook(webhookSecret);
    return wh.verify(payloadString, svixHeaders) as WebhookEvent;
  } catch (error) {
    console.error("Webhook validation failed:", error);
    throw new Error("Invalid webhook request");
  }

}

/**
 * Handles POST requests from Clerk webhooks
 */
export async function POST(request: Request) {
  try {
    const payload = await validateRequest(request);
    const event = payload.data;

    switch (payload.type) {
      case "user.created":
        await handleUserCreated(event as UserJSON);
        break;
      case "user.updated":
        await handleUserUpdated(event as UserJSON);
        break;
      case "user.deleted":
        await handleUserDeleted(event as UserJSON);
        break;
      default:
        console.warn(`Unhandled webhook event type: ${payload.type}`);
    }

    return NextResponse.json({ message: "Webhook processed successfully" }, { status: 200 });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}

/**
 * Creates a new user in the database
 */
async function handleUserCreated(event: UserJSON) {
  try {
    await prisma.user.upsert({
      where: { id: event.id },
      update: {
        email: event.email_addresses[0]?.email_address,
        name: `${event.first_name ?? ""} ${event.last_name ?? ""}`.trim(),
      },
      create: {
        id: event.id,
        email: event.email_addresses[0]?.email_address,
        name: `${event.first_name ?? ""} ${event.last_name ?? ""}`.trim(),
      },
    });

    console.log(`✅ User ${event.id} created or updated.`);
  } catch (error) {
    console.error(`❌ Failed to create user ${event.id}:`, error);
  }
}

/**
 * Updates an existing user in the database
 */
async function handleUserUpdated(event: UserJSON) {
  try {
    await prisma.user.update({
      where: { id: event.id },
      data: {
        name: `${event.first_name ?? ""} ${event.last_name ?? ""}`.trim(),
      },
    });

    console.log(`✅ User ${event.id} updated.`);
  } catch (error) {
    console.error(`❌ Failed to update user ${event.id}:`, error);
  }
}

/**
 * Deletes a user from the database
 */
async function handleUserDeleted(event: UserJSON) {
  try {
    await prisma.user.delete({
      where: { id: event.id },
    });

    console.log(`✅ User ${event.id} deleted.`);
  } catch (error) {
    console.error(`❌ Failed to delete user ${event.id}:`, error);
  }
}
