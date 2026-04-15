import { GoogleGenerativeAI } from "@google/generative-ai";
import { IAIProvider } from "../../domain/interfaces/ai-provider.interface";
import { WeatherEntity } from "../../domain/entities/weather.entity";

export class GeminiClient implements IAIProvider {
  private genAI: GoogleGenerativeAI;
  private isConfigured: boolean;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    this.isConfigured = !!apiKey && apiKey !== "MOCK" && apiKey !== "your_gemini_api_key_here";
    this.genAI = new GoogleGenerativeAI(apiKey || "MOCK_KEY");
  }

  async generateInsights(weather: WeatherEntity): Promise<string> {
    if (!this.isConfigured) {
      return "AI insights are currently unavailable. Please configure your Gemini API key to activate the Agentic Weather Analyst.";
    }

    try {
      const model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

      const prompt = `
        You are a premium AI Weather Analyst for a luxury weather intelligence dashboard.
        Current weather in ${weather.location}:
        - Temperature: ${weather.temperature}°C
        - Condition: ${weather.condition} (${weather.description})
        - Humidity: ${weather.humidity}%
        - Wind Speed: ${weather.windSpeed} m/s

        Provide a brief, engaging, and highly contextual 2-sentence insight. 
        Include a practical recommendation for someone traveling or living there today. 
        Keep the tone professional, slightly conversational, and premium.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("GeminiClient Error:", error);
      return "The AI Weather Analyst is temporarily resting. We'll have more insights for you soon.";
    }
  }
}
