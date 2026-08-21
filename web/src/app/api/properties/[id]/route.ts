import { NextResponse } from "next/server";
import { findProperty } from "@/lib/campusnest";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const property = findProperty(id);
  if (!property) return NextResponse.json({ error: "Property not found" }, { status: 404 });
  return NextResponse.json({ data: property });
}
