import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { deleteUserData } from "@/lib/cache";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const roastId = body.roastId;

    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("yt_roast_session")?.value;

    let sessionId: string | undefined = undefined;
    if (sessionCookie) {
      try {
        sessionId = JSON.parse(sessionCookie)?.sessionId;
      } catch {
        // ignore
      }
    }

    if (roastId) {
      deleteUserData(roastId);
    }
    if (sessionId) {
      deleteUserData(sessionId);
    }

    // Clear all cookies
    cookieStore.delete("yt_roast_session");
    cookieStore.delete("pkce_verifier");
    cookieStore.delete("oauth_state");

    return NextResponse.json({
      success: true,
      message: "All user data, cached results, and session credentials have been permanently deleted.",
    });
  } catch (err) {
    console.error("Error in delete endpoint:", err);
    return NextResponse.json({ error: "Failed to delete user data." }, { status: 500 });
  }
}
