import { NextResponse } from "next/server";
import { getCachedRoast } from "@/lib/cache";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  if (!id) {
    return NextResponse.json({ error: "Missing roast ID" }, { status: 400 });
  }

  const result = getCachedRoast(id);
  if (!result) {
    return NextResponse.json(
      { error: "Roast not found or expired. Roasts are automatically purged after 24 hours." },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    result,
  });
}
