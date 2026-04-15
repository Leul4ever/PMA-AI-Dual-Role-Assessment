import { NextResponse } from "next/server";
import { PrismaWeatherRepository } from "@/infrastructure/database/prisma-weather.repository";
import { ManageHistoryUseCase } from "@/application/use-cases/manage-history.use-case";

const historyRepo = new PrismaWeatherRepository();
const manageHistory = new ManageHistoryUseCase(historyRepo);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const format = searchParams.get("format") as "json" | "csv" | null;

  try {
    if (format) {
      const data = await manageHistory.exportData(format);
      return new NextResponse(data, {
        headers: {
          "Content-Type": format === "json" ? "application/json" : "text/csv",
          "Content-Disposition": `attachment; filename=weather-history.${format}`,
        },
      });
    }

    const history = await manageHistory.getHistory();
    return NextResponse.json(history);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch/export history" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  try {
    await manageHistory.deleteRecord(parseInt(id));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete record" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, location } = await request.json();
    if (!id || !location) return NextResponse.json({ error: "ID and Location required" }, { status: 400 });

    await manageHistory.updateRecord(parseInt(id), location);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update record" }, { status: 500 });
  }
}
