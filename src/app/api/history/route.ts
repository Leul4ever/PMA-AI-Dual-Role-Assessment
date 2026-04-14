import { NextResponse } from "next/server";
import { PrismaWeatherRepository } from "@/infrastructure/database/prisma-weather.repository";
import { ManageHistoryUseCase } from "@/application/use-cases/manage-history.use-case";

const historyRepo = new PrismaWeatherRepository();
const manageHistory = new ManageHistoryUseCase(historyRepo);

export async function GET() {
  try {
    const history = await manageHistory.getHistory();
    return NextResponse.json(history);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 });
  }
}
