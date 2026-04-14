import { NextRequest, NextResponse } from "next/server";
import { OpenWeatherClient } from "@/infrastructure/api/open-weather.client";
import { YouTubeClient } from "@/infrastructure/api/youtube.client";
import { PrismaWeatherRepository } from "@/infrastructure/database/prisma-weather.repository";
import { GetWeatherDashboardUseCase } from "@/application/use-cases/get-weather-dashboard.use-case";
import { ManageHistoryUseCase } from "@/application/use-cases/manage-history.use-case";

// Composition Root for this route
const weatherProvider = new OpenWeatherClient();
const videoProvider = new YouTubeClient();
const historyRepo = new PrismaWeatherRepository();

const getWeatherDashboard = new GetWeatherDashboardUseCase(
  weatherProvider,
  videoProvider,
  historyRepo
);

const manageHistory = new ManageHistoryUseCase(historyRepo);

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city");

  if (!city) {
    return NextResponse.json({ error: "City is required" }, { status: 400 });
  }

  try {
    const result = await getWeatherDashboard.execute(city);
    return NextResponse.json(result);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      await manageHistory.deleteRecord(parseInt(id));
    } else {
      await manageHistory.clearHistory();
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete record" }, { status: 500 });
  }
}
