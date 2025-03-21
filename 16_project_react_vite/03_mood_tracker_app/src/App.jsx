import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import "./App.css";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// ✅ Register Chart.js components
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

// Mood options
const moods = [
  { emoji: "😀", label: "Happy" },
  { emoji: "😐", label: "Neutral" },
  { emoji: "😢", label: "Sad" },
  { emoji: "🤩", label: "Excited" },
  { emoji: "😠", label: "Angry" },
];

const MoodTracker = () => {
  const [moodLogs, setMoodLogs] = useState([]);

  // Load mood logs from LocalStorage
  useEffect(() => {
    const storedMoods = JSON.parse(localStorage.getItem("moodLogs")) || [];
    setMoodLogs(storedMoods);
  }, []);

  // Log a mood for today and update the chart
  const logMood = (mood) => {
    const today = Math.floor(Date.now() / 1000);
    // const existingEntry = moodLogs.find((log) => log.date === today);

    // if (existingEntry) {
    //   alert("You have already logged your mood for today.");
    //   return;
    // }

    const newLog = {date: today, mood };
    const updatedLogs = [...moodLogs, newLog];
    setMoodLogs(updatedLogs);
    localStorage.setItem("moodLogs", JSON.stringify(updatedLogs));
    // localStorage.setItem(
    //   "moodLogs",
    //   JSON.stringify([
    //     { date: "3/18/2025", mood: "Happy" },
    //     { date: "3/19/2025", mood: "Neutral" },
    //     { date: "3/20/2025", mood: "Excited" },
    //     { date: "3/21/2025", mood: "Sad" },
    //     { date: "3/22/2025", mood: "Angry" },
    //   ])
    // );
  };

  // Delete a mood entry
  // delete mode by rendom id not by data
  const deleteMood = (date) => {
    const updatedLogs = moodLogs.filter((log) => log.date !== date);
    setMoodLogs(updatedLogs);
    localStorage.setItem("moodLogs", JSON.stringify(updatedLogs));
  };

  // Ensure valid chart data
  const chartData = {
    labels: moodLogs.map((log) => log.date),
    datasets: [
      {
        label: "Mood Trend",
        data: moodLogs.map((log) => {
          const moodIndex = moods.findIndex((m) => m.label === log.mood);
          return moodIndex !== -1 ? moodIndex : 0; // ✅ Prevents null values
        }),
        borderColor: "#3b82f6",
        backgroundColor: "#93c5fd",
        tension: 0.4,
        pointStyle: "circle",
        pointRadius: 6,
        pointHoverRadius: 10,
      },
    ],
  };

  return (
    <div className="p-5 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Daily Mood Tracker</h1>

      {/* Mood Selection */}
      <p className="text-gray-600 mb-2">Select your mood for today:</p>
      <div className="flex space-x-4">
        {moods.map(({ emoji, label }) => (
          <button
            key={label}
            className="text-3xl p-2 hover:scale-110 transition-transform"
            onClick={() => logMood(label)}
          >
            {emoji}
          </button>
        ))}
      </div>

      {/* Mood History */}
      <h2 className="mt-5 text-lg font-semibold">Mood History</h2>
      <ul className="mt-2">
        {moodLogs.length === 0 ? (
          <p className="text-gray-500">No mood logs yet.</p>
        ) : (
          moodLogs.map((log, index) => (
            <li
              key={index}
              className="text-gray-700 flex justify-between items-center border-b py-1"
            >
              {log.date}: {log.mood}
              <button
                onClick={() => deleteMood(log.date)}
                className="bg-red-500 text-white px-2 py-1 rounded text-sm"
              >
                Delete
              </button>
            </li>
          ))
        )}
      </ul>

      {/* Mood Trend Chart */}
      <h2 className="mt-5 text-lg font-semibold">Mood Trend</h2>
      {moodLogs.length > 1 ? (
        <div className="w-full h-64">
          <Line key={moodLogs.length} data={chartData} />
        </div>
      ) : (
        <p className="text-gray-500">Add more moods to see trends.</p>
      )}
    </div>
  );
};

export default MoodTracker;
