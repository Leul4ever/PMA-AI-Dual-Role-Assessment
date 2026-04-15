import { IWeatherHistoryRepository } from "../../domain/interfaces/weather-history.repository";
import { WeatherEntity, WeatherHistoryEntity } from "../../domain/entities/weather.entity";
import prisma from "../../lib/db";

export class PrismaWeatherRepository implements IWeatherHistoryRepository {
  async save(weather: WeatherEntity): Promise<void> {
    await prisma.weatherRecord.create({
      data: {
        location: weather.location,
        temperature: weather.temperature,
        condition: weather.condition,
        description: weather.description,
        icon: weather.icon,
        humidity: weather.humidity,
        windSpeed: weather.windSpeed,
        pressure: weather.pressure,
      },
    });
  }

  async getHistory(limit: number = 20): Promise<WeatherHistoryEntity[]> {
    const rawHistory = await prisma.weatherRecord.findMany({
      orderBy: { recordedAt: "desc" },
      take: limit,
    });

    return rawHistory.map(record => ({
      location: record.location,
      temperature: record.temperature,
      condition: record.condition,
      description: record.description ?? "",
      icon: record.icon ?? "",
      humidity: record.humidity ?? 0,
      windSpeed: record.windSpeed ?? 0,
      pressure: record.pressure ?? 0,
      id: record.id,
      recordedAt: record.recordedAt,
    }));
  }

  async clearAll(): Promise<void> {
    await prisma.weatherRecord.deleteMany();
  }

  async deleteById(id: number): Promise<void> {
    await prisma.weatherRecord.delete({
      where: { id },
    });
  }

  async updateLocation(id: number, newLocation: string): Promise<void> {
    await prisma.weatherRecord.update({
      where: { id },
      data: { location: newLocation },
    });
  }
}
