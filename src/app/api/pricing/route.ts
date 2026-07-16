import { NextResponse } from "next/server";
import { calculateQuote } from "@/lib/pricing";
import { pricingInputSchema } from "@/lib/validation/pricing";

export async function POST(request: Request) {
  const length = Number(request.headers.get("content-length") ?? 0);
  if (length > 32_000) return NextResponse.json({ error: "Request is too large." }, { status: 413 });
  const parsed = pricingInputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "The plan contains invalid options.", fields: parsed.error.flatten().fieldErrors }, { status: 400 });
  return NextResponse.json({ quote: calculateQuote(parsed.data), calculatedAt: new Date().toISOString() }, { headers: { "Cache-Control": "no-store" } });
}
