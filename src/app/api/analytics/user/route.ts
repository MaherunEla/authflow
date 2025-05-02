import { prisma } from "@/lib/prisma";
import { subDays, format } from "date-fns";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const days = parseInt(searchParams.get("days") || "7", 10);
  const fromDate = subDays(new Date(), days - 1);

  const users = await prisma.user.findMany({
    where: {
      createdAt: {
        gte: fromDate,
      },
    },
  });

  const grouped: Record<string, number> = {};

  for (let i = 0; i < days; i++) {
    const day = format(subDays(new Date(), days - 1 - i), "MMM d");
    grouped[day] = 0;
  }

  for (const user of users) {
    const day = format(user.createdAt, "MMM d");
    if (grouped[day] !== undefined) {
      grouped[day]++;
    }
  }

  const chartData = Object.entries(grouped).map(([date, count]) => ({
    date,
    count,
  }));

  return NextResponse.json(chartData);
}
