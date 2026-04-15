import { GoogleGenerativeAI } from "@google/generative-ai";
import { IAIProvider } from "../../domain/interfaces/ai-provider.interface";
import { WeatherEntity } from "../../domain/entities/weather.entity";

// Simple in-memory cache to avoid hitting rate limits
const insightsCache = new Map<string, { text: string; expiresAt: number }>();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

// Local contextual fallback — generates meaningful insights without the API
function generateLocalInsights(weather: WeatherEntity): string {
  const { location, temperature, condition, humidity, windSpeed, description } = weather;
  const condition_lower = condition.toLowerCase();

  let insight = "";
  let recommendation = "";

  if (temperature >= 30) {
    insight = `${location} is experiencing intense heat at ${temperature}°C with ${description.toLowerCase()}.`;
    recommendation = "Stay hydrated and avoid prolonged sun exposure — light breathable clothing and sunscreen are essential today.";
  } else if (temperature >= 22) {
    insight = `${location} enjoys pleasant warmth at ${temperature}°C with ${description.toLowerCase()}.`;
    recommendation = "Ideal conditions for outdoor activities — a light jacket for the evening is all you'll need.";
  } else if (temperature >= 12) {
    insight = `${location} sits at a mild ${temperature}°C with ${description.toLowerCase()}.`;
    recommendation = "Comfortable layering weather — a medium jacket should keep you perfectly comfortable throughout the day.";
  } else if (temperature >= 0) {
    insight = `${location} is cool at ${temperature}°C with ${description.toLowerCase()}.`;
    recommendation = "Bundle up in a warm coat and consider bringing hot drinks to stay comfortable while out.";
  } else {
    insight = `${location} is below freezing at ${temperature}°C with ${description.toLowerCase()}.`;
    recommendation = "Extreme cold conditions — wear thermal layers, waterproof outerwear, and limit time outdoors.";
  }

  if (condition_lower.includes("rain") || condition_lower.includes("drizzle")) {
    recommendation = `Don't forget an umbrella — ${description.toLowerCase()} makes rain gear a must for any outdoor plans in ${location} today.`;
  } else if (condition_lower.includes("storm") || condition_lower.includes("thunder")) {
    recommendation = `Stay indoors if possible — stormy conditions in ${location} could create hazardous situations for travelers and commuters.`;
  } else if (condition_lower.includes("snow")) {
    recommendation = `Snow in ${location} means slippery roads — allow extra travel time and wear waterproof footwear.`;
  } else if (condition_lower.includes("fog") || condition_lower.includes("mist")) {
    recommendation = `Heavy ${description.toLowerCase()} reduces visibility — drive carefully and use fog lights if commuting in ${location}.`;
  }

  if (humidity > 80) {
    insight += ` High humidity at ${humidity}% will make it feel warmer than the thermometer suggests.`;
  }
  if (windSpeed > 10) {
    insight += ` Winds at ${windSpeed} m/s add a noticeable chill factor.`;
  }

  return `${insight} ${recommendation}`;
}

export class GeminiClient implements IAIProvider {
  private genAI: GoogleGenerativeAI;
  private isConfigured: boolean;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    this.isConfigured = !!apiKey && apiKey !== "MOCK" && apiKey !== "your_gemini_api_key_here";
    this.genAI = new GoogleGenerativeAI(apiKey || "MOCK_KEY");
  }

  async generateInsights(weather: WeatherEntity): Promise<string> {
    // Build a cache key from city + condition + temp
    const cacheKey = `${weather.location.toLowerCase()}-${weather.condition}-${weather.temperature}`;
    const cached = insightsCache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.text;
    }

    // Try Gemini API first if configured
    if (this.isConfigured) {
      try {
        const model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

        const prompt = `
          You are a premium AI Weather Analyst for a luxury weather intelligence dashboard.
          Current weather in ${weather.location}:
          - Temperature: ${weather.temperature}°C
          - Condition: ${weather.condition} (${weather.description})
          - Humidity: ${weather.humidity}%
          - Wind Speed: ${weather.windSpeed} m/s

          Write exactly 2 sentences: one insight about the current conditions, and one practical recommendation for someone in this city today.
          Be engaging, specific, and premium in tone. Do not use bullet points.
        `;

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        // Cache the result
        insightsCache.set(cacheKey, { text, expiresAt: Date.now() + CACHE_TTL_MS });
        return text;
      } catch (error: unknown) {
        console.error("GeminiClient Error — falling back to local insights:", error instanceof Error ? error.message.substring(0, 100) : error);
        // Fall through to local insights
      }
    }

    // Generate contextual local insights
    const localText = generateLocalInsights(weather);
    insightsCache.set(cacheKey, { text: localText, expiresAt: Date.now() + CACHE_TTL_MS });
    return localText;
  }
}
