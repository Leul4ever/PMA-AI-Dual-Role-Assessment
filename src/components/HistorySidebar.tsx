"use client";

import React, { useEffect, useState } from "react";
import { History, Trash2, Download, X, Edit2, Check, Trash } from "lucide-react";

interface WeatherRecord {
  id: number;
  location: string;
  temperature: number;
  condition: string;
  recordedAt: string;
}

export const HistorySidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState<WeatherRecord[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");

  const fetchHistory = async () => {
    const res = await fetch("/api/history");
    const data = await res.json();
    setHistory(data);
  };

  useEffect(() => {
    if (isOpen) {
      fetchHistory();
    }
  }, [isOpen]);

  const clearHistory = async () => {
    if (!confirm("Are you sure you want to clear all history?")) return;
    await fetch("/api/history", { method: "DELETE" }); // This should clear all if no ID
    setHistory([]);
  };

  const deleteRecord = async (id: number) => {
    await fetch(`/api/history?id=${id}`, { method: "DELETE" });
    setHistory(history.filter(r => r.id !== id));
  };

  const startEdit = (record: WeatherRecord) => {
    setEditingId(record.id);
    setEditValue(record.location);
  };

  const saveEdit = async (id: number) => {
    await fetch("/api/history", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, location: editValue }),
    });
    setHistory(history.map(r => r.id === id ? { ...r, location: editValue } : r));
    setEditingId(null);
  };

  const exportData = (format: "json" | "csv") => {
    let content = "";
    let mimeType = "";
    const fileName = `weather_history.${format}`;

    if (format === "json") {
      content = JSON.stringify(history, null, 2);
      mimeType = "application/json";
    } else {
      const headers = ["Location", "Temp", "Condition", "Date"];
      const rows = history.map((r) => [r.location, r.temperature, r.condition, r.recordedAt]);
      content = [headers, ...rows].map((row) => row.join(",")).join("\n");
      mimeType = "text/csv";
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed right-6 top-6 z-40 p-3 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md border border-white/10 transition-all group"
      >
        <History className="text-white/60 group-hover:text-accent" size={24} />
      </button>

      <div
        className={`fixed top-0 right-0 h-screen w-80 md:w-96 glass z-50 transform transition-transform duration-500 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <History size={20} className="text-accent" />
              History
            </h2>
            <button onClick={() => setIsOpen(false)} className="text-white/40 hover:text-white">
              <X size={24} />
            </button>
          </div>

          <div className="flex gap-2 mb-6">
            <button
              onClick={() => exportData("csv")}
              className="flex-1 flex items-center justify-center gap-2 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-medium transition-colors"
            >
              <Download size={14} /> CSV
            </button>
            <button
              onClick={() => exportData("json")}
              className="flex-1 flex items-center justify-center gap-2 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-medium transition-colors"
            >
              <Download size={14} /> JSON
            </button>
            <button
              onClick={clearHistory}
              className="px-3 flex items-center justify-center bg-red-500/10 hover:bg-red-500/20 rounded-lg text-red-400 transition-colors"
            >
              <Trash2 size={14} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
            {history.length === 0 ? (
              <p className="text-center text-white/20 mt-20 italic">No records found</p>
            ) : (
              history.map((record) => (
                <div
                  key={record.id}
                  className="p-4 bg-white/5 border border-white/5 rounded-xl hover:border-white/20 transition-all group"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 mr-2">
                      {editingId === record.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="w-full bg-white/10 border border-white/10 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-accent"
                            autoFocus
                          />
                          <button onClick={() => saveEdit(record.id)} className="text-green-400 hover:text-green-300">
                            <Check size={16} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-white/90">{record.location}</h4>
                          <button 
                            onClick={() => startEdit(record)}
                            className="opacity-0 group-hover:opacity-100 text-white/20 hover:text-accent transition-all"
                          >
                            <Edit2 size={12} />
                          </button>
                        </div>
                      )}
                      <p className="text-xs text-white/40">
                        {new Date(record.recordedAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-lg font-bold text-accent">{record.temperature}°</span>
                      <button 
                        onClick={() => deleteRecord(record.id)}
                        className="opacity-0 group-hover:opacity-100 text-white/20 hover:text-red-400 transition-all"
                      >
                        <Trash size={14} />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-white/60 mt-2 uppercase tracking-tighter">
                    {record.condition}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
        />
      )}
    </>
  );
};
