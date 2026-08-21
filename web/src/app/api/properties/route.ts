import { NextRequest, NextResponse } from "next/server";
import { PropertyType, searchProperties, StudentPreferences } from "@/lib/campusnest";

function numberParam(value: string | null): number | undefined {
  if (value === null || value.trim() === "") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get("type") as PropertyType | null;
  const preferences: StudentPreferences = {
    budgetMin: numberParam(searchParams.get("budgetMin")),
    budgetMax: numberParam(searchParams.get("budgetMax")),
    locality: searchParams.get("locality") || undefined,
    accommodationType: type || undefined,
    lifestyleTags: searchParams.get("lifestyleTags")?.split(",").filter(Boolean),
  };

  return NextResponse.json({ data: searchProperties(preferences) });
}
