-- CreateTable
CREATE TABLE "WeatherRecord" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "location" TEXT NOT NULL,
    "temperature" REAL NOT NULL,
    "condition" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "humidity" INTEGER,
    "windSpeed" REAL,
    "pressure" INTEGER,
    "recordedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "WeatherRecord_location_idx" ON "WeatherRecord"("location");
